use validator::ValidateEmail;

#[derive(Debug, Clone)]
pub struct Email(String);

impl Email {
    pub fn parse(s: String) -> Result<Email, String> {
        if ValidateEmail::validate_email(&s) {
            Ok(Self(s))
        } else {
            Err(format!("{} is not a valid email.", s))
        }
    }
}

impl AsRef<str> for Email {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

impl std::fmt::Display for Email {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

#[cfg(test)]
mod tests {
    use super::Email;
    use fake::faker::internet::en::SafeEmail;
    use fake::Fake;

    #[derive(Debug, Clone)]
    struct ValidEmailFixture(pub String);

    impl quickcheck::Arbitrary for ValidEmailFixture {
        fn arbitrary<G: quickcheck::Gen>(g: &mut G) -> Self {
            let email = SafeEmail().fake_with_rng(g);
            Self(email)
        }
    }

    #[test]
    fn empty_string_is_rejected() {
        let email = "".to_string();
        assert_eq!(Email::parse(email).is_err(), true);
    }

    #[test]
    fn email_missing_at_symbol_is_rejected() {
        let email = "rick.deboer.com".to_string();
        assert_eq!(Email::parse(email).is_err(), true);
    }

    #[test]
    fn email_missing_subject_is_rejected() {
        let email = "@live.nl".to_string();
        assert_eq!(Email::parse(email).is_err(), true);
    }

    #[quickcheck_macros::quickcheck]
    fn valid_emails_are_parsed_successfully(valid_email: ValidEmailFixture) -> bool {
        Email::parse(valid_email.0).is_ok()
    }
}
