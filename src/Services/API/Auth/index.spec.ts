// #region Local Imports
import { AuthService } from "@Services";
import { createServer, Response } from "miragejs";

describe("Auth Service tests", () => {
  let server;
  beforeEach(() => {
    server = createServer({
      environment: "test",
      routes() {
        this.namespace = "api";

        this.post("/auth/register", (schema, request) => {
          return new Response(
            200,
            {},
            {
              error: false,
              code: 200,
              data: {
                token: "Winterfell",
              },
            }
          );
        });
      },
    });
  });

  afterEach(() => {
    server.shutdown();
  });
  test("200 test", async () => {
    const result = await AuthService.register({
      params: { email: "john@test.com", password: "12345678" },
    });
    console.log(JSON.stringify(result));
    expect(result.data.token).toEqual("Winterfell");
  });
});
