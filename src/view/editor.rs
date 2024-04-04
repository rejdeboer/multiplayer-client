use core::panic;

use crate::{configuration::ClientSettings, websocket, Message};
use iced::{widget::text_editor, Command, Element, Subscription};
use yrs::{Doc, TextRef};

use super::View;

pub struct Editor {
    settings: ClientSettings,
    token: String,
    content: text_editor::Content,
    connection: Option<websocket::Connection>,
    document: Doc,
    current_text: TextRef,
}

impl Editor {
    pub fn new(settings: ClientSettings, token: String) -> Self {
        let doc = Doc::new();

        Self {
            settings,
            token,
            content: text_editor::Content::new(),
            connection: None,
            current_text: doc.get_or_insert_text("test"),
            document: doc,
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
        websocket::connect(self.settings.server_url.clone(), self.token.clone()).map(Message::Event)
    }
}
