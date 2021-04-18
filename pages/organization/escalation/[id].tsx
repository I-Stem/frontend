import { Wrapper } from "@Components";
import { FormLayout, GreenButton } from "@Components/HOC/Dashboard";
import { IStemServices, IStore } from "@Interfaces";
import { EscalationService } from "@Services/API/Escalations";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { EscalationDetails } from "@Services/API/Escalations/IEscalationResponse";
import { ServiceType } from "@Definitions/Constants";
import { Button, Col, Row } from "react-bootstrap";
import Upload from "@Components/Upload";
import { connect } from "react-redux";
import PrivateRoute from "@Pages/_privateRoute";
import { UploadActions } from "@Actions";
import { UniversityPortalActions } from "src/Actions/UniversityActions";
import Moment from "moment";
import "../style.scss";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";
import { serviceTypeEnum } from "@Components/Upload/constants";
import { FileProcessAssociations } from "@Definitions/Constants/FileConstants";

const EscalationDetail: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [escalationDetails, setEscalationDetails] = useState<
    EscalationDetails | undefined
  >(undefined);
  const { can } = useAppAbility();
  const access: boolean = can("VIEW", "ESCALATIONS");
  const initialFocus = useRef<HTMLDivElement>(null);
  const { escalation, user } = props;
  const fetchEscalationDetails = () => {
    EscalationService.getEscalationDetails({
      params: { id: id as string },
    }).then(response => {
      setEscalationDetails(response.data);
    });
  };
  useEffect(() => {
    initialFocus.current?.focus();
    fetchEscalationDetails();
    props.resetList();
    props.resetEscalation();
  }, []);

  const button = (text: string, link: string | undefined) => (
    <Button
      variant="primary"
      className="detail-button"
      href={link}
      style={{ marginTop: "10px" }}
    >
      {text}
    </Button>
  );

  const assignMe = (escalationId: string) => {
    EscalationService.assignEscalation({ id: escalationId }).then(response => {
      if (response.error) {
        console.log("Error occured", response.error);
      }
    });
  };

  const resolveEscalation = (escalationId: string | undefined) => {
    EscalationService.resolveEscalation({
      id: escalationId,
      inputFileId: props.escalation.inputFileId,
    }).then(response => {
      router.back();
    });
  };

  const checkResolver = (resolverId: string) => {
    if (user.id === resolverId) {
      return (
        <Row>
          <Col md={4}>
            <Upload
              serviceType={serviceTypeEnum.escalation}
              type={escalationDetails?.escalationForService === "AFC" ? FileProcessAssociations.AFC_REMEDIATION : FileProcessAssociations.VC_REMEDIATION}
              size={20}
              label="Remediate escalation"
            />
          </Col>
          {escalation.inputFileId !== "" && (
            <Col md={4}>
              <GreenButton
                onClick={() =>
                  resolveEscalation(escalationDetails?.escalationId)
                }
              >
                Resolve
              </GreenButton>
            </Col>
          )}
        </Row>
      );
    }
    if (resolverId === "") {
      return (
        <Row>
          <Col md={4}>
            <GreenButton
              onClick={() => {
                assignMe(escalationDetails?.escalationId || "");
                router.reload();
              }}
            >
              Assign to me
            </GreenButton>
          </Col>
        </Row>
      );
    }
    return <></>;
  };

  return access ? (
    <Wrapper>
      <Head>
        <title>Escalation Detail | I-Stem</title>
      </Head>
      <FormLayout hideFooter>
        <div tabIndex={-1} ref={initialFocus}>
          <h2 className="mt-8 lip-title">ESCALATION DETAILS</h2>
        </div>
        <>
          {escalationDetails?.escalationId && (
            <table>
              <tr className="font-16">
                <th className="height-3rem">File Name: </th>
                <td>{escalationDetails?.documentName}</td>
              </tr>
              {escalationDetails?.escalationForService === ServiceType.AFC ? (
                <tr className="font-16">
                  <th className="height-3rem">Page Ranges: </th>
                  <td>{escalationDetails.pageRanges}</td>
                </tr>
              ) : (
                <tr className="font-16">
                  <th className="height-3rem">Video Portions: </th>
                  <td>{escalationDetails?.videoPortions}</td>
                </tr>
              )}
              <tr className="font-16">
                <th className="height-3rem">Source File: </th>
                <td>{button("Download", escalationDetails?.sourceFileUrl)}</td>
              </tr>
              {escalationDetails.escalationForService === "AFC" && (
                <tr className="font-16">
                  <th className="height-3rem">Doc File for Remediation: </th>
                  <td>
                    {button("Download", escalationDetails?.docOutputFileUrl)}
                  </td>
                </tr>
              )}
              {escalationDetails?.assignedTo ? (
                <tr className="font-16">
                  <th className="height-3rem">Assigned to: </th>
                  <td>{escalationDetails.assignedTo}</td>
                </tr>
              ) : (
                <></>
              )}
              {escalationDetails?.assignedOn ? (
                <tr className="font-16">
                  <th className="height-3rem">Assigned on: </th>
                  <td>
                    {Moment(escalationDetails.assignedOn).format(
                      "DD MMM, hh:mm a"
                    )}
                  </td>
                </tr>
              ) : (
                <></>
              )}
              {escalationDetails?.description ? (
                <>
                  <h5 style={{ fontSize: "16px", fontWeight: "bold" }}>
                    User Feedback:{" "}
                  </h5>
                  <p className="font-16">{escalationDetails?.description}</p>
                </>
              ) : (
                <></>
              )}
              {checkResolver(escalationDetails?.resolverId || "")}
            </table>
          )}
        </>
      </FormLayout>
    </Wrapper>
  ) : (
    <Error title="Page Not Found" statusCode={404} />
  );
};

const mapStateToProps = (store: IStore) => {
  const { escalation, auth } = store;
  return {
    user: auth?.user,
    escalation,
  };
};
const mapDispatchToProps = {
  resetList: UploadActions.resetUploadList,
  resetEscalation: UniversityPortalActions.ResetEscalation,
};
export default PrivateRoute(
  connect(mapStateToProps, mapDispatchToProps)(EscalationDetail)
);
