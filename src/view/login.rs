use core::panic;

use crate::configuration::ClientSettings;
use crate::http::HttpClient;
use crate::widget::error_message;
use crate::Message;
use iced::widget::{button, column, container, text, text_input};
use iced::{Alignment, Command, Element, Length, Subscription};
use reqwest::StatusCode;

use super::View;

pub struct Login {
    http_client: HttpClient,
    email: String,
    password: String,
    error_message: Option<String>,
}

impl Login {
    pub fn new(settings: ClientSettings) -> Self {
        Self {
            http_client: HttpClient::new(settings.server_url),
            email: String::new(),
            password: String::new(),
            error_message: None,
        }
    }
}

impl Login {
    fn handle_login(&mut self, email: String, password: String) -> Command<Message> {
        let client = self.http_client.clone();
        Command::perform(
            async move { client.get_token(email, password).await },
            |login_response| match login_response {
                Ok(token) => Message::GoToChat(token),
                Err(err) => handle_error(err),
            },
        )
    }
}

impl View for Login {
    fn update(&mut self, message: Message) -> Command<Message> {
        match message {
            Message::LoginSubmit(email, password) => self.handle_login(email, password),
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

        let form = if let Some(msg) = &self.error_message {
            let error_message = error_message(msg.clone());
            column![email_input, password_input, error_message, submit_button]
        } else {
            column![email_input, password_input, submit_button]
        };

        container(
            form.align_items(Alignment::Center)
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

fn handle_error(err: reqwest::Error) -> Message {
    if let Some(status) = err.status() {
        if status.lt(&StatusCode::INTERNAL_SERVER_ERROR) {
            return Message::LoginError("Invalid username or password".to_string());
        }
    }

    Message::LoginError("An unexpected error occured, please try again later".to_string())
}
