import * as React from "react";

import { render } from "@Test/utils";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
// import { Rec } from "@Components";
import AuthDisclaimer from "./AuthDisclaimer";
import ForgotPasswordForm from "./ForgotPasswordForm";
import RegisterMain from "./RegisterMain";
import ResetPasswordForm from "./ResetPasswordForm";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const store = mockStore({
  auth: {
    user: {},
  },
});
const baseProps = {
  toggleDialog: jest.fn(),
};
const ForgotPasswordFormStore = () => (
  <Provider store={store}>
    <ForgotPasswordForm />
  </Provider>
);

const RegisterMainStore = () => (
  <Provider store={store}>
    <RegisterMain registrationContext={[]} />
  </Provider>
);

const ResetPasswordFormStore = () => (
  <Provider store={store}>
    <ResetPasswordForm />
  </Provider>
);

describe("AuthDisclaimer", () => {
  it("should render without fail", () => {
    const { getByText } = render(<AuthDisclaimer message="Sign in" />);

    expect(getByText("Terms of Service and Privacy Policy.")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<AuthDisclaimer message="Sign in" />);

    expect(container).toMatchSnapshot();
  });
});
describe("ForgotPasswordForm", () => {
  it("should render without fail", () => {
    const { getByText } = render(<ForgotPasswordFormStore />);

    expect(getByText("Forgot password?")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<ForgotPasswordFormStore />);

    expect(container).toMatchSnapshot();
  });
});
describe("RegisterMain", () => {
  it("should render without fail", () => {
    const { getByText } = render(<RegisterMainStore />);

    expect(getByText("Register your account as")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<RegisterMainStore />);

    expect(container).toMatchSnapshot();
  });
});
describe("ResetPassword", () => {
  it("should render without fail", () => {
    const { getByText } = render(<ResetPasswordFormStore />);

    expect(getByText("Set a new password")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<ResetPasswordFormStore />);

    expect(container).toMatchSnapshot();
  });
});
