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
import { IRegister } from "@Interfaces";
import Link from "next/link";
// #endregion Interface Imports

const { Content } = Layout;

const { LIP_LOGO } = fileNames;

export const Setup: NextPage<IRegister.IProps, IRegister.InitialProps> = () => {
  return (
    <section id="setup">
      <Wrapper>
        <div className="p-6 setup-header">
          <Link href="/register">
            <img className="lip-logo inline-block" src={LIP_LOGO} alt="Logo" />
          </Link>
        </div>

        <Content className="mx-auto" style={{ maxWidth: "1280px" }}>
          <BusinessSetup userType="organisation" />
        </Content>
      </Wrapper>
    </section>
  );
};

export default Setup;
