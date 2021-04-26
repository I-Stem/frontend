import * as React from "react";
import { render } from "@Test/utils";
import { ConfirmImport } from "@Components/Organization/ConfirmAndImport";
import { UploadData } from "@Components/Organization/UploadData";
import { OrganizationDashboard } from "@Components/Organization/Dashboard";
import { ColumnMapping } from "@Components/Organization/ColumnMapping";
import { ResolveErrors } from "@Components/Organization/ResolveErrors";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { UserType } from "@Definitions/Constants";
import { useAppAbility } from "@Hooks/useAppAbility";
import { useRouter } from "next/router";
const mockStore = configureStore([]);

/*
jest.mock("next/router",() => {
  return {
  useRouter:() => {
    return {
      pathname: "/hello/world"
    }
  }
}
});
*/

jest.mock("../../Hooks/useAppAbility", () => {
  return {
    useAppAbility: () => {
      return {
        can: (sub: string, obj: string) => {
          return true;
        },
      };
    },
  };
});

describe("organization pages", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: {
          organizationCode: "world",
          userType: UserType.UNIVERSITY,
          role: "STAFF",
        },
      },
      university: {
        csvFile: [["name", "email", "role number"]],
        csvErrors: {
          validationResult: [
            {
              row: 1,
              errors: {
                EMAIL: "Invalid character in domain",
                NAME: "Too long",
                ROLL_NO: "unknown",
              },
            },
          ],
        },
      },
    });
  });

  it("should render without fail", () => {
    const { getAllByRole } = render(
      <Provider store={store}>
        <ConfirmImport />
      </Provider>
    );

    expect(getAllByRole("button")).toBeTruthy();
  });

  it("should match ConfirmAndImport snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        <ConfirmImport />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("should match UploadData snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        <UploadData />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });

  /*
  it("should match Organization dashboard snapshot", () => {
    const { container } = render((
      <Provider store={store}> <OrganizationDashboard/></Provider>
    ));

    expect(container).toMatchSnapshot();
  });
*/
  it("should match ColumnMapping snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        {" "}
        <ColumnMapping />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it("should match ResolveErrors snapshot", () => {
    const { container } = render(
      <Provider store={store}>
        <ResolveErrors />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });
});
