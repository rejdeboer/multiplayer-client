mod chat;
mod login;

use iced::{Command, Element, Subscription};

use crate::Message;

pub use chat::*;
pub use login::*;

pub trait View {
    fn update(&mut self, message: Message) -> Command<Message>;

    fn view(&self) -> Element<'_, Message>;

    fn subscription(&self) -> Subscription<Message>;
}
