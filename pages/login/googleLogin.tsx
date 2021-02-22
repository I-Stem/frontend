// #region Global Imports
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Col, Layout, Row } from "antd";
import Cookies from "js-cookie";
import { AuthToken } from "@Services";
import { Wrapper } from "@Components";
import { Navbar } from "@Components/Navbar";
import fileName from "@Definitions/Constants/image";
// #endregion Local Imports

// #region Interface Imports
import { ILogin } from "@Interfaces";
import { useRouter } from "next/router";
import { Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import { AuthActions } from "@Actions";
import { connect } from "react-redux";
import { PropertySafetyTwoTone } from "@ant-design/icons";
import { UserType } from "@Definitions/Constants";
import "./style.scss";
import Head from "next/head";
import Link from "next/link";
import { getContextPathFromUserCreationContext } from "@Definitions/Constants/user/ContextualRedirects";
// #endregion Interface Imports

const { Content } = Layout;
const { AUTH_BACKGROUND_IMAGE } = fileName;

export const GoogleLogin: NextPage<ILogin.IProps, ILogin.InitialProps> = (
  props: any
) => {
  const router = useRouter();
  const [message, setMessage] = useState<string | string[]>("");
  const [description, setDescription] = useState<string>("");
  useEffect(() => {
    if (router.query.message) {
      setMessage(router.query.message || "");
    } else {
      const getUser = axios({
        method: "get",
        url: "/api/userInfo",
        headers: {
          Authorization: `Bearer ${router.query.token}`,
          "Content-Type": "application/json",
        },
      })
        .then((result: any) => {
          props.User(result.data.data);
          if (
            result.data.data.user.userType === UserType.UNIVERSITY &&
            result.data.data.user.role === "STAFF"
          ) {
            if (
              result.data.data.organizationStatus === "REGISTRATION_COMPLETE"
            ) {
              AuthToken.storeToken(router.query.token.toString());
              router.push("/dashboard");
            } else if (
              result.data.data.organizationStatus === "REGISTRATION_PENDING"
            ) {
              AuthToken.storeToken(router.query.token.toString());
              router.push({
                pathname: "/register/business/setup",
                query: { organizationName: result.data.user?.organizationName },
              });
            } else if (
              result.data.data.organizationStatus === "REGISTRATION_REJECTED"
            ) {
              setMessage("Your registration for the university was rejected.");
            } else {
              setMessage(
                "Your registration for the university is pending approval from I-Stem. You will be notified through email once approved."
              );
            }
          } else {
            AuthToken.storeToken(router.query.token.toString());
            if (result.data.data.contextPath)
              router.push(
                getContextPathFromUserCreationContext(
                  result.data.data.contextPath
                )
              );
            else router.push("/dashboard");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  return (
    <section className="auth-bg" id="login">
      <Head>
        <title>Redirecting... | I-Stem</title>
      </Head>
      <Wrapper>
        <Navbar currentPage="login" />
        <Content className="w-full">
          <Row className="row-login">
            {message ? (
              <>
                <h1 className="message-login">{message}</h1>
                <p>
                  Click{" "}
                  <Link href="/login">
                    <a>here</a>
                  </Link>{" "}
                  to go to login page.
                </p>
              </>
            ) : (
              <Spinner className="spinner" animation="border" />
            )}
          </Row>
        </Content>
      </Wrapper>
    </section>
  );
};

const mapDispatchToProps = {
  User: AuthActions.User,
};
export default connect(null, mapDispatchToProps)(GoogleLogin);
