import React, { useEffect, useState, useRef } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
import { useRouter } from "next/router";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import PrivateRoute from "../../_privateRoute";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Pagination from "@Components/HOC/Pagination";
import Error from "next/error";
import { FormLayout } from "@Components/HOC/Dashboard";
import { StudentDetails } from "@Components/University/StudentDetails";

const StudentInfo: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { can } = useAppAbility();
  const access = can("VIEW", "STUDENTS");

  const { organizationCode, userType } = props.user;
  useEffect(() => {
    initialFocus?.current?.focus();
  });

  return access ? (
    <Wrapper>
      <Head>
        <title>Details | I-Stem</title>
      </Head>
      <FormLayout hideFooter>
        <section className="pl-20 pt-12">
          <StudentDetails
            studentId={String(router.query.id)}
            studentDetails={{
              name: String(router.query.name),
              email: String(router.query.email),
              roll: String(router.query.roll),
            }}
          />
        </section>
      </FormLayout>
    </Wrapper>
  ) : (
    <Error statusCode={404} title="Page Not Found" />
  );
};

const mapStateToProps = (store: IStore) => {
  const { university, auth } = store;
  return {
    csvFile: university?.csvFile,
    csvErrors: university?.csvErrors,
    user: auth?.user,
  };
};

const mapDispatchToProps = {
  //   resetCsv: UniversityPortalActions.ResetCsvData,
};

export default PrivateRoute(
  connect(mapStateToProps, mapDispatchToProps)(StudentInfo)
);
