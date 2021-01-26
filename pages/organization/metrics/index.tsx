import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { NextPage } from "next";
import Head from "next/head";
import debounce from "lodash.debounce";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout/index";
import { Col, Row, Table } from "react-bootstrap";
import PrivateRoute from "@Pages/_privateRoute";
import { UniversityPortal } from "@Services";
import { MetricsData } from "../../../src/Services/API/University/IUniversityResponse";

const Metrics: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const [reachedEnd, setEnd] = useState(false);
  const [metricsData, setMetricsData] = useState<MetricsData>();
  const { userType, role } = props.user;
  useEffect(() => {
    initialFocus.current?.focus();
    UniversityPortal.getUniversityMetrics().then((results: any) => {
      setMetricsData(results.data);
    });
  }, []);
  console.log(metricsData);
  window.onscroll = debounce(() => {
    if (reachedEnd) {
      return;
    }
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
    }
  }, 100);

  function formatResolutionTime(millis: any) {
    const minutes = Math.floor(millis / 60000);
    const seconds = Number(((millis % 60000) / 1000).toFixed(0));
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <Wrapper>
      <Head>
        <title>Metrics | I-Stem</title>
      </Head>
      <DashboardLayout userType={userType} role={role} hideBreadcrumb>
        <Row className="stud-row">
          <Col sm={5}>
            <div ref={initialFocus} tabIndex={-1}>
              <h2 className="lip-title">METRICS</h2>
            </div>
          </Col>
        </Row>
        <div className="stud-div">
          <Table style={{ marginTop: "1rem" }}>
            <thead>
              <tr style={{ borderTop: "hidden" }}>
                <th style={{ width: "30%" }}>SERVICE NAME</th>
                <th>AVERAGE RATING GIVEN BY STUDENTS</th>
                <th>AVERAGE RESOLUTION TIME </th>
                <th>NO OF REQUESTS BY STUDENTS</th>
                <th>NO OF STUDENTS USING THIS SERVICE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Document accessibility</td>
                <td>{metricsData?.averageRatingAfc}</td>
                <td>
                  {formatResolutionTime(metricsData?.averageResolutionTimeAfc)}{" "}
                  min
                </td>
                <td>{metricsData?.totalRequestsAfc}</td>
                <td>{metricsData?.studentsUsingAfc}</td>
              </tr>
              <tr>
                <td>Audio and Video accessibility</td>
                <td>{metricsData?.averageRatingVc}</td>
                <td>
                  {formatResolutionTime(metricsData?.averageResolutionTimeVc)}{" "}
                  min
                </td>
                <td>{metricsData?.totalRequestsVc}</td>
                <td>{metricsData?.studentsUsingVc}</td>
              </tr>
            </tbody>
          </Table>
        </div>
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
const Extended = connect(mapStateToProps, null)(Metrics);

export default PrivateRoute(Extended);
export interface FormData {
  emails: string;
}
