import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { BlueButton } from "@Components/HOC/Dashboard/CTAButtons";
import RadioCheck from "@Components/HOC/Dashboard/RadioCheck";
import { Form as FormikForm, Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import FormErrorFocus from "../../../src/Components/FormErrorFocus";
import { CommunityService } from "@Services";

// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { DisabilitiesData, HackathonData, IStemServices } from "@Interfaces";
import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import { CommunityActions } from "@Actions";
import {
  DASHBOARD_ROUTE,
  THANKYOU_HACKATHON,
} from "@Definitions/Constants/pageroutes";
import PrivateRoute from "../../_privateRoute";
import fileNames from "@Definitions/Constants/image";
import { HackathonDescription } from "@Components/ServiceDescriptions/hackathon";

const Hackathon: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const router = useRouter();
  const initialFocus = useRef<HTMLDivElement>(null);
  const [disabilities, setDisabilities] = useState([] as DisabilitiesData[]);
  const [showDescription, setShowDescription] = useState(true);
  const { INFO_ICON } = fileNames;

  useEffect(() => {
    initialFocus.current?.focus();

    props.GetDisabilities().then((response: any) => {
      setDisabilities(response);
    });
  }, []);

  const initialValues: HackathonData = {
    isPWD: "",
    associatedDisabilities: [],
    designation: "",
    orgName: "",
    canCode: "",
    anythingElse: "",
    preferedAreas: "",
    expectations: "",
  };

  const onsubmit = (data: any) => {
    console.log("Form Data:", JSON.stringify(data));
    CommunityService.postHackathon(data)
      .then((result: any) => {
        router.push(THANKYOU_HACKATHON);
      })
      .catch((error: any) => {
        console.log("Error occurred while sending request.", error);
      });
  };

  return (
    <Wrapper>
      <Head>
        <title>Hackathon | I-Stem</title>
      </Head>
      <FormLayout
        form="jobPreferencesForm"
        hideFooter
        close={() => router.push(DASHBOARD_ROUTE)}
      >
        <div className="lip-margin">
          <div className="display-flex">
            <div tabIndex={-1} ref={initialFocus}>
              <h2 className="lip-title">Hackathon </h2>
            </div>
            <img
              className="desc-toggle-icon"
              alt={
                "Show description" +
                (showDescription ? "Expanded" : "Collapsed")
              }
              onClick={() => setShowDescription(!showDescription)}
              src={INFO_ICON}
              role="button"
              aria-expanded={showDescription}
              aria-live="polite"
            />
          </div>
          {showDescription ? (
            <>
              <HackathonDescription />
              <div className="lip-submit">
                <BlueButton
                  htmlType="button"
                  onClick={() => {
                    setShowDescription(!showDescription);
                  }}
                >
                  PROCEED TO HACKATHON APPLICATION
                </BlueButton>
              </div>
            </>
          ) : (
            <div>
              <p className="lip-subtext">
                Inclusive Stem Hackathon brings people with and without
                disabilities to work together, ideate and develop solutions to
                some of the most pressing accessibility problems. Learn more and
                sign up.
              </p>
              <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                  isPWD: Yup.string().required("Select an option"),
                  associatedDisabilities: Yup.array().when("isPWD", {
                    is: "false",
                    then: schema => schema,
                    otherwise: Yup.array().min(
                      1,
                      "Select atleast one disability"
                    ),
                  }),
                  designation: Yup.string().required("Required"),
                  orgName: Yup.string().required("Required"),
                  canCode: Yup.string().required("Select an option"),
                })}
                onSubmit={onsubmit}
              >
                {formik => (
                  <Form onSubmit={formik.handleSubmit} id="jobPreferencesForm">
                    <fieldset>
                      <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                        Are you a person with disability? *
                      </h3>
                      <RadioCheck
                        htmlType="radio"
                        name="isPWD"
                        value="true"
                        label="Yes"
                        id="yes"
                        onChange={() => formik.setFieldValue("isPWD", "true")}
                      />
                      <RadioCheck
                        htmlType="radio"
                        name="isPWD"
                        value="false"
                        label="No"
                        id="no"
                        onChange={() => {
                          formik.setFieldValue("isPWD", "false");
                          formik.setFieldValue("associatedDisabilities", []);
                        }}
                      />
                    </fieldset>
                    {formik.errors.isPWD && formik.touched.isPWD ? (
                      <div className="error">{formik.errors.isPWD}</div>
                    ) : null}
                    {formik.values.isPWD == "true" ? (
                      <div>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Nature of disability? *
                        </h3>
                        <fieldset
                          className="space-bottom"
                          id="disabilitiesList"
                          style={{ display: "flex", flexWrap: "wrap" }}
                        >
                          {disabilities.map((data: any, i: number) => {
                            return (
                              <div style={{ flex: "0 50%" }}>
                                <RadioCheck
                                  htmlType="checkbox"
                                  label={`${data.name}`}
                                  id={data.name}
                                  value={data.name}
                                  key={`${i}`}
                                  name="associatedDisabilities"
                                  onChange={formik.handleChange}
                                />
                              </div>
                            );
                          })}
                        </fieldset>
                        {formik.errors.associatedDisabilities &&
                        formik.touched.associatedDisabilities ? (
                          <div className="error">
                            {formik.errors.associatedDisabilities}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <></>
                    )}
                    <Form.Group controlId="designation">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Your Designation: e.g. student, software engineer, VP
                          of engineering etc *
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="Designation"
                        as="textarea"
                        rows={1}
                        required
                        className="lip-textarea"
                        {...formik.getFieldProps("designation")}
                      />
                    </Form.Group>
                    {formik.errors.designation && formik.touched.designation ? (
                      <div className="error">{formik.errors.designation}</div>
                    ) : null}
                    <Form.Group controlId="orgName">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Name of your company/university? *
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="Company / University"
                        as="textarea"
                        rows={1}
                        required
                        className="lip-textarea"
                        {...formik.getFieldProps("orgName")}
                      />
                    </Form.Group>
                    {formik.errors.orgName && formik.touched.orgName ? (
                      <div className="error">{formik.errors.orgName}</div>
                    ) : null}
                    <fieldset>
                      <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                        Can you code? *
                      </h3>
                      <RadioCheck
                        htmlType="radio"
                        name="canCode"
                        label="Yes"
                        id="yesCode"
                        value="true"
                        onChange={() => formik.setFieldValue("canCode", "true")}
                      />
                      <RadioCheck
                        htmlType="radio"
                        name="canCode"
                        label="No"
                        id="noCode"
                        value="false"
                        onChange={() =>
                          formik.setFieldValue("canCode", "false")
                        }
                      />
                    </fieldset>
                    {formik.errors.canCode && formik.touched.canCode ? (
                      <div className="error">{formik.errors.canCode}</div>
                    ) : null}
                    <Form.Group controlId="preferedAreas">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Are there particular projects or challenge areas
                          (education, employment or social connection) that you
                          would like to work on?
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="Preferences"
                        as="textarea"
                        rows={1}
                        className="lip-textarea"
                        {...formik.getFieldProps("preferedAreas")}
                      />
                    </Form.Group>
                    {formik.errors.preferedAreas &&
                    formik.touched.preferedAreas ? (
                      <div className="error">{formik.errors.preferedAreas}</div>
                    ) : null}
                    <Form.Group controlId="expectations">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          What do you want to get out of the hackathon?
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="Expectations"
                        as="textarea"
                        rows={1}
                        className="lip-textarea"
                        {...formik.getFieldProps("expectations")}
                      />
                    </Form.Group>
                    <Form.Group controlId="anythingElse">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Anything else that we should know?
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="Anything else"
                        as="textarea"
                        rows={1}
                        className="lip-textarea"
                        {...formik.getFieldProps("anythingElse")}
                      />
                    </Form.Group>
                    <div className="lip-submit">
                      <BlueButton htmlType="submit">
                        SUBMIT APPLICATION
                      </BlueButton>
                    </div>
                    <FormErrorFocus
                      offset={0}
                      align="top"
                      focusDelay={200}
                      ease="linear"
                      duration={100}
                      formik={formik}
                    />
                  </Form>
                )}
              </Formik>
            </div>
          )}
        </div>
      </FormLayout>
    </Wrapper>
  );
};

const mapDispatchToProps = {
  GetDisabilities: CommunityActions.GetDisabilities,
};
const Extended = connect(null, mapDispatchToProps)(Hackathon);

export default PrivateRoute(Extended);
