import * as React from "react";

import { render } from "@Test/utils";
import Header from "./index";

describe("Header", () => {
  it("should render without fail", () => {
    const { getByText } = render(
      <Header>
        <div>Test Header</div>
      </Header>
    );

    expect(getByText("Test Header")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <Header>
        <div>Test Header</div>
      </Header>
    );

    expect(container).toMatchSnapshot();
  });
});
