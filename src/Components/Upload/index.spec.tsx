// #region Global Imports
import * as React from "react";
import { mount } from "enzyme";
// #endregion Global Imports

// #region Local Imports
import { Upload } from "@Components";
// #endregion Local Imports

describe("Upload", () => {
  it("should match snapshot", () => {
    const wrapper = mount(<Upload />);
    expect(wrapper).toMatchSnapshot();
  });
});
