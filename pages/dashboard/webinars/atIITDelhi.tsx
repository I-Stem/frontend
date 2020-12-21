import React, { Fragment, useEffect, useState, useRef } from "react";
import { NextPage } from "next";
import Head from 'next/head';
import { Col, Row, Typography } from "antd";
import { connect } from "react-redux";
import { useRouter } from "next/router";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import {
  IStemServices,
  ReduxNextPageContext,
} from "@Interfaces";
import { Wrapper } from "@Components";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout/index";
import fileNames from "@Definitions/Constants/image";
import PrivateRoute from "../../_privateRoute";

const { STATUS_IMAGE_VC } = fileNames;
const { Title, Text } = Typography;
const Webinar: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    initialFocus?.current?.focus();
  }, []);  

  return (
    <Wrapper>
      <DashboardLayout hideBreadcrumb={true}>
      <Head>
        <title>Webinar | I-Stem</title>
      </Head>
        <Row className="tiles-row">
          <Col span={25}>
            <div ref={initialFocus} tabIndex={-1} >
              <Title className="mt-8 lip-title">Accessibility efforts at IIT Delhi</Title>
            </div>
            <Text className="lip-subtext">
              This webinar, published in 2018, features Prof. M. Balakrishanan from IIT Delhi talking about research and innovation at Assistech group
            </Text>
            <div className="lip-youtube">
              <iframe 
                  width="700" 
                  height="394" 
                  src="https://www.youtube.com/embed/yLlYdnV1QRU" 
                  frameBorder="0" 
                  allow="accelerometer; 
                  autoplay; 
                  clipboard-write; 
                  encrypted-media; 
                  gyroscope; 
                  picture-in-picture" 
                  allowFullScreen 
              />
            </div>

          </Col>
            
        </Row>
      </DashboardLayout>
    </Wrapper>
  );
};

const Extended = connect(null, null)(Webinar);

export default PrivateRoute(Extended);
