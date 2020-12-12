import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useRouter } from "next/router";

import { GreenButton } from "../../HOC/Dashboard/CTAButtons/GreenButton";

export const DialogMessageBox: React.FC<DialogMessageProps> = (
  props: DialogMessageProps
) => {
  const { showModal, message, heading, toggleDialog, route } = props;
  const [open, setOpen] = useState(showModal);
  const router = useRouter();
  useEffect(() => {
    setOpen(showModal);
  }, [showModal]);
  const handleClose = () => {
    toggleDialog();
    if (route !== undefined) {
      router.push(route);
    }
  };
  return (
    <Modal show={open} onHide={toggleDialog}>
      <Modal.Header closeButton>
        <Modal.Title>{heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <div style={{ width: "40%" }}>
          <GreenButton htmlType="button" onClick={handleClose}>
            <span className="flex items-center">
              <span className="ml-2">Close</span>
            </span>
          </GreenButton>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

interface DialogMessageProps {
  showModal: boolean;
  heading: string;
  message: string;
  toggleDialog: () => void;
  route?: string;
}
