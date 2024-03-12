use crate::websocket;

#[derive(Debug, Clone)]
pub enum Message {
    NewMessageChanged(String),
    Send(websocket::Message),
    Event(websocket::Event),
}
