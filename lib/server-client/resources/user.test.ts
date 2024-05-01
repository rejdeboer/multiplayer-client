// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable  @typescript-eslint/no-throw-literal */
import axios from "axios";
import { Server, ServerClient } from "../server";

let server: ServerClient;

beforeAll(async () => {
  server = Server("http://localhost:8000");
});

describe("User resource", () => {
  it("create", async () => {
    const intId = server.addRequestInterceptor((config) => {
      expect(config.method).toBe("post");
      expect(config.data).toEqual({
        email: "rick.deboer@live.nl",
        username: "rejdeboer",
        password: "Secret123!",
      });
      expect(config.url).toBe("user");

      throw new axios.Cancel("test");
    });

    await server.users
      .create({
        email: "rick.deboer@live.nl",
        username: "rejdeboer",
        password: "Secret123!",
      })
      .catch((e: Error) => expect(e.message).toBe("test"))
      .finally(() => server.removeInterceptor("request", intId));
  });
});

export { };
