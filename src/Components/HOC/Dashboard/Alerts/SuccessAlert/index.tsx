import React from "react";
import fileNames from "@Definitions/Constants/image";
import { Modal } from "antd";
import { IAlert } from "../Alert";
import "./style.scss";

export const SuccessAlert: React.FunctionComponent<IAlert.IProps> = props => {
  const { visible, message, children } = props;
  return (
    <Modal
      className="success-modal"
      visible={visible}
      footer={false}
      closable={false}
    >
      <img
        src={fileNames.SUCCESS_ALERT_ICON}
        alt="alert icon"
        className="success-icon position-absolute mx-auto mb-4"
      />
      <div className="text-center text-white mb-4 text-base leading-normal font-semibold">
        {message}
      </div>
      {children}
    </Modal>
  );
};
