use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Clone)]
pub struct HttpClient {
    client: Client,
    base_url: String,
    token: Option<String>,
}

#[derive(Serialize)]
struct LoginBody {
    email: String,
    password: String,
}

#[derive(Deserialize)]
struct LoginResponse {
    pub token: String,
}

impl HttpClient {
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

    pub async fn login(&mut self, email: String, password: String) -> Result<(), reqwest::Error> {
        let url = format!("{}/token", self.base_url);
        let request_body = LoginBody { email, password };

        let login_response = self
            .client
            .post(url)
            .json(&request_body)
            .send()
            .await?
            .error_for_status()?
            .json::<LoginResponse>()
            .await?;

        self.token = Some(login_response.token);

        Ok(())
    }
}
