import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Col, Form, Input, Modal, Row, Select, Typography } from "antd";
import "./style.scss";
import {
  IAfcServiceDocument,
  ICaptioningServiceDocument,
  IStore,
} from "@Interfaces";
import { WhiteButton } from "@Components/HOC/Dashboard/CTAButtons";
import {
  PER_MINUTE_COST,
  PER_PAGE_COST,
  STATUS_ESCALATED,
} from "@Definitions/Constants";
import { AfcServiceActions, CreditsActions, VcServiceActions } from "@Actions";
import { findPageCount } from "@Services/helper/utils";

import { ModalProps } from "./StemServices";

const { Text, Title } = Typography;
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const EscalateRequestModal: React.FunctionComponent<ModalProps> = ({
  ...props
}) => {
  const {
    showModal,
    service,
    secondaryAction,
    serviceType,
    updateFunction,
    credits,
  } = props;
  const [option, setOption] = useState("All");
  const [errorMsg, setErrorMsg] = useState("");
  const [earnCredits, setEarnCredits] = useState(false);
  const primaryButtonText = "Yes, Escalate";
  const secondaryButtonText = "Cancel";

  const videoLength = (service as ICaptioningServiceDocument)?.videoLength || 0;

  function submitEscalateRequest(values: any) {
    const payload = {
      status: STATUS_ESCALATED,
    };
    if (serviceType === "vc") {
      if ((videoLength / 60) * PER_MINUTE_COST < credits.totalCredits) {
        props
          .vcEscalate(service?.id, { ...payload, requestType: option })
          .then(() => {
            updateFunction("");
            secondaryAction(null);
          });
      } else {
        setEarnCredits(true);
      }

      return true;
    }
    const range =
      values.pages === "All"
        ? `1-${(service as IAfcServiceDocument)?.pageCount}`
        : values.range;
    const totalPages = findPageCount(range);
    const cost = PER_PAGE_COST * -1 * totalPages;

    try {
      if (cost > credits.totalCredits) {
        throw new Error(
          `You do not have enough credits in your account to escalate the request \nRequired Credits: ${cost} \nYour Credits: ${credits.totalCredits}`
        );
      } else if (cost < 0) {
        throw new Error(
          `Invalid Range Entered Please try to enter a proper range`
        );
      } else {
        try {
          props
            .afcEscalate(service?.id, { ...payload, escalatedPageRange: range })
            .then(() => {
              props.updateCredits({ cost });
              updateFunction("");
              secondaryAction(null);
            });
          return true;
        } catch (error) {
          return error;
        }
      }
    } catch (error) {
      setErrorMsg(error.message);
      return error;
    }
  }
  const optionSelected = (value: string) => {
    setOption(value);
  };

  return serviceType === "afc" ? (
    <Modal
      className="escalate-modal"
      visible={showModal || false}
      footer={null}
      width="28em"
      closable={false}
    >
      <div className="auth-form">
        <Form name="escalateForm" {...layout} onFinish={submitEscalateRequest}>
          <Title className="text-white" level={4}>
            Escalate request
          </Title>
          <Text className="text-white">
            {service?.documentName} ({" "}
            {(service as IAfcServiceDocument)?.pageCount} {"Page Document )"}
          </Text>
          <Form.Item
            rules={[{ required: true, message: "Please select an option" }]}
            label="Pages"
            name="pages"
          >
            <Select onSelect={optionSelected} placeholder="All / Custom">
              <Select.Option value="All">All</Select.Option>
              <Select.Option value="Custom">Custom</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Custom Page range"
            style={option !== "Custom" ? { display: "none" } : {}}
            name="range"
            rules={[
              {
                type: "regexp",
                pattern: new RegExp("[0-9]+-[0-9]+(?:,[0-9]+-[0-9]+)*"),
                message: "Please enter proper format like: 1-2",
              },
            ]}
          >
            <Input
              className="lip-button"
              placeholder="Custom range 1-5,8-10,10-15"
            />
          </Form.Item>
          <div className="p-4">
            <span className="escalate-error">{errorMsg}</span>
          </div>

          <Row gutter={12}>
            <Col span={12}>
              <Button
                className="lip-button"
                block
                type="primary"
                key="submit"
                htmlType="submit"
              >
                {primaryButtonText}
              </Button>
            </Col>
            <Col span={12}>
              <Button className="lip-button" block onClick={secondaryAction}>
                {secondaryButtonText}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  ) : (
    <Modal
      className="escalate-modal"
      visible={showModal || false}
      footer={null}
      width="28em"
      closable={false}
    >
      <div className="auth-form">
        <Form name="escalateForm" {...layout} onFinish={submitEscalateRequest}>
          <Title className="text-white" level={4}>
            Escalate request
          </Title>
          <Text className="text-white">
            {`${Math.ceil(videoLength / 60)} minute video`}
          </Text>
          <Form.Item
            rules={[{ required: true, message: "Please select an option" }]}
            label="What do you want to escalate"
            name="service"
          >
            <Select onSelect={optionSelected} placeholder="Select service">
              <Select.Option value="CAPTION">Caption</Select.Option>
              <Select.Option value="OCR">
                Text extraction from video images
              </Select.Option>
              <Select.Option value="OCR_CAPTION">Both</Select.Option>
            </Select>
          </Form.Item>
          <div className="text-center text-white mb-4 text-base leading-normal font-semibold">
            {`${Math.ceil(videoLength / 60) *
              PER_MINUTE_COST} credits will be used in escalating this ${Math.ceil(
              videoLength / 60
            )} minute video. Do you
            want to proceed with escalation?`}
          </div>
          <div className="p-4">
            <span className="escalate-error">{errorMsg}</span>
          </div>

          <Row gutter={12}>
            <Col span={12}>
              <Button
                className="lip-button"
                block
                type="primary"
                key="submit"
                htmlType="submit"
              >
                {primaryButtonText}
              </Button>
            </Col>
            <Col span={12}>
              <Button className="lip-button" block onClick={secondaryAction}>
                {secondaryButtonText}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

function mapStateToProps(store: IStore) {
  const { credits } = store;
  return {
    credits,
  };
}

const mapDispatchToProps = {
  afcEscalate: AfcServiceActions.EscalateAfcService,
  vcEscalate: VcServiceActions.EscalateVCService,
  updateCredits: CreditsActions.updateCredits,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EscalateRequestModal);
