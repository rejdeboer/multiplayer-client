use async_tungstenite::tungstenite::handshake::client::Request;
use iced::futures;
use iced::subscription::{self, Subscription};

use futures::channel::mpsc;
use futures::sink::SinkExt;
use futures::stream::StreamExt;

use async_tungstenite::tungstenite;
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
                        let request = create_connection_request(&server_url, &token);
                        match async_tungstenite::tokio::connect_async(request).await {
                            Ok((websocket, _)) => {
                                let (sender, receiver) = mpsc::channel(100);

                                _ = output.send(Event::Connected(Connection(sender))).await;

                                state = State::Connected(websocket, receiver);
                            }
                            Err(err) => {
                                tracing::error!("error connecting to server: {}", err);
                                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
                                _ = output.send(Event::Disconnected).await;
                            }
                        }
                    }
                    State::Connected(websocket, input) => {
                        let mut fused_websocket = websocket.by_ref().fuse();

                        futures::select! {
                            received = fused_websocket.select_next_some() => {
                                match received {
                                    Ok(tungstenite::Message::Binary(update)) => {
                                        _ = output.send(Event::Update(update)).await;
                                    }
                                    Err(err) => {
                                        tracing::error!("error receiving message: {}", err);
                                        _ = output.send(Event::Disconnected).await;
                                        state = State::Disconnected;
                                    }
                                    Ok(response) => {
                                        tracing::warn!("unhandled message: {:?}", response);
                                    },
                                }
                            }

                            update = input.select_next_some() => {
                                let result = websocket.send(tungstenite::Message::binary(update)).await;

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
    Connected(
        async_tungstenite::WebSocketStream<async_tungstenite::tokio::ConnectStream>,
        mpsc::Receiver<Vec<u8>>,
    ),
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

fn create_connection_request(server_url: &str, token: &str) -> Request {
    let url_str = &*format!("{}/websocket", &server_url.replace("http", "ws"));
    let url = url::Url::parse(url_str).unwrap();
    let host = url.host_str().expect("Host should be found in URL");

    Request::builder()
        .method("GET")
        .uri(url_str)
        .header("Host", host)
        .header("Authorization", format!("Bearer {}", token))
        .header("Upgrade", "websocket")
        .header("Connection", "upgrade")
        .header("Sec-Websocket-Key", generate_websocket_key())
        .header("Sec-Websocket-Version", "13")
        .body(())
        .unwrap()
}

fn generate_websocket_key() -> String {
    let mut rng = rand::thread_rng();
    let mut random_bytes = [0u8; 16];
    rng.fill(&mut random_bytes);
    base64::encode(random_bytes)
}
