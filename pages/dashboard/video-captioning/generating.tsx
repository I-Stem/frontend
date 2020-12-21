import React from "react";
import { NextPage } from "next";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices } from "@Interfaces";
import { Wrapper } from "@Components";
import { SuccessScreen } from "@Components/HOC/Dashboard/";
import fileNames from "@Definitions/Constants/image";
import { GreenButton } from "@Components/HOC/Dashboard/CTAButtons";
import { VIDEO_CAPTIONING_HOME_ROUTE } from "@Definitions/Constants";

const message =
  "We will send you a notification on your registered email id when the results are ready.";
const title = "Your captions are being generated.";

const VideoConverted: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = () => {
  return (
    <Wrapper>
      <SuccessScreen
        image={fileNames.STATUS_IMAGE_VC}
        message={message}
        title={title}
      >
        <div className="width-25p mx-auto pt-6">
          <GreenButton href={VIDEO_CAPTIONING_HOME_ROUTE}>
            OK, Got it
          </GreenButton>
        </div>
      </SuccessScreen>
    </Wrapper>
  );
};
export default VideoConverted;
