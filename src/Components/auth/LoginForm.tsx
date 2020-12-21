import React, { useEffect, useRef,useState } from "react";
import Head from 'next/head';
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
      console.log(" Error is ", result);
      if (!result.error) {
        setRespMessage("");
        props.clearAuthMessage();
        router.push("/dashboard");
      }
      else {
        setRespMessage(result.message);
      }
    });
  };
  const { email } = router.query;
  return (
    <div className="mt-16 auth-form">
      <Head>
        <title>Sign in | I-Stem</title>
      </Head>
    <div ref={headref} tabIndex={-1}>
      <Title className="lipHead">{message || heading}</Title>
    </div>
      <Title className="lipHead" level={4}>
        {subtitle}
      </Title>
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
          <Input aria-live="off" className="auth-input" size="large" placeholder="user@email.com" />

        </Form.Item>
        <span aria-hidden="true" tabIndex={-1} className="forgot-password-link z-10">
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
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password aria-live="off" className="auth-input" size="large" placeholder="8+ characters" />
        </Form.Item>

        <Form.Item>
          <span className="response_Message">
            {respMessage}
          </span>
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
