import * as React from "react";

import { render } from "@Test/utils";
import { Navbar } from "@Components";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { UserType } from "@Definitions/Constants";
import { ColorThemes, FontThemes } from "@Definitions/Constants/ThemeConstants";

const mockStore = configureStore([]);

describe("Navbar", () => {
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
        <Navbar />
      </Provider>
    );

    expect(
      getByText("Already have an account?" || "New to I-Stem?")
    ).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        <Navbar />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });
});
