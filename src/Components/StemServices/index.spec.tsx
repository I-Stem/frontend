import * as React from "react";
import configureMockStore from "redux-mock-store";

import { render } from "@Test/utils";
import SearchDocument from "./SearchDocument";
import FeedbackModal from "./FeedbackModal";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { AFCRequestOutputFormat } from "@Definitions/Constants/dashboard-form-constants";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const store = mockStore({
  auth: {
    user: {},
  },
});

const baseProps = {
  mockFunc: jest.fn(),
};

const FeedbackModalStore = () => (
  <Provider store={store}>
    <FeedbackModal
      showModal={true}
      closeAction={baseProps.mockFunc}
      updateFunction={baseProps.mockFunc}
      serviceType="vc"
    />
  </Provider>
);

describe("SearchDocument", () => {
  it("should render without fail", () => {
    const { getByText } = render(<SearchDocument />);

    expect(getByText("Search")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<SearchDocument />);

    expect(container).toMatchSnapshot();
  });
});
describe("FeedbackModal", () => {
  it("should render without fail", () => {
    const { getAllByText } = render(<FeedbackModalStore />);

    expect(getAllByText("Add review").length).toEqual(2);
  });

  it("should match snapshot", () => {
    const { container } = render(<FeedbackModalStore />);
    expect(container).toMatchSnapshot();
  });
});
