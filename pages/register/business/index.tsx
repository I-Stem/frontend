// #region Global Imports
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Col, Layout, Row } from "antd";
// #endregion Global Imports

// #region Local Imports
import { Wrapper } from "@Components";
import RegisterUser from "@Components/auth/RegisterUser";
import { Navbar } from "@Components/Navbar";
import fileName from "@Definitions/Constants/image";
import "../style.scss";

// #endregion Local Imports

// #region Interface Imports
import { IRegister } from "@Interfaces";
import { UserType } from "@Definitions/Constants";
import { useRouter } from "next/router";
// #endregion Interface Imports

const { Content } = Layout;
const { AUTH_BACKGROUND_IMAGE } = fileName;

export const Register: NextPage<
  IRegister.IProps,
  IRegister.InitialProps
> = () => {
  const router = useRouter();
  const [currentUserType, setCurrentUserType] = useState<UserType>(
    UserType.BUSINESS
  );
  useEffect(() => {
    if (router.query.userType === UserType.BUSINESS) {
      setCurrentUserType(UserType.BUSINESS);
    } else if (router.query.userType === UserType.UNIVERSITY) {
      setCurrentUserType(UserType.UNIVERSITY);
    }
  }, []);

  return (
    <section className="auth-bg" id="register">
      <Wrapper>
        <Navbar />
        <Content>
          <Row>
            <Col xs={0} lg={12}>
              <div className="mt-4 h-full mr-16">
                <img
                  className="w-full bottom-0"
                  src={AUTH_BACKGROUND_IMAGE}
                  alt="Logo"
                />
              </div>
            </Col>
            <Col xs={24} lg={11}>
              <div className="p-6 mt-8">
                <RegisterUser userType={currentUserType} />
              </div>
            </Col>
          </Row>
        </Content>
      </Wrapper>
    </section>
  );
};
export default Register;
