import * as React from "react";

import { render } from "@Test/utils";
// import { Rec } from "@Components";
import { RadioCheck } from "./index";

describe("RadioCheck", () => {
  it("should render without fail", () => {
    const { getByText } = render(
      <RadioCheck
        htmlType="radio"
        label="TestRadio"
        id="test"
        name="test"
        value="Yes"
      />
    );

    expect(getByText("TestRadio")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <RadioCheck
        htmlType="radio"
        label="TestRadio"
        id="test"
        name="test"
        value="Yes"
      />
    );

    expect(container).toMatchSnapshot();
  });
});
