use reqwest::Client;

#[derive(Clone)]
pub struct Http {
    client: Client,
    base_url: String,
    token: Option<String>,
}

impl Http {
    pub fn new(base_url: String) -> Self {
        let client = Client::new();
        Self {
            client,
            base_url,
            token: None,
        }
    }

    pub fn get_token(&self) -> Option<String> {
        self.token
    }
}
