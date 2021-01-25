import React, { Fragment, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { BlueButton, GreenButton } from "@Components/HOC/Dashboard/CTAButtons";
import RadioCheck from "@Components/HOC/Dashboard/RadioCheck";
import fileNames from "@Definitions/Constants/image";
import { ErrorMessage, Form as FormikForm, Formik, useFormik } from "formik";
import * as Yup from "yup";
import { Button, Col, Form, Row } from "react-bootstrap";
import FormErrorFocus from "../../../src/Components/FormErrorFocus";
import { CommunityService } from "@Services";

// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import Upload from "@Components/Upload";
import {
  DisabilitiesData,
  IStemServices,
  IStore,
  JobPreferencesData,
} from "@Interfaces";
import { Wrapper } from "@Components";
import { outputFormatsListAFC } from "@Definitions/Constants/dashboard-form-constants";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import { CommunityActions, UploadActions } from "@Actions";
import { VALID_FILE_NAME } from "@Definitions/Constants";
import { DASHBOARD_ROUTE, THANKYOU } from "@Definitions/Constants/pageroutes";
import DropdownWrapper from "@Components/StemServices/DropdownComponent";
import PrivateRoute from "../../_privateRoute";
import { JobOpportunitiesDescription } from "@Components/ServiceDescriptions/job-opportunities";

const JobPreferences: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  const router = useRouter();
  const initialFocus = useRef<HTMLDivElement>(null);
  const [disabilities, setDisabilities] = useState([] as DisabilitiesData[]);
  const [industryError, SetIndustryError] = useState(false);
  const [industry, setIndustry] = useState<string | undefined>("");
  const [closeButtonDialog, setCloseButtonDialog] = useState(false);
  const fileFocus = React.useRef<HTMLDivElement>(null);
  const [fixFocus, setFixFocus] = useState<boolean>(false);
  const { INFO_ICON } = fileNames;
  const [showDescription, setShowDescription] = useState(false);
  useEffect(() => {
    props.resetList();
    // initialFocus.current?.focus();
    CommunityService.getJobPreference(props.user.id).then(response => {
      if (!response.data.length) {
        setShowDescription(true);
      }
    });
    props.GetDisabilities().then((response: any) => {
      setDisabilities(response);
    });
  }, []);

  useEffect(() => {
    initialFocus.current?.focus();
  }, [showDescription]);

  const initialValues: JobPreferencesData = {
    seekingJob: "",
    natureOfJob: "",
    industry: "",
    idealPosition: "",
    highestEducation: "",
    highestDegree: "",
    major: "",
    workExperience: "",
    associatedDisabilities: [],
    currentPlace: "",
    canRelocate: "",
    linkedIn: "",
    portfolioLink: "",
    resumeLink: "",
    needCareerHelp: "",
    inputFileId: "",
  };

  const onsubmit = (data: any) => {
    console.log("Form Data:", JSON.stringify(data));
    const formData = {
      ...data,
      inputFileId: props.inputFileId,
      industry: industry,
    };

    props
      .PostJobPreferences(formData)
      .then((result: any) => {
        router.push(THANKYOU);
      })
      .catch((error: any) => {
        console.log("Error occurred while sending request.", error);
      });
  };

  const handleCloseButton = () => {
    setCloseButtonDialog(!closeButtonDialog);
  };

  return (
    <Wrapper>
      <Head>
        <title>Job Preferences | I-Stem</title>
      </Head>
      <FormLayout form="jobPreferencesForm" hideFooter>
        <div className="lip-margin">
          <div className="display-flex">
            <div tabIndex={-1} ref={initialFocus}>
              <h2 className="lip-title">JOB PREFERENCES</h2>
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
              <JobOpportunitiesDescription />
              <div className="lip-submit">
                <BlueButton
                  htmlType="button"
                  onClick={() => {
                    setShowDescription(!showDescription);
                  }}
                >
                  PROCEED TO FILL JOB APPLICATION
                </BlueButton>
              </div>
            </>
          ) : (
            <div>
              <p className="lip-subtext">
                Complete this application to be considered for opportunities
                with our corporate partners.
              </p>
              <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                  seekingJob: Yup.string().required("Required"),
                  natureOfJob: Yup.string().required("Required"),
                  idealPosition: Yup.string().required("Required"),
                  highestEducation: Yup.string().required("Required"),
                  highestDegree: Yup.string().required("Required"),
                  associatedDisabilities: Yup.array().required("Required"),
                  currentPlace: Yup.string().required("Required"),
                  canRelocate: Yup.string().required("Required"),
                  needCareerHelp: Yup.string().required("Required"),
                })}
                onSubmit={onsubmit}
              >
                {formik => (
                  <Form onSubmit={formik.handleSubmit} id="jobPreferencesForm">
                    <fieldset>
                      <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                        Are you seeking a job (internship or full-time) in 2021
                        in the private sector? *
                      </h3>
                      <RadioCheck
                        htmlType="radio"
                        name="seekingJob"
                        label="Yes"
                        id="yesJob"
                        value="true"
                        onChange={() =>
                          formik.setFieldValue("seekingJob", "true")
                        }
                      />
                      <RadioCheck
                        htmlType="radio"
                        name="seekingJob"
                        label="No"
                        id="noJob"
                        value="false"
                        onChange={() =>
                          formik.setFieldValue("seekingJob", "false")
                        }
                      />
                    </fieldset>
                    {formik.errors.seekingJob && formik.touched.seekingJob ? (
                      <div className="error">{formik.errors.seekingJob}</div>
                    ) : null}
                    <fieldset>
                      <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                        Nature of job *
                      </h3>
                      <RadioCheck
                        htmlType="radio"
                        name="natureOfJob"
                        label="Internship"
                        id="internship"
                        value="internhip"
                        onChange={() =>
                          formik.setFieldValue("natureOfJob", "internhip")
                        }
                      />
                      <RadioCheck
                        htmlType="radio"
                        name="natureOfJob"
                        label="Full-Time"
                        id="full_time"
                        value="full_time"
                        onChange={() =>
                          formik.setFieldValue("natureOfJob", "full_time")
                        }
                      />
                      <RadioCheck
                        htmlType="radio"
                        name="natureOfJob"
                        label="Both"
                        id="both"
                        value="both"
                        onChange={() =>
                          formik.setFieldValue("natureOfJob", "both")
                        }
                      />
                    </fieldset>
                    {formik.errors.natureOfJob && formik.touched.natureOfJob ? (
                      <div className="error">{formik.errors.natureOfJob}</div>
                    ) : null}
                    <label htmlFor="industryElement">
                      <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                        Industry you want to work in? *
                      </h3>
                    </label>
                    <div className="lip-industry">
                      <DropdownWrapper
                        setSelectedOrTypedInputValue={setIndustry}
                        name="industry"
                        id="industryElement"
                        getDropdownListItems={props.GetIndustry}
                        initialDropdownValue={industry}
                        required
                      />
                    </div>
                    <br />
                    <Form.Group controlId="idealPosition">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          What is your ideal position in this industry (e.g.
                          software engineer, product manager, CA, accessibility
                          tester, marketing manager, IT manager etc.)? Feel free
                          to mention multiple roles *
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="Roles"
                        as="textarea"
                        // name="idealPosition"
                        rows={1}
                        className="lip-textarea"
                        {...formik.getFieldProps("idealPosition")}
                      />
                    </Form.Group>
                    {formik.errors.idealPosition &&
                    formik.touched.idealPosition ? (
                      <div className="error">{formik.errors.idealPosition}</div>
                    ) : null}
                    <fieldset>
                      <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                        Highest educational qualification *
                      </h3>
                      <RadioCheck
                        htmlType="radio"
                        name="highestEducation"
                        label="10th Std"
                        id="10th_std"
                        value="10th_std"
                        onChange={() =>
                          formik.setFieldValue("highestEducation", "10th_std")
                        }
                      />
                      <RadioCheck
                        htmlType="radio"
                        name="highestEducation"
                        label="12th Std"
                        id="12th_std"
                        value="12th_std"
                        onChange={() =>
                          formik.setFieldValue("highestEducation", "12th_std")
                        }
                      />
                      <RadioCheck
                        htmlType="radio"
                        name="highestEducation"
                        label="Graduate degree"
                        id="graduate_degree"
                        value="graduate_degree"
                        onChange={() =>
                          formik.setFieldValue(
                            "highestEducation",
                            "graduate_degree"
                          )
                        }
                      />
                      <RadioCheck
                        htmlType="radio"
                        name="highestEducation"
                        label="Post-graduate degree"
                        id="post_graduate_degree"
                        value="post_graduate_degree"
                        onChange={() =>
                          formik.setFieldValue(
                            "highestEducation",
                            "post_graduate_degree"
                          )
                        }
                      />
                    </fieldset>
                    {formik.errors.highestEducation &&
                    formik.touched.highestEducation ? (
                      <div className="error">
                        {formik.errors.highestEducation}
                      </div>
                    ) : null}
                    <Form.Group controlId="idealPosition">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Highest degree (e.g. B. Com, B.A., MBA, CA, CFA, none
                          etc.) *
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="Degree"
                        as="textarea"
                        // name="highestDegree"
                        rows={1}
                        className="lip-textarea"
                        {...formik.getFieldProps("highestDegree")}
                      />
                    </Form.Group>
                    {formik.errors.highestDegree &&
                    formik.touched.highestDegree ? (
                      <div className="error">{formik.errors.highestDegree}</div>
                    ) : null}
                    <Form.Group controlId="major">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Academic concentration/major (e.g. Computer Science,
                          Mechanical Engineering, none etc.)
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="Major"
                        as="textarea"
                        // name="major"
                        rows={1}
                        className="lip-textarea"
                        {...formik.getFieldProps("major")}
                      />
                    </Form.Group>
                    <Form.Group controlId="workExperience">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Relevant work experience
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="Work experience"
                        as="textarea"
                        // name="workExperience"
                        rows={1}
                        className="lip-textarea"
                        {...formik.getFieldProps("workExperience")}
                      />
                    </Form.Group>
                    <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                      Select which of these disabilities do you closely
                      associate with? *
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
                    <Form.Group controlId="currentPlace">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Where are you currently based? *
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="City/State"
                        as="textarea"
                        // name="currentPlace"
                        rows={1}
                        className="lip-textarea"
                        {...formik.getFieldProps("currentPlace")}
                      />
                    </Form.Group>
                    {formik.errors.currentPlace &&
                    formik.touched.currentPlace ? (
                      <div className="error">{formik.errors.currentPlace}</div>
                    ) : null}
                    <fieldset>
                      <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                        Are you willing to relocate for the job if expected? *
                      </h3>
                      <RadioCheck
                        htmlType="radio"
                        name="canRelocate"
                        label="Yes"
                        id="yesRelocate"
                        value="true"
                        onChange={() =>
                          formik.setFieldValue("canRelocate", "true")
                        }
                      />
                      <RadioCheck
                        htmlType="radio"
                        name="canRelocate"
                        label="No"
                        id="noRelocate"
                        value="false"
                        onChange={() =>
                          formik.setFieldValue("canRelocate", "false")
                        }
                      />
                    </fieldset>
                    {formik.errors.canRelocate && formik.touched.canRelocate ? (
                      <div className="error">{formik.errors.canRelocate}</div>
                    ) : null}
                    <Form.Group controlId="linkedIn">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Link to your LinkedIn profile if available
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="Link"
                        as="textarea"
                        // name="linkedIn"
                        rows={1}
                        className="lip-textarea"
                        {...formik.getFieldProps("linkedIn")}
                      />
                    </Form.Group>
                    <Form.Group controlId="portfolioLink">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Link to your portfolio if available
                        </h3>
                      </Form.Label>
                      <Form.Control
                        placeholder="Link"
                        as="textarea"
                        // name="portfolioLink"
                        rows={1}
                        className="lip-textarea"
                        {...formik.getFieldProps("portfolioLink")}
                      />
                    </Form.Group>
                    <div tabIndex={-1} ref={fileFocus}>
                      <label htmlFor="resumeElement">
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                          Upload your latest resume *
                        </h3>
                      </label>
                    </div>
                    Supported Input Formats: .pdf and .doc. Max filesize limit -
                    10 mb
                    <div className="lip-form-buttton" aria-required="true">
                      <Upload
                        type="community"
                        label="Upload Resume"
                        size={10}
                        accept=".pdf,.doc"
                        required
                      />
                    </div>
                    <fieldset>
                      <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                        Do you need help improving your resume or developing a
                        career plan? *
                      </h3>
                      <p className="lip-note">
                        Note that indicating "yes" does not guarantee a session
                        with a job coach which is solely contingent on their
                        availability.
                      </p>
                      <RadioCheck
                        htmlType="radio"
                        name="needCareerHelp"
                        label="Yes"
                        id="yesCareerHelp"
                        value="true"
                        onChange={() =>
                          formik.setFieldValue("needCareerHelp", "true")
                        }
                      />
                      <RadioCheck
                        htmlType="radio"
                        name="needCareerHelp"
                        label="No"
                        id="noCareerHelp"
                        value="false"
                        onChange={() =>
                          formik.setFieldValue("needCareerHelp", "false")
                        }
                      />
                    </fieldset>
                    {formik.errors.needCareerHelp &&
                    formik.touched.needCareerHelp ? (
                      <div className="error">
                        {formik.errors.needCareerHelp}
                      </div>
                    ) : null}
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

const mapStateToProps = (store: IStore) => {
  const { communityService, auth } = store;
  return {
    inputFileId: communityService.inputFileId,
    user: auth.user,
  };
};

const mapDispatchToProps = {
  GetDisabilities: CommunityActions.GetDisabilities,
  PostJobPreferences: CommunityActions.PostJobPreferences,
  GetIndustry: CommunityActions.GetIndustry,
  resetList: UploadActions.resetUploadList,
};
const Extended = connect(mapStateToProps, mapDispatchToProps)(JobPreferences);

export default PrivateRoute(Extended);
