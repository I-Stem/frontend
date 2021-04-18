import { ResolveErrors } from "@Components/Organization/ResolveErrors";
import { IStemServices } from "@Interfaces";
import PrivateRoute from "@Pages/_privateRoute";
import { NextPage } from "next";
import React from "react";

const ResolveErrorsStudent: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  return <ResolveErrors />;
};

export default PrivateRoute(ResolveErrorsStudent);
