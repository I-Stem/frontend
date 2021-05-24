import { createServer, Response } from "miragejs";
import { CommunityActions } from "./index";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { JobPreferencesData } from "@Interfaces";

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
  status: 2,
  //createdAt: new Date(),
  inputFileId: "fileId",
  //updatedAt: new Date(),
  inputFileLink: "server.com",
};

describe("Community service action test", () => {
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

        this.get("/disabilities", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });

        this.get("/industry", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });

        this.get("/skills", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });

        this.get("/mentorship", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });

        this.post("/job", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleDocument],
            }
          );
        });
      },
    });
  });

  afterEach(async () => {
    await server.shutdown();
  });

  it("should test retrieval of disabilities action", async () => {
    const result = CommunityActions.GetDisabilities();
    console.log(JSON.stringify(await result()));
    expect(await result()).not.toEqual(undefined);
  });

  it("should test retrieval of industry action", async () => {
    const result = CommunityActions.GetIndustry();
    expect((await result())?.data.length).toEqual(1);
  });

  it("should test retrieval of skills action", async () => {
    const result = CommunityActions.GetSkills();
    expect(await result()).not.toEqual(undefined);
  });

  it("should test retrieval of mentorship applications action", async () => {
    const result = CommunityActions.GetMentorship();
    expect(await result()).not.toEqual(undefined);
  });

  it("should post job application request", async () => {
    const middleware = await CommunityActions.PostJobPreferences(({
      ...sampleDocument,
    } as unknown) as JobPreferencesData);
    const result = await middleware(store.dispatch, store.getState);
    console.log(JSON.stringify(result));
    expect(result?.data).not.toEqual(undefined);
  });
});
