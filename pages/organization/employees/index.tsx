import { OrganizationDashboard } from "@Components/Organization/Dashboard";
import { IStemServices } from "@Interfaces";
import PrivateRoute from "@Pages/_privateRoute";
import { NextPage } from "next";
import React from "react";

const Employees: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  return <OrganizationDashboard />;
};

export default PrivateRoute(Employees);
