// #region Local Imports
import { AuthService } from "@Services";
// #endregion Local Imports

describe("Auth Service tests", () => {
  test("200 test", async () => {
    const result = await AuthService.register({
      params: { email: "john@test.com", password: "12345678" },
    });
    expect(result.token).toEqual("Pankod");
  });

  test("500 test", async () => {
    const result = await AuthService.register({
      params: { email: "john@test.com", password: "12345678" },
    });
    expect(result.token).toEqual("");
  });
});
