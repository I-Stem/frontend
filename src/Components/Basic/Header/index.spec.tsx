import * as React from "react";

import { render } from "@Test/utils";
import Header from "./index";

import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { UserType } from "@Definitions/Constants";
import { ColorThemes, FontThemes } from "@Definitions/Constants/ThemeConstants";

const mockStore = configureStore([]);

describe("Header", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: {
          organizationCode: "world",
          userType: UserType.UNIVERSITY,
          role: "STAFF",
          userPreferences: {
            themes: {
              fontTheme: FontThemes.FONTL,
              colorTheme: ColorThemes.BLACKWHITE,
            },
          },
        },
      },
    });
  });

  it("should render without fail", () => {
    const { getByText } = render(
      <Provider store={store}>
        <Header>
          <div>Test Header</div>
        </Header>
      </Provider>
    );

    expect(getByText("Test Header")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        <Header>
          <div>Test Header</div>
        </Header>
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });
});
