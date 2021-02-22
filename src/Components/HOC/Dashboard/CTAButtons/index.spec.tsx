import * as React from "react";

import { render } from "@Test/utils";
// import { Rec } from "@Components";
import { BlueButton } from "./BlueButton";
import { GreenButton } from "./GreenButton";
import { WhiteButton } from "./WhiteButton";
describe("BlueButton", () => {
  it("should render without fail", () => {
    const { getByText } = render(<BlueButton>Test BlueButton</BlueButton>);

    expect(getByText("Test BlueButton")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<BlueButton>Test BlueButton</BlueButton>);

    expect(container).toMatchSnapshot();
  });
});
describe("GreenButton", () => {
  it("should render without fail", () => {
    const { getByText } = render(<GreenButton>Test GreenButton</GreenButton>);

    expect(getByText("Test GreenButton")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<GreenButton>Test GreenButton</GreenButton>);

    expect(container).toMatchSnapshot();
  });
});
describe("BlueButton", () => {
  it("should render without fail", () => {
    const { getByText } = render(<WhiteButton>Test WhiteButton</WhiteButton>);

    expect(getByText("Test WhiteButton")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<WhiteButton>Test WhiteButton</WhiteButton>);

    expect(container).toMatchSnapshot();
  });
});
