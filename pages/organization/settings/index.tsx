import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { NextPage } from "next";
import Head from "next/head";
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
import { InviteModal } from "@Components/University/InviteModal";
import { getInvitationResponseMessage } from "@Services/helper/utils";
import { UserType } from "@Definitions/Constants";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";
import { DASHBOARD_ROUTE } from "@Definitions/Constants/pageroutes";

const Settings: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showDomain, setShowDomain] = useState(false);
  const [universityData, setUniversityData] = useState<UniversityData>();
  const [messageBox, setMessageBox] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogHeading, setDialogHeading] = useState("");
  const [domainAccessStatus, setDomainAccessStatus] = useState("");
  const [remediatorInvite, setRemediatorInvite] = useState(false);
  const { userType, role, organizationCode, escalationSetting } = props.user;
  useEffect(() => {
    initialFocus.current?.focus();
    UniversityPortal.getUniversity().then((response: any) => {
      setUniversityData(response.data);
      if (response.data.domainAccess === "AUTO") {
        setShowDomain(true);
      }
      setDomainAccessStatus(response.data.domainAccessStatusLog.pop().status);
    });
  }, []);
  const { can } = useAppAbility();
  const access = can("VIEW", "SETTINGS");
  enum domainAccessStatusEnum {
    VERIFIED = "Verified",
    NOTVERIFIED = "Not verified(We will contact you on your mail to verify your domain name)",
    PENDING = "In-Progress",
    REJECTED = "Rejected",
  }

  const domainAccessStatusMapper = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return domainAccessStatusEnum.VERIFIED;
      case "NOT_VERIFIED":
        return domainAccessStatusEnum.NOTVERIFIED;
      case "PENDING":
        return domainAccessStatusEnum.PENDING;
      default:
        return domainAccessStatusEnum.REJECTED;
    }
  };

  const handleSubmit = (data: any) => {
    const emails = data.emails.split(",").map((email: any) => {
      return email.trim();
    });
    const userRole = remediatorInvite ? "REMEDIATOR" : "STAFF";
    UniversityPortal.studentInvite({
      fullNames: [],
      emails,
      organization: organizationCode,
      rollNos: [],
      role: userRole,
    })
      .then((results: any) => {
        if (results.code === 200) {
          if (userRole === "REMEDIATOR") setRemediatorInvite(false);
          else setShowInvite(false);
          const message = getInvitationResponseMessage(
            results.data.newUsers,
            results.data.existingUsers
          );
          setDialogMessage(message);
          setDialogHeading("Invitation Success");
          setMessageBox(!messageBox);
        }
      })
      .catch((err: any) => {
        if (userRole === "REMEDIATOR") setRemediatorInvite(false);
        else setShowInvite(false);
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
      if (results.code === 200) {
        router.push(DASHBOARD_ROUTE);
      } else {
        console.log("Error", results.message);
      }
    });
  };

  const initialValues: FormData = {
    emails: "",
    domainAccess: universityData?.domainAccess || "",
    escalationHandledBy: universityData?.escalationHandledBy || "",
    domain: universityData?.domain || "",
  };
  return access ? (
    <Wrapper>
      <Head>
        <title>Settings | I-Stem</title>
      </Head>
      <DashboardLayout
        userType={userType}
        role={role}
        escalationSetting={escalationSetting}
        hideBreadcrumb
      >
        <div className="">
          <Row className="stud-row">
            <Col sm={4}>
              <div ref={initialFocus} tabIndex={-1}>
                <h2 className="lip-title mt-4">SETTINGS</h2>
              </div>
            </Col>
            <Col sm={4}>
              <div className="mt-3">
                <GreenButton onClick={() => setShowInvite(true)}>
                  <span className="flex items-center">
                    <span className="ml-2">INVITE STAFFS</span>
                  </span>
                </GreenButton>
              </div>
            </Col>
            <Col sm={4}>
              <div className="mt-3">
                <GreenButton onClick={() => setRemediatorInvite(true)}>
                  <span className="flex items-center">
                    <span className="ml-2">INVITE REMEDIATORS</span>
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
                    <h3 className="lip-subtext lip-label font-semibold text-xl leading-9 ">
                      Choose between automatically allowing{" "}
                      {userType === UserType.BUSINESS
                        ? "employees"
                        : "students"}{" "}
                      from insititute domain or manually giving them access to
                      the platform.
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
                        <h3 className="lip-subtext lip-label font-semibold text-xl leading-9 ">
                          Domain name
                        </h3>
                      </Form.Label>
                      <Form.Control
                        className="stud-search-box email domain"
                        placeholder="Institute domain"
                        {...formik.getFieldProps("domain")}
                      />
                      <span className="font-16">
                        <b>Status: </b>
                        {domainAccessStatusMapper(domainAccessStatus)}
                      </span>
                    </Form.Group>
                  ) : (
                    <></>
                  )}
                  <fieldset className="mt-4">
                    <h3 className="lip-subtext lip-label font-semibold text-xl leading-9 ">
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
        <InviteModal
          formSubmit={handleSubmit}
          isOpen={showInvite}
          toggleModal={() => setShowInvite(false)}
          invitationFor="STAFFS"
        >
          Enter staff email address or multiple addresses separated by commas to
          invite. A link will be mailed to them to sign up.
        </InviteModal>
        <InviteModal
          formSubmit={handleSubmit}
          isOpen={remediatorInvite}
          toggleModal={() => setRemediatorInvite(false)}
          invitationFor="REMEDIATORS"
        >
          Enter remediator email address or multiple addresses separated by
          commas to invite. A link will be mailed to them to sign up.
        </InviteModal>
        <DialogMessageBox
          showModal={messageBox}
          message={dialogMessage}
          heading={dialogHeading}
          toggleDialog={toggleMessageModal}
        />
      </DashboardLayout>
    </Wrapper>
  ) : (
    <Error title="Page Not Found" statusCode={404} />
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
