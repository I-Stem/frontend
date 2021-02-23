import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard";
import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useRef } from "react";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";
import { RequestTable } from "@Components/Admin/RequestTable";
import { requestTypeConstants } from "@Components/Admin";
import { IStemServices, IStore } from "@Interfaces";
import PrivateRoute from "@Pages/_privateRoute";
import Heading from "@Components/HOC/Heading";
import { Tab, Tabs } from "react-bootstrap";
import { ReviewTable } from "@Components/Admin/ReviewTable";
import { connect } from "react-redux";
import "../../dashboard/style.scss";

const OrganizationRequest: NextPage<IStemServices.InitialProps, {}> = (
  props: any
) => {
  const { can } = useAppAbility();
  const access = can("VIEW", "ADMIN_PANEL");
  const { requestCount, reviewCount } = props;
  const initialFocus = useRef<HTMLDivElement>(null);
  useEffect(() => {
    initialFocus.current?.focus();
  }, []);

  return (
    <Wrapper>
      {access ? (
        <>
          <Head>
            <title>Organization Requests | I-Stem</title>
          </Head>
          <FormLayout hideFooter>
            <Heading ref={initialFocus}>REQUESTS FOR NEW ORGANIZATION</Heading>
            <Tabs defaultActiveKey="requested" id="uncontrolled-tab-example">
              <Tab eventKey="requested" title="Pending Requests">
                <RequestTable
                  pageURL="/admin/organization"
                  requestType={requestTypeConstants.ORGANIZATION}
                  totalItems={requestCount.totalOrganizationRequests}
                />
              </Tab>
              <Tab eventKey="reviewed" title="Reviewed Requests">
                <ReviewTable
                  requestType={requestTypeConstants.ORGANIZATION}
                  totalItems={reviewCount.totalOrganizationRequests}
                />
              </Tab>
            </Tabs>
          </FormLayout>
        </>
      ) : (
        <Error title="Page Not Found" statusCode={404} />
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

export default PrivateRoute(
  connect(mapStateToProps, null)(OrganizationRequest)
);
