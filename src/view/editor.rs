use core::panic;
use std::borrow::BorrowMut;

use crate::{configuration::ClientSettings, websocket, Message};
use iced::{widget::text_editor, Command, Element, Length, Subscription};
use yrs::{updates::decoder::Decode, Doc, Text, TextRef, Transact, Update};

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
            websocket::Event::Update(update) => {
                self.document
                    .transact_mut()
                    .apply_update(Update::decode_v1(update.as_slice()).unwrap());
                Command::none()
            }
        }
    }
}

impl View for Editor {
    fn update(&mut self, message: Message) -> Command<Message> {
        match message {
            Message::WebsocketEvent(event) => self.handle_websocket_event(event),
            Message::EditorAction(action) => {
                let mut txn = self.document.transact_mut();

                match &action {
                    text_editor::Action::Edit(edit) => {
                        let index = get_cursor_index(&self.content);
                        match edit {
                            text_editor::Edit::Insert(char) => {
                                self.current_text
                                    .insert(&mut txn, index as u32, &char.to_string())
                            }
                            text_editor::Edit::Paste(content) => {
                                self.current_text.insert(&mut txn, index as u32, &*content)
                            }
                            text_editor::Edit::Enter => {
                                self.current_text.insert(&mut txn, index as u32, "\n")
                            }
                            text_editor::Edit::Delete => {
                                self.current_text.remove_range(&mut txn, index as u32, 1)
                            }
                            text_editor::Edit::Backspace => {
                                if index == 0 {
                                    ()
                                }
                                self.current_text
                                    .remove_range(&mut txn, index as u32 - 1, 1)
                            }
                        }
                    }
                    _ => (),
                }

                self.content.perform(action);
                if let Some(cn) = self.connection.borrow_mut() {
                    let update = txn.encode_update_v1();
                    cn.send(update);
                }

                Command::none()
            }
            _ => panic!("Unknown message for editor: {:?}", message),
        }
    }

    fn view(&self) -> Element<'_, Message> {
        text_editor(&self.content)
            .on_action(Message::EditorAction)
            .height(Length::Fill)
            .into()
    }

    fn subscription(&self) -> Subscription<Message> {
        websocket::connect(self.settings.server_url.clone(), self.token.clone())
            .map(Message::WebsocketEvent)
    }
}

fn get_cursor_index(content: &text_editor::Content) -> usize {
    let (line, column) = content.cursor_position();

    if line == 0 {
        return column;
    }

    content
        .lines()
        .take(line - 1)
        .fold(0, |count, line| count + line.len())
        + column
}
