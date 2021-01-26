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
  UserType,
} from "@Definitions/Constants";
import "./auth.scss";
import { IAuthPayload } from "@Interfaces";
import AuthDisclaimer from "./AuthDisclaimer";
import { IAuth } from "./Auth";
import { GreenButton } from "@Components/HOC/Dashboard";
import GoogleButton from "react-google-button";
import Cookies from "js-cookie";

const { Title } = Typography;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const RegisterUser = (props: IAuth.IRegisterUserProps) => {
  const router = useRouter();
  const { userType, email, verificationToken } = props;
  const loginWithGoogle = () => {
    Cookies.set("liprodAuthFlow", "register");
    Cookies.set("userType", userType);
    Cookies.set("invitationToken", verificationToken ? verificationToken : "");
    Cookies.set("invitationEmail", email ? email : "");
    router.push("/api/auth/google/");
  };

  const onFinish = (values: any) => {
    const { fullname, email, password, organizationName } = values;
    props
      .register({
        fullname,
        email,
        organizationName,
        password,
        userType: userType,
        verificationLink: `${BASE_URL}${VERIFICATION_URL}`,
        verifyToken: verificationToken,
      })
      .then((result: IAuthPayload) => {
        if (result.error) {
          router.push(`${LOGIN_PAGE_ROUTE}?email=${encodeURIComponent(email)}`);
        } else if (router.query.verificationToken) {
          router.push({
            pathname: "/register/success",
            query: { registerAs: "invited" },
          });
        } else {
          router.push("/register/success");
        }
      });
    // }
  };

  const checkUserType = () => {
    if (router.query.userType === UserType.I_STEM)
      return <span className="capitalize">Individual</span>;
    if (router.query.userType === UserType.VOLUNTEER)
      return <span className="capitalize">Volunteer or Mentor</span>;
    return <span className="capitalize">Organization</span>;
  };

  return (
    <section id="registeruser" className="mt-16 auth-form">
      <Title className="lipHead">Welcome to I-Stem!</Title>
      <Title className="lipHead" level={4}>
        Register your account as {checkUserType()}
      </Title>
      <GoogleButton label="Register with Google" onClick={loginWithGoogle} />
      <div className="mt-6">
        <Form
          aria-live="polite"
          name="basic"
          initialValues={{ remember: true, email: email }}
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
                  disabled={email}
                />
              </Form.Item>
            </Col>
            {!router.query.verificationToken &&
            (UserType.VOLUNTEER === userType ||
              UserType.UNIVERSITY === userType) ? (
              <Col xs={24} md={12}>
                <Form.Item
                  {...layout}
                  aria-live="polite"
                  label="Organization name"
                  name="organizationName"
                  rules={[
                    {
                      required: true,
                      message: "Organization name is required",
                    },
                  ]}
                >
                  <Input
                    aria-live="off"
                    className="auth-input"
                    placeholder="I-Stem"
                    size="large"
                  />
                </Form.Item>
              </Col>
            ) : (
              <></>
            )}
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
