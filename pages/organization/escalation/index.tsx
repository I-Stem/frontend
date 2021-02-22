import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
import Error from "next/error";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import { Button, Form, Modal, Table } from "react-bootstrap";
import PrivateRoute from "@Pages/_privateRoute";
import Upload from "@Components/Upload";
import { EscalationService } from "@Services/API/Escalations";
import {
  EscalationDetails,
  EscalationsData,
} from "@Services/API/Escalations/IEscalationResponse";
import { GreenButton } from "@Components/HOC/Dashboard";
import Moment from "moment";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout";
import { UploadActions } from "@Actions";
import { useAppAbility } from "src/Hooks/useAppAbility";
import { EscalationStatus, ServiceType } from "@Definitions/Constants";
import Link from "next/link";

const Escalations: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  const { can } = useAppAbility();
  const access: boolean = can("VIEW", "ESCALATIONS");
  const initialFocus = useRef<HTMLDivElement>(null);
  const [escalationData, setEscalationData] = useState<
    EscalationsData[] | undefined
  >(undefined);
  const { userType, role, escalationSetting } = props.user;
  const [filters, setFilters] = useState<{ status: string; service: string }>({
    status: "ALL",
    service: "ALL",
  });
  const fetchEscalationData = () => {
    const { service, status } = filters;
    EscalationService.getEscalations({
      params: { status, service },
    }).then(response => {
      setEscalationData(response.data);
    });
  };
  useEffect(() => {
    initialFocus?.current?.focus();
  }, []);
  useEffect(() => {
    fetchEscalationData();
  }, [filters]);

  const rows = escalationData?.map((data: EscalationsData) => (
    <tr key={data.escalationId}>
      <td>
        <Link href={`/organization/escalation/${data.escalationId}`}>
          <a>{data.documentName}</a>
        </Link>
      </td>

      <td>
        {data.escalationForService === ServiceType.AFC
          ? "Document Accessibility"
          : "Video Captioning"}
      </td>
      {data?.escalationForService === ServiceType.AFC ? (
        <td>{data.pageRanges}</td>
      ) : (
        <td>{data.videoPortions}</td>
      )}
      <td>{Moment(data.escaltionDate).format("DD MMM, hh:mm a")}</td>
      <td>{data.resolverName === "" ? "Unassigned" : data.resolverName}</td>
      <td>{data.status?.replace(/[_]/, " ")}</td>
    </tr>
  ));

  const statusDropdown = () => {
    return (
      <Form.Group>
        <Form.Label>Status</Form.Label>
        <Form.Control
          as="select"
          onChange={event =>
            setFilters({ ...filters, status: event.target.value })
          }
        >
          <option value="ALL">All Status</option>
          <option value={EscalationStatus.UNASSIGNED}>Unassigned</option>
          <option value={EscalationStatus.INPROGRESS}>In Progress</option>
          <option value={EscalationStatus.RESOLVED}>Resolved</option>
        </Form.Control>
      </Form.Group>
    );
  };

  const serviceDropdown = () => {
    return (
      <Form.Group>
        <Form.Label>For Service</Form.Label>
        <Form.Control
          as="select"
          onChange={event =>
            setFilters({ ...filters, service: event.target.value })
          }
        >
          <option value="ALL">All Services</option>
          <option value={ServiceType.AFC}>Document Accessibility</option>
          <option value={ServiceType.VC}>Video Captioning</option>
        </Form.Control>
      </Form.Group>
    );
  };

  return (
    <Wrapper>
      {access ? (
        <>
          <Head>
            <title>Escalations | I-Stem</title>
          </Head>
          <DashboardLayout
            role={role}
            hideBreadcrumb
            userType={userType}
            escalationSetting={escalationSetting}
          >
            <div>
              <div tabIndex={-1} ref={initialFocus}>
                <h2 className="mt-8 lip-title">ESCALATIONS</h2>
              </div>
              <Table style={{ marginTop: "1rem" }} responsive="md">
                <thead>
                  <tr style={{ borderTop: "hidden" }}>
                    <th>Document Name</th>
                    <th style={{ paddingBottom: 0 }}>{serviceDropdown()}</th>
                    <th>Page ranges / Video portions</th>
                    <th>Escalated on</th>
                    <th>Assigned to</th>
                    <th style={{ paddingBottom: 0 }}>{statusDropdown()}</th>
                  </tr>
                </thead>
                {escalationData && <tbody>{rows}</tbody>}
              </Table>
            </div>
          </DashboardLayout>
        </>
      ) : (
        <Error title="Page Not Found" statusCode={404} />
      )}
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
