use iced::executor;
use iced::{Application, Command, Element, Settings, Subscription, Theme};
use multiplayer_client::configuration::get_configuration;
use multiplayer_client::view::{Chat, View};
use multiplayer_client::Message;

pub fn main() -> iced::Result {
    Client::run(Settings::default())
}

struct Client {
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
            current_view: Box::new(Chat::new(settings.clone())),
        };

        (app, Command::none())
    }

    fn title(&self) -> String {
        String::from("Multiplayer client")
    }

    fn update(&mut self, message: Message) -> Command<Message> {
        match message {
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
