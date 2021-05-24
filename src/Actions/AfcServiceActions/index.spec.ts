import { RemediationSetting } from "@Definitions/Constants";
import { AFCRequestOutputFormat } from "@Definitions/Constants/dashboard-form-constants";
import { createServer, Response } from "miragejs";
import { AfcServiceActions } from "./index";
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

const sampleAFCDocument = {
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
  outputFormat: AFCRequestOutputFormat.HTML,
  outputURL: "server.com/result",
  escalatedPageRange: "2-5",
  //review: IAfcServiceReviewResponse;
  docType: "NONMATH",
  resultType: RemediationSetting.MANUAL,
  otherRequests: "none",
  __v: 0,
};
describe("Document accessibility service action test", () => {
  let server: any;
  let store: any;

  beforeEach(() => {
    store = mockStore({
      afcService: {},
    });

    server = createServer({
      environment: "test",
      routes() {
        this.namespace = "api";

        this.get("/afc", () => {
          return {
            ...responseWrapper,
            data: [sampleAFCDocument],
          };
        });

        this.post("/afc", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleAFCDocument],
            }
          );
        });

        //update afc
        this.patch(`/afc/${sampleAFCDocument.id}`, (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleAFCDocument],
            }
          );
        });

        this.patch(`/afc/${sampleAFCDocument.id}/review`, (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: [sampleAFCDocument],
            }
          );
        });

        this.post(
          `/afc/${sampleAFCDocument.id}/escalate`,
          (schema, request) => {
            return new Response(
              200,
              {},
              {
                ...responseWrapper,
                data: [sampleAFCDocument],
              }
            );
          }
        );
      },
    });
  });

  afterEach(async () => {
    await server.shutdown();
  });

  it("should test search action", async () => {
    const result = AfcServiceActions.Search({ searchString: "fi" });
    console.log(JSON.stringify(await result()));
    expect((await result())?.data.length).toEqual(1);
  });

  it("should post afc service request", async () => {
    const middleware = await AfcServiceActions.Add({
      ...sampleAFCDocument,
      statusLog: "",
    });
    const result = await middleware(store.dispatch, store.getState);
    console.log(JSON.stringify(result));
    expect(result?.length).toEqual(1);
  });

  it("should update afc service by id", async () => {
    const middleware = await AfcServiceActions.UpdateAfcService(
      sampleAFCDocument.id,
      { ...sampleAFCDocument }
    );
    const result = await middleware(store.dispatch);
    expect(result).toEqual(undefined);
  });

  it("should submit review for afc service", async () => {
    const middleware = await AfcServiceActions.ReviewAfcService(
      sampleAFCDocument.id,
      { ...sampleAFCDocument }
    );
    const result = await middleware();
    expect(result.data?.length).toEqual(1);
  });

  it("should escalate afc service by id", async () => {
    const middleware = await AfcServiceActions.EscalateAfcService(
      sampleAFCDocument.id,
      { ...sampleAFCDocument, pageCount: String(sampleAFCDocument.pageCount) }
    );
    const result = await middleware();
    expect(result.data?.length).toEqual(1);
  });
});
