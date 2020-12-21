import React, {useEffect, useRef} from "react";
import Header from "@Components/Basic/Header";
import "./style.scss";
import { ISuccessScreen } from "./SuccessScreen";

export const SuccessScreen: React.FunctionComponent<ISuccessScreen.IProps> = props => {
  const { image, title, message, children } = props;
  const initialFocus = useRef<HTMLDivElement>(null);
  useEffect(() => {
    initialFocus.current?.focus();
  })
  return (
    <div className="lipbg">
      <div className=" text-center w-full">
        <Header />
      </div>
      <div className=" w-full pt-8">
        <img src={image} className="mx-auto" alt="Status" />
      </div>

      <div ref={initialFocus} tabIndex={-1} className="text-center w-full px-64 pt-10">
        <h1 className=" text-center font-semibold text-4xl leading-10 text-white">
          {title}
        </h1>
      </div>

      <div className=" text-center w-full px-64 pt-4">
        <p className=" text-center text-lg leading-7 font-medium text-white px-40">
          {message}
        </p>
      </div>

      {children}
    </div>
  );
};
