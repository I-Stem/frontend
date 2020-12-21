import React from "react";
import { Button } from "antd";
import Link from "next/link";
import { ICTAButton } from "../CTAButton";
import "../style.scss";
import { query } from "express";

export const BlueButton: React.FunctionComponent<ICTAButton.IProps> = props => {
  const ButtonComponent = (
    <Button
      onClick={props.onClick}
      block
      className="text-center blue-btn"
      htmlType={props.htmlType}
      form={props.form}
      disabled={props.disabled}
    >
      <span className="font-semibold text-lg text-white leading-6">
        {props.children}
      </span>
    </Button>
  );
  return (
    <div className="w-full">
      {props.href ? (
        <Link href={{
          pathname: props.href,
          query:  props.queryParams
        }} >{ButtonComponent}</Link>
      ) : (
          ButtonComponent
        )}
    </div>
  );
};
export default BlueButton;
