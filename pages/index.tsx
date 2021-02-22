import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Grid } from "@material-ui/core";
// #endregion Global Imports

// #region Local Imports
import "./style.scss";
import {
  CardPreferences,
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
import { AuthActions, CreditsActions } from "@Actions";
import { AccessService } from "../src/Services/API/AccessService";
import PrivateRoute from "./_privateRoute";

const StemServices: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  const { userType, role, escalationSetting, userPreferences } = props.user;
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

  const updateCardPreferences = (updatedPreferences: CardPreferences) => {
    props.updatePreferences({
      user: { ...props.user, cardPreferences: updatedPreferences },
    });
  };

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
      (userType === UserType.UNIVERSITY && role === "STAFF")
    ) {
      return data.ServiceName !== "Job Opportunities";
    } else if (userType === UserType.BUSINESS && role == "STAFF") {
      return (
        data.ServiceName !== "Job Opportunities" &&
        data.ServiceName !== "Webinars"
      );
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
      <DashboardLayout
        userType={userType}
        role={role}
        escalationSetting={escalationSetting}
        hideBreadcrumb
      >
        <div className="pl-16 pr-12 flex-1" key="2">
          {(userType === UserType.UNIVERSITY ||
            userType === UserType.BUSINESS) &&
          role === "STAFF" ? (
            <RecommendedActions
              cardPreferences={{
                showOnboardStudentsCard:
                  userPreferences?.cardPreferences?.showOnboardStudentsCard,
                showOnboardStaffCard:
                  userPreferences?.cardPreferences?.showOnboardStaffCard,
              }}
              updatePreferences={updateCardPreferences}
              userType={userType}
            />
          ) : (
            <></>
          )}
          <Grid item className="pt-4">
            <div ref={initialFocus} tabIndex={-1}>
              <h2 className="font-semibold text-xl heading-color">
                PROGRAMS AND RESOURCES
              </h2>
            </div>
          </Grid>
          <Grid container spacing={3}>
            {resources}
          </Grid>

          <Grid item className="pt-4">
            <h2 className="font-semibold text-xl heading-color">AI SERVICES</h2>
          </Grid>
          <Grid container spacing={3} className="pb-3">
            {AIservicesList.filter(data => {
              if (userType !== UserType.BUSINESS) {
                return data.ServiceName !== "Hiring";
              }
              return data.ServiceName !== "";
            }).map(service => {
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
  updatePreferences: AuthActions.updateCardPreferences,
};

export default PrivateRoute(
  connect(mapStateToProps, mapDispatchToProps)(StemServices)
);
