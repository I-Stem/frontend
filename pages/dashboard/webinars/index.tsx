import React, { Fragment, useEffect, useState, useRef } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Col, Row, Typography } from "antd";
import { connect } from "react-redux";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore, ReduxNextPageContext } from "@Interfaces";
import { Wrapper } from "@Components";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout/index";
import fileNames from "@Definitions/Constants/image";
import { CommunityActions } from "@Actions";
import PrivateRoute from "../../_privateRoute";
import Link from "next/link";

const { STATUS_IMAGE_VC } = fileNames;
const { Title, Text } = Typography;
const Webinars: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initialFocus?.current?.focus();
  }, []);
  const { user } = props;
  return (
    <Wrapper>
      <DashboardLayout
        hideBreadcrumb
        role={user.role}
        userType={user.userType}
        escalationSetting={user.escalationSetting}
      >
        <Head>
          <title>Webinar | I-Stem</title>
        </Head>
        <Row className="tiles-row">
          <Col span={25}>
            <div ref={initialFocus} tabIndex={-1}>
              <Title className="mt-8 lip-title">WEBINARS</Title>
            </div>
            <Text className="lip-subtext">
              This page is a collection of I-Stem webinars on a variety of
              topics including studying STEM-based courses, inclusive
              educational institutes, interviews with several professionals and
              achievers with disabilities etc. Check this page often for new
              content.
            </Text>
          </Col>
          <Link href={`./webinars/atIITDelhi`}>
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/yLlYdnV1QRU/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    Accessibility efforts at IIT Delhi
                  </Title>
                  <Text className="lip-subtext">
                    This webinar, published in 2018, features Prof. M.
                    Balakrishanan from IIT Delhi talking about research and
                    innovation at Assistech group
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./webinars/accessibleAstronomy">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/cZhwh9XuQHM/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    Accessible astronomy
                  </Title>
                  <Text className="lip-subtext">
                    Learn more about IDATA (Inovater developing accessible tools
                    for Astronomy) and their work
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./webinars/msrIndia">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/uf61M-q9Udw/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    What's up at MSR India?
                  </Title>
                  <Text className="lip-subtext">
                    In this webinar, Dr. Manohar Swaminathan from Microsoft
                    Research India discusses the work of his teem on
                    accessibility for people with visual impairment (2018)
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./webinars/inclusiveCollegeCampus">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/H8S_UFCNm1Y/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    Making college campuses inclusive in India
                  </Title>
                  <Text className="lip-subtext">
                    Hear from Ashoka University, IIM Bangalore and St. Xavier's
                    College Mumbai about their journeys towards inclusion
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./webinars/accessibilityGuru">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/hQT4QNobddA/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    A programmer, an accessibility guru and an entrepreneur
                  </Title>
                  <Text className="lip-subtext">
                    Who said blind couldn't be successful tech professionals?
                    Hear from our highly accomplished trio who have achieved
                    amazing success in software development, accessibility and
                    entrepreneurship
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./webinars/inftyThoughts">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/mq4MxSANYII/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    Thoughts from the Infty project
                  </Title>
                  <Text className="lip-subtext">
                    Thanks to the founders of the Infty project in Japan, this
                    webinar features exciting project progress and a teaser of
                    what's next
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
        </Row>
      </DashboardLayout>
    </Wrapper>
  );
};

Webinars.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IStemServices.InitialProps> => {
  const { user, token } = ctx.store.getState().auth;

  return { namespacesRequired: ["common"], token, user };
};

const mapStateToProps = (store: IStore) => {
  const { auth } = store;
  return {
    user: auth.user,
  };
};

const Extended = connect(mapStateToProps, null)(Webinars);

export default PrivateRoute(Extended);
