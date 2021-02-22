import React, { Fragment, useEffect, useState, useRef } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Col, Row, Typography } from "antd";
import { connect } from "react-redux";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout/index";
import fileNames from "@Definitions/Constants/image";
import PrivateRoute from "../../_privateRoute";
import Link from "next/link";

const { STATUS_IMAGE_VC } = fileNames;
const { Title, Text } = Typography;
const LearningHub: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
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
          <title>LearningHub | I-Stem</title>
        </Head>
        <Row className="tiles-row">
          <Col span={25}>
            <div ref={initialFocus} tabIndex={-1}>
              <Title className="mt-8 lip-title">LEARNING HUB</Title>
            </div>
            <Text className="lip-subtext">
              This page is a collection of resources, learning material and
              content developed by I-Stem over the years on a variety of topics
              including STEM accessibility tools, accessible programming,
              academic and employment guidance etc. Check this page often for
              new content.
            </Text>
          </Col>
          <Title level={2} className="mt-8 lip-title">
            STEM Accessibility Tools
          </Title>
          <Link href="./learning-hub/screenReader">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/NuIsNMV8QeM/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    What is a screen reader?
                  </Title>
                  <Text className="lip-subtext">
                    This short video provides a basic introduction to screen
                    readers with a demo using JAWS, and also talks about NVDA
                    for windows and ORCA for Linux
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./learning-hub/voiceOver">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/rIWlvuJha70/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    VoiceOver introduction
                  </Title>
                  <Text className="lip-subtext">
                    This video introduces VoiceOver for iOS with a demo
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./learning-hub/mathIntro">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/EeCHLn-P4xQ/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    Introducing MathType and MathPlayer
                  </Title>
                  <Text className="lip-subtext">
                    Learn more about an equation editor mathtype and a math
                    reader extension MathPlayer which is a popular combination
                    for reading and writing math
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./learning-hub/jdm">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/bj18vy_73Nk/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    JAWS Dictionary Manager (JDM) to read inaccessible notation
                  </Title>
                  <Text className="lip-subtext">
                    Read symbols and notations not read out by JAWS by default
                    using JAWS Dictionary Manager (JDM)
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./learning-hub/autotext">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/smBxYDxOw_g/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    Write math faster with autotext
                  </Title>
                  <Text className="lip-subtext">
                    This video introduces autotext, a popular word processing
                    feature, that can be used as a strategy when writing STEM
                    documents to make the process faster
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./learning-hub/graphs">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/JQYnew1AUTE/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    Software for visualizing graphs and charts
                  </Title>
                  <Text className="lip-subtext">
                    Better understand and visualize graphs and charts using
                    MathTrax from NASA
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./learning-hub/elementaryTools">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/NN9dkKWfdgY/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    Elementary tools for mathematical computation
                  </Title>
                  <Text className="lip-subtext">
                    Used for elementary math, taylor frame and abacus continue
                    to be some of the most popular computational devices in
                    several regions of the world. Learn more about how it works.
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./learning-hub/spreadsheets">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/Io9-ui8sVxs/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    Digitizing calculations using spreadsheets
                  </Title>
                  <Text className="lip-subtext">
                    Learn more about digitizing your mathematical computations
                    using Excel spreadsheets and VP arithmetic
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./learning-hub/accLabs">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/A-OOfbwS8Fk/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    Accessible labs
                  </Title>
                  <Text className="lip-subtext">
                    Learn about the latest and greatest in making labs
                    accessible
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Title level={2} className="mt-8 lip-title">
            Accessible programming
          </Title>
          <Link href="./learning-hub/accIDE">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/MlykD_B--4Y/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    Accessible IDEs
                  </Title>
                  <Text className="lip-subtext">
                    Getting started with coding? Learn more about accessible
                    IDEs
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./learning-hub/codeblock">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/F7RtRREN1WY/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    CodeBlock
                  </Title>
                  <Text className="lip-subtext">
                    This video demoes a popular accessible IDE CodeBlock
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Title level={2} className="mt-8 lip-title">
            Academic and employment guidance
          </Title>
          <Link href="./learning-hub/education">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/M4Bt3qLWA7Y/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    International education for the blind
                  </Title>
                  <Text className="lip-subtext">
                    Published by Radio Udaan, hear from our co-founder Kartik
                    Sawhney about studying abroad as a person with a disability
                  </Text>
                </Col>
              </Row>
            </div>
          </Link>
          <Link href="./learning-hub/jobs">
            <div className="tiles">
              <Row gutter={[16, 16]}>
                <Col span={5}>
                  <img
                    className="w-full lip-img-web"
                    src="https://img.youtube.com/vi/PoWRCllZaj4/0.jpg"
                    alt=""
                  />
                </Col>
                <Col span={18}>
                  <Title level={3} className="mt-8 lip-title">
                    What jobs are available in tech?
                  </Title>
                  <Text className="lip-subtext">
                    Published by National Association for the Blind Delhi,
                    Kartik, our co-founder, talks about opportunities in tech
                    particularly beyond coding jobs
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

const mapStateToProps = (store: IStore) => {
  const { auth } = store;
  return {
    user: auth.user,
  };
};

const Extended = connect(mapStateToProps, null)(LearningHub);

export default PrivateRoute(Extended);
