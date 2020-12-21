import * as React from "react";
import { Button } from "antd";
import Link from "next/link";
import fileNames from "@Definitions/Constants/image";

import { INavbar } from "./Navbar";
import "./Navbar.scss";

const { LIP_LOGO } = fileNames;
const Navbar: React.FunctionComponent<INavbar.IProps> = ({
  currentPage,
}): JSX.Element => {
  let buttonlink = "/login";
  let headermessage = "Already have an account?";
  let buttonmessage = "SIGN IN";

  if (currentPage === "login") {
    buttonlink = "/register";
    headermessage = "New to I-Stem?";
    buttonmessage = "CREATE AN ACCOUNT";
  }
  return (
    <div className="p-6 flex justify-between">
      <div>
        <Link href="/register">
          <img className="lip-logo inline-block" src={LIP_LOGO} alt="Logo" />
        </Link>
      </div>

      <div className=" flex items-center">
        <span className="text-white text-lg">{headermessage}</span>
        <Link href={buttonlink}>
          <Button className="lip-nav-button ml-4">
            <span className="tracking-wider px-8">
              {buttonmessage}
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export { Navbar };
