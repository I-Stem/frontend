// #region Global Imports
import React from "react";
import { NextPage } from "next";
// #endregion Global Imports

// #region Local Imports
import { Wrapper } from "@Components";
import fileNames from "@Definitions/Constants/image";
import BusinessSetup from "@Components/auth/BusinessSetup";
import { Layout } from "antd";

// #endregion Local Imports

// #region Interface Imports
import { IRegister, IStemServices, ReduxNextPageContext } from "@Interfaces";
import Link from "next/link";
import PrivateRoute from "@Pages/_privateRoute";
import { UserType } from "@Definitions/Constants";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout";
import Head from "next/head";
import { FormLayout } from "@Components/HOC/Dashboard";
import "../style.scss";
// #endregion Interface Imports

const { Content } = Layout;

const { LIP_LOGO } = fileNames;

export const Setup: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  return (
    <section id="setup">
      <Wrapper>
        <Head>
          <title>Basic Information | I-Stem</title>
        </Head>
        <FormLayout hideFooter={true}>
          <Content className="mx-auto" style={{ maxWidth: "1150px" }}>
            <BusinessSetup userType={UserType.UNIVERSITY} />
          </Content>
        </FormLayout>
      </Wrapper>
    </section>
  );
};
Setup.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IStemServices.InitialProps> => {
  const { user, token } = ctx.store.getState().auth;

  return { namespacesRequired: ["common"], token, user };
};
export default PrivateRoute(Setup);
