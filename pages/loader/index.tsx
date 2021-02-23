import React, { useEffect } from "react";
import { NextPage } from "next";
// #endregion Global Imports

// #region Local Imports
import { IStemServices, IStore } from "@Interfaces";
import { Spinner } from "react-bootstrap";
import "./styles.scss";
import PrivateRoute from "@Pages/_privateRoute";
import { useRouter } from "next/router";
import { DASHBOARD_ROUTE } from "@Definitions/Constants";

const Loader: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(DASHBOARD_ROUTE);
  });

  return (
    <Spinner className="spinner" animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

export default PrivateRoute(Loader);
