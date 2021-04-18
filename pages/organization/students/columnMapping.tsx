import { ColumnMapping } from "@Components/Organization/ColumnMapping";
import { IStemServices } from "@Interfaces";
import PrivateRoute from "@Pages/_privateRoute";
import { NextPage } from "next";
import React from "react";

const ColumnMappingComponent: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  return <ColumnMapping />;
};

export default PrivateRoute(ColumnMappingComponent);
