import React from "react";
import { Col, Row } from "react-bootstrap";
import "./style.scss";
import fileNames from "@Definitions/Constants/image";

export const MentorshipDescription = (props: any) => {
  const { MENTORSHIP_DESC } = fileNames;
  return (
    <Row>
      <Col>
        <p>
          This service helps you connect with fellow community members to learn
          or offer your knowledge. You can sign up as mentee, mentor or both.
        </p>
        <h3 className="des-heading">FOR MENTEES</h3>
        <p>
          Mentorship cycles are two weeks. This means that once you submit a
          mentorship request, you cannot submit another one until two weeks end.
        </p>
        <p>
          Only sign up when you are ready to meet with a mentor for a specific
          query within the next two weeks of you submitting a request. In other
          words, you should be ready for a mentor call within the next two weeks
          of you submitting the form.
        </p>
        <p>
          When matched, mentors are only committing to interacting with you over
          one 45 Mins. call and any additional time they spend with you is
          totally at their discretion. If you require long-term mentorship,
          please indicate that in the form.
        </p>
        <p>
          Mentorship is a privilege and you are required to show respect for
          mentor's time and effort. Please be prepared with specific questions
          before a mentorship call. Please ensure to include I-Stem
          (info@inclusivestem.org) in all of your communication with the mentor
          to the extent possible. All communication as part of this service
          remains strictly confidential.
        </p>
        <p>
          You have 24 Hrs. after submission of your form to cancel your
          mentorship request. Cancelling your mentorship calls more than twice
          after 24 Hrs. of submitting the request will result in you being
          denied this service.
        </p>
        <h3 className="des-heading"> FOR MENTORS </h3>
        <p>
          Every mentorship request is a 45 Mins. call. You may choose to engage
          with the mentee beyond the 45 Mins. call, but that is totally at your
          discretion.
        </p>
        <p>
          Once you complete this form, your mentorship profile remains active in
          our system until you "pause" mentorship on the "mentorship" tab on the
          I-Stem portal.
        </p>
        <p>
          You can specify the cadence at which you are willing to mentor new
          mentees. Feel free to edit this at any time.
        </p>
        <p>
          When there is a match, the I-Stem team will introduce you with your
          mentee via an email. We recommend keeping the I-Stem team copied on
          all communication with the mentee to the extent possible so that we
          can provide any support as needed.
        </p>
        <p>
          It is totally okay to not have answers to every question that the
          mentee might have, especially questions around disability or
          accessibility in case you do not have any experience in the field.
          Please refer the mentee to the I-Stem team for any such questions.
        </p>
        <p>
          Thank you for considering to share your time and knowledge with our
          community. We hope you will find this to be a rewarding experience.
        </p>
      </Col>
      <Col>
        <img aria-hidden="true" src={MENTORSHIP_DESC} />
      </Col>
    </Row>
  );
};
