import React, { useState }  from "react";
import { connect } from "react-redux";
import { Button, Form, Input, Modal, Typography } from "antd";
import {Rating} from "@material-ui/lab";

import { AfcServiceActions, VcServiceActions } from "@Actions";

import { FeedbackModalProps } from "./StemServices";

const { Title } = Typography;
const { TextArea } = Input;

const FeedbackModal: React.FunctionComponent<FeedbackModalProps> = props => {
  const {
    showModal,
    closeAction,
    service,
    updateFunction,
    serviceType,
  } = props;
  const message =
    service?.review && service?.review?.text.length
      ? "Update review"
      : "Add review";

  const [rating, setRating] = useState<number | null>(null);

  function submitReview(values: any) {
    const payload = {
      review: values,
    };
    try {
      if (serviceType === "afc") {
        props.afcReview(service?.id, payload).then(() => {
          updateFunction("");
          closeAction();
        });
      } else if (serviceType === "vc") {
        props.vcReview(service?.id, payload).then(() => {
          updateFunction("");
          closeAction();
        });
      }
      return true;
    } catch (err) {
      return err;
    }
  }

  return (
    <Modal
      width="54em"
      visible={showModal || false}
      footer={null}
      onCancel={() => closeAction()}
      destroyOnClose
    >
      <Form
        name="feedbackForm"
        onFinish={submitReview}
        initialValues={{
          rating: service?.review?.rating,
          text: service?.review?.text,
        }}
      >
        <Title level={4}>{message}</Title>
        <Form.Item name="rating">
        <Rating name="simple-controlled" size="large" defaultValue={1} value={rating} onChange={(event, newRating) => setRating(newRating)} />
        </Form.Item>

        <div className="mt-2">
          <Form.Item
            rules={[{ required: true, message: "Please Enter review text" }]}
            name="text"
          >
            <TextArea rows={6} placeholder="Add a review about this service" />
          </Form.Item>
          <Form.Item>
            <Button
              className="mt-6"
              key="submit"
              type="primary"
              htmlType="submit"
            >
              <span className="px-12">{message}</span>
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

const mapDispatchToProps = {
  afcReview: AfcServiceActions.ReviewAfcService,
  vcReview: VcServiceActions.ReviewVcService,
};

export default connect(null, mapDispatchToProps)(FeedbackModal);
