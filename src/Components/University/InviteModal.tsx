import { GreenButton } from "@Components/HOC/Dashboard";
import { Formik } from "formik";
import React from "react";
import { Form, Modal } from "react-bootstrap";
import * as Yup from "yup";

export const InviteModal: React.FC<Props> = props => {
  const { isOpen, toggleModal, children, formSubmit, invitationFor } = props;
  const initialValues = {
    emails: "",
  };
  const handleSubmit = (values: any) => {
    formSubmit(values);
  };
  return (
    <Modal show={isOpen} onHide={toggleModal} animation>
      <Modal.Header closeButton>
        <Modal.Title>
          <h3 className="lip-title">INVITE {invitationFor}</h3>
        </Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={Yup.object().shape({
          emails: Yup.string().required("Emails cannot be blank"),
        })}
      >
        {formik => (
          <Form onSubmit={formik.handleSubmit}>
            <Modal.Body>
              {children}
              <Form.Group controlId="emails">
                <Form.Control
                  className="stud-search-box email"
                  placeholder={`Enter ${invitationFor.toLowerCase()} email`}
                  {...formik.getFieldProps("emails")}
                />
              </Form.Group>
              {formik.errors.emails && formik.touched.emails ? (
                <div className="error">{formik.errors.emails}</div>
              ) : null}
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
  );
};

interface Props {
  isOpen: boolean;
  toggleModal: Function;
  formSubmit: (data: any) => void;
  invitationFor: string;
}
