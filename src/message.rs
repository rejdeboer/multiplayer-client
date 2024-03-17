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
    LoginEmailChanged(String),
    LoginPasswordChanged(String),

    // Signup
    SignupSubmit(String, String, String, String),
    SignupError(String),
    SignupEmailChanged(String),
    SignupUsernameChanged(String),
    SignupPasswordChanged(String),
    SignupPasswordConfirmChanged(String),

    // Chat
    NewMessageChanged(String),
    Send(websocket::Message),
    Event(websocket::Event),
}
