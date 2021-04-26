import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
import { useRouter } from "next/router";
// #endregion Global Imports

// #region Local Imports
import "./style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import CSVReader from "react-csv-reader";
import { UniversityPortalActions } from "@Actions/UniversityActions";
import {
  COLUMN_MAPPING_EMPLOYEES,
  COLUMN_MAPPING_STUDENTS,
} from "@Definitions/Constants/universityRoutes";
import fileNames from "@Definitions/Constants/image";
import Link from "next/link";
import { UserType } from "@Definitions/Constants";
import { useAppAbility } from "@Hooks/useAppAbility";
import Error from "next/error";

const UploadDataComponent: React.FC = (props: any) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const [showError, setShowError] = useState(false);
  const { userType } = props.user;
  const router = useRouter();
  useEffect(() => {
    initialFocus?.current?.focus();
  });
  const { can } = useAppAbility();
  const access = can("VIEW", "STUDENTS");
  const handleFileUpload = (data: any, fileInfo: any) => {
    if (data.length) {
      props.uploadCsv({
        csvFile: data,
      });
      if (userType === UserType.BUSINESS) router.push(COLUMN_MAPPING_EMPLOYEES);
      else router.push(COLUMN_MAPPING_STUDENTS);
    } else {
      setShowError(true);
    }
  };
  const parseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header: any) => header.toUpperCase().replace(/\W/g, "_"),
  };
  return access ? (
    <Wrapper>
      <Head>
        <title>
          Upload {userType === UserType.BUSINESS ? "Employee" : "Student"} Data
          | I-Stem
        </title>
      </Head>
      <FormLayout form="uploadCSV" hideFooter>
        <div className="lip-margin">
          <div tabIndex={-1} ref={initialFocus}>
            <h2 className="mt-8 lip-title">
              STEP 1: UPLOAD{" "}
              {userType === UserType.BUSINESS ? "EMPLOYEE" : "STUDENT"} DATA
            </h2>
          </div>
          <p className="lip-subtext">
            Upload the CSV file with name, email id and roll no(optional) fields
            for {userType === UserType.BUSINESS ? "employees" : "student"} data.
            Email ID must be unique. Download a sample file
            <Link href={fileNames.IMPORT_STUDENTS_SAMPLE}> here.</Link>
          </p>
          <div className="stud-upload">
            <CSVReader
              cssClass="csv-reader-input"
              label="UPLOAD CSV FILE"
              onFileLoaded={handleFileUpload}
              parserOptions={parseOptions}
            />
          </div>
          {showError ? (
            <div className="error">Uploaded file is empty!</div>
          ) : (
            <></>
          )}
        </div>
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
    user: auth.user,
  };
};

const mapDispatchToProps = {
  uploadCsv: UniversityPortalActions.UploadCsvFile,
};

const UploadData = connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadDataComponent);

export { UploadData };
