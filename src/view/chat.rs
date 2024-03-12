use crate::{configuration::ClientSettings, message::Message, websocket};
use iced::{
    alignment,
    widget::{button, column, container, row, scrollable, text, text_input},
    Alignment, Color, Command, Element, Length, Subscription,
};
use once_cell::sync::Lazy;

use super::View;

pub struct Chat {
    messages: Vec<websocket::Message>,
    new_message: String,
    state: State,
    settings: ClientSettings,
}

impl Chat {
    pub fn new(settings: ClientSettings) -> Self {
        Self {
            messages: vec![],
            new_message: String::default(),
            state: State::default(),
            settings,
        }
    }
}

impl View for Chat {
    fn update(&mut self, message: Message) -> Command<Message> {
        match message {
            Message::NewMessageChanged(new_message) => {
                self.new_message = new_message;

                Command::none()
            }
            Message::Send(message) => match &mut self.state {
                State::Connected(connection) => {
                    self.new_message.clear();

                    connection.send(message);

                    Command::none()
                }
                State::Disconnected => Command::none(),
            },
            Message::Event(event) => match event {
                websocket::Event::Connected(connection) => {
                    self.state = State::Connected(connection);

                    self.messages.push(websocket::Message::connected());

                    Command::none()
                }
                websocket::Event::Disconnected => {
                    self.state = State::Disconnected;

                    self.messages.push(websocket::Message::disconnected());

                    Command::none()
                }
                websocket::Event::MessageReceived(message) => {
                    self.messages.push(message);

                    scrollable::snap_to(MESSAGE_LOG.clone(), scrollable::RelativeOffset::END)
                }
            },
        }
    }

    fn view(&self) -> Element<'_, Message> {
        let message_log: Element<_> = if self.messages.is_empty() {
            container(
                text("Your messages will appear here...").style(Color::from_rgb8(0x88, 0x88, 0x88)),
            )
            .width(Length::Fill)
            .height(Length::Fill)
            .center_x()
            .center_y()
            .into()
        } else {
            scrollable(
                column(self.messages.iter().cloned().map(text).map(Element::from)).spacing(10),
            )
            .id(MESSAGE_LOG.clone())
            .height(Length::Fill)
            .into()
        };

        let new_message_input = {
            let mut input = text_input("Type a message...", &self.new_message)
                .on_input(Message::NewMessageChanged)
                .padding(10);

            let mut button = button(
                text("Send")
                    .height(40)
                    .vertical_alignment(alignment::Vertical::Center),
            )
            .padding([0, 20]);

            if matches!(self.state, State::Connected(_)) {
                if let Some(message) = websocket::Message::new(&self.new_message) {
                    input = input.on_submit(Message::Send(message.clone()));
                    button = button.on_press(Message::Send(message));
                }
            }

            row![input, button]
                .spacing(10)
                .align_items(Alignment::Center)
        };

        column![message_log, new_message_input]
            .height(Length::Fill)
            .padding(20)
            .spacing(10)
            .into()
    }

    fn subscription(&self) -> Subscription<Message> {
        websocket::connect(self.settings.server_url.clone()).map(Message::Event)
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
