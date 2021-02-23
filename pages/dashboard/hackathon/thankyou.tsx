import React from "react";
import { NextPage } from "next";
import Head from "next/head";
// #endregion Global Imports

// #region Local Imports
import { IStemServices } from "@Interfaces";
import { Wrapper } from "@Components";
import { SuccessScreen } from "@Components/HOC/Dashboard";
import fileNames from "@Definitions/Constants/image";
import { GreenButton } from "@Components/HOC/Dashboard/CTAButtons";
import { DASHBOARD_ROUTE } from "@Definitions/Constants";
import PrivateRoute from "@Pages/_privateRoute";

const message =
  "We will soon reach out to you via email with the platform details and next steps";
const title = "Thanks for registering for hackathon. ";

const Thankyou: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = () => {
  return (
    <Wrapper>
      <Head>
        <title>Thank you | I-Stem</title>
      </Head>
      <SuccessScreen image={fileNames.HACKER} title={title} message={message}>
        <div className="width-25p mx-auto pt-6">
          <GreenButton href={DASHBOARD_ROUTE}>OK, Got it</GreenButton>
        </div>
      </SuccessScreen>
    </Wrapper>
  );
};

export default PrivateRoute(Thankyou);
