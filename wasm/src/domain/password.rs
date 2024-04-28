#[derive(Debug, Clone)]
pub struct Password(String);

impl Password {
    pub fn parse(s: String) -> Result<Password, String> {
        Ok(Self(s))
    }
}

impl AsRef<str> for Password {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

impl std::fmt::Display for Password {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}
