import React from "react";
import { Col, Row } from "react-bootstrap";
import "./style.scss";
import fileNames from "@Definitions/Constants/image";

export const JobOpportunitiesDescription = (props: any) => {
  const { JOB_DESC } = fileNames;
  return (
    <Row>
      <Col>
        <p>
          This service helps people with disabilities to submit their resumes
          and credentials for being considered for internship and full-time
          opportunities with our corporate partners.
        </p>

        <p>
          Please be as thorough as possible when completing the job
          opportunities form.
        </p>
        <p>
          Make sure that your resume is professional, grammatically correct and
          well-formatted.
        </p>
        <p>
          If you would like help with your resume or portfolio, please check the
          option at the end of the form to request such assistance. Note that
          I-Stem cannot guarantee this assistance and is totally contingent on
          the availability of a suitable mentor/job coach.
        </p>
        <p>
          Once you complete this form, I-Stem will share your details with our
          corporate partners who will reach out to you should there be a match.
        </p>
        <p>
          Know that completing this form does not guarantee any job whatsoever.
        </p>
      </Col>
      <Col>
        <img aria-hidden="true" src={JOB_DESC} />
      </Col>
    </Row>
  );
};
