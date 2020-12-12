import { BlueButton, GreenButton } from "@Components/HOC/Dashboard";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./style.scss";
import fileNames from "@Definitions/Constants/image";
import { STUDENTS, SETTINGS } from "@Definitions/Constants/universityRoutes";
const { ONBOARD_STUDENTS, ONBOARD_STAFF, CLOSE_ICON } = fileNames;

export const RecommendedActions = (props: any) => {
  var cardsCount = 2;
  const [hideSection, setHideSection] = useState(false);
  const closeTile = (event: any) => {
    if (cardsCount === 2) {
      event.target.parentElement.parentElement.hidden = "true";
      cardsCount--;
    } else {
      event.target.parentElement.parentElement.hidden = "true";
      setHideSection(true);
    }
  };
  return (
    <div hidden={hideSection}>
      <h2 className="font-semibold text-xl heading-color">
        RECOMMENDED ACTIONS
      </h2>
      <Row className="onboard-tiles">
        <Col style={{ marginTop: "1rem" }} sm={6}>
          <h3 className="font-semibold text-l heading-color">
            Get started by inviting your students to the I-Stem platform.
          </h3>
          <p>
            Or you can always go to Students &gt; INVITE STUDENTS / IMPORT
            STUDENTS to invite students.
          </p>
          <div className="onboard-button">
            <BlueButton href={STUDENTS}>ONBOARD STUDENTS</BlueButton>
          </div>
        </Col>
        <Col style={{ marginLeft: "8rem" }} sm={4}>
          <img
            className="w-full lip-img"
            src={ONBOARD_STUDENTS}
            alt="decorative"
            aria-hidden="true"
          />
        </Col>
        <div onClick={closeTile}>
          <img
            className="close-tiles"
            src={CLOSE_ICON}
            alt="Close tile"
            role="button"
          />
        </div>
      </Row>
      <Row className="onboard-tiles">
        <Col style={{ marginTop: "1rem" }} sm={6}>
          <h3 className="font-semibold text-l heading-color">
            Get started by inviting your staff to the I-Stem platform.
          </h3>
          <p>
            Or you can always go to Settings &gt; INVITE STAFF to invite staff.
          </p>
          <div className="onboard-button">
            <BlueButton href={SETTINGS}>ONBOARD STAFF</BlueButton>
          </div>
        </Col>
        <Col style={{ marginLeft: "8rem" }} sm={4}>
          <img
            className="w-full lip-img"
            src={ONBOARD_STAFF}
            alt="decorative"
            aria-hidden="true"
          />
        </Col>
        <div onClick={closeTile}>
          <img
            className="close-tiles"
            src={CLOSE_ICON}
            alt="Close tile"
            role="button"
          />
        </div>
      </Row>
    </div>
  );
};
