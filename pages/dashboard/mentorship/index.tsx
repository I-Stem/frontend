import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { BlueButton } from "@Components/HOC/Dashboard/CTAButtons";
import { GreenButton } from "@Components/HOC/Dashboard";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { CommunityService } from "@Services";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import {
  DisabilitiesData,
  IStemServices,
  MentorshipData,
  MentorshipStatus,
  ReduxNextPageContext,
} from "@Interfaces";
import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import { CommunityActions } from "@Actions";
import {
  DASHBOARD_ROUTE,
  THANKYOU_MENTORSHIP,
} from "@Definitions/Constants/pageroutes";
import DropdownWrapper from "@Components/StemServices/DropdownComponent";
import { Formik, Form as FormikForm, FormikProps } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import RadioCheck from "@Components/HOC/Dashboard/RadioCheck";
import FormErrorFocus from "../../../src/Components/FormErrorFocus";
import PrivateRoute from "../../_privateRoute";

const Mentorship: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const router = useRouter();
  const [hasPreviousRequest, setHasPreviousRequest] = useState<boolean>(false);
  const [preFill, setPreFill] = useState<MentorshipData>();
  const initialFocus = useRef<HTMLDivElement>(null);

  const [disabilities, setDisabilities] = useState([] as DisabilitiesData[]);
  const [changeButtons, setChangeButtons] = useState<Boolean>();
  const [closeButtonDialog, setCloseButtonDialog] = useState(false);
  const [hideForm, setHideForm] = useState(false);
  const dialogFocus = useRef<HTMLDivElement>(null);
  const [industry, setIndustry] = useState<string | undefined>("");
  let mentorShipStatus = "";
  let menteeStatus: boolean;

  useEffect(() => {
    initialFocus.current?.focus();
    props.GetDisabilities().then((response: any) => {
      setDisabilities(response);
    });
    props.GetMentorship().then((response: any) => {
      console.log(`mentorship: ${JSON.stringify(response)}`);
      let isPWDValue = "";
      if (response) {
        if (response?.isPWD === true) isPWDValue = "true";
        else if (response?.isPWD === false) isPWDValue = "false";
        setPreFill({
          ...response,
          isPWD: isPWDValue,
        });
        setHasPreviousRequest(true);
        setChangeButtons(true);
      }
    });
  }, []);

  const onsubmit = (data: any) => {
    console.log("Form Data:", JSON.stringify(data));
    let _mentorshipStatus: MentorshipStatus[] = [];
    if (data.signupAs === "mentor" || data.signupAs === "both") {
      _mentorshipStatus = [{ status: "started", actionAt: new Date() }];
    }
    if (data.signupAs === "mentee" || data.signupAs === "both") {
      menteeStatus = false;
    }
    const formData = {
      ...data,
      cancelMenteeship: menteeStatus,
      connectOften: data.connectOften ? data.connectOften : undefined,
      industry: industry || preFill?.industry,
      mentorshipStatus: preFill?.mentorshipStatus?.length
        ? [...preFill.mentorshipStatus]
        : _mentorshipStatus,
    };
    CommunityService.postMentorship(formData)
      .then(result => {
        router.push({
          pathname: THANKYOU_MENTORSHIP,
          query: { signupAs: data.signupAs },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const submitData = (data: any) => {
    const formData = {
      ...data,
      cancelMenteeship: menteeStatus,
      connectOften: data.connectOften ? data.connectOften : undefined,
      industry: industry || preFill?.industry,
      mentorshipStatus:
        mentorShipStatus !== ""
          ? [
              ...preFill?.mentorshipStatus!,
              { status: mentorShipStatus, actionAt: new Date() },
            ]
          : [...preFill?.mentorshipStatus!],
    };
    console.log(formData);

    CommunityService.postMentorship(formData)
      .then(result => {
        router.push({
          pathname: THANKYOU_MENTORSHIP,
          query: { status: mentorShipStatus },
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handlePauseCancel = (name: string, type?: string) => {
    let signupAsStatus = preFill?.signupAs;
    if (name === "mentee") {
      menteeStatus = true;
    } else if (name === "mentor") {
      if (type === "pause") {
        mentorShipStatus = "paused";
      }
      if (type === "resume") {
        mentorShipStatus = "active";
      }
    } else if (name === "both") {
      if (type === "mentee") {
        menteeStatus = true;
        signupAsStatus = "mentor";
      }
      if (type === "pause") {
        mentorShipStatus = "paused";
      }
      if (type === "resume") {
        mentorShipStatus = "active";
      }
    }
    const formData: any = {};
    const keys = [
      "userId",
      "_id",
      "__v",
      "userId",
      "updatedAt",
      "createdAt",
      "id",
    ];
    if (preFill) {
      Object.keys(preFill).map((e: string) => {
        if (!keys.includes(e)) {
          formData[e] = preFill[(e as unknown) as keyof MentorshipData];
        }
      });
      submitData({
        ...formData,
        mentorshipId: preFill._id,
        signupAs: signupAsStatus,
      });
    }
  };
  const toggleButtons = (text: string, name: string, type?: string) => (
    <div className="header-buttons">
      <GreenButton onClick={() => handlePauseCancel(name, type)}>
        {text}
      </GreenButton>
    </div>
  );

  const showButtons = () => {
    let status: string = "";
    if (preFill?.mentorshipStatus) {
      if (preFill.mentorshipStatus[preFill.mentorshipStatus.length - 1])
        // eslint-disable-next-line prefer-destructuring
        status =
          preFill.mentorshipStatus[preFill.mentorshipStatus.length - 1].status;
      else status = "start";
    }
    if (preFill?.signupAs === "mentee") {
      if (preFill?.cancelMenteeship === true) {
        return <></>;
      }
      return toggleButtons("CANCEL MENTEE REQUEST", "mentee");
    }
    if (preFill?.signupAs === "mentor") {
      return toggleButtons(
        status === "paused" ? "RESUME MENTORSHIP" : "PAUSE MENTORSHIP",
        "mentor",
        status === "paused" ? "resume" : "pause"
      );
    }
    if (preFill?.signupAs === "both") {
      return (
        <div style={{ display: "flex", gap: "12px" }}>
          {preFill.cancelMenteeship === false ? (
            toggleButtons("CANCEL MENTEE REQUEST", "both", "mentee")
          ) : (
            <div />
          )}
          {toggleButtons(
            status === "paused" ? "RESUME MENTORSHIP" : "PAUSE MENTORSHIP",
            "both",
            status === "paused" ? "resume" : "pause"
          )}
        </div>
      );
    }
    if (preFill?.signupAs === "none") {
      return <></>;
    }
  };

  const handleCloseButton = () => {
    setCloseButtonDialog(!closeButtonDialog);
  };

  const closeDialog = (
    <Dialog
      open={closeButtonDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      role="dialog"
      PaperProps={{
        style: { backgroundColor: "#002852" },
      }}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <p
            ref={dialogFocus}
            className=" text-center  leading-7 font-medium text-white"
          >
            Are you sure you want to leave the page? Leaving this page will
            discard any unsaved changes.
          </p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <div style={{ width: "100%", display: "flex" }}>
          <GreenButton onClick={handleCloseButton} href={DASHBOARD_ROUTE}>
            Yes
          </GreenButton>
          <GreenButton onClick={handleCloseButton}>No</GreenButton>
        </div>
      </DialogActions>
    </Dialog>
  );

  const menteeSection = (formik: FormikProps<MentorshipFormFields>) => (
    <div>
      <h2 className="lip-title">MENTEE QUESTIONS</h2>
      <Form.Group controlId="learnSkillsElement">
        <Form.Label>
          <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
            What skill(s) would you like to learn and/or connect about? *
          </h3>
        </Form.Label>
        <Form.Control
          placeholder="Skills"
          as="textarea"
          rows={1}
          className="lip-textarea"
          {...formik.getFieldProps("learnSkills")}
        />
      </Form.Group>
      {formik.errors.learnSkills && formik.touched.learnSkills ? (
        <div className="error">{formik.errors.learnSkills}</div>
      ) : null}
      <Form.Group controlId="questionToMentorElement">
        <Form.Label>
          <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
            Do you have specific questions or discussion points for your mentor
            (e.g. I want help with my resume, I want help drafting a cover
            letter, what textbooks should I use to improve my skills in
            management, help with career progression etc.)
          </h3>
        </Form.Label>
        <Form.Control
          placeholder="Questions for Mentor"
          as="textarea"
          rows={1}
          className="lip-textarea"
          {...formik.getFieldProps("questionToMentor")}
        />
      </Form.Group>
      {formik.errors.questionToMentor && formik.touched.questionToMentor ? (
        <div className="error">{formik.errors.questionToMentor}</div>
      ) : null}
      <br />
      <Form.Group controlId="terms">
        <Form.Check
          label="By signing up as a mentee, I understand that I need help with the specific area indicated on this application within the next two weeks. I also agree that I will respect the mentor's time and will not reschedule or cancel unless absolutely necessary. If I miss or cancel meetings more than twice, I understand that I will lose access to this service."
          feedback="You must agree before submitting."
          className="space-bottom lip-checkbox"
          {...formik.getFieldProps("menteeAgreement")}
        />
      </Form.Group>
      {formik.errors.menteeAgreement && formik.touched.menteeAgreement ? (
        <div className="error">{formik.errors.menteeAgreement}</div>
      ) : null}
    </div>
  );
  const mentorSection = (formik: FormikProps<MentorshipFormFields>) => (
    <div>
      <h2 className="lip-title">MENTOR QUESTIONS</h2>

      <Form.Group controlId="mentorSkillsElement">
        <Form.Label>
          <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
            What skill(s) can you share with the mentee? *
          </h3>
        </Form.Label>
        <Form.Control
          placeholder="Skills"
          as="textarea"
          rows={1}
          className="lip-textarea"
          {...formik.getFieldProps("mentorSkills")}
        />
      </Form.Group>
      {formik.errors.mentorSkills && formik.touched.mentorSkills ? (
        <div className="error">{formik.errors.mentorSkills}</div>
      ) : null}
      <label htmlFor="connectOftenElement">
        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
          How often would you like to connect with a mentee? (For estimate 45
          minutes meeting) *
        </h3>
      </label>
      <fieldset>
        <RadioCheck
          htmlType="radio"
          name="connectOften"
          value="once_every_week"
          label="Once every week"
          id="once_every_week"
          onChange={() =>
            formik.setFieldValue("connectOften", "once_every_week")
          }
          checked={formik.values.connectOften === "once_every_week"}
        />
        <RadioCheck
          htmlType="radio"
          name="connectOften"
          value="once_every_other_week"
          label="Once every other week"
          id="once_every_other_week"
          onChange={() =>
            formik.setFieldValue("connectOften", "once_every_other_week")
          }
          checked={formik.values.connectOften === "once_every_other_week"}
        />
        <RadioCheck
          htmlType="radio"
          name="connectOften"
          value="once_every_month"
          label="Once every month"
          id="once_every_month"
          onChange={() =>
            formik.setFieldValue("connectOften", "once_every_month")
          }
          checked={formik.values.connectOften === "once_every_month"}
        />
        <RadioCheck
          htmlType="radio"
          name="connectOften"
          value="once_every_3_months"
          label="Once every 3 months"
          id="once_every_3_months"
          onChange={() =>
            formik.setFieldValue("connectOften", "once_every_3_months")
          }
          checked={formik.values.connectOften === "once_every_3_months"}
        />
      </fieldset>
      {formik.errors.connectOften && formik.touched.connectOften ? (
        <div className="error">{formik.errors.connectOften}</div>
      ) : null}
    </div>
  );

  const conditional = (formik: FormikProps<MentorshipFormFields>) => {
    if (formik.values.signupAs === "mentee") {
      return menteeSection(formik);
    }
    if (formik.values.signupAs === "mentor") {
      return mentorSection(formik);
    }
    if (formik.values.signupAs === "both") {
      return (
        <div>
          {menteeSection(formik)}
          {mentorSection(formik)}
        </div>
      );
    }
  };

  const initialValues: MentorshipFormFields = {
    industry: preFill?.industry || "",
    currentPosition: preFill?.currentPosition || "",
    isPWD: preFill?.isPWD || "",
    associatedDisabilities: preFill?.associatedDisabilities || [],
    signupAs: preFill?.signupAs || "",
    anythingElse: preFill?.anythingElse || "",
    connectOften: preFill?.connectOften || "",
    mentorSkills: preFill?.mentorSkills || "",
    learnSkills: preFill?.learnSkills || "",
    questionToMentor: preFill?.questionToMentor || "",
  };

  return (
    <Wrapper>
      <Head>
        <title>Mentorship | I-Stem</title>
      </Head>
      {closeDialog}
      <FormLayout form="mentorshipForm" hideFooter close={handleCloseButton}>
        <div className="lip-margin">
          <div tabIndex={-1} ref={initialFocus}>
            <h2 className="lip-title">MENTORSHIP</h2>
          </div>
          {hasPreviousRequest ? showButtons() : <></>}
          <p className="lip-subtext">
            Complete this form to sign up for a meeting with a mentor in the
            next two weeks, or as a mentor to share your knowledge, experience
            and skills with a mentee. Each meeting is typically 45 Mins. long.
            If you are a mentee, you can sign up for a match every other week.
            If you are a mentor, you only need to submit this once, and may
            update your response or pause mentorship temporarily using this
            page.
          </p>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              currentPosition: Yup.string().required(
                "Current Position is required"
              ),
              isPWD: Yup.string().required("Select the option"),
              associatedDisabilities: Yup.array()
                .required()
                .when("isPWD", {
                  is: "true",
                  then: schema => schema,
                  otherwise: Yup.array(),
                }),
              signupAs: Yup.string().required("Sign Up As required"),
              learnSkills: Yup.string().when("signupAs", {
                is: (value: string) =>
                  !(value === "mentee" || value === "both"),
                then: schema => schema,
                otherwise: Yup.string().required("Skills required"),
              }),
              questionToMentor: Yup.string(),
              menteeAgreement: Yup.boolean().when("signupAs", {
                is: (value: string) =>
                  !(value === "mentee" || value === "both"),
                then: schema => schema,
                otherwise: Yup.boolean().required("Agreement Required"),
              }),
              mentorSkills: Yup.string().when("signupAs", {
                is: (value: string) =>
                  !(value === "mentor" || value === "both"),
                then: schema => schema,
                otherwise: Yup.string().required("Mentor skills Required"),
              }),
              connectOften: Yup.string().when("signupAs", {
                is: (value: string) =>
                  !(value === "mentor" || value === "both"),
                then: schema => schema,
                otherwise: Yup.string().required("Choose one option"),
              }),
              anythingElse: Yup.string(),
            })}
            onSubmit={onsubmit}
          >
            {formik => (
              <Form
                id="mentorshipForm"
                aria-hidden={hideForm}
                onSubmit={formik.handleSubmit}
              >
                <label htmlFor="industryElement">
                  <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                    Industry you work/interested in? *
                  </h3>
                </label>
                <div className="lip-industry">
                  <DropdownWrapper
                    setSelectedOrTypedInputValue={setIndustry}
                    name="industry"
                    id="industryElement"
                    getDropdownListItems={props.GetIndustry}
                    initialDropdownValue={preFill?.industry}
                    required
                  />
                </div>
                <Form.Group controlId="currentPositionElement">
                  <Form.Label>
                    <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                      What is your current job position? (e.g. student at IIT
                      Delhi, software engineer at Intel, Secretary in Ministry
                      of Health etc.) *
                    </h3>
                  </Form.Label>
                  <Form.Control
                    placeholder="Current Job Position"
                    as="textarea"
                    rows={1}
                    className="lip-textarea"
                    {...formik.getFieldProps("currentPosition")}
                  />
                </Form.Group>
                {formik.errors.currentPosition &&
                formik.touched.currentPosition ? (
                  <div className="error">{formik.errors.currentPosition}</div>
                ) : null}
                <br />
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
                    checked={formik.values.isPWD === "true"}
                  />
                  <RadioCheck
                    htmlType="radio"
                    name="isPWD"
                    value="false"
                    label="No"
                    id="no"
                    onChange={() => formik.setFieldValue("isPWD", "false")}
                    checked={formik.values.isPWD === "false"}
                  />
                </fieldset>
                {formik.errors.isPWD && formik.touched.isPWD ? (
                  <div className="error">{formik.errors.isPWD}</div>
                ) : null}
                {formik.values.isPWD === "true" ? (
                  <div>
                    <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                      What is the nature of your disability? *
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
                              defaultChecked={preFill?.associatedDisabilities?.includes(
                                data.name
                              )}
                              value={data.name}
                              key={`${i}`}
                              name="associatedDisabilities"
                              onChange={() =>
                                formik.setFieldValue("associatedDisabilities", [
                                  ...formik.values?.associatedDisabilities!,
                                  data.name,
                                ])
                              }
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

                <label htmlFor="signUpAsElement">
                  <h3 className="lip-subtext lip-label font-semibold text-xl leading-9">
                    What would you like to signup as? *
                  </h3>
                </label>
                <label>
                  Please note: If you would like to sign up as a mentee, but do
                  not have a question in the next two weeks, please don't sign
                  up right now. Only sign up if you would like to connect with a
                  community member for support in the next two weeks.
                </label>
                <fieldset>
                  <RadioCheck
                    htmlType="radio"
                    name="signupAs"
                    value="mentee"
                    label="Mentee"
                    id="mentee"
                    onChange={() => formik.setFieldValue("signupAs", "mentee")}
                    checked={formik.values.signupAs === "mentee"}
                  />
                  <RadioCheck
                    htmlType="radio"
                    name="signupAs"
                    value="mentor"
                    label="Mentor"
                    id="mentor"
                    onChange={() => formik.setFieldValue("signupAs", "mentor")}
                    checked={formik.values.signupAs === "mentor"}
                  />
                  <RadioCheck
                    htmlType="radio"
                    name="signupAs"
                    value="both"
                    label="Both"
                    id="both"
                    onChange={() => formik.setFieldValue("signupAs", "both")}
                    checked={formik.values.signupAs === "both"}
                  />
                </fieldset>
                {formik.errors.signupAs && formik.touched.signupAs ? (
                  <div className="error">{formik.errors.signupAs}</div>
                ) : null}
                {conditional(formik)}
                <Form.Group controlId="anythingElseElement">
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
                {formik.errors.anythingElse && formik.touched.anythingElse ? (
                  <div className="error">{formik.errors.anythingElse}</div>
                ) : null}
                <br />
                {changeButtons ? (
                  <div className="display-flex lip-submit">
                    <BlueButton htmlType="submit">UPDATE CHANGES</BlueButton>
                  </div>
                ) : (
                  <div className="lip-submit">
                    <BlueButton htmlType="submit">
                      SUBMIT APPLICATION
                    </BlueButton>
                  </div>
                )}
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
      </FormLayout>
    </Wrapper>
  );
};

Mentorship.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IStemServices.InitialProps> => {
  const { user, token } = ctx.store.getState().auth;

  return { namespacesRequired: ["common"], token, user };
};

const mapDispatchToProps = {
  GetDisabilities: CommunityActions.GetDisabilities,
  GetIndustry: CommunityActions.GetIndustry,
  GetSkills: CommunityActions.GetSkills,
  GetMentorship: CommunityActions.GetMentorship,
};
const Extended = connect(null, mapDispatchToProps)(Mentorship);

export default PrivateRoute(Extended);

export interface MentorshipFormFields extends Partial<MentorshipData> {
  industry: string;
  currentPosition: string;
  isPWD: string;
  signupAs: string;
  anythingElse: string;
  connectOften: string;
  mentorSkills: string;
  learnSkills: string;
  questionToMentor: string;
}
