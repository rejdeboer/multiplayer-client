use crate::websocket;

#[derive(Debug, Clone)]
pub enum Message {
    // Views
    GoToLogin,
    GoToSignup,
    GoToChat(String),

    // Login
    LoginSubmit(String, String),
    LoginError(String),

    // Chat
    NewMessageChanged(String),
    Send(websocket::Message),
    Event(websocket::Event),
}
