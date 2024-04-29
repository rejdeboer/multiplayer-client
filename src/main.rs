use core::panic;

use iced::widget::{column, text_editor};
use iced::{executor, Length};
use iced::{Application, Command, Element, Settings, Subscription, Theme};
use multiplayer_client::Message;

pub fn main() -> iced::Result {
    #[cfg(not(target_arch = "wasm32"))]
    tracing_subscriber::fmt::init();

    Client::run(Settings::default())
}

struct Client {
    content: text_editor::Content,
}

impl Application for Client {
    type Message = Message;
    type Theme = Theme;
    type Flags = ();
    type Executor = executor::Default;

    fn new(_flags: Self::Flags) -> (Self, Command<Message>) {
        let app = Self {
            content: text_editor::Content::new(),
        };

        (app, Command::none())
    }

    fn title(&self) -> String {
        String::from("Multiplayer client")
    }

    fn update(&mut self, message: Message) -> Command<Message> {
        match message {
            Message::EditorAction(action) => {
                self.content.perform(action);
                Command::none()
            }
            _ => panic!("Unknown message"),
        }
    }

    fn subscription(&self) -> Subscription<Message> {
        Subscription::none()
    }

    fn view(&self) -> Element<Message> {
        let editor = text_editor(&self.content)
            .on_action(Message::EditorAction)
            .height(Length::Fill);

        let view = column![editor];

        view.into()
    }

    fn theme(&self) -> Self::Theme {
        Theme::Dark
    }
}
