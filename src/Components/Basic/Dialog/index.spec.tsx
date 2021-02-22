import * as React from "react";

import { render } from "@Test/utils";
import { DialogMessageBox } from "./index";
import { STUDENTS } from "@Definitions/Constants/universityRoutes";

describe("DialogMessageBox", () => {
  const baseProps = {
    toggleDialog: jest.fn(),
  };
  it("should render without fail", () => {
    const { getByText } = render(
      <DialogMessageBox
        showModal={true}
        message="Testing Dialog"
        heading="Test"
        toggleDialog={baseProps.toggleDialog}
        route={STUDENTS}
      />
    );

    expect(getByText("Testing Dialog")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <DialogMessageBox
        showModal={true}
        message="Testing Dialog"
        heading="Test"
        toggleDialog={baseProps.toggleDialog}
        route={STUDENTS}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
