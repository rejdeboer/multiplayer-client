use iced::futures;
use iced::subscription::{self, Subscription};

use futures::channel::mpsc;
use futures::sink::SinkExt;
use futures::stream::StreamExt;

use rand::Rng;

pub fn connect(server_url: String, token: String) -> Subscription<Event> {
    struct Connect;

    subscription::channel(
        std::any::TypeId::of::<Connect>(),
        100,
        |mut output| async move {
            _ = tracing::info_span!("WS loop").entered();
            let mut state = State::Disconnected;

            loop {
                match &mut state {
                    State::Disconnected => {
                        // TODO: use document ID in URL
                        let url = format!("{}/sync/{}?{}", server_url, "".to_string(), token);
                        match ws_stream_wasm::WsMeta::connect(url, None).await {
                            Ok((_, stream)) => {
                                let (sender, receiver) = mpsc::channel(100);

                                _ = output.send(Event::Connected(Connection(sender))).await;

                                state = State::Connected(stream, receiver);
                            }
                            Err(err) => {
                                tracing::error!("error connecting to server: {}", err);
                                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
                                _ = output.send(Event::Disconnected).await;
                            }
                        }
                    }
                    State::Connected(stream, input) => {
                        let mut fused_websocket = stream.by_ref().fuse();

                        futures::select! {
                            received = fused_websocket.select_next_some() => {
                                match received {
                                   ws_stream_wasm::WsMessage::Binary(update) => {
                                        _ = output.send(Event::Update(update)).await;
                                    }
                                    response => {
                                        tracing::warn!("unhandled message: {:?}", response);
                                    },
                                }
                            }

                            update = input.select_next_some() => {
                                let result = stream.send(ws_stream_wasm::WsMessage::Binary(update)).await;

                                if result.is_err() {
                                    _ = output.send(Event::Disconnected).await;

                                    state = State::Disconnected;
                                }
                            }
                        }
                    }
                }
            }
        },
    )
}

#[derive(Debug)]
#[allow(clippy::large_enum_variant)]
enum State {
    Disconnected,
    Connected(ws_stream_wasm::WsStream, mpsc::Receiver<Vec<u8>>),
}

#[derive(Debug, Clone)]
pub enum Event {
    Connected(Connection),
    Disconnected,
    Update(Vec<u8>),
}

#[derive(Debug, Clone)]
pub struct Connection(mpsc::Sender<Vec<u8>>);

impl Connection {
    pub fn send(&mut self, update: Vec<u8>) {
        self.0
            .try_send(update)
            .expect("message should be sent to server");
    }
}

fn generate_websocket_key() -> String {
    let mut rng = rand::thread_rng();
    let mut random_bytes = [0u8; 16];
    rng.fill(&mut random_bytes);
    base64::encode(random_bytes)
}
