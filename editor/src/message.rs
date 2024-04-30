#[derive(Debug, Clone)]
pub enum Message {
    // Views
    GoToLogin,
    GoToSignup,
    GoToEditor(String),

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

    // Editor
    Send(String),
    EditorAction(iced::widget::text_editor::Action),
    EditorToggleModal,
    EditorNewFileNameChanged(String),
    EditorCreateFile,
    // WebsocketEvent(websocket::Event),
}
