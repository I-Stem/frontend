import React from "react";
import Link from "next/link";
import { IAuth } from "./Auth";

function AuthDisclaimer(props: IAuth.IAuthDisclaimerProps) {
  const { message } = props;
  return (
    <p className="text-center text-gray-500">
      By clicking “{message}” , you agree to our{" "}
      <a href="https://www.istemai.com/istem_privacy_policy.html">
        <span className="disclaimer">Terms of Service and Privacy Policy.</span>
      </a>
    </p>
  );
}

export default AuthDisclaimer;
