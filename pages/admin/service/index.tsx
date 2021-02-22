import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard";
import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useRef } from "react";
import Error from "next/error";
import { useAppAbility } from "src/Hooks/useAppAbility";
import { RequestTable } from "@Components/Admin/RequestTable";
import { requestTypeConstants } from "@Components/Admin";
import { IStemServices, IStore } from "@Interfaces";
import PrivateRoute from "@Pages/_privateRoute";
import Heading from "@Components/HOC/Heading";
import { Tab, Tabs } from "react-bootstrap";
import { ReviewTable } from "@Components/Admin/ReviewTable";
import { connect } from "react-redux";
import "../../dashboard/style.scss";

const ServiceRequest: NextPage<IStemServices.InitialProps, {}> = (
  props: any
) => {
  const { can } = useAppAbility();
  const initialFocus = useRef<HTMLDivElement>(null);
  const access = can("VIEW", "ADMIN_PANEL");
  const { requestCount, reviewCount } = props;
  useEffect(() => {
    initialFocus.current?.focus();
  }, []);
  return (
    <Wrapper>
      {access ? (
        <>
          <Head>
            <title>Service Role Requests | I-Stem</title>
          </Head>
          <FormLayout hideFooter>
            <Heading ref={initialFocus}>REQUESTS FOR SERVICE ROLE</Heading>
            <Tabs defaultActiveKey="requested" id="uncontrolled-tab-example">
              <Tab eventKey="requested" title="Pending Requests">
                <RequestTable
                  requestType={requestTypeConstants.SERVICE}
                  pageURL="/admin/service"
                  totalItems={requestCount.totalServiceRequests}
                />
              </Tab>
              <Tab eventKey="reviewed" title="Reviewed Requests">
                <ReviewTable
                  requestType={requestTypeConstants.SERVICE}
                  totalItems={reviewCount.totalServiceRequests}
                />
              </Tab>
            </Tabs>
          </FormLayout>
        </>
      ) : (
        <Error statusCode={404} title="Page not found" />
      )}
    </Wrapper>
  );
};

const mapStateToProps = (store: IStore) => {
  const { admin } = store;
  return {
    requestCount: admin.requestCount,
    reviewCount: admin.reviewCount,
  };
};

export default PrivateRoute(connect(mapStateToProps, null)(ServiceRequest));
