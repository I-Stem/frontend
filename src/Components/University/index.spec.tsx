import * as React from "react";

import { render } from "@Test/utils";
// import { Rec } from "@Components";
import { RecommendedActions } from "./RecommendedActions";

describe("Recomended Actions", () => {
  it("should render without fail", () => {
    const { getByText } = render(<RecommendedActions />);

    expect(getByText("RECOMMENDED ACTIONS")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<RecommendedActions />);

    expect(container).toMatchSnapshot();
  });
});
