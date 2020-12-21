import React from "react";
import { NextPage } from "next";
// #endregion Global Imports

// #region Local Imports
import { Wrapper } from "@Components";
import SuccessScreen from "@Components/auth/SuccessScreen";
import { Navbar } from "@Components/Navbar";
import "./style.scss";
import { Col, Layout, Row } from "antd";
// #endregion Local Imports

// #region Interface Imports
import { IRegister, ReduxNextPageContext } from "@Interfaces";

const { Content } = Layout;
// #endregion Interface Imports

export const Register: NextPage<
  IRegister.IProps,
  IRegister.InitialProps
> = ({}) => {
  return (
    <section className="auth-bg" id="register">
      <Wrapper>
        <Navbar />
        <Content className="lip-container">
          <Row justify="center">
            <Col xs={24} md={12}>
              <SuccessScreen
                heading="Success!"
                content="Account Successfully Created"
                email=""
              />
            </Col>
          </Row>
        </Content>
      </Wrapper>
    </section>
  );
};

Register.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IRegister.InitialProps> => {
  return { namespacesRequired: ["common"] };
};

export default Register;
