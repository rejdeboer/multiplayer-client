use crate::websocket;

#[derive(Debug, Clone)]
pub enum Message {
    // Views
    GoToLogin,
    GoToSignup,
    GoToChat,

    // Login
    LoginSubmit(String, String),

    // Chat
    NewMessageChanged(String),
    Send(websocket::Message),
    Event(websocket::Event),
}
