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
import { useAppAbility } from "src/Hooks/useAppAbility";
import { Button, Modal, Table } from "react-bootstrap";
import PrivateRoute from "@Pages/_privateRoute";
import { Menu, MenuButton, MenuItem, MenuList } from "@reach/menu-button";
import { MoreOutlined } from "@ant-design/icons";
import Upload from "@Components/Upload";
import { EscalationService } from "@Services/API/Escalations";
import {
  EscalationDetails,
  EscalationDetailsParams,
  EscalationsData,
} from "@Services/API/Escalations/IEscalationResponse";
import { GreenButton } from "@Components/HOC/Dashboard";
import Moment from "moment";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout";

const Escalations: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const [escalationData, setEscalationData] = useState<EscalationsData[]>([]);
  const [escalationDetails, setEscalationDetails] = useState<
    EscalationDetails
  >();
  const { userType, role } = props.user;
  const [showModel, setShowModel] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  useEffect(() => {
    initialFocus?.current?.focus();
    EscalationService.getEscalations().then(response => {
      setEscalationData(response?.data || []);
    });
  }, []);
  const ecalationModal = (id: string) => {
    EscalationService.getEscalationDetails({ params: { id } }).then(
      response => {
        setEscalationDetails(response.data);
        setShowModel(true);
      }
    );
  };

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
      } else {
        setShowModel(false);
      }
    });
  };

  const resolveEscalation = (escalationId: string | undefined) => {
    EscalationService.resolveEscalation({
      id: escalationId,
      inputFileLink: props.escalation.inputFileLink,
    }).then(response => {
      setShowModel(false);
    });
  };

  const rows = escalationData?.map((data: EscalationsData) => {
    return (
      <tr key={data.escalationId}>
        <td
          onClick={() => {
            ecalationModal(data.escalationId);
          }}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {data.documentName}
        </td>
        <td>
          {data.escalationForService === "afc"
            ? "Document Accessibility"
            : "Video Captioning"}
        </td>
        {data?.escalationForService === "afc" ? (
          <td>{data.pageRanges}</td>
        ) : (
          <td>{data.videoPortions}</td>
        )}
        <td>{Moment(data.escaltionDate).format("DD MMM, hh:mm a")}</td>
        <td>{data.resolverName === "" ? "Unassigned" : data.resolverName}</td>
      </tr>
    );
  });

  const checkResolver = (resolverId: string) => {
    if (props.user.id === resolverId) {
      return (
        <div className="display-flex">
          <div className="remediate-upload">
            <Upload
              type="escalation"
              size={20}
              accept=".srt, .txt, .html, .mp3, .docx"
              label="Remediated file"
              onUpload={(fileName: string) => {
                setShowResolve(true);
              }}
            />
          </div>
          {showResolve && (
            <div className="resolve-escalation">
              <GreenButton
                onClick={() =>
                  resolveEscalation(escalationDetails?.escalationId)
                }
              >
                Resolve
              </GreenButton>
            </div>
          )}
        </div>
      );
    }
    if (resolverId === "") {
      return (
        <GreenButton
          onClick={() => assignMe(escalationDetails?.escalationId || "")}
        >
          Assign to me
        </GreenButton>
      );
    }
    return <></>;
  };

  return (
    <Wrapper>
      <Head>
        <title>Escalations | I-Stem</title>
      </Head>
      <DashboardLayout role={role} hideBreadcrumb userType={userType}>
        <div className="lip-margin">
          <div tabIndex={-1} ref={initialFocus}>
            <h2 className="mt-8 lip-title">ESCALATIONS</h2>
          </div>
          <div className="">
            <Table style={{ marginTop: "1rem" }}>
              <thead>
                <tr style={{ borderTop: "hidden" }}>
                  <th>Document Name</th>
                  <th>For Service</th>
                  <th>Page ranges / Video portions</th>
                  <th>Escalated on</th>
                  <th>Assigned to</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </div>
        </div>
        <Modal show={showModel} onHide={() => setShowModel(false)} animation>
          <Modal.Header closeButton>
            <Modal.Title>
              <h3 className="lip-title">{escalationDetails?.documentName}</h3>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="escalation-modal">
            <Table />
            {escalationDetails?.escalationForService === "afc" ? (
              <tr>
                {" "}
                <th className="height-3rem">Page Ranges:</th>
                <td> {escalationDetails.pageRanges}</td>
              </tr>
            ) : (
              <tr>
                <th className="height-3rem">Video Portions:</th>
                <td> {escalationDetails?.videoPortions}</td>
              </tr>
            )}
            <tr>
              <th className="height-3rem">Source File: </th>
              <td>{button("Download", escalationDetails?.sourceFileUrl)}</td>
            </tr>
            <tr>
              <th className="height-3rem">Converted File: </th>
              <td>
                {button(
                  "Download",
                  escalationDetails?.aiServiceConvertedFileURL
                )}
              </td>
            </tr>
          </Modal.Body>
          <Modal.Footer>
            {checkResolver(escalationDetails?.resolverId || "")}
          </Modal.Footer>
        </Modal>
      </DashboardLayout>
    </Wrapper>
  );
};

const mapStateToProps = (store: IStore) => {
  const { escalation, auth } = store;
  return {
    user: auth?.user,
    escalation,
  };
};

export default PrivateRoute(connect(mapStateToProps, null)(Escalations));
