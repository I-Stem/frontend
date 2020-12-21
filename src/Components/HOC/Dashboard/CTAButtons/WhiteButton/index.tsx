import React from "react";
import Link from "next/link";
import { Button } from "antd";

import { ICTAButton } from "../CTAButton";
import "../style.scss";

export const WhiteButton: React.FunctionComponent<ICTAButton.IProps> = props => {
  const ButtonComponent = (
    <Button
      onClick={props.onClick}
      block
      className="text-center white-btn"
      htmlType={props.htmlType}
      form={props.form}
    >
      <span className="font-semibold text-lg text-white leading-6">
        {props.children}
      </span>
    </Button>
  );
  return (
    <div className="w-full">
      {props.href ? (
        <Link href={props.href}>{ButtonComponent}</Link>
      ) : (
        ButtonComponent
      )}
    </div>
  );
};
export default WhiteButton;
