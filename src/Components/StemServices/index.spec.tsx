import * as React from "react";

import { render } from "@Test/utils";
// import { Rec } from "@Components";
import SearchDocument from "./SearchDocument";

describe("BlueButton", () => {
  it("should render without fail", () => {
    const { getByText } = render(<SearchDocument />);

    expect(getByText("Search")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<SearchDocument />);

    expect(container).toMatchSnapshot();
  });
});
