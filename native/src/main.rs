use iced::executor;
use iced::{Application, Command, Element, Settings, Subscription, Theme};
use multiplayer_client::configuration::{get_configuration, ClientSettings};
use multiplayer_client::view::{Editor, Login, Signup, View};
use multiplayer_client::Message;

pub fn main() -> iced::Result {
    #[cfg(not(target_arch = "wasm32"))]
    tracing_subscriber::fmt::init();

    Client::run(Settings::default())
}

struct Client {
    settings: ClientSettings,
    current_view: Box<dyn View>,
}

impl Application for Client {
    type Message = Message;
    type Theme = Theme;
    type Flags = ();
    type Executor = executor::Default;

    fn new(_flags: Self::Flags) -> (Self, Command<Message>) {
        let settings = get_configuration().expect("configuration should be retrieved");

        let app = Self {
            current_view: Box::new(Login::new(settings.clone())),
            settings,
        };

        (app, Command::none())
    }

    fn title(&self) -> String {
        String::from("Multiplayer client")
    }

    fn update(&mut self, message: Message) -> Command<Message> {
        match message {
            Message::GoToLogin => {
                self.current_view = Box::new(Login::new(self.settings.clone()));
                Command::none()
            }
            Message::GoToSignup => {
                self.current_view = Box::new(Signup::new(self.settings.clone()));
                Command::none()
            }
            Message::GoToEditor(token) => {
                self.current_view = Box::new(Editor::new(self.settings.clone(), token));
                Command::none()
            }
            _ => self.current_view.update(message),
        }
    }

    fn subscription(&self) -> Subscription<Message> {
        self.current_view.subscription()
    }

    fn view(&self) -> Element<Message> {
        self.current_view.view()
    }

    fn theme(&self) -> Self::Theme {
        Theme::Dark
    }
}
