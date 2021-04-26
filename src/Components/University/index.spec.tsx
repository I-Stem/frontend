import * as React from "react";

import { render } from "@Test/utils";
// import { Rec } from "@Components";
import { RecommendedActions } from "./RecommendedActions";
import { InviteModal } from "./InviteModal";
import { MetricsReportDialog } from "./MetricsReport";
import { StudentDetails } from "./StudentDetails";
import { UserType } from "@Definitions/Constants";
const baseProps = {
  mockFunc: jest.fn(),
};
describe("Recomended Actions", () => {
  it("should render without fail", () => {
    const { getByText } = render(
      <RecommendedActions
        cardPreferences={{
          showOnboardStudentsCard: true,
          showOnboardStaffCard: true,
        }}
        updatePreferences={baseProps.mockFunc}
        userType={UserType.I_STEM}
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
        userType={UserType.I_STEM}
      />
    );

    expect(container).toMatchSnapshot();
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
