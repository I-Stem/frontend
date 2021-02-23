import { BlueButton } from "@Components/HOC/Dashboard";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./style.scss";
import fileNames from "@Definitions/Constants/image";
import { STUDENTS, SETTINGS } from "@Definitions/Constants/universityRoutes";
import { UniversityPortal } from "@Services";
import { CardPreferences } from "@Interfaces";
import { UserType } from "@Definitions/Constants";

const { ONBOARD_STUDENTS, ONBOARD_STAFF, CLOSE_ICON } = fileNames;

export const RecommendedActions = (props: Props) => {
  const { cardPreferences, updatePreferences, userType } = props;
  const [staffCard, toggleStaffCard] = useState(
    cardPreferences?.showOnboardStaffCard
  );
  const [studentCard, toggleStudentCard] = useState(
    cardPreferences?.showOnboardStudentsCard
  );
  const closeTile = (cardType: string) => {
    if (cardType === "students") {
      toggleStudentCard(!studentCard);
      UniversityPortal.updateUserCardPreferences({
        showOnboardStudentsCard: false,
        showOnboardStaffCard: staffCard,
      });
      updatePreferences({
        showOnboardStaffCard: staffCard,
        showOnboardStudentsCard: false,
      });
    }
    if (cardType === "staffs") {
      toggleStaffCard(!staffCard);
      UniversityPortal.updateUserCardPreferences({
        showOnboardStaffCard: false,
        showOnboardStudentsCard: studentCard,
      });
      updatePreferences({
        showOnboardStaffCard: false,
        showOnboardStudentsCard: studentCard,
      });
    }
  };
  const onboardingUser = () => {
    if (userType === UserType.UNIVERSITY) {
      return "STUDENTS";
    }
    if (userType === UserType.BUSINESS) {
      return "EMPLOYEES";
    }
  };

  return (
    <div>
      {staffCard === true || studentCard === true ? (
        <h2 className="font-semibold text-xl heading-color">
          RECOMMENDED ACTIONS
        </h2>
      ) : (
        <></>
      )}

      {studentCard && (
        <Row className="onboard-tiles">
          <Col style={{ marginTop: "1rem" }} sm={6}>
            <h3 className="font-semibold text-l heading-color">
              Get started by inviting your{" "}
              {onboardingUser()?.toLocaleLowerCase()} to the I-Stem platform.
            </h3>
            <p>
              Or you can always go to{" "}
              {onboardingUser()
                ?.charAt(0)
                .concat(
                  onboardingUser()!
                    .substring(1)
                    .toLowerCase()
                )}{" "}
              &gt; INVITE {onboardingUser()} / IMPORT {onboardingUser()} to
              invite {onboardingUser()?.toLocaleLowerCase()}.
            </p>
            <div className="onboard-button">
              <BlueButton href={STUDENTS}>
                ONBOARD {onboardingUser()}
              </BlueButton>
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
          <div onClick={event => closeTile("students")}>
            <img
              className="close-tiles"
              src={CLOSE_ICON}
              alt="Close tile"
              role="button"
            />
          </div>
        </Row>
      )}
      {staffCard && (
        <Row className="onboard-tiles">
          <Col style={{ marginTop: "1rem" }} sm={6}>
            <h3 className="font-semibold text-l heading-color">
              Get started by inviting your staff to the I-Stem platform.
            </h3>
            <p>
              Or you can always go to Settings &gt; INVITE STAFF to invite
              staff.
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
          <div onClick={event => closeTile("staffs")}>
            <img
              className="close-tiles"
              src={CLOSE_ICON}
              alt="Close tile"
              role="button"
            />
          </div>
        </Row>
      )}
    </div>
  );
};

interface Props {
  cardPreferences: CardPreferences;
  updatePreferences: (preferences: CardPreferences) => void;
  userType: UserType;
}
