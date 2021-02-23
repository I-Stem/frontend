// #region Global Imports
import { Col, Layout, Row } from "antd";
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
// #endregion Global Imports

// #region Local Imports
import "./style.scss";
import { Wrapper } from "@Components";
import RegisterUser from "@Components/auth/RegisterUser";
import { Navbar } from "@Components/Navbar";
import { UserType } from "@Definitions/Constants";
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
  const [currentUserType, setCurrentUserType] = useState<UserType>(
    UserType.I_STEM
  );

  useEffect(() => {
    if (router.query.userType === UserType.I_STEM) {
      setCurrentUserType(UserType.I_STEM);
    } else if (router.query.userType === UserType.VOLUNTEER) {
      setCurrentUserType(UserType.VOLUNTEER);
    } else if (
      router.query.userType === UserType.UNIVERSITY &&
      router.query.verificationToken
    ) {
      setCurrentUserType(UserType.UNIVERSITY);
    } else if (
      router.query.userType === UserType.BUSINESS &&
      router.query.verificationToken
    ) {
      setCurrentUserType(UserType.BUSINESS);
    }
  }, []);

  return (
    <section className="auth-bg" id="register-student">
      <Wrapper>
        <Head>
          <title>Register | I-Stem</title>
        </Head>
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
                <RegisterUser
                  userType={currentUserType}
                  email={router.query.email}
                  verificationToken={router.query.verificationToken}
                  context={String(router.query.context || "")}
                />
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
