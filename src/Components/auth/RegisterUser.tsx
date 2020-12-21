import React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { Button, Col, Form, Input, Row, Typography } from "antd";
import { AuthActions } from "@Actions";
import {
  BASE_URL,
  LOGIN_PAGE_ROUTE,
  VALID_PASSWORD,
  VERIFICATION_URL,
  userType,
} from "@Definitions/Constants";
import "./auth.scss";
import { IAuthPayload } from "@Interfaces";
import AuthDisclaimer from "./AuthDisclaimer";
import { IAuth } from "./Auth";

const { Title } = Typography;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const RegisterUser = (props: IAuth.IRegisterUserProps) => {
  const router = useRouter();
  const onFinish = (values: any) => {
    const { fullname, email, password } = values;
    if (props.userType === "organisation") {
      props.saveBusinessCredentials({
        fullname,
        email,
        password,
        userType: userType[props.userType],
      });
      router.push("/register/business/setup");
    } else {
      props
        .register({
          fullname,
          email,
          password,
          userType: userType[props.userType],
          verificationLink: `${BASE_URL}${VERIFICATION_URL}`,
        })
        .then((result: IAuthPayload) => {
          if (result.error) {
            router.push(
              `${LOGIN_PAGE_ROUTE}?email=${encodeURIComponent(email)}`
            );
          } else {
            router.push("/register/success");
          }
        });
    }
  };

  return (
    <section id="registeruser" className="mt-16 auth-form">
      <Title className="lipHead">Welcome to I-Stem!</Title>
      <Title className="lipHead" level={4}>
        Register your account as{" "}
        <span className="capitalize"> {props.userType} </span>
      </Title>
      <div className="mt-6">
        <Form
          aria-live='polite'
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          hideRequiredMark
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                {...layout}
                aria-live="polite"
                label="Name"
                name="fullname"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input
                  aria-live="off" 
                  className="auth-input"
                  placeholder="John Doe"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                {...layout}
                aria-live="polite"
                label="Email Address"
                name="email"
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
                  placeholder="user@email.com"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} className="mt-2">
            <Col xs={24} md={12}>
              <Form.Item
                {...layout}
                aria-live="polite"
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Password is Required" },
                  {
                    pattern: new RegExp(VALID_PASSWORD),
                    message: "Password must be atleast 8 characters",
                  },
                ]}
              >
                <Input.Password
                  aria-live="off"
                  className="auth-input"
                  placeholder="8+ characters"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                {...layout}
                aria-live="polite"
                label="Confirm Password"
                name="password2"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please Re-enter password" },
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
                  className="auth-input"
                  placeholder="8+ characters"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              className="login-button mt-8"
              block
              type="primary"
              htmlType="submit"
            >
              CREATE AN ACCOUNT
            </Button>
          </Form.Item>
        </Form>
        <AuthDisclaimer message="Create an account" />
      </div>
    </section>
  );
};

const mapDispatchToProps = {
  register: AuthActions.Register,
  saveBusinessCredentials: AuthActions.SaveBusinessCredentials,
};

export default connect(null, mapDispatchToProps)(RegisterUser);
