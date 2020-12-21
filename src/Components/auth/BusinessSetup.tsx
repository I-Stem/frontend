import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Col, Form, Input, Radio, Row, Typography } from "antd";
import { AuthActions } from "@Actions";
import {
  BASE_URL,
  LOGIN_PAGE_ROUTE,
  VERIFICATION_URL,
  userType,
} from "@Definitions/Constants";
import { IStore } from "@Redux/IStore";

import "./auth.scss";

import { IAuthPayload } from "@Interfaces";
import { IAuth } from "./Auth";

const { Text } = Typography;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const BusinessSetup = (props: IAuth.IRegisterUserProps) => {
  const router = useRouter();
  const onFinish = (values: any) => {
    const {
      organisationName,
      organisationAddress,
      noStudentsWithDisability,
    } = values;
    const { fullname = "", email = "", password = "" } = props.user;
    props
      .register({
        fullname,
        email,
        password,
        userType: userType.organisation,
        organisationName,
        organisationAddress,
        noStudentsWithDisability,
        verificationLink: `${BASE_URL}${VERIFICATION_URL}`,
      })
      .then((result: IAuthPayload) => {
        if (result.error) {
          router.push(`${LOGIN_PAGE_ROUTE}?email=${email}`);
        } else {
          router.push("/register/success");
        }
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
  };
  return (
    <>
      <Row>
        <Col xs={24} lg={18}>
          <div className="mt-8">
            <Text type="secondary">Let&apos;s get to know you</Text>
          </div>

          <h1 className="text-4xl">Basic info about your company/institute</h1>
          <Form
            id="business-setup"
            className="w-9/12"
            layout="horizontal"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              {...layout}
              className="dark"
              label="Company/Institute Name"
              name="organisationName"
              rules={[{ required: true, message: "Please enter your organization name!" }]}
            >
              <Input size="large" placeholder="I-Stem" />
            </Form.Item>
            <Form.Item
              {...layout}
              className="dark"
              label="Company/Institute location"
              name="organisationAddress"
              rules={[
                { required: true, message: "Please enter your organization location!" },
              ]}
            >
              <Input size="large" placeholder="City, Country, Pincode" />
            </Form.Item>

            <Form.Item
              {...layout}
              className="dark"
              label="Estimate students/employees with disabilities in your
              institute/company"
              name="noStudentsWithDisability"
              rules={[{ required: true, message: "Please select an option!" }]}
            >
              <Radio.Group
                defaultValue="a"
                buttonStyle="solid"
                size="large"
                className="vertical-radio"
              >
                <Radio.Button value="not-sure">Not Sure</Radio.Button>
                <Radio.Button value="1-10">1-10</Radio.Button>
                <Radio.Button value="10-50">10-50</Radio.Button>
                <Radio.Button value="50-100">50-100</Radio.Button>
                <Radio.Button value="100-500">100-500</Radio.Button>
                <Radio.Button value="500+">500+</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Col>
        <Col xs={0} lg={6}>
          <div className="splash-container">
            <img src="/static/images/setup.svg" alt="Logo" />
          </div>
        </Col>
      </Row>
      <div className="fixed bg-white  bottom-0 left-0 right-0 p-3 border-t border-gray-200">
        <div className="flex justify-between">
          <Link href="/register/business">
            <Button type="text">Previous</Button>
          </Link>

          <Button
            form="business-setup"
            key="submit"
            htmlType="submit"
            className="w-40"
            type="primary"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

function mapStateToProps(store: IStore) {
  const { auth } = store;
  return {
    user: auth.user,
  };
}

const mapDispatchToProps = {
  register: AuthActions.Register,
  saveBusinessCredentials: AuthActions.SaveBusinessCredentials,
};

export default connect(mapStateToProps, mapDispatchToProps)(BusinessSetup);
