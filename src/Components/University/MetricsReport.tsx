import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { GreenButton } from "@Components/HOC/Dashboard";
import { UniversityPortal } from "@Services";

export const MetricsReportDialog: React.FC<MetricsReportDialogProps> = (
  props: MetricsReportDialogProps
) => {
  const { showModal, toggleDialog } = props;
  const [open, setOpen] = useState(showModal);
  useEffect(() => {
    setOpen(showModal);
  }, [showModal]);
  const handleClose = () => {
    toggleDialog();
    UniversityPortal.emailStudentsReport();
  };
  return (
    <Modal show={open} onHide={toggleDialog} animation>
      <Modal.Header closeButton>
        <Modal.Title>Generate Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        A report for students metrics will be generated as CSV and send to your
        email.
      </Modal.Body>
      <Modal.Footer>
        <div style={{ width: "40%" }}>
          <GreenButton htmlType="button" onClick={handleClose}>
            <span className="flex items-center">
              <span className="ml-2">Send Email</span>
            </span>
          </GreenButton>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

interface MetricsReportDialogProps {
  showModal: boolean;
  toggleDialog: () => void;
}
