import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { NextPage } from "next";
import Head from "next/head";
import debounce from "lodash.debounce";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { UniversityData } from "../../../src/Services/API/University/IUniversityResponse";
import { Wrapper } from "@Components";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout/index";
import { GreenButton } from "@Components/HOC/Dashboard/CTAButtons";
import { Col, Form, Modal, Row, Table } from "react-bootstrap";
import { Formik } from "formik";
import { UniversityPortal } from "@Services";
import PrivateRoute from "@Pages/_privateRoute";
import { RadioCheck } from "@Components/HOC/Dashboard/RadioCheck";
import router from "next/router";
import { DialogMessageBox } from "@Components/Basic/Dialog";

const Settings: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const [reachedEnd, setEnd] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showDomain, setShowDomain] = useState(false);
  const [universityData, setUniversityData] = useState<UniversityData>();
  const [messageBox, setMessageBox] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogHeading, setDialogHeading] = useState("");
  const { userType, role, organizationCode } = props.user;
  useEffect(() => {
    initialFocus.current?.focus();
    UniversityPortal.getUniversity().then((response: any) => {
      setUniversityData(response.data);
      if (response.data.domainAccess === "AUTO") {
        setShowDomain(true);
      }
    });
  }, []);

  const handleSubmit = (data: any) => {
    const emails = data.emails.split(",").map((email: any) => {
      return email.trim();
    });
    UniversityPortal.studentInvite({
      fullNames: [],
      emails,
      organization: organizationCode,
      rollNos: [],
      role: "STAFF",
    })
      .then((results: any) => {
        if (results.code === 200) {
          setShowInvite(false);
          setDialogMessage("Invitations sent successfully to given emails");
          setDialogHeading("Invitation Success");
          setMessageBox(!messageBox);
        }
      })
      .catch((err: any) => {
        setShowInvite(false);
        setDialogMessage(
          "Error occurred while sending invitations through emails. Try Again!"
        );
        setDialogHeading("Invitation Failed");
        setMessageBox(!messageBox);
      });
  };
  const toggleMessageModal = () => {
    setMessageBox(!messageBox);
  };

  const handleDomainSave = (data: any) => {
    UniversityPortal.saveSettings({
      code: universityData?.code,
      domainAccess: data.domainAccess,
      domain: data.domain,
      escalationHandledBy: data.escalationHandledBy,
    }).then((results: any) => {
      if (results.code == 200) {
        router.push("/dashboard");
      } else {
        console.log("Error", results.message);
      }
    });
  };
  window.onscroll = debounce(() => {
    if (reachedEnd) {
      return;
    }
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
    }
  }, 100);

  const initialValues: FormData = {
    emails: "",
    domainAccess: universityData?.domainAccess || "",
    escalationHandledBy: universityData?.escalationHandledBy || "",
    domain: universityData?.domain || "",
  };
  return (
    <Wrapper>
      <Head>
        <title>Settings | I-Stem</title>
      </Head>
      <DashboardLayout userType={userType} role={role} hideBreadcrumb={true}>
        <div className="">
          <Row className="stud-row">
            <Col sm={6}>
              <div ref={initialFocus} tabIndex={-1}>
                <h2 className="lip-title mt-4">SETTINGS</h2>
              </div>
            </Col>
            <Col sm={6}>
              <div className="mt-3 u-button">
                <GreenButton onClick={() => setShowInvite(true)}>
                  <span className="flex items-center">
                    <span className="ml-2">INVITE STAFF</span>
                  </span>
                </GreenButton>
              </div>
            </Col>
          </Row>
          <div className="settings-div">
            <Formik
              initialValues={initialValues}
              onSubmit={handleDomainSave}
              enableReinitialize
            >
              {formik => (
                <Form onSubmit={formik.handleSubmit}>
                  <fieldset className="mt-4">
                    <h3 className="lip-subtext lip-label font-semibold text-xl leading-9 settings-font">
                      Choose between automatically allowing students from
                      insititute domain or manually giving them access to the
                      platform.
                    </h3>
                    <RadioCheck
                      htmlType="radio"
                      name="domainAccess"
                      value="AUTO"
                      label="AUTO-ACCESS VIA DOMAIN NAME"
                      id="domainAccessElement"
                      onChange={() => {
                        formik.setFieldValue("domainAccess", "AUTO");
                        setShowDomain(true);
                      }}
                      checked={formik.values.domainAccess === "AUTO"}
                    />
                    <RadioCheck
                      htmlType="radio"
                      name="domainAccess"
                      value="MANUAL"
                      label="MANUAL ACCESS"
                      id="domainAccessElement"
                      onChange={() => {
                        formik.setFieldValue("domainAccess", "MANUAL");
                        setShowDomain(false);
                      }}
                      checked={formik.values.domainAccess === "MANUAL"}
                    />
                  </fieldset>
                  {showDomain ? (
                    <Form.Group controlId="domain">
                      <Form.Label>
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9 settings-font">
                          Domain name
                        </h3>
                      </Form.Label>
                      <Form.Control
                        className="stud-search-box email domain"
                        placeholder="Institute domain"
                        {...formik.getFieldProps("domain")}
                      />
                    </Form.Group>
                  ) : (
                    <></>
                  )}
                  <fieldset className="mt-4">
                    <h3 className="lip-subtext lip-label font-semibold text-xl leading-9 settings-font">
                      Escalation of document accessibility and video/audio
                      accessibility
                    </h3>
                    <RadioCheck
                      htmlType="radio"
                      name="escalationHandledBy"
                      value="INSTITUTE"
                      label="ESCALATION HANDLED BY INSTITUTE"
                      id="escalationHandledByElement"
                      onChange={() =>
                        formik.setFieldValue("escalationHandledBy", "INSTITUTE")
                      }
                      checked={
                        formik.values.escalationHandledBy === "INSTITUTE"
                      }
                    />
                    <RadioCheck
                      htmlType="radio"
                      name="escalationHandledBy"
                      value="I_STEM"
                      label="ESCALATION HANDLED BY I-STEM"
                      id="escalationHandledByElement"
                      onChange={() =>
                        formik.setFieldValue("escalationHandledBy", "I_STEM")
                      }
                      checked={formik.values.escalationHandledBy === "I_STEM"}
                    />
                  </fieldset>
                  <div className="mt-4" style={{ width: "45%" }}>
                    <GreenButton htmlType="submit">
                      <span className="flex items-center">
                        <span className="ml-2">SAVE</span>
                      </span>
                    </GreenButton>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <Modal
          show={showInvite}
          onHide={() => setShowInvite(false)}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h3 className="lip-title">INVITE STAFFS</h3>
            </Modal.Title>
          </Modal.Header>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {formik => (
              <Form onSubmit={formik.handleSubmit}>
                <Modal.Body>
                  Enter staff email address or multiple addresses separated by
                  commas to invite. A link will be mailed to them to sign up.
                  <Form.Group controlId="emails">
                    <Form.Control
                      className="stud-search-box email"
                      placeholder="Enter staff email"
                      {...formik.getFieldProps("emails")}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <div style={{ width: "40%" }}>
                    <GreenButton htmlType="submit">
                      <span className="flex items-center">
                        <span className="ml-2">SEND INVITE</span>
                      </span>
                    </GreenButton>
                  </div>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
        <DialogMessageBox
          showModal={messageBox}
          message={dialogMessage}
          heading={dialogHeading}
          toggleDialog={toggleMessageModal}
        />
      </DashboardLayout>
    </Wrapper>
  );
};
const mapStateToProps = (store: IStore) => {
  const { auth } = store;
  return {
    user: auth.user,
  };
};

const Extended = connect(mapStateToProps, null)(Settings);

export default PrivateRoute(Extended);
export interface FormData {
  domainAccess?: string;
  escalationHandledBy?: string;
  domain?: string;
  emails?: string;
}
