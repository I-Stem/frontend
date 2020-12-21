import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
// #endregion Global Imports

// #region Local Imports
import { IStemServices } from "@Interfaces";
import { Wrapper } from "@Components";
import { SuccessScreen } from "@Components/HOC/Dashboard";
import fileNames from "@Definitions/Constants/image";
import { GreenButton } from "@Components/HOC/Dashboard/CTAButtons";
import { AFC_HOME_ROUTE, DASHBOARD_ROUTE } from "@Definitions/Constants";
import PrivateRoute from "@Pages/_privateRoute";

const Thankyou: NextPage = () => {
  const router = useRouter();
  let message = "";
  let title = "";

  if (router.query.signupAs === "mentee") {
    message =
      "We will be in touch with you as soon as we find a matching mentor for you.";
    title = "Thank you for signing up as a mentee.";
  } else if (router.query.signupAs === "mentor") {
    message =
      "Your experience and advice will go a long way in helping our community grow, and we hope that you will find this experience to be rewarding as well. We will follow up with mentee requests as per the cadence you specified.";
    title = "Thank you for offering to be a mentor. ";
  } else if (router.query.signupAs === "both") {
    message =
      "Thank you for signing up as a mentee and mentor. We will be in touch with a mentor match and any prospective mentee matches as per the cadence specified by you.";
    title = "Thank you for signing up as a mentee and mentor.";
  } else if (router.query.status === "paused") {
    title = "Your mentorship has been paused.";
    message = "You can always resume your mentorship whenever you want.";
  } else if (router.query.status === "active") {
    message =
      "Your experience and advice will go a long way in helping our community grow, and we hope that you will find this experience to be rewarding as well. We will follow up with mentee requests as per the cadence you specified.";
    title = "Your mentorship has been resumed";
  } else {
    message = "You can always submit another request whenever you require it. ";
    title = "Your menteeship request has been cancelled";
  }

  return (
    <Wrapper>
      <Head>
        <title>Thank you | I-Stem</title>
      </Head>
      <SuccessScreen
        image={fileNames.MENTORSHIP}
        title={title}
        message={message}
      >
        <div className="width-25p mx-auto pt-6">
          <GreenButton href={DASHBOARD_ROUTE}>OK, Got it</GreenButton>
        </div>
      </SuccessScreen>
    </Wrapper>
  );
};
export default Thankyou;
