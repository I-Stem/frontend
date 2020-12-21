import React from "react";
import "./style.scss";
import {
  STATUS_CLASS_MAP,
  STATUS_MAP,
} from "@Definitions/Constants/statusConstants";
import { TagProps } from "./StemServices";

const StatusTag: React.FunctionComponent<TagProps | undefined> = ({
  status,
}) => {
  const tagName: string = STATUS_MAP[status];
  const tagClass = STATUS_CLASS_MAP[tagName];
  return (
    <div className={tagClass}>
      <span>{tagName}</span>
    </div>
  );
};

export default StatusTag;
