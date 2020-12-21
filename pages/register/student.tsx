// #region Global Imports
import { Col, Layout, Row } from "antd";
import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
// #endregion Global Imports

// #region Local Imports
import "./style.scss";
import { Wrapper } from "@Components";
import RegisterUser from "@Components/auth/RegisterUser";
import { Navbar } from "@Components/Navbar";
import fileName from "@Definitions/Constants/image";
// #endregion Local Imports

// #region Interface Imports
import { IRegister } from "@Interfaces";
// #endregion Interface Imports

const { Content } = Layout;
const { AUTH_BACKGROUND_IMAGE } = fileName;

export const Register: NextPage<
  IRegister.IProps,
  IRegister.InitialProps
> = () => {
  const router = useRouter();

  return (
    <section className="auth-bg" id="register-student">
      <Wrapper>
        <Navbar />
        <Content>
          <Row>
            <Col xs={0} lg={12}>
              <div className="mt-4 h-full mr-16">
                <img
                  className="w-full"
                  src={AUTH_BACKGROUND_IMAGE}
                  alt="Logo"
                />
              </div>
            </Col>
            <Col xs={24} lg={11}>
              <div className="p-6 mt-8">
                <RegisterUser userType={router.query.userType} />
              </div>
            </Col>
          </Row>
        </Content>
      </Wrapper>
    </section>
  );
};

Register.getInitialProps = async (): Promise<IRegister.InitialProps> => {
  return { namespacesRequired: ["common"] };
};

export default Register;
