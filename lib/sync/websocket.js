/**
 * @module provider/websocket
 */

/* eslint-env browser */

import * as Y from 'yjs' // eslint-disable-line
import * as bc from 'lib0/broadcastchannel'
import * as time from 'lib0/time'
import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import * as syncProtocol from './protocol'
import * as awarenessProtocol from './awareness'
import { Observable } from 'lib0/observable'
import * as math from 'lib0/math'
import * as url from 'lib0/url'
import * as env from 'lib0/environment'
import * as MESSAGE from './message'

// TODO: Make this more memory efficient by removing all of the array copies

// @todo - this should depend on awareness.outdatedTime
const messageReconnectTimeout = 30000

/**
 * @param {WebsocketProvider} provider
 * @param {Uint8Array} buf
 * @param {boolean} emitSynced
 * @return {Uint8Array | undefined}
 */
const readMessage = (provider, buf, emitSynced) => {
	const bufLength = buf.length
	const messageType = buf[bufLength - 1]
	const message = buf.slice(0, bufLength - 1)

	if (messageType !== MESSAGE.AWARENESS) {
		// Encode the length of the update as a varUint
		const lengthEncoder = encoding.createEncoder()
		encoding.writeVarUint(lengthEncoder, bufLength - 1)
		const lengthBitLength = encoding.length(lengthEncoder)
		const lengthBuffer = encoding.toUint8Array(lengthEncoder)

		// Prepend the length of the buffer
		buf = new Uint8Array(lengthBitLength + bufLength - 1)
		buf.set(lengthBuffer)
		buf.set(message, lengthBitLength)
	} else {
		console.log(buf)
		buf = message
	}

	const decoder = decoding.createDecoder(buf)
	const encoder = encoding.createEncoder()
	let reply;
	switch (messageType) {
		case MESSAGE.UPDATE:
			syncProtocol.readUpdate(decoder, provider.doc, provider)
			break;
		case MESSAGE.SYNC_STEP_1:
			syncProtocol.readSyncStep1(decoder, encoder, provider.doc)
			reply = encoding.toUint8Array(encoder).slice(1)
			break;
		case MESSAGE.SYNC_STEP_2:
			if (buf.length > 0) {
				syncProtocol.readSyncStep2(decoder, provider.doc, provider)
			}
			if (emitSynced && !provider.synced) {
				provider.synced = true
			}
			break;
		case MESSAGE.AWARENESS:
			awarenessProtocol.applyAwarenessUpdate(
				provider.awareness,
				decoding.readVarUint8Array(decoder),
				provider
			)
			break;
		case MESSAGE.QUERY_AWARENESS:
			encoding.writeVarUint8Array(
				encoder,
				awarenessProtocol.encodeAwarenessUpdate(
					provider.awareness,
					Array.from(provider.awareness.getStates().keys())
				)
			)
			encoding.writeVarUint(encoder, MESSAGE.AWARENESS)
			reply = encoding.toUint8Array(encoder)
			break;
		default:
			throw new Error('Unknown message type')
	}
	return reply
}

/**
 * @param {WebsocketProvider} provider
 */
const setupWS = (provider) => {
	if (provider.shouldConnect && provider.ws === null) {
		const websocket = new provider._WS(provider.url)
		websocket.binaryType = 'arraybuffer'
		provider.ws = websocket
		provider.wsconnecting = true
		provider.wsconnected = false
		provider.synced = false

		websocket.onmessage = (event) => {
			provider.wsLastMessageReceived = time.getUnixTime()
			const reply = readMessage(provider, new Uint8Array(event.data), true)
			if (reply !== undefined) {
				websocket.send(reply)
			}
		}
		websocket.onerror = (event) => {
			provider.emit('connection-error', [event, provider])
		}
		websocket.onclose = (event) => {
			provider.emit('connection-close', [event, provider])
			provider.ws = null
			provider.wsconnecting = false
			if (provider.wsconnected) {
				provider.wsconnected = false
				provider.synced = false
				// update awareness (all users except local left)
				awarenessProtocol.removeAwarenessStates(
					provider.awareness,
					Array.from(provider.awareness.getStates().keys()).filter((client) =>
						client !== provider.doc.clientID
					),
					provider
				)
				provider.emit('status', [{
					status: 'disconnected'
				}])
			} else {
				provider.wsUnsuccessfulReconnects++
			}
			// Start with no reconnect timeout and increase timeout by
			// using exponential backoff starting with 100ms
			setTimeout(
				setupWS,
				math.min(
					math.pow(2, provider.wsUnsuccessfulReconnects) * 100,
					provider.maxBackoffTime
				),
				provider
			)
		}
		websocket.onopen = () => {
			provider.wsLastMessageReceived = time.getUnixTime()
			provider.wsconnecting = false
			provider.wsconnected = true
			provider.wsUnsuccessfulReconnects = 0
			provider.emit('status', [{
				status: 'connected'
			}])
			// always send sync step 1 when connected
			const encoder = encoding.createEncoder()
			syncProtocol.writeSyncStep1(encoder, provider.doc)
			websocket.send(encoding.toUint8Array(encoder).slice(1))
			// broadcast local awareness state
			if (provider.awareness.getLocalState() !== null) {
				const encoderAwarenessState = encoding.createEncoder()
				encoding.writeVarUint8Array(
					encoderAwarenessState,
					awarenessProtocol.encodeAwarenessUpdate(provider.awareness, [
						provider.doc.clientID
					])
				)
				encoding.writeVarUint(encoderAwarenessState, MESSAGE.AWARENESS)
				websocket.send(encoding.toUint8Array(encoderAwarenessState))
			}
		}
		provider.emit('status', [{
			status: 'connecting'
		}])
	}
}

