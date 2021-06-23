import { createServer, Response } from "miragejs";
import { StudentActivityParams, UniversityPortal } from "./index";
import { StudentsData } from "./IUniversityResponse";

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
};

describe("university service action test", () => {
  let server: any;
  let store: any;

  beforeEach(() => {
    server = createServer({
      environment: "test",
      routes() {
        this.namespace = "api";

        this.post("/university/student", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: {
                ...sampleDocument,
              },
            }
          );
        });

        this.post("/university/settings", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: {
                ...sampleDocument,
              },
            }
          );
        });

        this.post("/university/invite", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: {
                ...sampleDocument,
              },
            }
          );
        });

        this.post("/university/register", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: {
                ...sampleDocument,
              },
            }
          );
        });

        this.post("/university/index", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: {
                ...sampleDocument,
              },
            }
          );
        });

        this.post("/university/index/student/update", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: {
                ...sampleDocument,
              },
            }
          );
        });

        this.post("/university/onboardCards", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: {
                ...sampleDocument,
              },
            }
          );
        });

        this.post(
          "/university/organ/req/organizationCode/action",
          (schema, request) => {
            return new Response(
              200,
              {},
              {
                ...responseWrapper,
                data: {
                  ...sampleDocument,
                },
              }
            );
          }
        );

        this.post("/university/domainAcess/action", (schema, request) => {
          return new Response(
            200,
            {},
            {
              ...responseWrapper,
              data: {
                ...sampleDocument,
              },
            }
          );
        });

        this.get("/university", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });

        this.get("/university/metrics", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });

        this.get("/university/index", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });

        this.get("/university/index/student", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });

        this.get("/university/studentsCount", () => {
          return {
            ...responseWrapper,
            data: [sampleDocument],
          };
        });

        this.get("/university/emailReport", () => {
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

  it("should test university api", async () => {
    await UniversityPortal.emailStudentsReport();
    await UniversityPortal.getUniversity();
    await UniversityPortal.getUniversityMetrics();
    await UniversityPortal.handleDomainAccess("action", { id: "", code: "s" });
    await UniversityPortal.handleUniversity("organizationCode", "action", {
      id: "id",
    });
    await UniversityPortal.registerUniversity({});
    await UniversityPortal.saveSettings({});
    await UniversityPortal.studentActivityData({} as StudentActivityParams);
    await UniversityPortal.studentDataVerification([]);
    await UniversityPortal.studentInvite({
      fullNames: [],
      emails: [],
      organization: "",
      rollNos: [],
      role: "",
    });
    await UniversityPortal.studentsCount({ params: { searchString: "" } });
    await UniversityPortal.studentsData({
      params: { limit: 10, offset: 3, searchString: "" },
    });
    await UniversityPortal.updateStudentDetail({
      fullname: "",
      email: "",
      userId: "",
      rollNumber: "",
    });
    await UniversityPortal.updateUserCardPreferences({});
  });
});
