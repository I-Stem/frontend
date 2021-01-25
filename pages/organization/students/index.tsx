import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { NextPage } from "next";
import Head from "next/head";
import debounce from "lodash.debounce";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore, ReduxNextPageContext } from "@Interfaces";
import { Wrapper } from "@Components";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout/index";
import { GreenButton, WhiteButton } from "@Components/HOC/Dashboard/CTAButtons";
import fileNames from "@Definitions/Constants/image";
import { Col, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import { Formik } from "formik";
import { UniversityPortal } from "@Services";
import PrivateRoute from "@Pages/_privateRoute";
import { UPLOAD_STUDENTS } from "@Definitions/Constants/universityRoutes";
import { StudentDetails } from "@Components/University/StuentDetails";
import { DialogMessageBox } from "@Components/Basic/Dialog";

const { STUDENTS } = fileNames;
const Students: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const [reachedEnd, setEnd] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [studentModal, setStudentModal] = useState(false);
  const [index, setIndex] = useState(0);
  const [studentData, setStudentData] = useState<StudentDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { userType, role, organizationCode } = props.user;
  const [messageBox, setMessageBox] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogHeading, setDialogHeading] = useState("");
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchResult, setSearchResult] = useState(false);
  const [searchString, setSearchString] = useState("");
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

  const pageNumbers = [];
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
          setDialogMessage("Invitations sent successfully to given emails");
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

  const initialValues: FormData = {
    emails: "",
  };
  for (let i = 1; i <= Math.ceil(totalStudents / 10); i++) {
    pageNumbers.push(i);
  }

  const handlePageNumber = (event: any) => {
    getStudentsData(Number(event.target.innerText), searchString);
    setCurrentPage(Number(event.target.innerText));
  };
  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <Pagination.Item
        key={number}
        value={number}
        onClick={handlePageNumber}
        active={currentPage === number}
      >
        {number}
      </Pagination.Item>
    );
  });
  const inviteStudents = (
    <Row className="justify-center">
      <Col sm={4}>
        <div className="mt-4">
          <WhiteButton href={UPLOAD_STUDENTS}>
            <span className="flex items-center">
              <span className="ml-2">IMPORT STUDENT DATA</span>
            </span>
          </WhiteButton>
        </div>
      </Col>
      <Col sm={4}>
        <div className="mt-4">
          <GreenButton onClick={() => setShowInvite(true)}>
            <span className="flex items-center">
              <span className="ml-2">INVITE STUDENTS</span>
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
          Please invite your students to the platform or import an already
          existing list with name and email address.
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

  return (
    <Wrapper>
      <Head>
        <title>Students | I-Stem</title>
      </Head>
      <DashboardLayout userType={userType} role={role} hideBreadcrumb>
        <Row className="stud-row">
          <Col sm={3}>
            <div ref={initialFocus} tabIndex={-1}>
              <h2 className="lip-title mt-4">STUDENTS</h2>
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
                  onKeyUp={handleSearchKeyUp}
                  onChange={event => setSearchString(event.target.value)}
                  value={searchString}
                />
              </Col>
              <Col sm={2} />
              <Col sm={3}>
                <div className="">
                  <WhiteButton>
                    <span className="flex items-center">
                      <span className="ml-2">SEARCH</span>
                    </span>
                  </WhiteButton>
                </div>
              </Col>
            </Row>
            {searchResult ? (
              <Row className="mt-3">
                <Col sm={9}>
                  <h4 className="lip-subtext font-semibold">Search results</h4>
                </Col>
                <Col>
                  <span
                    className="lip-subtext"
                    role="button"
                    onClick={() => {
                      setSearchString("");
                      setSearchResult(false);
                      getStudentsData(1, "");
                    }}
                  >
                    Clear
                  </span>
                </Col>
              </Row>
            ) : (
              <></>
            )}
            <Table style={{ marginTop: "1rem" }}>
              <thead>
                <tr style={{ borderTop: "hidden" }}>
                  <th>STUDENT NAME</th>
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
                ))}
              </tbody>
            </Table>
            <div className="lip-pagination">
              <Pagination>
                <Pagination.Prev
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage - 1 == 0}
                >
                  Previous
                </Pagination.Prev>
                {renderPageNumbers}
                <Pagination.Next
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={
                    currentPage + 1 > pageNumbers[pageNumbers.length - 1]
                  }
                >
                  Next
                </Pagination.Next>
              </Pagination>
            </div>
          </div>
        ) : (
          <div>{isNew}</div>
        )}
        <Modal show={showInvite} onHide={() => setShowInvite(false)} animation>
          <Modal.Header closeButton>
            <Modal.Title>
              <h3 className="lip-title">INVITE STUDENTS</h3>
            </Modal.Title>
          </Modal.Header>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {formik => (
              <Form onSubmit={formik.handleSubmit}>
                <Modal.Body>
                  Enter student email address or multiple addresses separated by
                  commas to invite. A link will be mailed to them to sign up.
                  <Form.Group controlId="emails">
                    <Form.Control
                      className="stud-search-box email"
                      placeholder="Enter student email"
                      {...formik.getFieldProps("emails")}
                    />
                  </Form.Group>
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
        <>
          {StudentDetails({
            showModal: studentModal,
            toggleModal,
            studentId: studentData[index]?.id,
            studentDetails: {
              name: studentData[index]?.name || "",
              email: studentData[index]?.email || "",
              roll: studentData[index]?.roll || "",
            },
          })}
          <DialogMessageBox
            showModal={messageBox}
            message={dialogMessage}
            heading={dialogHeading}
            toggleDialog={toggleMessageModal}
          />
        </>
      </DashboardLayout>
    </Wrapper>
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
export interface FormData {
  emails: string;
}

export interface StudentDetails {
  name: string;
  email: string;
  roll?: string;
  id: string;
  totalRequests: string;
  escalatedRequests: string;
}

interface UserRequestActivity {
  title: string;
  lastUpdatedAt: string;
  currentStatus: string;
}
