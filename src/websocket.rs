use async_tungstenite::tungstenite::handshake::client::Request;
use iced::futures;
use iced::subscription::{self, Subscription};

use futures::channel::mpsc;
use futures::sink::SinkExt;
use futures::stream::StreamExt;

use async_tungstenite::tungstenite;
use rand::Rng;
use std::fmt;

pub fn connect(server_url: String, token: String) -> Subscription<Event> {
    struct Connect;

    subscription::channel(
        std::any::TypeId::of::<Connect>(),
        100,
        |mut output| async move {
            let mut state = State::Disconnected;

            loop {
                match &mut state {
                    State::Disconnected => {
                        let url_str = &*format!("{}/websocket", &server_url.replace("http", "ws"));
                        let url = url::Url::parse(url_str).unwrap();
                        let host = url.host_str().expect("Host should be found in URL");
                        let request = Request::builder()
                            .method("GET")
                            .uri(url_str)
                            .header("Host", host)
                            .header("Authorization", format!("Bearer {}", token))
                            .header("Upgrade", "websocket")
                            .header("Connection", "upgrade")
                            .header("Sec-Websocket-Key", generate_websocket_key())
                            .header("Sec-Websocket-Version", "13")
                            .body(())
                            .unwrap();

                        match async_tungstenite::tokio::connect_async(request).await {
                            Ok((websocket, _)) => {
                                let (sender, receiver) = mpsc::channel(100);

                                _ = output.send(Event::Connected(Connection(sender))).await;

                                state = State::Connected(websocket, receiver);
                            }
                            Err(err) => {
                                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
                                println!("{}", err.to_string());

                                _ = output.send(Event::Disconnected).await;
                            }
                        }
                    }
                    State::Connected(websocket, input) => {
                        let mut fused_websocket = websocket.by_ref().fuse();

                        futures::select! {
                            received = fused_websocket.select_next_some() => {
                                match received {
                                    Ok(tungstenite::Message::Text(message)) => {
                                       _ = output.send(Event::Update(message)).await;
                                    }
                                    Err(err) => {
                                        _ = output.send(Event::Disconnected).await;
                                        println!("{}", err.to_string());

                                        state = State::Disconnected;
                                    }
                                    Ok(_) => continue,
                                }
                            }

                            message = input.select_next_some() => {
                                let result = websocket.send(tungstenite::Message::Text(message.to_string())).await;

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
        mpsc::Receiver<String>,
    ),
}

#[derive(Debug, Clone)]
pub enum Event {
    Connected(Connection),
    Disconnected,
    Update(String),
}

#[derive(Debug, Clone)]
pub struct Connection(mpsc::Sender<String>);

impl Connection {
    pub fn send(&mut self, message: String) {
        self.0
            .try_send(message)
            .expect("message should be sent to server");
    }
}

fn generate_websocket_key() -> String {
    let mut rng = rand::thread_rng();
    let mut random_bytes = [0u8; 16];
    rng.fill(&mut random_bytes);
    base64::encode(random_bytes)
}
