import React from "react";
import { NextPage } from "next";
import Head from 'next/head';
// #endregion Global Imports

// #region Local Imports
import { IStemServices } from "@Interfaces";
import { Wrapper } from "@Components";
import { SuccessScreen } from "@Components/HOC/Dashboard";
import fileNames from "@Definitions/Constants/image";
import { GreenButton } from "@Components/HOC/Dashboard/CTAButtons";
import { DASHBOARD_ROUTE} from "@Definitions/Constants";
import PrivateRoute from "@Pages/_privateRoute";

const message =
  "We will be in touch should there be relevant positions. If you have requested job coaching services, we will reach out should there be availability.";
const title = "Thank you for completing the job application. ";

const Thankyou: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = () => {
  return (
    <Wrapper>
      <Head>
          <title>Thank you | I-Stem</title>
      </Head>
      <SuccessScreen
        image={fileNames.JOB_OPPORTUNITIES}
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
