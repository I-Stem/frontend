import React from "react";
import fileNames from "@Definitions/Constants/image";
import { Modal } from "antd";
import { IAlert } from "../Alert";
import "./style.scss";

export const FailureAlert: React.FunctionComponent<IAlert.IProps> = props => {
  return (
    <div>
      <Modal
        className="failure-modal"
        visible={props.visible}
        footer={false}
        closable={false}
      >
        <img
          src={fileNames.FAILURE_ALERT_ICON}
          className="failure-icon position-absolute mx-auto mb-4"
        />
        <div className="text-center text-white mb-4 text-base leading-normal font-semibold">
          {props.message}
        </div>
        {props.children}
      </Modal>
    </div>
  );
};
