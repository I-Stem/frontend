import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Col, Input, Modal, Row, Select, Typography } from "antd";
import { Form, Table } from "react-bootstrap";
import * as Yup from "yup";
import "./style.scss";
import {
  IAfcServiceDocument,
  ICaptioningServiceDocument,
  IStore,
} from "@Interfaces";
import {
  PER_MINUTE_COST,
  PER_PAGE_COST,
  STATUS_ESCALATED,
} from "@Definitions/Constants";
import { AfcServiceActions, CreditsActions, VcServiceActions } from "@Actions";
import { findPageCount } from "@Services/helper/utils";

import { ModalProps } from "./StemServices";
import { Formik } from "formik";

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
          .vcEscalate(service?.id, {
            ...payload,
            requestType: option,
            description: values.description,
          })
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
            .afcEscalate(service?.id, {
              ...payload,
              escalatedPageRange: range,
              description: values.description,
            })
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
  const optionSelected = (event: any) => {
    if (event.target.name == "pages") setOption(event.target.value);
  };

  const initialValues = {
    pages: "",
    range: "",
    description: "",
  };
  const initialValuesVC = {
    service: "",
  };
  const rangeExp = RegExp("[0-9]+-[0-9]+(?:,[0-9]+-[0-9]+)*");

  return serviceType === "afc" ? (
    <Modal
      className="escalate-modal"
      visible={showModal || false}
      footer={null}
      width="28em"
      closable={false}
    >
      <div className="auth-form">
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            pages: Yup.string().required("Please select an option"),
            range: Yup.string().matches(
              rangeExp,
              "Please enter proper format like: 1-2"
            ),
            description: Yup.string(),
          })}
          onSubmit={submitEscalateRequest}
        >
          {formik => (
            <Form
              onChange={optionSelected}
              name="escalateForm"
              {...layout}
              onSubmit={formik.handleSubmit}
              id="escalationForm"
            >
              <Title className="text-white" level={4}>
                Escalate request
              </Title>
              <Text className="text-white">
                {service?.documentName} ({" "}
                {(service as IAfcServiceDocument)?.pageCount}{" "}
                {"Page Document )"}
              </Text>

              <Form.Group className="mt-3" controlId="pages">
                <Form.Label>
                  <h3 className="text-white">Pages</h3>
                </Form.Label>
                <Form.Control
                  className="lip-button"
                  as="select"
                  value="none"
                  {...formik.getFieldProps("pages")}
                >
                  <option value="none" hidden>
                    All/Custom
                  </option>
                  <option value="All">All</option>
                  <option value="Custom">Custom</option>
                </Form.Control>
              </Form.Group>
              {formik.errors.pages && formik.touched.pages ? (
                <div className="error">{formik.errors.pages}</div>
              ) : null}
              {option === "Custom" ? (
                <>
                  <Form.Group
                    controlId="range"
                    style={option !== "Custom" ? { display: "none" } : {}}
                  >
                    <Form.Label>
                      <h3 className="text-white">Custom Page range</h3>
                    </Form.Label>
                    <Form.Control
                      className="lip-button"
                      placeholder="Custom range 1-5,8-10,10-15"
                      {...formik.getFieldProps("range")}
                    />
                  </Form.Group>

                  {formik.errors.range && formik.touched.range ? (
                    <div className="error">{formik.errors.range}</div>
                  ) : null}
                </>
              ) : (
                <></>
              )}
              <Form.Group controlId="description">
                <Form.Label>
                  <h3 className="text-white">Escalation description</h3>
                </Form.Label>
                <Form.Control
                  className="lip-button"
                  placeholder="Where did the service go wrong?"
                  {...formik.getFieldProps("description")}
                />
              </Form.Group>
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
                    form="escalationForm"
                  >
                    {primaryButtonText}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    className="lip-button"
                    block
                    onClick={secondaryAction}
                  >
                    {secondaryButtonText}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
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
        <Formik
          initialValues={initialValuesVC}
          validationSchema={Yup.object().shape({
            service: Yup.string().required("Please select an option"),
          })}
          onSubmit={submitEscalateRequest}
        >
          {formik => (
            <Form
              name="escalateForm"
              {...layout}
              onSubmit={formik.handleSubmit}
            >
              <Title className="text-white" level={4}>
                Escalate request
              </Title>
              <Text className="text-white">
                {`${Math.ceil(videoLength / 60)} minute video`}
              </Text>

              <Form.Group className="mt-3" controlId="service">
                <Form.Label>
                  <h3 className="text-white">What do you want to escalate</h3>
                </Form.Label>
                <Form.Control
                  className="lip-button"
                  as="select"
                  defaultValue="none"
                  {...formik.getFieldProps("service")}
                >
                  <option value="none" hidden>
                    Select service
                  </option>
                  <option value="CAPTION">Caption</option>
                  <option value="OCR">Text extraction from video images</option>
                  <option value="OCR_CAPTION">Both</option>
                </Form.Control>
              </Form.Group>
              {formik.errors.service && formik.touched.service ? (
                <div className="error">{formik.errors.service}</div>
              ) : null}
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
                  <Button
                    className="lip-button"
                    block
                    onClick={secondaryAction}
                  >
                    {secondaryButtonText}
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
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
