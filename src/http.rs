use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone)]
pub struct HttpClient {
    client: Client,
    pub base_url: String,
}

#[derive(Serialize)]
struct LoginBody {
    email: String,
    password: String,
}

#[derive(Serialize)]
struct SignupBody {
    email: String,
    username: String,
    password: String,
}

#[derive(Deserialize)]
struct LoginResponse {
    pub token: String,
}

#[derive(Deserialize)]
struct SignupResponse {
    pub id: String,
    pub email: String,
}

impl HttpClient {
    pub fn new(base_url: String) -> Self {
        let client = Client::new();
        Self { client, base_url }
    }

    pub async fn get_token(
        &self,
        email: String,
        password: String,
    ) -> Result<String, reqwest::Error> {
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

        Ok(login_response.token)
    }

    pub async fn create_user(
        &self,
        email: String,
        username: String,
        password: String,
    ) -> Result<(), reqwest::Error> {
        let url = format!("{}/user", self.base_url);
        let request_body = SignupBody {
            email,
            username,
            password,
        };

        self.client
            .post(url)
            .json(&request_body)
            .send()
            .await?
            .error_for_status()?
            .json::<SignupResponse>()
            .await?;

        Ok(())
    }
}
