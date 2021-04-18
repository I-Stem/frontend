import { UploadData } from "@Components/Organization/UploadData";
import { IStemServices } from "@Interfaces";
import PrivateRoute from "@Pages/_privateRoute";
import { NextPage } from "next";
import React from "react";

const UploadDataEmployee: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  return <UploadData />;
};

export default PrivateRoute(UploadDataEmployee);
