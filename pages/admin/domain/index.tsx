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

const DomainAcces: NextPage<IStemServices.InitialProps, {}> = (props: any) => {
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
            <title>Auto Domain Requests | I-Stem</title>
          </Head>
          <FormLayout hideFooter>
            <Heading ref={initialFocus}>
              REQUESTS FOR AUTO DOMAIN ACCESS
            </Heading>
            <Tabs defaultActiveKey="requested" id="uncontrolled-tab-example">
              <Tab eventKey="requested" title="Pending Requests">
                <RequestTable
                  requestType={requestTypeConstants.AUTO_DOMAIN}
                  pageURL="/admin/domain"
                  totalItems={requestCount.totalAutoDomainRequests}
                />
              </Tab>
              <Tab eventKey="reviewed" title="Reviewed Requests">
                <ReviewTable
                  requestType={requestTypeConstants.AUTO_DOMAIN}
                  totalItems={reviewCount.totalAutoDomainRequests}
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

export default PrivateRoute(connect(mapStateToProps, null)(DomainAcces));
