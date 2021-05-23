import * as React from "react";
import configureMockStore from "redux-mock-store";
import { fireEvent, screen } from "@testing-library/react";
import { render } from "@Test/utils";
import SearchDocument from "./SearchDocument";
import FeedbackModal from "./FeedbackModal";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { AFCRequestOutputFormat } from "@Definitions/Constants/dashboard-form-constants";
import { FeedbackModalProps } from "./StemServices";

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

const feedbackProps: FeedbackModalProps = {
  showModal: true,
  closeAction: baseProps.mockFunc,
  updateFunction: baseProps.mockFunc,
  serviceType: "afc",
  afcReview: baseProps.mockFunc,
  vcReview: baseProps.mockFunc,
};
const FeedbackModalStore = (props: { serviceTypeValue: string }) => (
  <Provider store={store}>
    <FeedbackModal {...feedbackProps} serviceType={props.serviceTypeValue} />
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
    const { getAllByText, getByRole, getAllByRole } = render(
      <FeedbackModalStore serviceTypeValue="vc" />
    );
    const button = getAllByRole("button");
    fireEvent.change(getByRole("textbox"), { target: { value: "good" } });
    fireEvent.click(button[0]);
    expect(baseProps.mockFunc).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    const { container } = render(<FeedbackModalStore serviceTypeValue="vc" />);
    expect(container).toMatchSnapshot();
  });

  it("should close rendered afc feedback without fail", () => {
    const { getAllByText, getByRole, getAllByRole } = render(
      <FeedbackModalStore serviceTypeValue="afc" />
    );
    const button = getAllByRole("button");
    fireEvent.change(getByRole("textbox"), { target: { value: "good" } });
    fireEvent.click(button[1]);
    expect(baseProps.mockFunc.mock.calls.length).toEqual(1);
  });

  it("should render afc feedback without fail", () => {
    const { getAllByText, getByRole, getAllByRole } = render(
      <FeedbackModalStore serviceTypeValue="afc" />
    );
    const button = getAllByRole("button");
    fireEvent.change(getByRole("textbox"), { target: { value: "good" } });
    fireEvent.click(button[0]);
    expect(baseProps.mockFunc).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    const { container } = render(<FeedbackModalStore serviceTypeValue="afc" />);
    expect(container).toMatchSnapshot();
  });
});
