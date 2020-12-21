// #region Global Imports
import React from "react";
import { NextPage } from "next";
import { Col, Layout, Row } from "antd";
// #endregion Global Imports

// #region Local Imports
import { Wrapper } from "@Components";
import { Navbar } from "@Components/Navbar";
import LoginForm from "@Components/auth/LoginForm";
import fileName from "@Definitions/Constants/image";
// #endregion Local Imports

// #region Interface Imports
import { ILogin } from "@Interfaces";

// #endregion Interface Imports

const { Content } = Layout;
const { AUTH_BACKGROUND_IMAGE } = fileName;

export const Login: NextPage<ILogin.IProps, ILogin.InitialProps> = () => {
  // eslint-disable-next-line prefer-destructuring

  return (
    <section className="auth-bg" id="login">
      <Wrapper>
        <Navbar currentPage="login" />
        <Content className="w-full">
          <Row>
            <Col xs={0} lg={12} className="text-right">
              <div className="mt-4 h-full lip-img">
                <img
                  className="w-full"
                  src={AUTH_BACKGROUND_IMAGE}
                  alt="Logo"
                />
              </div>
            </Col>
            <Col xs={24} lg={9}>
              <div className="p-6 mt-8">
                <LoginForm />
              </div>
            </Col>
          </Row>
        </Content>
      </Wrapper>
    </section>
  );
};

Login.getInitialProps = async (): Promise<ILogin.InitialProps> => {
  return { namespacesRequired: ["common"] };
};

export default Login;
