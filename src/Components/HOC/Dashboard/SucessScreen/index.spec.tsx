import * as React from "react";
import fileNames from "@Definitions/Constants/image";
import { render } from "@Test/utils";
// import { Rec } from "@Components";
import { SuccessScreen } from "./index";

import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { UserType } from "@Definitions/Constants";
import { ColorThemes, FontThemes } from "@Definitions/Constants/ThemeConstants";

const mockStore = configureStore([]);

describe("SuccessScreen", () => {
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
        <SuccessScreen
          image={fileNames.ALTERNATE_FORMAT_CONVERSION}
          title="Success"
          message="Thank you"
        />
      </Provider>
    );

    expect(getByText("Thank you")).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        <SuccessScreen
          image={fileNames.ALTERNATE_FORMAT_CONVERSION}
          title="Success"
          message="Thank you"
        />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });
});
