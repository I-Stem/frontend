import React, { useEffect, useRef } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import PrivateRoute from "../../_privateRoute";
import { BlueButton } from "@Components/HOC/Dashboard";
import { Table } from "react-bootstrap";
import { UPLOAD_STUDENTS } from "@Definitions/Constants/universityRoutes";

const ResolveErrors: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const rows = props.csvErrors.validationResult.map((data: any) => {
    return (
      <tr key={data.row}>
        <td>{data.row}</td>
        <td>{data.errors.EMAIL} </td>
        <td>{data.errors.NAME}</td>
        <td>{data.errors.ROLL_NO}</td>
      </tr>
    );
  });
  useEffect(() => {
    initialFocus?.current?.focus();
  });
  return (
    <Wrapper>
      <Head>
        <title>Resolve Errors | I-Stem</title>
      </Head>

      <FormLayout form="resolveErrors" hideFooter={true}>
        <div className="lip-margin">
          <div tabIndex={-1} ref={initialFocus}>
            <h2 className="mt-8 lip-title orange-title">
              RESOLVE THE FOLLOWING ERRORS!
            </h2>
          </div>
          <div className="">
            <Table style={{ marginTop: "1rem" }}>
              <thead>
                <tr style={{ borderTop: "hidden" }}>
                  <th style={{ width: "15%" }}>Row</th>
                  <th>Email</th>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </div>
          <div style={{ width: "35%", marginTop: "2rem" }}>
            <BlueButton href={UPLOAD_STUDENTS}>RE-UPLOAD CSV FILE</BlueButton>
          </div>
        </div>
      </FormLayout>
    </Wrapper>
  );
};

const mapStateToProps = (store: IStore) => {
  const { university } = store;
  return {
    csvFile: university?.csvFile,
    csvErrors: university?.csvErrors,
  };
};

export default PrivateRoute(connect(mapStateToProps, null)(ResolveErrors));
