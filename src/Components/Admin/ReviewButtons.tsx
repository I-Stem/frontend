import React from "react";
import { Button } from "react-bootstrap";
import "./style.scss";

const ReviewButtons: React.FC<ReviewButtonsProps> = props => {
  const { acceptHandler, rejectHandler } = props;
  return (
    <div className="review-button">
      <Button
        variant="primary"
        className="detail-button"
        onClick={acceptHandler}
      >
        Approve Request
      </Button>
      <Button
        variant="primary"
        className="detail-button"
        onClick={rejectHandler}
      >
        Reject Request
      </Button>
    </div>
  );
};

export default ReviewButtons;

interface ReviewButtonsProps {
  acceptHandler: () => void;
  rejectHandler: () => void;
}
