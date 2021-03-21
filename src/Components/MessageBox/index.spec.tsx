import * as React from "react";

import { render } from "@Test/utils";
import { MessageBox } from "./index";

describe("MessageBox", () => {
  it("should render without fail", () => {
    const { getByText } = render(
      <MessageBox
        messageData={[
          { actionBy: "ABCD", actionAt: "15:56", comment: "Test MessageBox" },
        ]}
      />
    );

    expect(getByText("Test MessageBox")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <MessageBox
        messageData={[
          {
            actionBy: "ABCD",
            actionAt: "2021-03-21 20:30+05:30",
            comment: "Test MessageBox",
          },
        ]}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
