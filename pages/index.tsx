import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Grid } from "@material-ui/core";
// #endregion Global Imports

// #region Local Imports
import "./style.scss";
import {
  CreditsService,
  IStemServices,
  IStore,
  ReduxNextPageContext,
} from "@Interfaces";
import { StemService } from "@Components/StemServices";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout/index";
import { useAppAbility } from "src/Hooks/useAppAbility";

import AIservicesList from "@Definitions/Constants/AIServices";
import ResourcesList from "@Definitions/Constants/Resources";

import { BlueButton } from "@Components/HOC/Dashboard";
import imageContent from "@Definitions/Constants/image";
import { IServiceResponse } from "@Services/API/AccessService/IServiceResponse";
import { connect } from "react-redux";
import { RecommendedActions } from "@Components/University/RecommendedActions";
import { UserType } from "@Definitions/Constants";
import { CreditsActions } from "@Actions";
import { AccessService } from "../src/Services/API/AccessService";
import PrivateRoute from "./_privateRoute";

const StemServices: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  const {
    userType,
    role,
    showOnboardStudentsCard,
    showOnboardStaffCard,
  } = props.user;
  const initialFocus = useRef<HTMLDivElement>(null);
  const messageFocus = useRef<HTMLDivElement>(null);
  const [focus, updateFocus] = useState(false);
  const [request, setRequest] = useState(false);
  useEffect(() => {
    AccessService.getRequestAccess().then((res: IServiceResponse) => {
      if (res.data) {
        setRequest(true);
      }
    });
    initialFocus.current?.focus();
    if (focus) {
      messageFocus.current?.focus();
    }
  }, [focus]);

  useEffect(() => {
    props.getCredits();
  }, []);

  const { can } = useAppAbility();
  const access: boolean = can("VIEW", "AI_SERVICES");
  const requestAccess = () => (
    <div className="service-access-container">
      <div className="service-access-card">
        <div className="service-access-body">
          <img
            src={imageContent.SERVICE_LOCK}
            alt="service-lock"
            className="m-10"
          />
          {request ? (
            <h1
              className="font-semibold text-base leading-6 text-center mb-6 service-access-text"
              tabIndex={-1}
              ref={messageFocus}
            >
              We have received your request. We will send you a mail when we
              provide you access to AI services.
            </h1>
          ) : (
            <div tabIndex={-1} ref={messageFocus}>
              <h1 className="font-semibold text-base leading-6 text-center mb-6 service-access-text">
                Currently AI services are only available to selective users.
              </h1>
              <div style={{ width: "340px" }}>
                <BlueButton
                  onClick={() => {
                    setRequest(true);
                    AccessService.requestAccess();
                  }}
                >
                  <span className="flex items-center">
                    <span className="ml-2">REQUEST ACCESS TO AI SERVICES</span>
                  </span>
                </BlueButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const resources = ResourcesList.filter((data: any) => {
    if (
      userType === UserType.VOLUNTEER ||
      (userType === UserType.UNIVERSITY && role == "STAFF")
    ) {
      return data.ServiceName !== "Job Opportunities";
    }
    return data.ServiceName !== "";
  }).map(service => {
    return (
      <Grid item sm={6} md={6} lg={4} key={service.ServiceName}>
        <StemService serviceInstance={service} />
      </Grid>
    );
  });
  return (
    <section className="lipbg flex flex-col">
      <Head>
        <title>Dashboard | I-Stem</title>
      </Head>
      <DashboardLayout userType={userType} role={role} hideBreadcrumb>
        <div className="pl-16 pr-12 flex-1" key="2">
          {userType === UserType.UNIVERSITY &&
          (role === "STAFF" || role === "REMEDIATOR") ? (
            <RecommendedActions
              showOnboardStudentsCard={showOnboardStudentsCard}
              showOnboardStaffCard={showOnboardStaffCard}
            />
          ) : (
            <></>
          )}
          <Grid item className="pt-4">
            <div ref={initialFocus} tabIndex={-1}>
              <h2 className="font-semibold text-xl heading-color">
                AI SERVICES
              </h2>
            </div>
          </Grid>
          <Grid container spacing={3} className="pb-3">
            {AIservicesList.map(service => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={4}
                  key={service.ServiceName}
                  onClick={() => {
                    if (!access) {
                      updateFocus(true);
                    }
                  }}
                >
                  <StemService serviceInstance={service} disabled={!access} />
                </Grid>
              );
            })}
            {access ? <div /> : requestAccess()}
          </Grid>
          <Grid item className="pt-4">
            <div tabIndex={-1}>
              <h2 className="font-semibold text-xl heading-color">
                PROGRAMS AND RESOURCES
              </h2>
            </div>
          </Grid>
          <Grid container spacing={3}>
            {resources}
          </Grid>
        </div>
      </DashboardLayout>
    </section>
  );
};

StemServices.getInitialProps = async (
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

const mapDispatchToProps = {
  getCredits: CreditsActions.GetCredits,
};

export default PrivateRoute(
  connect(mapStateToProps, mapDispatchToProps)(StemServices)
);
