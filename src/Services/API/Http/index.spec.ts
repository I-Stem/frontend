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

        this.get("/testFile", () => {
          return { success: true };
        });

        this.post("/test1", (schema, request) => {
          return new Response(
            200,
            {},
            {
              error: false,
              success: true,
              code: 200,
              data: {
                token: "Winterfell",
              },
            }
          );
        });

        this.post("/404", () => {
          return new Response(404, {}, "couldn't find");
        });

        this.patch("/test2", () => {
          return { success: true };
        });

        this.patch("/404", () => {
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

  test("200 post test", async () => {
    const result: any = await Http.post("/test1");
    expect(result.success).toEqual(true);
  });

  test("404 post test", async () => {
    try {
      await Http.post("/404");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("Post Catch test", async () => {
    try {
      await Http.post("");
    } catch (error) {
      expect(error.code).toBeUndefined();
    }
  });

  test("200 patch test", async () => {
    const result: any = await Http.patch("/test2");
    expect(result.success).toEqual(true);
  });

  test("404 patch test", async () => {
    try {
      await Http.patch("/404");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("patch Catch test", async () => {
    try {
      await Http.patch("");
    } catch (error) {
      expect(error.code).toBeUndefined();
    }
  });

  test("200 getFile test", async () => {
    const result: any = await Http.getFile("/testFile");
    expect(result.success).toEqual(undefined);
  });

  test("404 getFile test", async () => {
    try {
      await Http.getFile("/404");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test("get file Catch test", async () => {
    try {
      await Http.getFile("");
    } catch (error) {
      expect(error.code).toBeUndefined();
    }
  });
});
