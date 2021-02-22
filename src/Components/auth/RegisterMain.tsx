import React from "react";
import Head from "next/head";
import { Button, Typography } from "antd";
import Link from "next/link";

import "./auth.scss";
import {
  REGISTER_BUSINESS_ROUTE,
  REGISTER_STUDENT_ROUTE,
  REGISTER_VOLUNTEER_ROUTE,
} from "@Definitions/Constants";
import volunteer from "@Pages/register/volunteer";
import { UserType } from "@Definitions/Constants";

const { Title } = Typography;

interface RegisterMainProps {
  registrationContext: string | string[];
}

const RegisterMain = (props: RegisterMainProps) => {
  return (
    <section id="registermain" className="mt-16 auth-form">
      <Head>
        <title>Register | I-Stem</title>
      </Head>
      <Title className="lipHead">Welcome to I-Stem!</Title>
      <Title className="lipHead" level={4}>
        Register your account as
      </Title>
      <div className="mt-6">
        <Link
          href={{
            pathname: REGISTER_STUDENT_ROUTE,
            query: {
              userType: UserType.I_STEM,
            },
          }}
        >
          <Button className="register-buttons mt-6" block>
            INDIVIDUAL
          </Button>
        </Link>
        <Link
          href={{
            pathname: REGISTER_BUSINESS_ROUTE,
            query: { userType: UserType.UNIVERSITY },
          }}
        >
          <Button className="register-buttons mt-6" block>
            UNIVERSITY REPRESENTATIVE
          </Button>
        </Link>
        <Link
          href={{
            pathname: REGISTER_BUSINESS_ROUTE,
            query: { userType: UserType.BUSINESS },
          }}
        >
          <Button className="register-buttons mt-6" block>
            BUSINESS REPRESENTATIVE
          </Button>
        </Link>
        <Link
          href={{
            pathname: REGISTER_STUDENT_ROUTE,
            query: { userType: UserType.VOLUNTEER },
          }}
        >
          <Button className="register-buttons mt-6" block>
            VOLUNTEER OR MENTOR
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default RegisterMain;
