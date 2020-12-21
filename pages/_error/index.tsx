// #region Global Imports
import * as React from "react";
import { NextPage } from "next";
// #endregion Global Imports

// #region Local Imports

// #endregion Local Imports

// #region Interface Imports
import { IErrorPage } from "@Interfaces";
// #endregion Interface Imports

const Error: NextPage<IErrorPage.IProps> = ({ statusCode }) => {
  return (
    <div aria-describedby="error-status" role="heading" aria-level={1}>
      <h1 id="error-status">{`${statusCode} | Error`}</h1>
    </div>
  );
};

Error.getInitialProps = async ({ res, err }) => {
  let statusCode;

  if (res) {
    ({ statusCode } = res);
  } else if (err) {
    ({ statusCode } = err);
  }

  return {
    statusCode,
  };
};

export default Error;
