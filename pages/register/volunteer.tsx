// #region Global Imports
import React from "react";
import { NextPage } from "next";
import { Col, Layout, Row } from "antd";
// #endregion Global Imports

// #region Local Imports
import "./style.scss";
import RegisterUser from "@Components/auth/RegisterUser";
import { Navbar } from "@Components/Navbar";
import fileNames from "@Definitions/Constants/image";
// #endregion Local Imports

// #region Interface Imports
import { IRegister } from "@Interfaces";
import { UserType } from "@Definitions/Constants";

// #endregion Interface Imports

const { Content } = Layout;
const { AUTH_BACKGROUND_IMAGE } = fileNames;

export const Register: NextPage<
  IRegister.IProps,
  IRegister.InitialProps
> = () => {
  return (
    <section className="lipbg" id="register">
      <Navbar />
      <Content>
        <Row>
          <Col xs={0} lg={12}>
            <div className="mt-4 h-full mr-16">
              <img className="w-full" src={AUTH_BACKGROUND_IMAGE} alt="Logo" />
            </div>
          </Col>
          <Col xs={24} lg={11}>
            <div className="p-6 mt-8">
              <RegisterUser userType={UserType.VOLUNTEER} />
            </div>
          </Col>
        </Row>
      </Content>
    </section>
  );
};

Register.getInitialProps = async (): Promise<IRegister.InitialProps> => {
  return { namespacesRequired: ["common"] };
};

export default Register;
