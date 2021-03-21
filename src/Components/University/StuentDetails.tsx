import { GreenButton } from "@Components/HOC/Dashboard";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import "./style.scss";
import { UniversityPortal } from "@Services";
import * as Yup from "yup";
import Moment from "moment";

export const StudentDetails: React.FC<Props> = (props: Props) => {
  const { showModal, toggleModal, studentId, studentDetails } = props;
  const [studentModal, setStudentModal] = useState(showModal);
  const [requestAcivityData, setRequestActivityData] = useState<
    RequestActivity
  >();
  const [activityData, setActivityData] = useState<any[]>([]);
  const [activityOption, setActivityOption] = useState<number>(0);
  const [details, setDetails] = useState<any[]>([]);
  const [collapse, setCollapse] = useState<boolean[]>([]);
  useEffect(() => {
    setStudentModal(showModal);
  }, [showModal]);

  useEffect(() => {
    if (studentId)
      UniversityPortal.studentActivityData({ params: { studentId } }).then(
        e => {
          setRequestActivityData(e.data);
        }
      );
  }, [studentId]);

  const initialValues = {
    email: studentDetails.email,
    fullname: studentDetails.name,
    rollNumber: studentDetails.roll,
  };

  const activityList: Array<Record<string, number>> = [
    { "All activity": 1 },
    { "Escalated Requests": 2 },
    { "Active Requests": 3 },
    { "Completed Requests": 4 },
    { "Document accessibility requests": 5 },
    { "Video and audio accessibility requests": 6 },
  ];

  enum afcStatusEnum {
    REQUEST_INITIATED = "Student submitted a new document accessibility request.",
    OCR_FAILED = "Document conversion request failed.",
    FORMATTING_COMPLETED = "Student got the result file.",
    FORMATTING_FAILED = "Document conversion request failed.",
    ESCALATION_REQUESTED = "Student escalated the request.",
    ESCALATION_RESOLVED = "Escalation completed successfully.",
  }

  enum vcStatusEnum {
    INITIATED = "Student submitted a new video captioning request.",
    INDEXING_REQUEST_FAILED = "Video captioning conversion request failed.",
    INDEXING_SKIPPED = "Indexing Skipped for video captioning.",
    INDEXING_API_FAILED = "Video captioning conversion request failed.",
    COMPLETED = "Student got the result file.",
    ESCALATION_REQUESTED = "Student escalated the request.",
    ESCALATION_RESOLVED = "Escalation completed successfully.",
  }

  const currentStatusMapper = (status: string) => {
    if (status === "FORMATTING_COMPLETED" || status === "COMPLETED") {
      return "Completed";
    }
    if (status === "ESCALATION_REQUESTED" || status === "ESCALATION_RESOLVED") {
      return "Escalated";
    }
    return "Active";
  };

  const statusMapper = (status: string) => {
    if (status === "REQUEST_INITIATED") {
      return afcStatusEnum.REQUEST_INITIATED;
    }
    if (status === "OCR_FAILED") {
      return afcStatusEnum.OCR_FAILED;
    }
    if (status === "FORMATTING_COMPLETED") {
      return afcStatusEnum.FORMATTING_COMPLETED;
    }
    if (status === "FORMATTING_FAILED") {
      return afcStatusEnum.FORMATTING_FAILED;
    }
    if (status === "ESCALATION_REQUESTED") {
      return afcStatusEnum.ESCALATION_REQUESTED;
    }
    if (status === "ESCALATION_RESOLVED") {
      return afcStatusEnum.ESCALATION_RESOLVED;
    }
    if (status === "INITIATED") {
      return vcStatusEnum.INITIATED;
    }
    if (status === "INDEXING_REQUEST_FAILED") {
      return vcStatusEnum.INDEXING_REQUEST_FAILED;
    }
    if (status === "INDEXING_SKIPPED") {
      return vcStatusEnum.INDEXING_SKIPPED;
    }
    if (status === "INDEXING_API_FAILED") {
      return vcStatusEnum.INDEXING_API_FAILED;
    }
    if (status === "COMPLETED") {
      return vcStatusEnum.COMPLETED;
    }
  };

  const button = (text: string, link: string) => (
    <Button
      variant="primary"
      className="detail-button"
      href={link}
      style={{ marginTop: "10px" }}
    >
      {text}
    </Button>
  );

  const activityDropdown = () =>
    activityList.map((activity, index) => {
      return (
        <option className="csv-dropdown-item" key={index}>
          {Object.keys(activity)[0]}
        </option>
      );
    });

  const [key, setKey] = useState("activity");
  const handleSubmit = (data: any) => {
    UniversityPortal.updateStudentDetail({
      ...data,
      userId: studentId,
    })
      .then((e: any) => {
        console.log("Success");
        toggleModal();
      })
      .catch((e: any) => console.log("Error occured "));
  };
  const mapOptions = (set: number) => {
    if (set === 1) {
      const array = requestAcivityData?.afcActivity.concat(
        requestAcivityData?.vcActivity
      )!;
      const status: any[] = [];
      array.forEach(element => {
        status.push(element.statusLog);
      });
      setDetails(status);
      setActivityData(array);
      const collapseDetail: any[] = new Array(status.length);
      collapseDetail.fill(false);
      setCollapse(collapseDetail);
    } else if (set === 2) {
      const array = requestAcivityData?.afcEscalatedActivity.concat(
        requestAcivityData?.vcEscalatedActivity
      )!;
      const status: any[] = [];
      array.forEach(element => {
        status.push(element.statusLog);
      });
      setActivityData(array);
      setDetails(status);
      const collapseDetail: any[] = new Array(status.length);
      collapseDetail.fill(false);
      setCollapse(collapseDetail);
    } else if (set === 3) {
      const array = requestAcivityData?.afcActiveActivity.concat(
        requestAcivityData?.vcActiveActivity
      )!;
      const status: any[] = [];
      array.forEach(element => {
        status.push(element.statusLog);
      });
      setActivityData(array);
      setDetails(status);
      const collapseDetail: any[] = new Array(status.length);
      collapseDetail.fill(false);
      setCollapse(collapseDetail);
    } else if (set === 4) {
      const array = requestAcivityData?.afcCompletedActivity.concat(
        requestAcivityData?.vcCompletedActivity
      )!;
      const status: any[] = [];
      array.forEach(element => {
        status.push(element.statusLog);
      });
      setActivityData(array);
      setDetails(status);
      const collapseDetail: any[] = new Array(status.length);
      collapseDetail.fill(false);
      setCollapse(collapseDetail);
    } else if (set === 5) {
      const array = requestAcivityData?.afcActivity!;
      const status: any[] = [];
      array.forEach(element => {
        status.push(element.statusLog);
      });
      setActivityData(array);
      setDetails(status);
      const collapseDetail: any[] = new Array(status.length);
      collapseDetail.fill(false);
      setCollapse(collapseDetail);
    } else {
      const array = requestAcivityData?.vcActivity!;
      const status: any[] = [];
      array.forEach(element => {
        status.push(element.statusLog);
      });
      setActivityData(array);
      setDetails(status);
      const collapseDetail: any[] = new Array(status.length);
      collapseDetail.fill(false);
      setCollapse(collapseDetail);
    }
  };

  const handleCollapse = (ind: number) => {
    const _collapse = [...collapse];
    _collapse[ind] = !_collapse[ind];
    setCollapse(_collapse);
  };
  return (
    <Modal
      show={studentModal}
      onHide={() => {
        toggleModal();
        setActivityData([]);
        setActivityOption(0);
      }}
      animation
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h3 className="lip-title text-uppercase mr-0">
            {studentDetails.name}
          </h3>
        </Modal.Title>
      </Modal.Header>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k: any) => setKey(k)}
      >
        <Tab
          eventKey="activity"
          title="Activity"
          css={{
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "24px",
            color: "#595959",
          }}
        >
          <Form.Group className="activity-dropdown" controlId="activity">
            <Form.Control
              className="stud-select"
              placeholder="Select csv column"
              as="select"
              onChange={e => {
                activityList.forEach(val => {
                  if (Object.keys(val)[0] === e.target.value) {
                    setActivityOption(Object.values(val)[0]);
                    mapOptions(Object.values(val)[0]);
                  }
                });
              }}
            >
              <option className="csv-dropdown-item" disabled>
                Select Activity
              </option>
              {activityDropdown()}
            </Form.Control>
          </Form.Group>

          <div className="activity-content">
            {activityData.map((activity: any, ind: number) => (
              <Card key={activity._id} style={{ marginBottom: "20px" }}>
                <Card.Body>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <Card.Title className="activity-text">
                        Document Name - {activity.documentName}
                      </Card.Title>
                      <Card.Text className="mb-0 activity-text">
                        Last updated -{" "}
                        {Moment(activity.updatedAt).format("D MMM YYYY")}
                        {", "}
                        {Moment(activity.updatedAt).format("h:mm A")}
                      </Card.Text>
                      <Card.Text className="mb-0 activity-text">
                        Current status - {currentStatusMapper(activity.status)}
                      </Card.Text>
                    </div>
                    <div>
                      <Button
                        variant="primary"
                        className="detail-button"
                        onClick={() => handleCollapse(ind)}
                      >
                        {collapse[ind] ? "HIDE DETAILS" : "VIEW DETAILS"}
                      </Button>
                    </div>
                  </div>
                </Card.Body>
                {collapse[ind] ? (
                  <div>
                    <hr className="show-detail-hr" />
                    {details[ind].map((elem: any) => {
                      return (
                        <>
                          {statusMapper(elem.status)?.length && (
                            <Card.Body>
                              <Row>
                                <Col sm={2}>
                                  <Card.Text className="mb-0 activity-text">
                                    {Moment(elem.actionAt).format("h:mm A")}
                                  </Card.Text>
                                  <Card.Text className="mb-0 activity-text">
                                    {Moment(elem.actionAt).format("D MMM YYYY")}
                                  </Card.Text>
                                </Col>
                                <Col sm={10}>
                                  <Card.Text className="activity-detail mb-0">
                                    {statusMapper(elem.status)}
                                  </Card.Text>
                                  {elem.status === "FORMATTING_COMPLETED" &&
                                    button(
                                      "DOWNLOAD RESULT FILE",
                                      activity.outputURL
                                    )}
                                  {elem.status === "REQUEST_INITIATED" &&
                                    button(
                                      "DOWNLOAD ORIGINAL FILE",
                                      activity.inputFileLink
                                    )}
                                  {elem.status === "COMPLETED" &&
                                    button(
                                      "DOWNLOAD RESULT FILE",
                                      activity.outputURL
                                    )}
                                  {elem.status === "INITIATED" &&
                                    button(
                                      "DOWNLOAD ORIGINAL FILE",
                                      activity.inputFileLink
                                    )}
                                </Col>
                              </Row>
                            </Card.Body>
                          )}
                        </>
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </Card>
            ))}
          </div>
        </Tab>
        <Tab eventKey="info" title="Info" className="tab-text">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              fullname: Yup.string().required("Name is required"),
              email: Yup.string().required("Email is required"),
              rollNumber: Yup.string(),
            })}
          >
            {formik => (
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId="nameElement">
                  <Form.Label className="student-detail-text">
                    Student name
                  </Form.Label>
                  <Form.Control
                    placeholder="Enter Email"
                    {...formik.getFieldProps("fullname")}
                  />
                </Form.Group>
                <Form.Group controlId="emailElement">
                  <Form.Label className="student-detail-text">
                    Student email
                  </Form.Label>
                  <Form.Control
                    placeholder="Enter Name"
                    {...formik.getFieldProps("email")}
                  />
                </Form.Group>
                <Form.Group controlId="rollNoElement">
                  <Form.Label className="student-detail-text">
                    Student roll no
                  </Form.Label>
                  <Form.Control
                    placeholder="Enter Roll no"
                    {...formik.getFieldProps("rollNumber")}
                  />
                </Form.Group>
                <div style={{ width: "40%" }}>
                  <GreenButton htmlType="submit">
                    <span className="flex items-center">
                      <span className="ml-2">SAVE CHANGES</span>
                    </span>
                  </GreenButton>
                </div>
              </Form>
            )}
          </Formik>
        </Tab>
      </Tabs>
    </Modal>
  );
};

interface Props {
  showModal: boolean;
  toggleModal: () => void;
  studentId: string;
  studentDetails: {
    name: string;
    email: string;
    roll: string;
  };
}

interface RequestActivity {
  afcActivity: any[];
  vcActivity: any[];
  vcEscalatedActivity: any[];
  vcCompletedActivity: any[];
  vcActiveActivity: any[];
  afcEscalatedActivity: any[];
  afcCompletedActivity: any[];
  afcActiveActivity: any[];
}
