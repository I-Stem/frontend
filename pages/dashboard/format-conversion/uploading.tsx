import React from "react";
import { NextPage } from "next";
// #endregion Global Imports

// #region Local Imports
import { IStemServices } from "@Interfaces";
import { Wrapper } from "@Components";
import { SuccessScreen } from "@Components/HOC/Dashboard";
import fileNames from "@Definitions/Constants/image";
import { GreenButton } from "@Components/HOC/Dashboard/CTAButtons";
import { AFC_HOME_ROUTE } from "@Definitions/Constants";

const message =
  "We will send you a notification on the portal and in mail when the results are ready (It takes between 1 min to 2 hours depending on file size).";
const title = "Your document is being uploaded. ";

const FileUploading: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = () => {
  return (
    <Wrapper>
      <SuccessScreen
        image={fileNames.STATUS_IMAGE_AFC}
        title={title}
        message={message}
      >
        <div className="width-25p mx-auto pt-6">
          <GreenButton href={AFC_HOME_ROUTE}>OK, Got it</GreenButton>
        </div>
      </SuccessScreen>
    </Wrapper>
  );
};
export default FileUploading;
