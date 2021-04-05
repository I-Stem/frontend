// #region Local Imports
import { Http } from "./index";
import { createServer, Response } from "miragejs";

describe("Http request tests", () => {
  let server: any;
  beforeEach(() => {
    server = createServer({
      environment: "test",
      routes() {
        this.namespace = "api";

        this.get("/test", () => {
          return { success: true };
        });

        this.get("/404", () => {
          return new Response(404, {}, "couldn't find");
        });
      },
    });
  });

  afterEach(async () => {
    await server.shutdown();
  });
  test("200 test", async () => {
    const result = await Http.get<{ success: boolean }>("/test");
    expect(result.success).toEqual(true);
  });

  test("404 test", async () => {
    try {
      await Http.get("/404");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("Catch test", async () => {
    try {
      await Http.get("");
    } catch (error) {
      expect(error.code).toBeUndefined();
    }
  });
});
