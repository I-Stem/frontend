import { createServer, Response } from "miragejs";
import { AuthActions } from "./index";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { UserType } from "@Definitions/Constants";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const responseWrapper = {
  flag: "success",
  message: "message",
  code: 200,
  error: false,
};

const sampleUser = {
  fullname: "user",
  email: "user@account.com",
  password: "secret",
  userType: UserType.UNIVERSITY,
  organisationName: "org",
  organisationAddress: "unknown",
  //noStudentsWithDisability: 23,
  verificationLink: "verify",
  verifyToken: "token",
  context: "s",
};

describe("user account lifecycle action test", () => {
  let server: any;
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {},
    });

    server = createServer({
      environment: "test",
      routes() {
        this.namespace = "api";

        this.post("/auth/register", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleUser],
            }
          );
        });

        this.post("/auth/login", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleUser],
            }
          );
        });

        this.post("/auth/forgot", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleUser],
            }
          );
        });

        this.post("/auth/reset", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleUser],
            }
          );
        });

        this.post("/auth/verify", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleUser],
            }
          );
        });
      },
    });
  });

  afterEach(async () => {
    await server.shutdown();
  });

  it("should register user", async () => {
    const middleware = AuthActions.Register({ ...sampleUser });
    expect((await middleware(store.dispatch))?.data.length).toEqual(1);
  });

  it("should send success login user action", async () => {
    const middleware = AuthActions.User({ ...sampleUser });
    await middleware(store.dispatch);
    expect(store.getActions().length).toEqual(1);
  });

  it("should login user action", async () => {
    const middleware = AuthActions.Login({ ...sampleUser });
    const result = await middleware(store.dispatch);
    console.log(JSON.stringify(result));
    expect(result.error).toEqual(true);
  });

  it("should execute forgot user action", async () => {
    const middleware = AuthActions.Forgot({
      ...sampleUser,
      resetPasswordURL: "/url",
    });
    const result = await middleware(store.dispatch);
    console.log(JSON.stringify(result));
    expect(result.error).toEqual(false);
  });

  it("should execute password reset for user action", async () => {
    const middleware = AuthActions.ResetPassword({
      ...sampleUser,
      resetPasswordURL: "/url",
      passwordResetToken: "token",
    });
    const result = await middleware();
    console.log(JSON.stringify(result));
    expect(result.error).toEqual(false);
  });

  it("should execute success org user action", async () => {
    const middleware = AuthActions.SaveBusinessCredentials({ ...sampleUser });
    await middleware(store.dispatch);
    expect(store.getActions().length).toEqual(1);
  });

  it("should execute logout for user action", async () => {
    const middleware = AuthActions.Logout();
    await middleware(store.dispatch);
    expect(store.getActions().length).toEqual(1);
  });

  it("should clear auth message for user action", async () => {
    const middleware = AuthActions.ClearAuthMessage();
    await middleware(store.dispatch);
    expect(store.getActions().length).toEqual(1);
  });

  it("should execute verification link for user action", async () => {
    const middleware = AuthActions.VerifyToken({
      ...sampleUser,
      verifyUserToken: "token",
    });
    const result = await middleware();
    console.log(JSON.stringify(result));
    expect(result.error).toEqual(false);
  });

  it("should execute update preferences action", async () => {
    const middleware = AuthActions.updateCardPreferences({
      ...sampleUser,
      resetPasswordURL: "/url",
      passwordResetToken: "token",
    });
    const result = await middleware(store.dispatch);
    console.log(JSON.stringify(result));
    expect(store.getActions().length).toEqual(1);
  });
});
