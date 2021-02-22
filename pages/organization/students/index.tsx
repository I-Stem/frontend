import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { NextPage } from "next";
import Head from "next/head";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout/index";
import { GreenButton, WhiteButton } from "@Components/HOC/Dashboard/CTAButtons";
import fileNames from "@Definitions/Constants/image";
import { Col, Row, Table } from "react-bootstrap";
import { UniversityPortal } from "@Services";
import PrivateRoute from "@Pages/_privateRoute";
import { UPLOAD_STUDENTS } from "@Definitions/Constants/universityRoutes";
import { StudentDetails } from "@Components/University/StuentDetails";
import { DialogMessageBox } from "@Components/Basic/Dialog";
import { MetricsReportDialog } from "@Components/University/MetricsReport";
import { InviteModal } from "@Components/University/InviteModal";
import { getInvitationResponseMessage } from "@Services/helper/utils";
import { UserType } from "@Definitions/Constants";
import Pagination from "@Components/HOC/Pagination";
import Error from "next/error";
import { useAppAbility } from "src/Hooks/useAppAbility";

const { STUDENTS } = fileNames;
const Students: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [studentModal, setStudentModal] = useState(false);
  const [index, setIndex] = useState(0);
  const [studentData, setStudentData] = useState<StudentDetails[] | undefined>(
    undefined
  );
  const { can } = useAppAbility();
  const access = can("VIEW", "STUDENTS");
  const [currentPage, setCurrentPage] = useState(1);
  const { userType, role, organizationCode, escalationSetting } = props.user;
  const [messageBox, setMessageBox] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogHeading, setDialogHeading] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchResult, setSearchResult] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [metricsModal, setMetricsModal] = useState(false);
  const studentCount = (searchText: string) => {
    UniversityPortal.studentsCount({
      params: { searchString: searchText },
    }).then(e => {
      setTotalStudents(e.data.count);
      if (e.data.count > 0) {
        setShowTable(true);
      }
    });
  };

  const getStudentsData = (page: number, searchText: string) => {
    studentCount(searchText);
    UniversityPortal.studentsData({
      params: {
        limit: 10,
        offset: (page - 1) * 10,
        searchString: searchText,
      },
    }).then(e => {
      setStudentData(e.data.studentData);
    });
  };

  useEffect(() => {
    initialFocus.current?.focus();
    getStudentsData(1, "");
  }, []);

  const handleSubmit = (data: any) => {
    const emails = data.emails.split(",").map((email: any) => {
      return email.trim();
    });
    UniversityPortal.studentInvite({
      fullNames: [],
      emails,
      organization: organizationCode,
      rollNos: [],
      role: "STUDENT",
    })
      .then((results: any) => {
        if (results.code === 200) {
          setShowInvite(false);
          const message = getInvitationResponseMessage(
            results.data.newUsers,
            results.data.existingUsers
          );
          setDialogMessage(message);
          setDialogHeading("Invitation Success");
          setMessageBox(!messageBox);
        }
      })
      .catch((err: any) => {
        setShowInvite(false);
        setDialogMessage(
          "Error occurred while sending invitations through emails. Try Again!"
        );
        setDialogHeading("Invitation Failed");
        setMessageBox(!messageBox);
      });
  };
  const toggleMessageModal = () => {
    setMessageBox(!messageBox);
  };
  const toggleModal = () => {
    setStudentModal(!studentModal);
  };
  const handlePageNumber = (val: any) => {
    getStudentsData(Number(val), searchString);
    setCurrentPage(Number(val));
  };
  const inviteStudents = (
    <Row className="justify-center">
      <Col sm={4}>
        <div className="mt-4">
          <WhiteButton href={UPLOAD_STUDENTS}>
            <span className="flex items-center">
              <span className="ml-2">
                IMPORT{" "}
                {userType === UserType.BUSINESS ? "EMPLOYEES" : "STUDENTS"} DATA
              </span>
            </span>
          </WhiteButton>
        </div>
      </Col>
      <Col sm={4}>
        <div className="mt-4">
          <GreenButton onClick={() => setShowInvite(true)}>
            <span className="flex items-center">
              <span className="ml-2">
                INVITE{" "}
                {userType === UserType.BUSINESS ? "EMPLOYEES" : "STUDENTS"}{" "}
              </span>
            </span>
          </GreenButton>
        </div>
      </Col>
    </Row>
  );
  const isNew = (
    <Row className="w-full">
      <Col sm="12">
        <img className="stud-img" src={STUDENTS} alt="decorative" />
        <Row className="justify-center lip-subtext mt-4">
          Please invite your{" "}
          {userType === UserType.BUSINESS ? "employees" : "students"} to the
          platform or import an already existing list with name and email
          address.
        </Row>
        <div>
          <div>{inviteStudents}</div>
        </div>
      </Col>
    </Row>
  );

  const handleSearchKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      getStudentsData(1, searchString);
      if (event.currentTarget.value !== "") setSearchResult(true);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const rows = studentData?.map((student, ind) => (
    <tr>
      <td
        onClick={() => {
          setIndex(ind);
          toggleModal();
        }}
        style={{
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        {student.name}
      </td>
      <td>{student.email}</td>
      <td>{student.roll}</td>
      <td>{student.totalRequests}</td>
      <td>{student.escalatedRequests}</td>
    </tr>
  ));

  return access ? (
    <Wrapper>
      <Head>
        <title>
          {userType === UserType.BUSINESS ? "Employees" : "Students"} | I-Stem
        </title>
      </Head>
      <DashboardLayout
        userType={userType}
        role={role}
        escalationSetting={escalationSetting}
        hideBreadcrumb
      >
        <Row className="stud-row">
          <Col sm={3}>
            <div ref={initialFocus} tabIndex={-1}>
              <h2 className="lip-title mt-4">
                {userType === UserType.BUSINESS ? "EMPLOYEES" : "STUDENTS"}{" "}
              </h2>
            </div>
          </Col>
          {showTable ? <Col>{inviteStudents}</Col> : <></>}
        </Row>
        {showTable ? (
          <div className="stud-div">
            <Row>
              <Col sm={6}>
                <input
                  className="stud-search-box "
                  type="text"
                  placeholder="Search student name or roll no"
                />
              </Col>
              <Col sm={3} />
              <Col sm={3}>
                <div>
                  <WhiteButton
                    onClick={() => {
                      setMetricsModal(!metricsModal);
                    }}
                  >
                    <span className="flex items-center">
                      <span className="ml-2">GENERATE REPORT</span>
                    </span>
                  </WhiteButton>
                </div>
              </Col>
            </Row>
            <Table style={{ marginTop: "1rem" }} responsive="md">
              <thead>
                <tr style={{ borderTop: "hidden" }}>
                  <th>STUDENT NAME </th>
                  <th>EMAIL</th>
                  <th>ROLL NUMBER</th>
                  <th>TOTAL REQUESTS</th>
                  <th>ESCALATED REQUESTS</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((student, ind) => (
                  <tr>
                    <td
                      onClick={() => {
                        setIndex(ind);
                        toggleModal();
                      }}
                      style={{
                        textDecoration: "underline",
                      }}
                      className="pointer"
                    >
                      {student.name}
                    </td>
                    <td>{student.email}</td>
                    <td>{student.roll}</td>
                    <td>{student.totalRequests}</td>
                    <td>{student.escalatedRequests}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination
              currentPage={currentPage}
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              handlePageNumber={handlePageNumber}
              totalItems={totalStudents}
            />
          </div>
        ) : (
          <div>{isNew}</div>
        )}
        <>
          <InviteModal
            formSubmit={handleSubmit}
            isOpen={showInvite}
            toggleModal={() => setShowInvite(false)}
            invitationFor={
              userType === UserType.BUSINESS ? "EMPLOYEES" : "STUDENTS"
            }
          >
            Enter student email address or multiple addresses separated by
            commas to invite. A link will be mailed to them to sign up.
          </InviteModal>
          <StudentDetails
            showModal={studentModal}
            toggleModal={toggleModal}
            studentId={(studentData && studentData[index]?.id) || ""}
            studentDetails={{
              name: (studentData && studentData[index]?.name) || "",
              email: (studentData && studentData[index]?.email) || "",
              roll: (studentData && studentData[index]?.roll) || "",
            }}
          />
          <DialogMessageBox
            showModal={messageBox}
            message={dialogMessage}
            heading={dialogHeading}
            toggleDialog={toggleMessageModal}
          />
          <MetricsReportDialog
            showModal={metricsModal}
            toggleDialog={() => setMetricsModal(!metricsModal)}
          />
        </>
      </DashboardLayout>
    </Wrapper>
  ) : (
    <Error title="Page Not Found" statusCode={404} />
  );
};
const mapStateToProps = (store: IStore) => {
  const { auth } = store;
  return {
    user: auth.user,
  };
};

const Extended = connect(mapStateToProps, null)(Students);
export default PrivateRoute(Extended);

export interface StudentDetails {
  name: string;
  email: string;
  roll?: string;
  id: string;
  totalRequests: string;
  escalatedRequests: string;
}
