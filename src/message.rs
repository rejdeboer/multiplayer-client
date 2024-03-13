use crate::websocket;

#[derive(Debug, Clone)]
pub enum Message {
    // Views
    GoToLogin,
    GoToSignup,
    GoToChat,

    // Chat
    NewMessageChanged(String),
    Send(websocket::Message),
    Event(websocket::Event),
}
