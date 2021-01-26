import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Form, Input, Typography } from "antd";
import { AuthActions } from "@Actions";
import "./auth.scss";
import { FORGOT_PASSWORD_ROUTE } from "@Definitions/Constants/pageroutes";
import { IAuthResponse, IStore } from "@Interfaces";
import AuthDisclaimer from "./AuthDisclaimer";
import { IAuth } from "./Auth";
import { UserType, VALID_PASSWORD } from "@Definitions/Constants";
import { Modal } from "react-bootstrap";
import { GreenButton } from "@Components/HOC/Dashboard";
import GoogleButton from "react-google-button";
import Cookies from "js-cookie";
import { UniversityStatus } from "@Definitions/Constants/UniversityConstants";

const { Title } = Typography;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const LoginForm = (props: IAuth.ILoginProps) => {
  const router = useRouter();
  const [heading, setHeading] = useState("Welcome to I-Stem!");
  const [subtitle, setSubtitle] = useState("Sign in to your account");
  const { message } = props;
  const [respMessage, setRespMessage] = useState("");
  const headref = useRef<HTMLDivElement>(null);
  const [orgMessage, setOrgMessage] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const verifyhasToken = async () => {
    const { email, verifyToken } = router.query;
    if (email && verifyToken) {
      try {
        await props
          .verifyToken({
            email: email.toString(),
            verifyUserToken: verifyToken.toString(),
          })
          .then(() => {
            setHeading("Your email has been verified.");
            setSubtitle("As a security step, please sign in to your account");
          });
      } catch (err) {
        setHeading("Your email is not verified.");
        setSubtitle("Kindly make sure you have verified your email");
      }
    }
  };

  const loginWithGoogle = () => {
    Cookies.set("liprodAuthFlow", "login");
    router.push("/api/auth/google/");
  };

  useEffect(() => {
    return () => {
      // Clear message state on component unmount
      props.clearAuthMessage();
    };
  }, [props]);

  useEffect(() => {
    headref?.current?.focus();
    verifyhasToken();
  });

  const onFinish = (values: any) => {
    const { email, password } = values;
    props.login({ email, password }).then((result: IAuthResponse) => {
      if (!result.error) {
        setRespMessage("");
        props.clearAuthMessage();

        if (
          result.data.user.userType === UserType.UNIVERSITY &&
          result.data.user.role === "STAFF"
        ) {
          if (
            result.data.organizationStatus ===
            UniversityStatus.REGISTRATION_COMPLETE
          ) {
            router.push("/dashboard");
          } else if (
            result.data.organizationStatus ===
            UniversityStatus.REGISTRATION_PENDING
          ) {
            router.push({
              pathname: "/register/business/setup",
              query: { organizationName: result.data.user.organizationName },
            });
          } else if (
            result.data.organizationStatus ===
            UniversityStatus.REGISTRATION_REJECTED
          ) {
            setOrgMessage("Your registration for the university was rejected.");
            setShowDialog(true);
            setRespMessage("");
          } else if (
            result.data.organizationStatus === UniversityStatus.APPROVAL_PENDING
          ) {
            setOrgMessage(
              "Your registration for the university is pending approval from I-Stem. You will be notified through email once approved."
            );
            setShowDialog(true);
            setRespMessage("");
          }
        } else router.push("/dashboard");
      } else setRespMessage(result.message);
    });
  };

  const { email } = router.query;
  return (
    <div className="mt-16 auth-form">
      <Head>
        <title>Sign in | I-Stem</title>
      </Head>
      <div ref={headref} tabIndex={-1}>
        <Title className="lipHead">{heading}</Title>
      </div>
      <Title className="lipHead" level={4}>
        {subtitle}
      </Title>
      <GoogleButton onClick={loginWithGoogle} />
      <div className="h-4" />
      <Form
        aria-live="polite"
        layout="horizontal"
        name="basic"
        initialValues={{ remember: true, email }}
        onFinish={onFinish}
        {...layout}
        hideRequiredMark
      >
        <Form.Item
          label="Email Address"
          name="email"
          aria-live="polite"
          rules={[
            { required: true, message: "Email is required" },
            {
              type: "email",
              message: "Not a valid email address",
            },
          ]}
          validateTrigger="onSubmit"
        >
          <Input
            aria-live="off"
            className="auth-input"
            size="large"
            placeholder="user@email.com"
          />
        </Form.Item>
        <span
          aria-hidden="true"
          tabIndex={-1}
          className="forgot-password-link z-10"
        >
          <Link href={FORGOT_PASSWORD_ROUTE}>
            <a tabIndex={-1}>
              <span> Forgot password?</span>
            </a>
          </Link>
        </span>
        <Form.Item
          aria-live="polite"
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password is required" },
            {
              pattern: new RegExp(VALID_PASSWORD),
              message: "Password must be atleast 8 characters",
            },
          ]}
          validateTrigger="onSubmit"
        >
          <Input.Password
            aria-live="off"
            className="auth-input"
            size="large"
            placeholder="8+ characters"
          />
        </Form.Item>

        <Form.Item>
          <span className="response_Message">{respMessage}</span>
          <Button
            size="large"
            className="login-button"
            block
            type="primary"
            htmlType="submit"
          >
            SIGN IN
          </Button>
          <span className="sr-only">
            <Link href={FORGOT_PASSWORD_ROUTE}>
              <a>
                <span> Forgot password?</span>
              </a>
            </Link>
          </span>
        </Form.Item>
      </Form>
      <AuthDisclaimer message="Sign in" />
      <Modal
        show={showDialog}
        onHide={() => setShowDialog(false)}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h3 className="lip-title">MESSAGE</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{orgMessage}</Modal.Body>
        <Modal.Footer>
          <div style={{ width: "40%" }}>
            <GreenButton htmlType="button" onClick={() => setShowDialog(false)}>
              <span className="flex items-center">
                <span className="ml-2">OK</span>
              </span>
            </GreenButton>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
function mapStateToProps(store: IStore) {
  const { message } = store;
  return {
    message: message?.message,
  };
}

const mapDispatchToProps = {
  login: AuthActions.Login,
  clearAuthMessage: AuthActions.ClearAuthMessage,
  verifyToken: AuthActions.VerifyToken,
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
