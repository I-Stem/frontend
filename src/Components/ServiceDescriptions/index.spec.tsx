import * as React from "react";

import { render } from "@Test/utils";
// import { Rec } from "@Components";
import { AfcDescription } from "./afc";
import { VcDescription } from "./vc";
import { JobOpportunitiesDescription } from "./job-opportunities";
import { MentorshipDescription } from "./mentorship";

describe("Afc Description", () => {
  it("should render without fail", () => {
    const { getByText } = render(<AfcDescription />);

    expect(getByText("Input file formats supported")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<AfcDescription />);

    expect(container).toMatchSnapshot();
  });
});
describe("VC Description", () => {
  it("should render without fail", () => {
    const { getByText } = render(<VcDescription />);

    expect(getByText("Service options")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<VcDescription />);

    expect(container).toMatchSnapshot();
  });
});
describe("Mentorship Description", () => {
  it("should render without fail", () => {
    const { getByText } = render(<MentorshipDescription />);

    expect(getByText("FOR MENTEES")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<MentorshipDescription />);

    expect(container).toMatchSnapshot();
  });
});
describe("Job Opportunities Description", () => {
  it("should render without fail", () => {
    const { getByText } = render(<JobOpportunitiesDescription />);

    expect(
      getByText(
        "Know that completing this form does not guarantee any job whatsoever."
      )
    ).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<JobOpportunitiesDescription />);

    expect(container).toMatchSnapshot();
  });
});
