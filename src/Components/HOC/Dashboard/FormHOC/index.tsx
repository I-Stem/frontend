import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import Header from "@Components/Basic/Header";
import { GreenButton } from "@Components/HOC/Dashboard";
import { FormProps } from "./FormProps";
import { AuthActions, CreditsActions } from "@Actions";
import { connect } from "react-redux";

const FormLayoutContainer: React.FunctionComponent<FormProps> = ({
  children,
  form,
  ...props
}): JSX.Element => {
  const router = useRouter();
  const handleClose = () => {
    if (router.query.organizationName) {
      props.logout();
      router.back();
    } else if (props.close) {
      props.close();
    } else {
      router.back();
    }
  };
  return (
    <section className="lipbg">
      <Row>
        <Header>
          <div className="text-white float-right pt-1">
            <CloseOutlined onClick={handleClose} />
          </div>
        </Header>
      </Row>
      <Row
        justify="center"
        className="dashboard-container h-auto overflow-auto pb-20"
      >
        <Col lg={24} className="pl-8" key="2">
          {children}
        </Col>
      </Row>
      {props.hideFooter ? (
        <></>
      ) : (
        <div className="bg-white position-fixed bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <div className="float-right">
            <GreenButton form={form} htmlType="submit">
              <span className="px-8">Next</span>
            </GreenButton>
          </div>
        </div>
      )}
    </section>
  );
};

const mapDispatchToProps = {
  logout: AuthActions.Logout,
};

const FormLayout = connect(null, mapDispatchToProps)(FormLayoutContainer);
export { FormLayout };
