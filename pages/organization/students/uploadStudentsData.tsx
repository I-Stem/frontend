import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
import { useRouter } from "next/router";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import PrivateRoute from "../../_privateRoute";
import CSVReader from "react-csv-reader";
import { UniversityPortalActions } from "src/Actions/UniversityActions";
import { COLUMN_MAPPING } from "@Definitions/Constants/universityRoutes";
import fileNames from "@Definitions/Constants/image";
import Link from "next/link";
import { UserType } from "@Definitions/Constants";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";

const Stepone: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
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
      router.push(COLUMN_MAPPING);
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
            <h2 className="mt-8 lip-title">STEP 1: UPLOAD STUDENT DATA</h2>
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

export default PrivateRoute(
  connect(mapStateToProps, mapDispatchToProps)(Stepone)
);
