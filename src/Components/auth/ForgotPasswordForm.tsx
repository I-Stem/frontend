import React, { useEffect, useRef } from "react";
import Head from "next/head";
import getConfig from "next/config";
import { connect } from "react-redux";
import { Button, Form, Input, Typography } from "antd";
import { AuthActions } from "@Actions";
import { IStore } from "@Interfaces";
import "./auth.scss";
import { IAuth } from "./Auth";

const { Title } = Typography;
const {
  publicRuntimeConfig: { BASE_URL, RESET_PASSWORD_URL },
} = getConfig();

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const ForgotPasswordForm = (props: IAuth.IForgotPasswordProps) => {
  const { message } = props;
  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    headerRef.current?.focus();
    return () => {
      // Clear message state on component unmount
      props.clearAuthMessage();
    };
  }, []);

  const onFinish = (values: any) => {
    const { email } = values;
    const resetPasswordURL = `${BASE_URL}${RESET_PASSWORD_URL}`;
    props.forgot({ email, resetPasswordURL });
  };

  return (
    <div className="mt-16  auth-form">
      <Head>
        <title>Forgot password? | I-Stem</title>
      </Head>
      <Title className="lipHead">
        <div ref={headerRef} tabIndex={-1}>
          Forgot password?
        </div>
      </Title>
      <Title className="lipHead" level={4}>
        Reset your password
      </Title>
      <div className="h-8" />
      <Form
        layout="horizontal"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        {...layout}
        hideRequiredMark
        aria-live="polite"
      >
        <Form.Item
          label="Email Address you registered with"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            {
              type: "email",
              message: "Not a valid email address",
            },
          ]}
        >
          <Input size="large" placeholder="user@email.com" aria-live="off" />
        </Form.Item>
        <div className="warning-msg text-red-400">{message?.toString()}</div>
        <Form.Item className="mt-4">
          <Button
            size="large"
            className="login-button mt-4"
            block
            type="primary"
            htmlType="submit"
          >
            SEND PASSWORD RESET EMAIL
          </Button>
        </Form.Item>
      </Form>
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
  forgot: AuthActions.Forgot,
  clearAuthMessage: AuthActions.ClearAuthMessage,
};
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordForm);
