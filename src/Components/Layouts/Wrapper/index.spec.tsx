import * as React from "react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { render } from "@Test/utils";
import { Wrapper } from "./index";
import thunk from "redux-thunk";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const store = mockStore({
  auth: {
    user: {},
  },
});

const WrapperStore = () => (
  <Provider store={store}>
    <Wrapper>
      <div>Test Wrapper</div>
    </Wrapper>
  </Provider>
);
describe("DashboardLayout", () => {
  it("should render without fail", () => {
    const { getByText } = render(<WrapperStore />);

    expect(getByText("Test Wrapper")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(<WrapperStore />);

    expect(container).toMatchSnapshot();
  });
});
