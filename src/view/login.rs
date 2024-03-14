use core::panic;

use crate::auth::login;
use crate::configuration::ClientSettings;
use crate::Message;
use iced::widget::{button, column, container, text, text_input};
use iced::{Alignment, Command, Element, Length, Subscription};

use super::View;

pub struct Login {
    settings: ClientSettings,
    email: String,
    password: String,
}

impl Login {
    pub fn new(settings: ClientSettings) -> Self {
        Self {
            settings,
            email: String::new(),
            password: String::new(),
        }
    }
}

impl Login {
    async fn handle_login(&self, email: &str, password: &str) -> Command<Message> {
        Command::none()
    }
}

impl View for Login {
    fn update(&mut self, message: Message) -> Command<Message> {
        match message {
            Message::LoginSubmit(email, password) => {
                Command::perform(self.handle_login(&email, &password), |_| ())
            }
            _ => panic!("Unknown login message: {:?}", message),
        }
    }

    fn view(&self) -> Element<'_, Message> {
        let email_input = text_input("Email", &self.email);

        let password_input = text_input("Password", &self.password);

        let submit_button = button(text("Submit")).on_press(Message::LoginSubmit(
            self.email.clone(),
            self.password.clone(),
        ));

        container(
            column![email_input, password_input, submit_button]
                .align_items(Alignment::Center)
                .max_width(400)
                .padding(10)
                .spacing(20),
        )
        .center_x()
        .center_y()
        .height(Length::Fill)
        .width(Length::Fill)
        .into()
    }

    fn subscription(&self) -> Subscription<Message> {
        Subscription::none()
    }
}
