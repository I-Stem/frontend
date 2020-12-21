import React, { Fragment, useState } from "react";
import Moment from "moment";
import {Menu, MenuList, MenuButton, MenuItem, MenuItems, MenuPopover, MenuLink,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { Dropdown, Table } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import StatusTag from "@Components/StemServices/StatusTag";
import { IAfcServiceDocument, ICaptioningServiceDocument } from "@Interfaces";
import {
  PER_MINUTE_COST,
  PER_PAGE_COST,
  STATUS_COMPLETED,
} from "@Definitions/Constants";
import FeedbackModal from "./FeedbackModal";
import EscalateRequestModal from "./EscalateRequestModal";
import { TableProps } from "./StemServices";
import "./style.scss";

const escalationMessage: { [key: string]: string } = {
  afc: `${PER_PAGE_COST} credits per page`,
  vc: `${PER_MINUTE_COST} credits per minute`,
};

const RequestTable: React.FunctionComponent<TableProps> = props => {
  const { tableData, updateFunction, serviceType } = props;
  const mappedData =
    tableData &&
    (tableData as Array<IAfcServiceDocument | ICaptioningServiceDocument>)?.map(
      (document: IAfcServiceDocument | ICaptioningServiceDocument) => {
        const { tag, createdAt } = document;
        const date = createdAt
          ? Moment(createdAt).format("DD MMM, hh:mm a")
          : "";
        return {
          ...document,
          tagName: tag ? tag : "",
          date,
        };
      }
    );

  const [escalateModal, setEscalateModal] = useState<boolean>(false);
  const [reviewModal, setReviewModal] = useState<boolean>(false);
  const [selectedService, selectService] = useState<
    IAfcServiceDocument | ICaptioningServiceDocument | undefined
  >(undefined);

  
  const closeModal = (e: any) => {
    setEscalateModal(false);
    setReviewModal(false);
    return e;
  };
  const reviewService = (
    service: IAfcServiceDocument | ICaptioningServiceDocument
  ) => {
    setReviewModal(true);
        selectService(service);
  };
  const escalateService = (
    service: IAfcServiceDocument | ICaptioningServiceDocument
  ) => {
    selectService(service);
    setEscalateModal(true);
  };
  const kebabMenu = (
    service: IAfcServiceDocument | ICaptioningServiceDocument
  ) => {
    return (
        <MenuList>
          <MenuLink href={service.outputURL} key="DOWNLOAD">
              <span className="font-semibold">Download converted file</span>
          </MenuLink>
          <MenuItem onSelect={() => {reviewService(service)}} key="REVIEW">
            <span className="font-semibold">Add review</span>
          </MenuItem>
          <MenuItem onSelect={() => {escalateService(service)}} key="ESCALATE">
            <div className="font-semibold">Escalate request</div>
            <div className="">{escalationMessage[serviceType]}</div>
          </MenuItem>
        </MenuList>
    );
  };
  const columns: any = [
    {
      title: "Document name",
      dataIndex: "documentName",
      key: "documentName",
      width: "30%",
    },
    {
      title: "Tag",
      dataIndex: "tagName",
      key: "tagName",
      width: "25%",
    },
    {
      title: "Date-time",
      dataIndex: "date",
      key: "date",
      width: "20%",
    },
    {
      title: "Current status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "15%",
      render: (status: number) => {
        return (
          <Fragment>
            <StatusTag status={status} key={status} />
          </Fragment>
        );
      },
    },
    {
      key: "index",
      width: "10%",
      render: (index: IAfcServiceDocument | ICaptioningServiceDocument) => {
        if (index.status === STATUS_COMPLETED) {
          return (
            <Menu>
              <MenuButton><MoreOutlined /></MenuButton>
              {kebabMenu(index)}
            </Menu>
          );
        }
        return <Fragment />;
      },
    },
  ];

  return (
    <div>
      <Table
        rowKey="_id"
        pagination={false}
        columns={columns}
        dataSource={mappedData}
      />

      <FeedbackModal
        showModal={reviewModal}
        closeAction={closeModal}
        service={selectedService}
        updateFunction={updateFunction}
        serviceType={serviceType}
      />
      <EscalateRequestModal
        showModal={escalateModal}
        secondaryAction={closeModal}
        updateFunction={updateFunction}
        serviceType={serviceType}
        service={selectedService}
      />
    </div>
  );
};

export default RequestTable;
