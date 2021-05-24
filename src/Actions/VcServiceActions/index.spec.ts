import { RemediationSetting } from "@Definitions/Constants";
import { createServer, Response } from "miragejs";
import { VcServiceActions } from "./index";
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

const sampleVCDocument = {
  _id: "abc",
  id: "abc",
  userId: "def",
  documentName: "conversion",
  pageCount: 5,
  tag: "history",
  //statusLog: [],
  status: 2,
  //    confidenceScore: number;
  //createdAt: new Date(),
  inputFileId: "fileId",
  //updatedAt: new Date(),
  inputFileLink: "server.com",
  outputFormat: "SRT",
  requestType: "BOTH",
  modelId: "standard",
  outputURL: "server.com/result",
  escalatedPageRange: "2-5",
  //review: IAfcServiceReviewResponse;
  docType: "NONMATH",
  resultType: RemediationSetting.MANUAL,
  otherRequests: "none",
  __v: 0,
};
describe("Audio/video accessibility service action test", () => {
  let server: any;
  let store: any;

  beforeEach(() => {
    store = mockStore({
      vcService: {},
    });

    server = createServer({
      environment: "test",
      routes() {
        this.namespace = "api";

        this.get("/vc", () => {
          return {
            ...responseWrapper,
            data: [sampleVCDocument],
          };
        });

        this.post("/vc", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleVCDocument],
            }
          );
        });

        //update vc
        this.patch(`/vc/${sampleVCDocument.id}`, (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleVCDocument],
            }
          );
        });

        this.post(`/vc/${sampleVCDocument.id}/review`, (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleVCDocument],
            }
          );
        });

        this.post(`/vc/${sampleVCDocument.id}/escalate`, (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleVCDocument],
            }
          );
        });

        this.post(`/vc/model`, (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleVCDocument],
            }
          );
        });

        this.get("/vc/model", () => {
          return {
            ...responseWrapper,
            data: [sampleVCDocument],
          };
        });
      },
    });
  });

  afterEach(async () => {
    await server.shutdown();
  });

  it("should test search action", async () => {
    const result = VcServiceActions.Search({ searchString: "fi" });
    console.log(JSON.stringify(await result()));
    expect((await result())?.data.length).toEqual(1);
  });

  it("should post vc service request", async () => {
    const middleware = await VcServiceActions.Add({
      ...sampleVCDocument,
      statusLog: "",
    });
    const result = await middleware(store.dispatch, store.getState);
    console.log(JSON.stringify(result));
    expect(result?.data.length).toEqual(1);
  });

  it("should update vc service by id", async () => {
    const middleware = await VcServiceActions.UpdateVCService(
      sampleVCDocument.id,
      { ...sampleVCDocument }
    );
    const result = await middleware(store.dispatch);
    expect(result).toEqual(undefined);
  });

  it("should submit review for vc service", async () => {
    const middleware = await VcServiceActions.ReviewVcService(
      sampleVCDocument.id,
      { ...sampleVCDocument }
    );
    const result = await middleware();
    expect(result.data?.length).toEqual(1);
  });

  it("should escalate vc service by id", async () => {
    const middleware = await VcServiceActions.EscalateVCService(
      sampleVCDocument.id,
      { ...sampleVCDocument, pageCount: String(sampleVCDocument.pageCount) }
    );
    const result = await middleware();
    expect(result.data?.length).toEqual(1);
  });

  it("should add new vc model ", async () => {
    const middleware = await VcServiceActions.AddModel({
      name: "universal",
      dataFileId: "sculpture",
    });
    const result = await middleware(store.dispatch);
    expect(result).not.toEqual(undefined);
  });

  it("should retrieve all vc model ", async () => {
    const middleware = await VcServiceActions.GetVCModels();
    const result = await middleware();
    expect(result).not.toEqual(undefined);
  });
});
