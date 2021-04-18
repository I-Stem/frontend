import { ConfirmImport } from "@Components/Organization/ConfirmAndImport";
import { IStemServices } from "@Interfaces";
import PrivateRoute from "@Pages/_privateRoute";
import { NextPage } from "next";
import React from "react";

const ConfirmImportEmployee: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  return <ConfirmImport />;
};

export default PrivateRoute(ConfirmImportEmployee);
