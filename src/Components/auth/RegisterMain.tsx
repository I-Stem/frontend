import React from "react";
import Head from 'next/head';
import { Button, Typography } from "antd";
import Link from "next/link";

import "./auth.scss";
import {
  REGISTER_BUSINESS_ROUTE,
  REGISTER_STUDENT_ROUTE,
  REGISTER_VOLUNTEER_ROUTE,
} from "@Definitions/Constants";
import volunteer from "@Pages/register/volunteer";

const { Title } = Typography;

const RegisterMain = () => {
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
        <Link href={{
            pathname: REGISTER_STUDENT_ROUTE,
            query: {userType:'student'}
          }}
        >
          <Button className="register-buttons mt-6" block>
            STUDENT OR PERSONAL
          </Button>
        </Link>
        <Link href={REGISTER_BUSINESS_ROUTE}>
          <Button className="register-buttons mt-6" block>
            UNIVERSITY OR BUSINESS REPRESENTATIVE
          </Button>
        </Link>
        <Link 
          href={{
            pathname: REGISTER_STUDENT_ROUTE,
            query: {userType:'volunteer'}
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
