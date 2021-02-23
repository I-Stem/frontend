// #region Global Imports
import React from "react";
import { NextPage } from "next";
import { Col, Layout, Row } from "antd";
// #endregion Global Imports

// #region Local Imports
import "./style.scss";
import { Wrapper } from "@Components";
import RegisterMain from "@Components/auth/RegisterMain";
import { Navbar } from "@Components/Navbar";
import fileNames from "@Definitions/Constants/image";
// #endregion Local Imports

// #region Interface Imports
import { IRegister } from "@Interfaces";
import { useRouter } from "next/router";
// #endregion Interface Imports

const { Content } = Layout;
const { AUTH_BACKGROUND_IMAGE } = fileNames;

export const Register: NextPage<
  IRegister.IProps,
  IRegister.InitialProps
> = () => {
  const router = useRouter();

  return (
    <section className="auth-bg" id="register">
      <Wrapper>
        <Navbar />
        <Content>
          <Row>
            <Col xs={0} lg={12}>
              <div className="mt-4 h-full lip-img mr-16">
                <img
                  className="w-full bottom-0"
                  src={AUTH_BACKGROUND_IMAGE}
                  alt="Logo"
                />
              </div>
            </Col>
            <Col xs={24} lg={11}>
              <div className="p-6 mt-8">
                <RegisterMain registrationContext={router.query.context} />
              </div>
            </Col>
          </Row>
        </Content>
      </Wrapper>
    </section>
  );
};

export default Register;
