use iced::widget::text;
use iced::{theme, Color, Element};

use crate::Message;

pub fn error_message<'a>(message: String) -> Element<'a, Message> {
    text(message)
        .style(theme::Text::from(Color::from_rgb(1., 0., 0.)))
        .into()
}
