import React, { useEffect, useRef } from "react";
import Head from 'next/head';
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { Button, Form, Input, Typography } from "antd";
import { AuthActions } from "@Actions";
import "./auth.scss";
import { IAuth } from "./Auth";

const { Title, Text } = Typography;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const ResetPasswordForm = (props: IAuth.IResetPasswordProps) => {
  const router = useRouter();
  const headRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    headRef.current?.focus();
  }, []);
  const onFinish = (values: any) => {
    const { password } = values;
    const { email, resetToken } = router.query;
    props
      .resetPassword({
        password,
        passwordResetToken: resetToken.toString(),
        email: email.toString(),
      })
      .then(() => {
        router.push("/login");
      });
  };

  return (
    <div className="mt-16  auth-form">
      <Head>
        <title>Reset password | I-Stem</title>
      </Head>
      <Title className="lipHead">
        <div ref={headRef} tabIndex={-1}>
          Set a new password
        </div>
      </Title>
      <Text className="lip-head">
        Keep a strong password to protect your account, We recommend using a mix
        of upper case, lower case, numbers and special characters.
      </Text>
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
          {...layout}
          label="New Password"
          name="password"
          aria-live="polite"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password
            aria-live="off"
            placeholder="8+ characters"
            size="large"
          />
        </Form.Item>

        <Form.Item
          {...layout}
          aria-live="polite"
          label="Confirm New Password"
          name="password2"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "The two passwords that you entered do not match!"
                );
              },
            }),
          ]}
          validateTrigger="onSubmit"
        >
          <Input.Password
            aria-live="off"
            placeholder="8+ characters"
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            className="login-button mt-4 "
            block
            type="primary"
            htmlType="submit"
          >
            RESET PASSWORD
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
const mapDispatchToProps = {
  resetPassword: AuthActions.ResetPassword,
};
export default connect(null, mapDispatchToProps)(ResetPasswordForm);
