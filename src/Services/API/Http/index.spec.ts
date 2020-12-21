// #region Local Imports
import { Http } from ".";
// #endregion Local Imports

describe("Http request tests", () => {
  test("200 test", async () => {
    const result = await Http.get<{ success: boolean }>("/200");
    expect(result.success).toEqual(true);
  });

  test("404 test", async () => {
    try {
      await Http.get("/404");
    } catch (error) {
      expect(error.status).toEqual(404);
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
