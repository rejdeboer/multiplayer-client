use core::panic;

use crate::configuration::ClientSettings;
use crate::domain::Email;
use crate::http::HttpClient;
use crate::widget::error_message;
use crate::Message;
use iced::widget::{button, column, container, text, text_input};
use iced::{Alignment, Command, Element, Length, Subscription};
use reqwest::StatusCode;

use super::View;

pub struct Signup {
    http_client: HttpClient,
    email: String,
    email_error: Option<String>,
    username: String,
    username_error: Option<String>,
    password: String,
    password_error: Option<String>,
    password_confirm: String,
    password_confirm_error: Option<String>,
    form_error: Option<String>,
}

impl Signup {
    pub fn new(settings: ClientSettings) -> Self {
        Self {
            http_client: HttpClient::new(settings.server_url),
            email: String::new(),
            email_error: None,
            username: String::new(),
            username_error: None,
            password: String::new(),
            password_error: None,
            password_confirm: String::new(),
            password_confirm_error: None,
            form_error: None,
        }
    }
}

impl Signup {
    fn handle_signup(
        &mut self,
        email: String,
        username: String,
        password: String,
        password_confirm: String,
    ) -> Command<Message> {
        let mut is_err = false;

        if password != password_confirm {
            self.password_confirm_error = Some("Passwords should be equal".to_string());
            is_err = true;
        }

        match Email::parse(email.clone()) {
            Ok(_) => self.email_error = None,
            Err(err) => {
                self.email_error = Some(err);
                is_err = true;
            }
        };

        if is_err {
            return Command::none();
        }

        let client = self.http_client.clone();
        Command::perform(
            async move { client.create_user(email, username, password).await },
            |signup_response| match signup_response {
                Ok(()) => Message::GoToLogin,
                Err(err) => Message::SignupError(err.to_string()),
            },
        )
    }
}

impl View for Signup {
    fn update(&mut self, message: Message) -> Command<Message> {
        match message {
            Message::SignupSubmit(email, username, password, password_confirm) => {
                self.handle_signup(email, username, password, password_confirm)
            }
            Message::SignupError(err_msg) => {
                self.form_error = Some(err_msg);
                Command::none()
            }
            Message::SignupEmailChanged(email) => {
                self.email = email;
                Command::none()
            }
            Message::SignupUsernameChanged(username) => {
                self.username = username;
                Command::none()
            }
            Message::SignupPasswordChanged(password) => {
                self.password = password;
                Command::none()
            }
            Message::SignupPasswordConfirmChanged(password) => {
                self.password_confirm = password;
                Command::none()
            }
            _ => panic!("Unknown signup message: {:?}", message),
        }
    }

    fn view(&self) -> Element<'_, Message> {
        let email_input = text_input("Email", &self.email).on_input(Message::SignupEmailChanged);

        let username_input =
            text_input("Username", &self.username).on_input(Message::SignupUsernameChanged);

        let password_input =
            text_input("Password", &self.password).on_input(Message::SignupPasswordChanged);

        let password_confirm_input = text_input("Confirm password", &self.password_confirm)
            .on_input(Message::SignupPasswordConfirmChanged);

        let submit_button = button(text("Submit")).on_press(Message::SignupSubmit(
            self.email.clone(),
            self.username.clone(),
            self.password.clone(),
            self.password_confirm.clone(),
        ));

        let form = if let Some(msg) = &self.form_error {
            let error_message = error_message(msg.clone());
            column![
                email_input,
                username_input,
                password_input,
                password_confirm_input,
                error_message,
                submit_button
            ]
        } else {
            column![
                email_input,
                username_input,
                password_input,
                password_confirm_input,
                submit_button
            ]
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
