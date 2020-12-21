import React from "react";
import { IRadioCheck } from "./RadioCheck";
import "./style.scss";

export const RadioCheck: React.FunctionComponent<IRadioCheck.IProps> = (
  props: IRadioCheck.IProps
) => {
  const { htmlType, id, name, value, label, onChange, onBlur, checked, defaultChecked } = props;
  return (
    <div className="lip-radio-div">
      <input
        className="lip-radio"
        type={htmlType}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
        defaultChecked={defaultChecked}
        aria-label={label}
      />
      <label aria-hidden="true" className="lip-label-r" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

export default RadioCheck;
