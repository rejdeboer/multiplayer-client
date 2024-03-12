use iced::alignment::{self, Alignment};
use iced::executor;
use iced::widget::{button, column, container, row, scrollable, text, text_input};
use iced::{Application, Color, Command, Element, Length, Settings, Subscription, Theme};
use multiplayer_client::configuration::{get_configuration, ClientSettings};
use multiplayer_client::echo;
use once_cell::sync::Lazy;

pub fn main() -> iced::Result {
    WebSocket::run(Settings::default())
}

struct WebSocket {
    messages: Vec<echo::Message>,
    new_message: String,
    state: State,
    settings: ClientSettings,
}

#[derive(Debug, Clone)]
enum Message {
    NewMessageChanged(String),
    Send(echo::Message),
    Echo(echo::Event),
}

impl Application for WebSocket {
    type Message = Message;
    type Theme = Theme;
    type Flags = ();
    type Executor = executor::Default;

    fn new(_flags: Self::Flags) -> (Self, Command<Message>) {
        let app = Self {
            messages: vec![],
            new_message: String::default(),
            state: State::default(),
            settings: get_configuration().expect("failed to get configuration"),
        };

        (app, Command::none())
    }

    fn title(&self) -> String {
        String::from("WebSocket - Iced")
    }

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
            Message::Echo(event) => match event {
                echo::Event::Connected(connection) => {
                    self.state = State::Connected(connection);

                    self.messages.push(echo::Message::connected());

                    Command::none()
                }
                echo::Event::Disconnected => {
                    self.state = State::Disconnected;

                    self.messages.push(echo::Message::disconnected());

                    Command::none()
                }
                echo::Event::MessageReceived(message) => {
                    self.messages.push(message);

                    scrollable::snap_to(MESSAGE_LOG.clone(), scrollable::RelativeOffset::END)
                }
            },
        }
    }

    fn subscription(&self) -> Subscription<Message> {
        echo::connect(self.settings.server_url.clone()).map(Message::Echo)
    }

    fn view(&self) -> Element<Message> {
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
                if let Some(message) = echo::Message::new(&self.new_message) {
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
}

enum State {
    Disconnected,
    Connected(echo::Connection),
}

impl Default for State {
    fn default() -> Self {
        Self::Disconnected
    }
}

static MESSAGE_LOG: Lazy<scrollable::Id> = Lazy::new(scrollable::Id::unique);
