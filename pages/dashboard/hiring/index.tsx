import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import { GreenButton } from "@Components/HOC/Dashboard";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
  Toast,
} from "react-bootstrap";
import Pagination from "@Components/HOC/Pagination";
import { CommunityActions } from "@Actions";
import { BusinessActions } from "src/Actions/Business";
import MultiSelectDropdownWrapper from "@Components/StemServices/MultiselectComponent";
import { HiringService } from "@Services/API/Hiring";
import { CandidatesData } from "@Services/API/Hiring/IHiringResponse";
import {
  CaretDownOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  CaretUpOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import PrivateRoute from "../../_privateRoute";
import { formatFilterName } from "@Services/helper/utils";
import { Formik } from "formik";
import fileNames from "@Definitions/Constants/image";
import { MessageBox } from "@Components/MessageBox";
import { CandidateStatus } from "@Definitions/Constants/HiringConstants";
const { MESSAGE_ICON, MESSAGE_CIRCLE } = fileNames;

const Hiring: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const { email, organizationCode, fullname, organizationName } = props.user;
  const initialFocus = useRef<HTMLDivElement>(null);
  const [industries, setIndustry] = useState<string[]>([]);
  const [disabilities, setDisabilities] = useState<string[]>([]);
  const [candidatesData, setCandidatesData] = useState<CandidatesData[]>();
  const [filters, setFilters] = useState<FormConstants>({});
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [requestCount, setRequestCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const last = currentPage * 10;
  const first = last - 10;
  const currentCandidates = candidatesData?.slice(first, last);
  const [showFilters, setShowFilters] = useState(false);
  const [ignoredAlert, setIgnoredAlert] = useState(false);
  const [actionToast, setActionToast] = useState("");
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState({
    id: "",
    name: "",
  });
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showCommentsList, setShowCommentsList] = useState(false);
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [status, setStatus] = useState("");

  const updateSelectedFilters = () => {
    setSelectedFilters(Object.keys({ ...filters }));
  };
  useEffect(() => {
    initialFocus?.current?.focus();
  }, []);
  useEffect(() => {
    getCandidates();
    updateSelectedFilters();
  }, [filters]);

  const getCandidates = () => {
    HiringService.getCandidates(
      { params: { status: status.toUpperCase() } },
      filters
    ).then(res => {
      setCandidatesData(res.data);
      setRequestCount(res.data.length);
    });
  };

  const handleRemoveFilter = (data: any) => {
    const allFilters = { ...filters };
    delete allFilters[(data as unknown) as keyof FormConstants];
    setFilters(allFilters);
  };

  const handleCandidate = (
    jobId: string,
    action: string,
    candidateName: string
  ) => {
    if (action === CandidateStatus.CONTACTED) {
      setShowInterestModal(true);
      setCurrentCandidate({ id: jobId, name: candidateName });
    } else if (action === CandidateStatus.COMMENTED) {
      setShowCommentModal(true);
      setCurrentCandidate({ id: jobId, name: candidateName });
    } else {
      setIgnoredAlert(true);
      setActionToast(action);
      HiringService.hiringAction({
        jobId,
        action,
      }).then(res => {
        console.log(res.message);
        getCandidates();
      });
    }
  };
  const handleIndustrySelect = (industry: string[]) => {
    if (industry.length > 0) {
      setFilters({ ...filters, industry });
    } else {
      handleRemoveFilter("industry");
    }
  };

  const handleDisabilitiesSelect = (disabilities: string[]) => {
    if (disabilities.length > 0) {
      setFilters({ ...filters, disabilities });
    } else {
      handleRemoveFilter("disabilities");
    }
  };
  const handleOnChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.FocusEvent<HTMLTextAreaElement>
  ) => {
    if (event.target.name === "status") {
      setStatus(event.target.value);
    }
    if (event.target.value.trim() !== "")
      setFilters({
        ...filters,
        [event.target.name]: event.target.value,
      });
  };

  const resetFilters = () => {
    setFilters({});
    setStatus("");
  };

  const emailInitialValues: EmailData = {
    cc: email,
    subject: `Connecting ${currentCandidate.name} and ${organizationName} for potential employment opportunity!!`,
    message:
      `Hello ${currentCandidate.name}` +
      "\n" +
      `Your profile has been shortlisted by ${fullname} from ${organizationName} for a potential employment opportunity. You could do a "reply all" to this thread with your time availability for further discussion. `,
  };
  const commentInitialValues: CommentData = {
    comment: "",
  };
  const handleEmailSubmit = (data: any) => {
    HiringService.contactCandidate({
      ...data,
      jobId: currentCandidate.id,
    }).then(res => {
      console.log(res.message);
      setShowInterestModal(false);
    });
    HiringService.hiringAction({
      ...data,
      action: CandidateStatus.CONTACTED,
      jobId: currentCandidate.id,
    }).then(res => {
      console.log(res.message);
      setShowCommentModal(false);
      getCandidates();
    });
  };
  const handleComment = (data: any) => {
    HiringService.hiringAction({
      ...data,
      action: CandidateStatus.COMMENTED,
      jobId: currentCandidate.id,
    }).then(res => {
      console.log(res.message);
      setShowCommentModal(false);
      getCandidates();
    });
  };

  const getCandidateComments = (jobId: string) => {
    HiringService.getComments({ jobId }).then(res => {
      setCommentsData(res.data);
    });
    setShowCommentsList(true);
  };

  const handlePageNumber = (val: any) => {
    setCurrentPage(Number(val));
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <Wrapper>
      <Head>
        <title>Hiring | I-Stem</title>
      </Head>
      <FormLayout form="hiring" hideFooter>
        <Row className="w-full">
          <Col sm={3} id="filters" className="filter-col">
            <div tabIndex={-1} ref={initialFocus}>
              <h2 className="mt-4 lip-subtext font-semibold">Filters</h2>
            </div>
            <div>
              {showFilters && (
                <Form.Group controlId="reset-button">
                  <Form.Control
                    className="reset-button lip-subtext"
                    as="button"
                    type="reset"
                    onClick={resetFilters}
                  >
                    Reset all filters
                  </Form.Control>
                </Form.Group>
              )}
              <Form.Group controlId="status">
                <Form.Label>
                  <h3 className="lip-subtext font-14">Status</h3>
                </Form.Label>
                <Form.Control
                  className="lip-button"
                  as="select"
                  onChange={handleOnChange}
                  name="status"
                >
                  <option
                    disabled
                    className="csv-dropdown-item"
                    selected={filters.status === undefined}
                  >
                    Select
                  </option>
                  <option
                    value={CandidateStatus.NEW}
                    className="csv-dropdown-item"
                    selected={filters.status === CandidateStatus.NEW}
                  >
                    New
                  </option>
                  <option
                    value={CandidateStatus.SHORTLISTED}
                    className="csv-dropdown-item"
                    selected={filters.status === CandidateStatus.SHORTLISTED}
                  >
                    Shortlisted
                  </option>
                  <option
                    value={CandidateStatus.COMMENTED}
                    className="csv-dropdown-item"
                    selected={filters.status === CandidateStatus.COMMENTED}
                  >
                    Commented
                  </option>
                  <option
                    value={CandidateStatus.CONTACTED}
                    className="csv-dropdown-item"
                    selected={filters.status === CandidateStatus.CONTACTED}
                  >
                    Contacted
                  </option>
                  <option
                    value={CandidateStatus.IGNORED}
                    className="csv-dropdown-item"
                    selected={filters.status === CandidateStatus.IGNORED}
                  >
                    Ignored
                  </option>
                </Form.Control>
              </Form.Group>
              <span
                role="button"
                className="show-filters"
                aria-expanded={showFilters}
                aria-controls="filters"
                aria-label="More filters"
                onClick={() => {
                  setShowFilters(!showFilters);
                  initialFocus?.current?.focus();
                }}
              >
                More filters{" "}
                {showFilters ? (
                  <CaretUpOutlined
                    aria-hidden="true"
                    style={{ verticalAlign: "0em" }}
                  />
                ) : (
                  <CaretDownOutlined
                    aria-hidden="true"
                    style={{ verticalAlign: "0em" }}
                  />
                )}
              </span>
              {showFilters && (
                <>
                  <Form.Group controlId="natureOfJob">
                    <Form.Label>
                      <h3 className="lip-subtext font-14">Job Type</h3>
                    </Form.Label>
                    <Form.Control
                      className="lip-button"
                      as="select"
                      name="jobType"
                      onChange={handleOnChange}
                    >
                      <option
                        className="csv-dropdown-item"
                        disabled
                        selected={filters.jobType === undefined}
                      >
                        Select
                      </option>
                      <option
                        value="FULL_TIME"
                        className="csv-dropdown-item"
                        selected={filters.jobType === "FULL_TIME"}
                      >
                        Full-time
                      </option>
                      <option
                        value="INTERNSHIP"
                        className="csv-dropdown-item"
                        selected={filters.jobType === "INTERNSHIP"}
                      >
                        Internship
                      </option>
                      <option
                        value="BOTH"
                        className="csv-dropdown-item"
                        selected={filters.jobType === "BOTH"}
                      >
                        Both
                      </option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="industryElement">
                    <Form.Label className="csv-select-label m-botttom">
                      <h3 className="lip-subtext font-14 ">Industry</h3>
                    </Form.Label>
                    <div className="">
                      <MultiSelectDropdownWrapper
                        setSelectedOrTypedInputValue={setIndustry}
                        label="Industry"
                        name="industry"
                        id="industryElement"
                        getDropdownListItems={props.GetIndustry}
                        onChange={handleIndustrySelect}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group controlId="rolesElement">
                    <Form.Label>
                      <h3 className="lip-subtext font-14">Roles</h3>
                    </Form.Label>
                    <Form.Control
                      className="lip-button"
                      placeholder="Roles"
                      as="textarea"
                      name="roles"
                      onBlur={handleOnChange}
                      value={filters.roles}
                    />
                  </Form.Group>
                  <Form.Group controlId="highestEducationElement">
                    <Form.Label>
                      <h3 className="lip-subtext font-14">
                        Minimum educational qualification
                      </h3>
                    </Form.Label>
                    <Form.Control
                      className="lip-button"
                      as="select"
                      name="highestEducation"
                      onChange={handleOnChange}
                    >
                      <option className="csv-dropdown-item" disabled selected>
                        Select
                      </option>
                      <option value="10TH_STD" className="csv-dropdown-item">
                        10th Std
                      </option>
                      <option value="12TH_STD" className="csv-dropdown-item">
                        12th Std
                      </option>
                      <option
                        value="GRADUATE_DEGREE"
                        className="csv-dropdown-item"
                      >
                        Graduate degree
                      </option>
                      <option
                        value="POST_GRADUATE_DEGREE"
                        className="csv-dropdown-item"
                      >
                        Post-graduate degree
                      </option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="highestDegree">
                    <Form.Label>
                      <h3 className="lip-subtext font-14">Highest degree</h3>
                    </Form.Label>
                    <Form.Control
                      className="lip-button"
                      placeholder="Degree"
                      as="textarea"
                      name="highestDegree"
                      onBlur={handleOnChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="major">
                    <Form.Label>
                      <h3 className="lip-subtext font-14">
                        Academic concentration
                      </h3>
                    </Form.Label>
                    <Form.Control
                      className="lip-button"
                      placeholder="Major"
                      as="textarea"
                      name="major"
                      onBlur={handleOnChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="totalExperience">
                    <Form.Label>
                      <h3 className="lip-subtext font-14">Total experience</h3>
                    </Form.Label>
                    <Form.Control
                      className="lip-button"
                      as="select"
                      name="totalExperience"
                      onChange={handleOnChange}
                    >
                      <option className="csv-dropdown-item" disabled selected>
                        Select
                      </option>
                      <option value="0_YEARS" className="csv-dropdown-item">
                        0 years
                      </option>
                      <option value="0-2_YEARS" className="csv-dropdown-item">
                        0-2 years
                      </option>
                      <option value="2-5_YEARS" className="csv-dropdown-item">
                        2-5 years
                      </option>
                      <option value="5-10_YEARS" className="csv-dropdown-item">
                        5-10 years
                      </option>
                      <option value="10+_YEARS" className="csv-dropdown-item">
                        10+ years
                      </option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="disabilitiesElement">
                    <Form.Label className="csv-select-label m-botttom">
                      <h3 className="lip-subtext font-14">Disabilities</h3>
                    </Form.Label>
                    <div className="">
                      <MultiSelectDropdownWrapper
                        setSelectedOrTypedInputValue={setDisabilities}
                        label="Disabilities"
                        name="disabilities"
                        id="disabilitiesElement"
                        getDropdownListItems={props.GetDisabilities}
                        onChange={handleDisabilitiesSelect}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group controlId="currentPlaceElement">
                    <Form.Label>
                      <h3 className="lip-subtext font-14">Location</h3>
                    </Form.Label>
                    <Form.Control
                      className="lip-button"
                      placeholder="Location"
                      as="textarea"
                      name="location"
                      onBlur={handleOnChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="canRelocate">
                    <Form.Label>
                      <h3 className="lip-subtext font-14">
                        Include candidates willing to relocate
                      </h3>
                    </Form.Label>
                    <Form.Control
                      className="lip-button"
                      as="select"
                      name="canRelocate"
                      onChange={handleOnChange}
                    >
                      <option className="csv-dropdown-item" disabled selected>
                        Select
                      </option>
                      <option value="true" className="csv-dropdown-item">
                        Yes
                      </option>
                      <option value="false" className="csv-dropdown-item">
                        No
                      </option>
                    </Form.Control>
                  </Form.Group>{" "}
                </>
              )}
            </div>
          </Col>
          <Col>
            <br />
            <Toast
              className="sr-only"
              delay={2000}
              show={ignoredAlert}
              autohide={true}
              onClose={() => setIgnoredAlert(false)}
            >
              <Toast.Body>Candidate {actionToast.toLowerCase()}</Toast.Body>
            </Toast>
            <h2 aria-live="polite" className="mt-4 lip-subtext font-semibold">
              Showing {requestCount} candidates
            </h2>
            {selectedFilters.map((data: any, index) => {
              if (data.length !== 0) {
                return (
                  <Toast show className="filter-toasts" key={`toast-${data}`}>
                    <Toast.Body
                      className="bg-toasts"
                      style={{ borderRadius: "5px" }}
                    >
                      {formatFilterName(String(data))}
                      {": "}
                      {(data === "canRelocate" &&
                        filters[(data as unknown) as keyof FormConstants] ===
                          "true" &&
                        "Yes") ||
                        (data === "canRelocate" &&
                          filters[(data as unknown) as keyof FormConstants] ===
                            "false" &&
                          "No") ||
                        String(
                          filters[(data as unknown) as keyof FormConstants]
                        )
                          .replace(/_/g, " ")
                          .toUpperCase()}
                      <CloseOutlined
                        role="button"
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "-2px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          handleRemoveFilter(data);
                        }}
                      />
                    </Toast.Body>
                  </Toast>
                );
              }
              return <></>;
            })}
            {currentCandidates?.map(candidate => {
              return (
                <article>
                  <Card className="mt-4">
                    <Card.Body>
                      <Card.Title>
                        <h3 className="font-semibold">{candidate.userName}</h3>
                      </Card.Title>
                      <Table role="table">
                        <tbody>
                          <tr role="row">
                            <Row>
                              {candidate.highestEducation && (
                                <Col role="cell" sm={8}>
                                  HIGHEST EDUCATION:{" "}
                                  <p className="font-semibold display-inline">
                                    {candidate.highestEducation
                                      .toUpperCase()
                                      .replace(/_/g, " ")}
                                  </p>
                                </Col>
                              )}
                              {candidate.associatedDisabilities && (
                                <Col role="cell" sm={4}>
                                  DISABILITY:{" "}
                                  <p className="font-semibold display-inline">
                                    {candidate.associatedDisabilities.join(
                                      ", "
                                    )}
                                  </p>
                                </Col>
                              )}
                            </Row>
                          </tr>
                          <tr role="row">
                            <Row>
                              {candidate.highestDegree && (
                                <Col role="cell" sm={8}>
                                  HIGHEST DEGREE:{" "}
                                  <p className="font-semibold display-inline">
                                    {candidate.highestDegree}
                                  </p>
                                </Col>
                              )}
                              {candidate.currentPlace && (
                                <Col role="cell" sm={4}>
                                  BASED IN:{" "}
                                  <p className="font-semibold display-inline">
                                    {candidate.currentPlace}
                                  </p>{" "}
                                </Col>
                              )}
                            </Row>
                          </tr>
                          <tr role="row">
                            <Row>
                              {candidate.major && (
                                <Col role="cell" sm={8}>
                                  MAJOR:{" "}
                                  <p className="font-semibold display-inline">
                                    {candidate.major}
                                  </p>
                                </Col>
                              )}
                              {candidate.canRelocate && (
                                <Col role="cell" sm={4}>
                                  WILLING TO RELOCATE:{" "}
                                  <p className="font-semibold display-inline">
                                    {candidate.canRelocate ? "Yes" : "No"}
                                  </p>{" "}
                                </Col>
                              )}
                            </Row>
                          </tr>
                          <tr role="row">
                            <Row>
                              {candidate.workExperience && (
                                <Col role="cell" sm={8}>
                                  WORK EXPERIENCE:{" "}
                                  <p className="font-semibold display-inline">
                                    {candidate.workExperience.replace(
                                      /_/g,
                                      " "
                                    )}
                                  </p>{" "}
                                </Col>
                              )}
                            </Row>
                          </tr>
                        </tbody>
                      </Table>
                      <Row>
                        <Col>
                          <div className="user-info-buttons" role="list">
                            <div role="listitem">
                              {candidate.linkedIn && (
                                <Button
                                  variant="primary"
                                  className="detail-button"
                                  href={candidate.linkedIn}
                                  target="_blank"
                                >
                                  LINKEDIN
                                </Button>
                              )}
                            </div>
                            <div role="listitem">
                              {candidate.portfolioLink && (
                                <Button
                                  variant="primary"
                                  className="detail-button"
                                  href={candidate.portfolioLink}
                                  target="_blank"
                                >
                                  PORTFOLIO
                                </Button>
                              )}
                            </div>
                            <div role="listitem">
                              {candidate.resumeLink && (
                                <Button
                                  variant="primary"
                                  className="detail-button"
                                  href={candidate.resumeLink}
                                  target="_blank"
                                >
                                  RESUME
                                </Button>
                              )}
                            </div>
                            <div role="listitem">
                              {candidate.actionLog.some(
                                data =>
                                  data.action === CandidateStatus.COMMENTED &&
                                  data.organization === organizationCode
                              ) && (
                                <Button
                                  variant="primary"
                                  className="detail-button"
                                  aria-label="show comments"
                                  onClick={() =>
                                    getCandidateComments(candidate.id)
                                  }
                                >
                                  <img
                                    style={{ maxWidth: "3rem" }}
                                    src={MESSAGE_CIRCLE}
                                  />
                                </Button>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col>
                          <div className="action-buttons" role="list">
                            {status != CandidateStatus.IGNORED && (
                              <div role="listitem">
                                <Button
                                  variant="primary"
                                  className="detail-button"
                                  onClick={() =>
                                    handleCandidate(
                                      candidate.id,
                                      CandidateStatus.IGNORED,
                                      candidate.userName
                                    )
                                  }
                                >
                                  IGNORE
                                </Button>
                              </div>
                            )}
                            <div role="listitem">
                              <Button
                                variant="primary"
                                className="detail-button"
                                aria-label="add comment"
                                onClick={() =>
                                  handleCandidate(
                                    candidate.id,
                                    CandidateStatus.COMMENTED,
                                    candidate.userName
                                  )
                                }
                              >
                                <img
                                  style={{ maxWidth: "3rem" }}
                                  src={MESSAGE_ICON}
                                />
                              </Button>
                            </div>
                            {status != CandidateStatus.SHORTLISTED && (
                              <div role="listitem">
                                <Button
                                  variant="primary"
                                  className="detail-button"
                                  onClick={() =>
                                    handleCandidate(
                                      candidate.id,
                                      CandidateStatus.SHORTLISTED,
                                      candidate.userName
                                    )
                                  }
                                >
                                  SHORTLIST
                                </Button>
                              </div>
                            )}
                            <div role="listitem">
                              <div className="mt-2">
                                <GreenButton
                                  onClick={() =>
                                    handleCandidate(
                                      candidate.id,
                                      CandidateStatus.CONTACTED,
                                      candidate.userName
                                    )
                                  }
                                >
                                  CONTACT
                                </GreenButton>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </article>
              );
            })}

            {requestCount > 0 && (
              <Pagination
                totalItems={requestCount}
                currentPage={currentPage}
                handleNextPage={handleNextPage}
                handlePageNumber={handlePageNumber}
                handlePreviousPage={handlePreviousPage}
              />
            )}
          </Col>
        </Row>
        <Modal
          show={showInterestModal}
          onHide={() => setShowInterestModal(false)}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h3 className="lip-title">SEND EMAIL</h3>
            </Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={emailInitialValues}
            enableReinitialize
            onSubmit={handleEmailSubmit}
          >
            {formik => (
              <Form onSubmit={formik.handleSubmit}>
                <Modal.Body>
                  <Form.Group controlId="cc" className="display-flex">
                    <Form.Label className="email-labels ">
                      <h3 className="lip-subtext font-14">CC : </h3>
                    </Form.Label>
                    <Form.Control
                      disabled
                      className="email-subject"
                      {...formik.getFieldProps("cc")}
                    />
                  </Form.Group>
                  <Form.Group controlId="subject" className="display-flex">
                    <Form.Label className="email-labels ">
                      <h3 className="lip-subtext font-14">Subject : </h3>
                    </Form.Label>
                    <Form.Control
                      className="email-subject"
                      {...formik.getFieldProps("subject")}
                    />
                  </Form.Group>
                  <Form.Group controlId="message" className="display-flex">
                    <Form.Label className="email-labels ">
                      <h3 className="lip-subtext font-14">Message : </h3>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      className="email-content"
                      {...formik.getFieldProps("message")}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <p>
                    Thanks a lot for using I-Stem portal. We would recommend you
                    to keep I-Stem email CC in all the conversations, so that we
                    could pitch in if there are any queries or help needed
                    around necessary accommodation during hiring process.
                  </p>
                  <div style={{ width: "40%" }}>
                    <GreenButton htmlType="submit">
                      <span className="flex items-center">
                        <span className="ml-2">SEND</span>
                      </span>
                    </GreenButton>
                  </div>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
        <Modal
          show={showCommentModal}
          onHide={() => setShowCommentModal(false)}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <h3 className="lip-title">Add comment</h3>
            </Modal.Title>
          </Modal.Header>
          <Formik initialValues={commentInitialValues} onSubmit={handleComment}>
            {formik => (
              <Form onSubmit={formik.handleSubmit}>
                <Modal.Body>
                  <Form.Group controlId="comment" className="display-flex">
                    <Form.Label className="email-labels ">
                      <h3 className="lip-subtext font-14">Comment : </h3>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      className="email-content"
                      {...formik.getFieldProps("comment")}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <div style={{ width: "40%" }}>
                    <GreenButton htmlType="submit">
                      <span className="flex items-center">
                        <span className="ml-2">ADD</span>
                      </span>
                    </GreenButton>
                  </div>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
        <Modal
          show={showCommentsList}
          onHide={() => setShowCommentsList(false)}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>COMMENTS</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {commentsData.length ? (
              <MessageBox messageData={commentsData} />
            ) : (
              <p>No comments</p>
            )}
          </Modal.Body>
        </Modal>
      </FormLayout>
    </Wrapper>
  );
};
const mapDispatchToProps = {
  GetDisabilities: BusinessActions.GetDisabilities,
  GetIndustry: CommunityActions.GetIndustry,
};

const mapStateToProps = (store: IStore) => {
  const { auth } = store;
  return {
    user: auth.user,
  };
};

export default PrivateRoute(
  connect(mapStateToProps, mapDispatchToProps)(Hiring)
);

interface FormConstants {
  status?: string;
  jobType?: string;
  industry?: string[];
  roles?: string;
  highestEducation?: string;
  highestDegree?: string;
  major?: string;
  totalExperience?: string;
  disabilities?: string[];
  location?: string;
  canRelocate?: string;
}

interface EmailData {
  subject: string;
  message: string;
  cc: string;
}
interface CommentData {
  comment: string;
}
