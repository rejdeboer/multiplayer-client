/**
 * @module sync-protocol
 */

import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import * as Y from 'yjs'
import * as MESSAGE from './message'

/**
 * @typedef {Map<number, number>} StateMap
 */

/**
 * Core Yjs defines two message types:
 * • YjsSyncStep1: Includes the State Set of the sending client. When received, the client should reply with YjsSyncStep2.
 * • YjsSyncStep2: Includes all missing structs and the complete delete set. When received, the client is assured that it
 *   received all information from the remote client.
 *
 * In a client-server model, you want to handle this differently: The client should initiate the connection with SyncStep1.
 * When the server receives SyncStep1, it should reply with SyncStep2 immediately followed by SyncStep1. The client replies
 * with SyncStep2 when it receives SyncStep1. Optionally the server may send a SyncDone after it received SyncStep2, so the
 * client knows that the sync is finished.  There are two reasons for this more elaborated sync model: 1. This protocol can
 * easily be implemented on top of http and websockets. 2. The server should only reply to requests, and not initiate them.
 * Therefore it is necessary that the client initiates the sync.
 *
 * Construction of a message:
 * [messageType : varUint, message definition..]
 *
 * Note: A message does not include information about the room name. This must to be handled by the upper layer protocol!
 *
 * stringify[messageType] stringifies a message definition (messageType is already read from the bufffer)
 */

/**
 * Create a sync step 1 message based on the state of the current shared document.
 *
 * @param {encoding.Encoder} encoder
 * @param {Y.Doc} doc
 */
export const writeSyncStep1 = (encoder, doc) => {
	const sv = Y.encodeStateVector(doc)
	encoding.writeVarUint8Array(encoder, sv)
	encoding.writeVarUint(encoder, MESSAGE.SYNC_STEP_1)
}

/**
 * @param {encoding.Encoder} encoder
 * @param {Y.Doc} doc
 * @param {Uint8Array} [encodedStateVector]
 */
export const writeSyncStep2 = (encoder, doc, encodedStateVector) => {
	encoding.writeVarUint8Array(encoder, Y.encodeStateAsUpdate(doc, encodedStateVector))
	encoding.writeVarUint(encoder, MESSAGE.SYNC_STEP_2)
}

/**
 * Read SyncStep1 message and reply with SyncStep2.
 *
 * @param {decoding.Decoder} decoder The reply to the received message
 * @param {encoding.Encoder} encoder The received message
 * @param {Y.Doc} doc
 */
export const readSyncStep1 = (decoder, encoder, doc) =>
	writeSyncStep2(encoder, doc, decoder.arr.length > 1 ? decoding.readVarUint8Array(decoder) : Uint8Array.of(0))

/**
 * Read and apply Structs and then DeleteStore to a y instance.
 *
 * @param {decoding.Decoder} decoder
 * @param {Y.Doc} doc
 * @param {any} transactionOrigin
 */
export const readSyncStep2 = (decoder, doc, transactionOrigin) => {
	try {
		Y.applyUpdate(doc, decoding.readVarUint8Array(decoder), transactionOrigin)
	} catch (error) {
		// This catches errors that are thrown by event handlers
		console.error('Caught error while handling a Yjs update', error)
	}
}

/**
 * @param {encoding.Encoder} encoder
 * @param {Uint8Array} update
 */
export const writeUpdate = (encoder, update) => {
	encoding.writeVarUint8Array(encoder, update)
	encoding.writeVarUint(encoder, MESSAGE.UPDATE)
}

/**
 * Read and apply Structs and then DeleteStore to a y instance.
 *
 * @param {decoding.Decoder} decoder
 * @param {Y.Doc} doc
 * @param {any} transactionOrigin
 */
export const readUpdate = readSyncStep2

