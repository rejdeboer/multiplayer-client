use std::sync::Arc;

use iced::executor;
use iced::{Application, Command, Element, Settings, Subscription, Theme};
use multiplayer_client::configuration::{get_configuration, ClientSettings};
use multiplayer_client::http::HttpClient;
use multiplayer_client::view::{Chat, Login, View};
use multiplayer_client::Message;

pub fn main() -> iced::Result {
    Client::run(Settings::default())
}

struct Client {
    http_client: Arc<HttpClient>,
    current_view: Box<dyn View>,
}

impl Application for Client {
    type Message = Message;
    type Theme = Theme;
    type Flags = ();
    type Executor = executor::Default;

    fn new(_flags: Self::Flags) -> (Self, Command<Message>) {
        let settings = get_configuration().expect("configuration should be retrieved");
        let http_client = Arc::new(HttpClient::new(settings.server_url));

        let app = Self {
            http_client,
            current_view: Box::new(Login::new(http_client.clone())),
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
            Message::GoToChat => {
                self.current_view = Box::new(Chat::new(self.settings.clone()));
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
}