/**
 * @param {WebsocketProvider} provider
 * @param {ArrayBuffer} buf
 */
const broadcastMessage = (provider, buf) => {
	const ws = provider.ws
	if (provider.wsconnected && ws && ws.readyState === ws.OPEN) {
		ws.send(buf)
	}
	if (provider.bcconnected) {
		bc.publish(provider.bcChannel, buf, provider)
	}
}

/**
 * Websocket Provider for Yjs. Creates a websocket connection to sync the shared document.
 * The document name is attached to the provided url. I.e. the following example
 * creates a websocket connection to http://localhost:1234/my-document-name
 *
 * @example
 *   import * as Y from 'yjs'
 *   import { WebsocketProvider } from 'y-websocket'
 *   const doc = new Y.Doc()
 *   const provider = new WebsocketProvider('http://localhost:1234', 'my-document-name', doc)
 *
 * @extends {Observable<string>}
 */
export class WebsocketProvider extends Observable {
	/**
	 * @param {string} serverUrl
	 * @param {string} roomname
	 * @param {Y.Doc} doc
	 * @param {object} opts
	 * @param {boolean} [opts.connect]
	 * @param {awarenessProtocol.Awareness} [opts.awareness]
	 * @param {Object<string,string>} [opts.params] specify url parameters
	 * @param {typeof WebSocket} [opts.WebSocketPolyfill] Optionall provide a WebSocket polyfill
	 * @param {number} [opts.resyncInterval] Request server state every `resyncInterval` milliseconds
	 * @param {number} [opts.maxBackoffTime] Maximum amount of time to wait before trying to reconnect (we try to reconnect using exponential backoff)
	 * @param {boolean} [opts.disableBc] Disable cross-tab BroadcastChannel communication
	 */
	constructor(serverUrl, roomname, doc, {
		connect = true,
		awareness = new awarenessProtocol.Awareness(doc),
		params = {},
		WebSocketPolyfill = WebSocket,
		resyncInterval = -1,
		maxBackoffTime = 2500,
		disableBc = false
	} = {}) {
		super()
		// ensure that url is always ends with /
		while (serverUrl[serverUrl.length - 1] === '/') {
			serverUrl = serverUrl.slice(0, serverUrl.length - 1)
		}
		this.serverUrl = serverUrl
		this.bcChannel = serverUrl + '/' + roomname
		this.maxBackoffTime = maxBackoffTime
		/**
		 * The specified url parameters. This can be safely updated. The changed parameters will be used
		 * when a new connection is established.
		 * @type {Object<string,string>}
		 */
		this.params = params
		this.roomname = roomname
		this.doc = doc
		this._WS = WebSocketPolyfill
		this.awareness = awareness
		this.wsconnected = false
		this.wsconnecting = false
		this.bcconnected = false
		this.disableBc = disableBc
		this.wsUnsuccessfulReconnects = 0
		/**
		 * @type {boolean}
		 */
		this._synced = false
		/**
		 * @type {WebSocket?}
		 */
		this.ws = null
		this.wsLastMessageReceived = 0
		/**
		 * Whether to connect to other peers or not
		 * @type {boolean}
		 */
		this.shouldConnect = connect

		/**
		 * @type {number}
		 */
		this._resyncInterval = 0
		if (resyncInterval > 0) {
			this._resyncInterval = /** @type {any} */ (setInterval(() => {
				if (this.ws && this.ws.readyState === WebSocket.OPEN) {
					// resend sync step 1
					const encoder = encoding.createEncoder()
					syncProtocol.writeSyncStep1(encoder, doc)
					this.ws.send(encoding.toUint8Array(encoder))
				}
			}, resyncInterval))
		}

		/**
		 * @param {ArrayBuffer} data
		 * @param {any} origin
		 */
		// TODO: Do we need this?
		// this._bcSubscriber = (data, origin) => {
		// 	if (origin !== this) {
		// 		const encoder = readMessage(this, new Uint8Array(data), false)
		// 		if (encoding.length(encoder) > 1) {
		// 			bc.publish(this.bcChannel, encoding.toUint8Array(encoder), this)
		// 		}
		// 	}
		// }
		/**
		 * Listens to Yjs updates and sends them to remote peers (ws and broadcastchannel)
		 * @param {Uint8Array} update
		 * @param {any} origin
		 */
		this._updateHandler = (update, origin) => {
			if (origin !== this) {
				const encoder = encoding.createEncoder()
				syncProtocol.writeUpdate(encoder, update)
				broadcastMessage(this, encoding.toUint8Array(encoder).slice(1))
			}
		}
		this.doc.on('update', this._updateHandler)
		/**
		 * @param {any} changed
		 * @param {any} _origin
		 */
		this._awarenessUpdateHandler = ({ added, updated, removed }, _origin) => {
			const changedClients = added.concat(updated).concat(removed)
			const encoder = encoding.createEncoder()
			encoding.writeVarUint8Array(
				encoder,
				awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients)
			)
			encoding.writeVarUint(encoder, MESSAGE.AWARENESS)
			broadcastMessage(this, encoding.toUint8Array(encoder))
		}
		this._exitHandler = () => {
			awarenessProtocol.removeAwarenessStates(
				this.awareness,
				[doc.clientID],
				'app closed'
			)
		}
		if (env.isNode && typeof process !== 'undefined') {
			process.on('exit', this._exitHandler)
		}
		awareness.on('update', this._awarenessUpdateHandler)
		this._checkInterval = /** @type {any} */ (setInterval(() => {
			if (
				this.wsconnected &&
				messageReconnectTimeout <
				time.getUnixTime() - this.wsLastMessageReceived
			) {
        // no message received in a long time - not even your own awareness
        // updates (which are updated every 15 seconds)
        /** @type {WebSocket} */ (this.ws).close()
			}
		}, messageReconnectTimeout / 10))
		if (connect) {
			this.connect()
		}
	}

	get url() {
		const encodedParams = url.encodeQueryParams(this.params)
		return this.serverUrl + '/' + this.roomname +
			(encodedParams.length === 0 ? '' : '?' + encodedParams)
	}

	/**
	 * @type {boolean}
	 */
	get synced() {
		return this._synced
	}

	set synced(state) {
		if (this._synced !== state) {
			this._synced = state
			this.emit('synced', [state])
			this.emit('sync', [state])
		}
	}

	destroy() {
		if (this._resyncInterval !== 0) {
			clearInterval(this._resyncInterval)
		}
		clearInterval(this._checkInterval)
		this.disconnect()
		if (env.isNode && typeof process !== 'undefined') {
			process.off('exit', this._exitHandler)
		}
		this.awareness.off('update', this._awarenessUpdateHandler)
		this.doc.off('update', this._updateHandler)
		super.destroy()
	}

	// connectBc() {
	// 	if (this.disableBc) {
	// 		return
	// 	}
	// 	if (!this.bcconnected) {
	// 		bc.subscribe(this.bcChannel, this._bcSubscriber)
	// 		this.bcconnected = true
	// 	}
	// 	// send sync step1 to bc
	// 	// write sync step 1
	// 	const encoderSync = encoding.createEncoder()
	// 	syncProtocol.writeSyncStep1(encoderSync, this.doc)
	// 	bc.publish(this.bcChannel, encoding.toUint8Array(encoderSync), this)
	// 	// broadcast local state
	// 	const encoderState = encoding.createEncoder()
	// 	syncProtocol.writeSyncStep2(encoderState, this.doc)
	// 	bc.publish(this.bcChannel, encoding.toUint8Array(encoderState), this)
	// 	// write queryAwareness
	// 	const encoderAwarenessQuery = encoding.createEncoder()
	// 	encoding.writeVarUint(encoderAwarenessQuery, MESSAGE.QUERY_AWARENESS)
	// 	bc.publish(
	// 		this.bcChannel,
	// 		encoding.toUint8Array(encoderAwarenessQuery),
	// 		this
	// 	)
	// 	// broadcast local awareness state
	// 	const encoderAwarenessState = encoding.createEncoder()
	// 	encoding.writeVarUint8Array(
	// 		encoderAwarenessState,
	// 		awarenessProtocol.encodeAwarenessUpdate(this.awareness, [
	// 			this.doc.clientID
	// 		])
	// 	)
	// 	encoding.writeVarUint(encoderAwarenessState, MESSAGE.AWARENESS)
	// 	bc.publish(
	// 		this.bcChannel,
	// 		encoding.toUint8Array(encoderAwarenessState),
	// 		this
	// 	)
	// }
	//
	// disconnectBc() {
	// 	// broadcast message with local awareness state set to null (indicating disconnect)
	// 	const encoder = encoding.createEncoder()
	// 	encoding.writeVarUint8Array(
	// 		encoder,
	// 		awarenessProtocol.encodeAwarenessUpdate(this.awareness, [
	// 			this.doc.clientID
	// 		], new Map())
	// 	)
	// 	encoding.writeVarUint(encoder, MESSAGE.AWARENESS)
	// 	broadcastMessage(this, encoding.toUint8Array(encoder))
	// 	if (this.bcconnected) {
	// 		bc.unsubscribe(this.bcChannel, this._bcSubscriber)
	// 		this.bcconnected = false
	// 	}
	// }

	disconnect() {
		this.shouldConnect = false
		// this.disconnectBc()
		if (this.ws !== null) {
			this.ws.close()
		}
	}

	connect() {
		this.shouldConnect = true
		if (!this.wsconnected && this.ws === null) {
			setupWS(this)
			// this.connectBc()
		}
	}
}
