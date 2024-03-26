use core::panic;

use crate::{configuration::ClientSettings, websocket, Message};
use iced::{
    alignment,
    widget::{button, column, container, row, scrollable, text, text_editor, text_input},
    Alignment, Color, Command, Element, Length, Subscription,
};
use once_cell::sync::Lazy;

use super::View;

pub struct Editor {
    settings: ClientSettings,
    token: String,
    content: text_editor::Content,
    state: State,
}

impl Editor {
    pub fn new(settings: ClientSettings, token: String) -> Self {
        Self {
            settings,
            token,
            content: text_editor::Content::new(),
            state: State::default(),
        }
    }
}

impl View for Editor {
    fn update(&mut self, message: Message) -> Command<Message> {
        match message {
            _ => panic!("Unknown message for editor: {:?}", message),
        }
    }

    fn view(&self) -> Element<'_, Message> {
        text_editor(&self.content).into()
    }

    fn subscription(&self) -> Subscription<Message> {
        websocket::connect(self.settings.server_url.clone(), self.token.clone())
            .map(Message::ContentChanged)
    }
}

enum State {
    Disconnected,
    Connected(websocket::Connection),
}

impl Default for State {
    fn default() -> Self {
        Self::Disconnected
    }
}

static MESSAGE_LOG: Lazy<scrollable::Id> = Lazy::new(scrollable::Id::unique);
