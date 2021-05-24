import { createServer, Response } from "miragejs";
import { CreditsActions } from "./index";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const responseWrapper = {
  flag: "success",
  message: "message",
  code: 200,
  error: false,
};

const sampleDocument = {
  _id: "abc",
  id: "abc",
  userId: "def",
  totalCredits: 2100,
  //createdAt: new Date(),
  //updatedAt: new Date(),
};

describe("Credit action test", () => {
  let server: any;
  let store: any;

  beforeEach(() => {
    store = mockStore({
      communityService: {},
    });

    server = createServer({
      environment: "test",
      routes() {
        this.namespace = "api";

        this.get("/credits/count", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });

        this.get("/credits", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });

        this.get("/game/feedback", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });
      },
    });
  });

  afterEach(async () => {
    await server.shutdown();
  });

  it("should test retrieval of credit count of user action", async () => {
    const result = CreditsActions.GetCredits();
    expect((await result(store.dispatch)).data[0].totalCredits).toEqual(
      sampleDocument.totalCredits
    );
  });

  it("should test retrieval of credit history action", async () => {
    const result = CreditsActions.GetCreditsHistory();
    expect(await result()).not.toEqual(undefined);
  });

  it("should test retrieval of feedback action", async () => {
    const result = CreditsActions.GetFeedbackFlags();
    expect(await result()).not.toEqual(undefined);
  });

  it("should update credit in store action", async () => {
    const middleware = CreditsActions.updateCredits({
      totalCredits: sampleDocument.totalCredits,
    });
    const result = await middleware(store.dispatch);
    expect(store.getActions().length).toEqual(1);
  });
});
