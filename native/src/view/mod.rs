mod editor;
mod home;
mod login;
mod signup;

use iced::{Command, Element, Subscription};

use crate::Message;

pub use editor::*;
pub use home::*;
pub use login::*;
pub use signup::*;

pub trait View {
    fn update(&mut self, message: Message) -> Command<Message>;

    fn view(&self) -> Element<'_, Message>;

    fn subscription(&self) -> Subscription<Message>;
}
