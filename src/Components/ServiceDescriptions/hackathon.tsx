import React from "react";
import { Col, Row } from "react-bootstrap";
import "./style.scss";
import fileNames from "@Definitions/Constants/image";
import Link from "next/link";

export const HackathonDescription = (props: any) => {
  const { HACKATHON_DESC } = fileNames;
  return (
    <Row>
      <Col>
        <p className="lip-subtext">
          This is the registration form for Inclusive Stem Hackathon 2021, a
          completely virtual 6-week hackathon starting February 15 and ending
          March 31. Once you complete this form, you will be sent a link to our
          private group for interacting with other participants, discussing your
          ideas and forming teams. Learn more about the hackathon{" "}
          <Link href="https://www.inclusivestem.org/hackathon.html">here</Link>{" "}
          . If you have any questions, feel free to reach us at
          info@inclusivestem.org.
        </p>
      </Col>
      <Col>
        <img aria-hidden="true" src={HACKATHON_DESC} />
      </Col>
    </Row>
  );
};
