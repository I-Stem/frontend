import { createServer, Response } from "miragejs";
import { UploadActions } from "./index";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { IUploadPayload } from "@Interfaces";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const responseWrapper = {
  flag: "success",
  message: "message",
  code: 200,
  error: false,
};

const sampleDocument = {
  file: new File([], ""),
  type: "escalation",
  progress: 25,
  hash: "abc",
  fileName: "val",
  initiatedAt: "now",
} as IUploadPayload;

describe("File upload service action test", () => {
  let server: any;
  let store: any;

  beforeEach(() => {
    store = mockStore({
      afcService: { _id: "h" },
      vcService: { _id: "h" },
      uploadService: {},
    });

    server = createServer({
      environment: "test",
      routes() {
        this.namespace = "api";

        this.post("/file", (schema, request) => {
          return new Response(
            200,
            {},
            {
              data: {
                ...sampleDocument,
                _id: "hello",
                inputURL: "unknown",
              },
            }
          );
        });

        this.post("/afc", (schema, request) => {
          return new Response(
            200,
            {},
            {
              data: {
                ...sampleDocument,
                _id: "hello",
                inputURL: "unknown",
              },
            }
          );
        });

        this.post("/vc", (schema, request) => {
          return new Response(
            200,
            {},
            {
              data: {
                ...sampleDocument,
                _id: "hello",
                inputURL: "unknown",
              },
            }
          );
        });
      },
    });
  });

  afterEach(async () => {
    await server.shutdown();
  });

  it("should test reset  action", async () => {
    const result = UploadActions.Reset();

    expect(result.type).not.toEqual(undefined);
  });

  it("should cancel upload request", async () => {
    const middleware = UploadActions.cancelUploadAndRemove(sampleDocument);
    const result = middleware(store.dispatch);
    console.log(JSON.stringify(result));
    expect(result).toEqual(undefined);
  });

  it("should initiate file upload request", async () => {
    const middleware = UploadActions.cancelUploadAndRemove(sampleDocument);
    const result = middleware(store.dispatch);
    console.log(JSON.stringify(result));
    expect(result).toEqual(undefined);
  });

  it("should test reset  upload list action", () => {
    const result = UploadActions.resetUploadList();

    expect(result.type).not.toEqual(undefined);
  });

  it("should post file", async () => {
    const result = [
      "escalation",
      "community",
      "customModel",
      "afcService",
      "vcService",
    ].map(async type => {
      sampleDocument.type = type;
      const middleware = UploadActions.uploadFile(sampleDocument);

      const result = await middleware(store.dispatch, store.getState);
      console.log(JSON.stringify(result));
      expect(result).toEqual(undefined);
    });

    await Promise.all(result);
  });
});
