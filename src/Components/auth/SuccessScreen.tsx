import React, { useEffect, useRef } from "react";
import { Typography } from "antd";
import { connect } from "react-redux";
import { IStore } from "@Interfaces";
import { AuthActions } from "@Actions";
import "./auth.scss";
import fileNames from "@Definitions/Constants/image";

const { Title } = Typography;
const { REGISTRATION_SUCCESS_IMAGE } = fileNames;
const SuccessScreen = (props: any) => {
  useEffect(() => {
    return () => {
      // Clear message state on component unmount
      props.clearAuthMessage();
    };
  }, [props]);

  const { message, user } = props;
  return (
    <div className="text-center">
      <img className="m-auto" src={REGISTRATION_SUCCESS_IMAGE} alt="Logo" />
      <div className="center-text-holder">
        <Title className="lipHead lip-message">
          {message}
          <br />
          {user.email}
        </Title>
        <div className="text-white">
          Please verify your email. If you could not find the verification email in your inbox, please check your{" "}
          <span className="font-bold">SPAM</span> folder.
          {/* or <span className="ml-2 underline">
            click here to send the link again.
          </span> */}
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(store: IStore) {
  const { auth, message } = store;
  return {
    user: auth?.user,
    message: message?.message,
  };
}

const mapDispatchToProps = {
  clearAuthMessage: AuthActions.ClearAuthMessage,
};
export default connect(mapStateToProps, mapDispatchToProps)(SuccessScreen);
