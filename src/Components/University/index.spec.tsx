import * as React from "react";
import { act, fireEvent, waitForElement, screen } from "@testing-library/react";
import { render } from "@Test/utils";
// import { Rec } from "@Components";
import { RecommendedActions } from "./RecommendedActions";
import { InviteModal } from "./InviteModal";
import { MetricsReportDialog } from "./MetricsReport";
import { StudentDetails } from "./StudentDetails";
import { UserType } from "@Definitions/Constants";
import { UniversityPortal } from "@Services";
import { createServer, Response } from "miragejs";
const baseProps = {
  mockFunc: jest.fn(),
};
jest.spyOn(UniversityPortal, "studentActivityData").mockImplementation(
  jest.fn().mockResolvedValue({
    error: false,
    code: 200,
    data: {
      afcActivity: [
        {
          statusLog: [
            {
              status: "FORMATTING_COMPLETED",
            },
          ],
        },
      ],
      vcActivity: [
        {
          statusLog: [
            {
              status: "COMPLETED",
            },
          ],
        },
      ],
      vcEscalatedActivity: [
        {
          statusLog: [
            {
              status: "ESCALATED",
            },
          ],
        },
      ],
      vcCompletedActivity: [
        {
          statusLog: [
            {
              status: "COMPLETED",
            },
          ],
        },
      ],
      vcActiveActivity: [
        {
          statusLog: [
            {
              status: "COMPLETED",
            },
          ],
        },
      ],
      afcEscalatedActivity: [
        {
          statusLog: [
            {
              status: "ESCALATED",
            },
          ],
        },
      ],
      afcCompletedActivity: [
        {
          statusLog: [
            {
              status: "FORMATTING_COMPLETED",
            },
          ],
        },
      ],
      afcActiveActivity: [
        {
          statusLog: [
            {
              status: "FORMATTING_COMPLETED",
            },
          ],
        },
      ],
    },
  })
);

let server: any;
beforeEach(() => {
  server = createServer({
    environment: "test",
    routes() {
      this.namespace = "api";

      this.post("/university/onboardCards", (schema, request) => {
        return new Response(
          200,
          {},
          {
            error: false,
            code: 200,
            data: {
              token: "Winterfell",
            },
          }
        );
      });
      /*
      this.get("/university/index/student", (schema, request) => {
        return new Response(
          200,
          {},

        );
      });
*/
    },
  });
});

afterEach(async () => {
  await server.shutdown();
});

describe("Recommended Actions", () => {
  it("should render without fail", () => {
    const { getByText } = render(
      <RecommendedActions
        cardPreferences={{
          showOnboardStudentsCard: true,
          showOnboardStaffCard: true,
        }}
        updatePreferences={baseProps.mockFunc}
        userType={UserType.UNIVERSITY}
      />
    );

    expect(getByText("RECOMMENDED ACTIONS")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <RecommendedActions
        cardPreferences={{
          showOnboardStudentsCard: true,
          showOnboardStaffCard: true,
        }}
        updatePreferences={baseProps.mockFunc}
        userType={UserType.UNIVERSITY}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it("should call backend api to update onboarding card preference", () => {
    const { getAllByAltText } = render(
      <RecommendedActions
        cardPreferences={{
          showOnboardStudentsCard: true,
          showOnboardStaffCard: true,
        }}
        updatePreferences={baseProps.mockFunc}
        userType={UserType.UNIVERSITY}
      />
    );

    const closeButtons = getAllByAltText("Close tile");
    expect(closeButtons.length).toEqual(2);

    closeButtons.forEach(closeButton => {
      fireEvent.click(closeButton);
    });

    expect(baseProps.mockFunc.mock.calls.length).toEqual(2);
  });
});

describe("InviteModal", () => {
  it("should render without fail", () => {
    const { getByText } = render(
      <InviteModal
        formSubmit={baseProps.mockFunc}
        isOpen={true}
        toggleModal={baseProps.mockFunc}
        invitationFor="REMEDIATORS"
      >
        Test InviteModal
      </InviteModal>
    );

    expect(getByText("Test InviteModal")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <InviteModal
        formSubmit={baseProps.mockFunc}
        isOpen={true}
        toggleModal={baseProps.mockFunc}
        invitationFor="REMEDIATORS"
      >
        Test InviteModal
      </InviteModal>
    );

    expect(container).toMatchSnapshot();
  });
});
describe("MetricsReportDialog", () => {
  it("should render without fail", () => {
    const { getByText } = render(
      <MetricsReportDialog showModal={true} toggleDialog={baseProps.mockFunc} />
    );

    expect(
      getByText(
        "A report for students metrics will be generated as CSV and send to your email."
      )
    ).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <MetricsReportDialog showModal={true} toggleDialog={baseProps.mockFunc} />
    );

    expect(container).toMatchSnapshot();
  });
});
describe("StudentDetails", () => {
  it("should render without fail", () => {
    const { getByRole } = render(
      <StudentDetails
        studentId={(undefined as unknown) as string}
        studentDetails={{
          name: "ABCD",
          email: "abc@example.com",
          roll: "1234",
        }}
      />
    );

    expect(getByRole("heading")).toBeTruthy();
  });

  const activityDataCases = async (activityType: string) => {
    const { getByPlaceholderText } = render(
      <StudentDetails
        studentId={"snow"}
        studentDetails={{
          name: "ABCD",
          email: "abc@example.com",
          roll: "1234",
        }}
      />
    );
    const node = await getByPlaceholderText("Select activity type");
    setTimeout(() => {
      fireEvent.change(node, { target: { value: activityType } });
    }, 300);
    //console.log("outputt:" + JSON.stringify(node));
    await waitForElement(() => screen.getAllByTestId("testId"));
  };

  it("should render without fail using studentId", async () => {
    await act(async () => {
      await activityDataCases("All activity");
    });
  });

  it("should show escalated requests", async () => {
    await act(async () => {
      await activityDataCases("Escalated Requests");
    });
  });

  it("should show active requests", async () => {
    await act(async () => {
      await activityDataCases("Active Requests");
    });
  });

  it("should show completed requests", async () => {
    await act(async () => {
      await activityDataCases("Completed Requests");
    });
  });

  it("should show document accessibility requests", async () => {
    await act(async () => {
      await activityDataCases("Document accessibility requests");
    });
  });

  it("should show a/v requests", async () => {
    await act(async () => {
      await activityDataCases("Video and audio accessibility requests");
    });
  });

  it("should match snapshot", () => {
    const { container } = render(
      <StudentDetails
        studentId={(undefined as unknown) as string}
        studentDetails={{
          name: "ABCD",
          email: "abc@example.com",
          roll: "1234",
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
