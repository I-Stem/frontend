import { AdminRequestCount, IAuthUser, IStore } from "@Interfaces";
import PrivateRoute from "@Pages/_privateRoute";
import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Wrapper } from "@Components";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout";
import { Col } from "react-bootstrap";
import { AdminPanelServices } from "@Services";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";
import Link from "next/link";
import { adminPageLink } from "@Components/Admin";
import "../dashboard/style.scss";
import Heading from "@Components/HOC/Heading";
import { AdminActions } from "src/Actions/AdminActions";

const AdminPanel: NextPage<AdminProps, {}> = (props: AdminProps) => {
  const { can } = useAppAbility();
  const { user, setRequestCount, setReviewCount } = props;
  const initialFocus = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(undefined);
  useEffect(() => {
    initialFocus.current?.focus();
    AdminPanelServices.countPendingRequests().then(res => {
      setCount(res.data.count);
      const { ORGANIZATION, AUTO_DOMAIN, SERVICE } = res.data.count;
      setRequestCount({
        requestCount: {
          totalAutoDomainRequests: AUTO_DOMAIN,
          totalOrganizationRequests: ORGANIZATION,
          totalServiceRequests: SERVICE,
        },
      });
    });
    AdminPanelServices.countReviewedRequests().then(res => {
      const { ORGANIZATION, AUTO_DOMAIN, SERVICE } = res.data.count;
      setReviewCount({
        reviewCount: {
          totalAutoDomainRequests: AUTO_DOMAIN,
          totalOrganizationRequests: ORGANIZATION,
          totalServiceRequests: SERVICE,
        },
      });
    });
  }, []);
  const access = can("VIEW", "ADMIN_PANEL");

  const rows = () =>
    adminPageLink.map(page => (
      <li>
        <Col md={12} className="mt-4">
          <Link href={page.link}>
            <a>
              <p>
                {page.message}
                {": "} {count![page.name]}
                {" requests"}
              </p>
            </a>
          </Link>
        </Col>
      </li>
    ));

  return (
    <Wrapper>
      {access ? (
        <>
          <Head>
            <title>Admin Panel | I-Stem</title>
          </Head>
          <DashboardLayout
            hideBreadcrumb
            userType={user?.userType}
            role={user?.role}
            escalationSetting={user?.escalationSetting}
          >
            <Heading ref={initialFocus}>ADMIN PANEL</Heading>
            <ul className="text-base font-medium mt-2 font-black">
              {count && rows()}
            </ul>
          </DashboardLayout>
        </>
      ) : (
        <Error statusCode={404} title="Page Not Found" />
      )}
    </Wrapper>
  );
};

const mapStateToProps = (store: IStore) => {
  const { auth } = store;
  return {
    user: auth.user,
  };
};

const mapDispatchToProps = {
  setRequestCount: AdminActions.UpdateRequestCount,
  setReviewCount: AdminActions.UpdateReviewCount,
};

export default PrivateRoute(
  connect(mapStateToProps, mapDispatchToProps)(AdminPanel)
);

interface AdminProps {
  user: IAuthUser;
  setRequestCount: (payload: { requestCount: AdminRequestCount }) => void;
  setReviewCount: (payload: { reviewCount: AdminRequestCount }) => void;
}
