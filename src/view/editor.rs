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

    fn handle_websocket_event(&mut self, event: websocket::Event) -> Command<Message> {
        match event {
            websocket::Event::Connected(cn) => {
                self.connection = Some(cn);
                Command::none()
            }
            websocket::Event::Disconnected => {
                self.connection = None;
                Command::none()
            }
            websocket::Event::Update(update) => Command::none(),
        }
    }
}

impl View for Editor {
    fn update(&mut self, message: Message) -> Command<Message> {
        match message {
            Message::WebsocketEvent(event) => self.handle_websocket_event(event),
            Message::EditorAction(action) => {
                self.content.perform(action);
                Command::none()
            }
            _ => panic!("Unknown message for editor: {:?}", message),
        }
    }

    fn view(&self) -> Element<'_, Message> {
        text_editor(&self.content).into()
    }

    fn subscription(&self) -> Subscription<Message> {
        websocket::connect(self.settings.server_url.clone(), self.token.clone())
            .map(Message::WebsocketEvent)
    }
}
