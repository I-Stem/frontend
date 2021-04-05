import * as React from "react";

import { render } from "@Test/utils";
import Pagination from "./index";

describe("Pagination", () => {
  const baseProps = {
    mockFunc: jest.fn(),
  };
  it("should render without fail", () => {
    const { getByText } = render(
      <Pagination
        totalItems={20}
        currentPage={1}
        handleNextPage={baseProps.mockFunc}
        handlePageNumber={baseProps.mockFunc}
        handlePreviousPage={baseProps.mockFunc}
      />
    );

    expect(getByText("2")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <Pagination
        totalItems={20}
        currentPage={1}
        handleNextPage={baseProps.mockFunc}
        handlePageNumber={baseProps.mockFunc}
        handlePreviousPage={baseProps.mockFunc}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
