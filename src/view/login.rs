use core::panic;

use crate::Message;
use iced::widget::column;
use iced::{Command, Element, Length, Subscription};

use super::View;

pub struct Login {}

impl Login {
    pub fn new() -> Self {
        Self {}
    }
}

impl View for Login {
    fn update(&mut self, message: Message) -> Command<Message> {
        match message {
            _ => panic!("Unknown login message: {:?}", message),
        }
    }

    fn view(&self) -> Element<'_, Message> {
        column![]
            .height(Length::Fill)
            .padding(20)
            .spacing(10)
            .into()
    }

    fn subscription(&self) -> Subscription<Message> {
        Subscription::none()
    }
}
