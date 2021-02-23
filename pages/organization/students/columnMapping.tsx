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
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import PrivateRoute from "../../_privateRoute";
import { Form } from "react-bootstrap";
import { BlueButton } from "@Components/HOC/Dashboard";
import { Formik } from "formik";
import { UniversityPortal } from "@Services";
import {
  RESOLVE_ERRORS,
  CONFIRM_IMPORT,
} from "@Definitions/Constants/universityRoutes";
import { UniversityPortalActions } from "src/Actions/UniversityActions";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";

const Steptwo: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [headers, setHeaders] = useState<string[]>([]);
  const fileData = props.csvFile;
  const { can } = useAppAbility();
  const access = can("VIEW", "STUDENTS");
  useEffect(() => {
    initialFocus?.current?.focus();
    setHeaders(Object.keys(props.csvFile[0]));
  }, []);

  function renameKey(obj: any, oldKey: any) {
    if (oldKey.name !== "NAME") {
      obj["NAME"] = obj[oldKey.name];
      delete obj[oldKey.name];
    }
    if (oldKey.email !== "EMAIL") {
      obj["EMAIL"] = obj[oldKey.email];
      delete obj[oldKey.email];
    }
    if (oldKey.roll_no !== "ROLL_NO") {
      obj["ROLL_NO"] = obj[oldKey.roll_no];
      delete obj[oldKey.roll_no];
    }
  }

  const handleSubmit = (data: any) => {
    fileData.forEach((obj: any) => renameKey(obj, data));
    UniversityPortal.studentDataVerification(fileData).then((results: any) => {
      if (results.data.validationResult.length > 0) {
        props.CsvErrors({
          csvErrors: results.data,
        });
        router.push(RESOLVE_ERRORS);
      } else {
        router.push(CONFIRM_IMPORT);
      }
    });
  };
  const initialValues: FormData = {
    name: headers[headers.indexOf("NAME")],
    email: headers[headers.indexOf("EMAIL")],
    roll_no: headers[headers.indexOf("ROLL_NO")],
  };
  return access ? (
    <Wrapper>
      <Head>
        <title>Column Mapping | I-Stem</title>
      </Head>
      <FormLayout form="csvMappingForm" hideFooter>
        <div className="lip-margin">
          <div tabIndex={-1} ref={initialFocus}>
            <h2 className="mt-8 lip-title">
              STEP 2: SELECT RESPECTIVE COLUMN HEADERS
            </h2>
          </div>
          <p className="lip-subtext">BASIC INFO</p>
          <div>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {formik => (
                <Form
                  onSubmit={formik.handleSubmit}
                  style={{ marginTop: "3rem" }}
                >
                  <Form.Group className="csv-formgroup" controlId="name">
                    <Form.Label className="csv-select-label">
                      <h3 className="lip-subtext">Name</h3>
                    </Form.Label>
                    <Form.Control
                      placeholder="Select csv column"
                      className="stud-select"
                      as="select"
                      value="none"
                      {...formik.getFieldProps("name")}
                    >
                      <option value="none" hidden>
                        Select csv column
                      </option>
                      {headers.map(header => (
                        <option key={header} className="csv-dropdown-item">
                          {header}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="csv-formgroup" controlId="email">
                    <Form.Label className="csv-select-label">
                      <h3 className="lip-subtext">Email</h3>
                    </Form.Label>
                    <Form.Control
                      placeholder="Select csv column"
                      className="stud-select"
                      as="select"
                      value="none"
                      {...formik.getFieldProps("email")}
                    >
                      <option value="none" hidden>
                        Select csv column
                      </option>
                      {headers.map(header => (
                        <option key={header} className="csv-dropdown-item">
                          {header}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group className="csv-formgroup" controlId="roll_no">
                    <Form.Label className="csv-select-label">
                      <h3 className="lip-subtext">Roll No</h3>
                    </Form.Label>
                    <Form.Control
                      className="stud-select"
                      placeholder="Select csv column"
                      as="select"
                      value="none"
                      {...formik.getFieldProps("roll_no")}
                    >
                      <option value="none" hidden>
                        Select csv column
                      </option>
                      {headers.map(header => (
                        <option key={header} className="csv-dropdown-item">
                          {header}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <div style={{ width: "35%" }}>
                    <BlueButton htmlType="submit">NEXT</BlueButton>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </FormLayout>
    </Wrapper>
  ) : (
    <Error title="Page Not Found" statusCode={404} />
  );
};

const mapStateToProps = (store: IStore) => {
  const { university } = store;
  return {
    csvFile: university?.csvFile,
    csvErrors: university?.csvErrors,
  };
};
const mapDispatchToProps = {
  CsvErrors: UniversityPortalActions.CsvErrors,
};

export default PrivateRoute(
  connect(mapStateToProps, mapDispatchToProps)(Steptwo)
);
export interface FormData {
  name: string;
  email: string;
  roll_no: string;
}
