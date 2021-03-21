import * as React from "react";
import fileNames from "@Definitions/Constants/image";
import { render } from "@Test/utils";
// import { Rec } from "@Components";
import { SuccessScreen } from "./index";

describe("SuccessScreen", () => {
  it("should render without fail", () => {
    const { getByText } = render(
      <SuccessScreen
        image={fileNames.ALTERNATE_FORMAT_CONVERSION}
        title="Success"
        message="Thank you"
      />
    );

    expect(getByText("Thank you")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <SuccessScreen
        image={fileNames.ALTERNATE_FORMAT_CONVERSION}
        title="Success"
        message="Thank you"
      />
    );

    expect(container).toMatchSnapshot();
  });
});
