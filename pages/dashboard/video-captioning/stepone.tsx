import React, { useEffect, useState, useRef } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { Typography } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices } from "@Interfaces";
import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import {
  VIDEO_CAPTIONING_NEW_REQUEST,
  VC_STEPTWO,
} from "@Definitions/Constants/pageroutes";
import PrivateRoute from "../../_privateRoute";
import { query } from "express";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";

const Stepone: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const [service, setService] = useState<string>();
  const router = useRouter();
  const { can } = useAppAbility();
  const access: boolean = can("VIEW", "AI_SERVICES");
  useEffect(() => {
    initialFocus?.current?.focus();
  });
  const handleServiceChange = (event: any, service: any) => {
    setService(service);
    if (service == "OCR") {
      router.push({
        pathname: VIDEO_CAPTIONING_NEW_REQUEST,
        query: { requestType: service },
      });
    } else {
      router.push({
        pathname: VC_STEPTWO,
        query: { requestType: service },
      });
    }
  };
  return (
    <Wrapper>
      <Head>
        <title>Select service | I-Stem</title>
      </Head>
      {access ? (
        <FormLayout form="vcModelSelectForm" hideFooter={true}>
          <div className="lip-margin">
            <div tabIndex={-1} ref={initialFocus}>
              <Typography variant="h2" gutterBottom>
                Step 1: What would you like to do?
              </Typography>
            </div>
            <Typography variant="subtitle1" gutterBottom>
              Choose between text extraction from video images(frames), get
              captions from audio/video, or both
            </Typography>
            <ToggleButtonGroup
              orientation="vertical"
              value={service}
              onChange={handleServiceChange}
              exclusive
            >
              <ToggleButton
                className="lip-button lip-model-button"
                value="CAPTION"
              >
                Captions
              </ToggleButton>
              <ToggleButton className="lip-button lip-model-button" value="OCR">
                Text extraction from video images
              </ToggleButton>
              <ToggleButton
                className="lip-button lip-model-button"
                value="OCR_CAPTION"
              >
                Both
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </FormLayout>
      ) : (
        <Error statusCode={403} title="Access Denied" />
      )}
    </Wrapper>
  );
};

// const Extended = connect()(Stepone);
// export default PrivateRoute(Extended);
export default PrivateRoute(connect(null, null)(Stepone));
