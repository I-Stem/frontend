import React, { useEffect, useState, useRef } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
import { useRouter } from "next/router";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import PrivateRoute from "../../_privateRoute";
import { useAppAbility } from "src/Hooks/useAppAbility";
import { BlueButton } from "@Components/HOC/Dashboard";
import { Pagination, Table } from "react-bootstrap";
import { UniversityPortal } from "@Services";
import { STUDENTS } from "@Definitions/Constants/universityRoutes";
import { cpuUsage } from "process";
import { DialogMessageBox } from "@Components/Basic/Dialog";

const StepThree: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { can } = useAppAbility();
  const studentData = props.csvFile;

  const [currentPage, setCurrentPage] = useState(1);
  const indexLastStud = currentPage * 10;
  const indexFirstStud = indexLastStud - 10;
  const currentStudents = studentData.slice(indexFirstStud, indexLastStud);
  const pageNumbers = [];
  const [messageBox, setMessageBox] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogHeading, setDialogHeading] = useState("");
  const { organizationCode } = props.user;
  useEffect(() => {
    initialFocus?.current?.focus();
  });
  const rows = currentStudents?.map((data: any) => {
    return (
      <tr key={data.EMAIL}>
        <td>{data.NAME}</td>
        <td>{data.EMAIL}</td>
        <td>{data.ROLL_NO}</td>
      </tr>
    );
  });
  for (let i = 1; i <= Math.ceil(studentData.length / 10); i++) {
    pageNumbers.push(i);
  }
  const handlePageNumber = (event: any) => {
    setCurrentPage(Number(event.target.innerText));
  };
  const toggleMessageModal = () => {
    setMessageBox(!messageBox);
  };

  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <Pagination.Item key={number} value={number} onClick={handlePageNumber}>
        {number}
      </Pagination.Item>
    );
  });
  const fullNames = Object.values(props.csvFile).map((data: any) =>
    String(data.NAME)
  );
  const emails = Object.values(props.csvFile).map((data: any) =>
    String(data.EMAIL)
  );

  const rollNo = Object.values(props.csvFile).map((data: any) =>
    String(data.ROLL_NO)
  );
  const handleConfirm = () => {
    UniversityPortal.studentInvite({
      fullNames,
      emails,
      organization: organizationCode,
      rollNos: rollNo,
      role: "STUDENT",
    })
      .then((results: any) => {
        if (results.code === 200) {
          setDialogMessage("Invitations sent successfully to given emails");
          setDialogHeading("Invitation Success");
          setMessageBox(!messageBox);
        }
      })
      .catch((err: any) => {
        setDialogMessage(
          "Error occurred while sending invitations through emails. Try Again!"
        );
        setDialogHeading("Invitation Failed");
        setMessageBox(!messageBox);
      });
  };

  return (
    <Wrapper>
      <Head>
        <title>Confirm and Import | I-Stem</title>
      </Head>
      <FormLayout form="confirmAndMerge" hideFooter={true}>
        <div className="lip-margin">
          <div tabIndex={-1} ref={initialFocus}>
            <h2 className="mt-8 lip-title">
              STEP 3: CONFIRM AND IMPORT ({studentData.length} STUDENTS)
            </h2>
          </div>
          <div className="">
            <Table style={{ marginTop: "1rem" }}>
              <thead>
                <tr style={{ borderTop: "hidden" }}>
                  <th>NAME</th>
                  <th>Email</th>
                  <th>ROLL NUMBER</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </div>
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
                disabled={currentPage + 1 > pageNumbers[pageNumbers.length - 1]}
              >
                Next
              </Pagination.Next>
            </Pagination>
          </div>

          <div style={{ width: "35%" }}>
            <BlueButton htmlType="button" onClick={handleConfirm}>
              CONFIRM AND IMPORT
            </BlueButton>
          </div>
        </div>
      </FormLayout>
      <DialogMessageBox
        showModal={messageBox}
        message={dialogMessage}
        heading={dialogHeading}
        toggleDialog={toggleMessageModal}
        route={STUDENTS}
      />
    </Wrapper>
  );
};

const mapStateToProps = (store: IStore) => {
  const { university, auth } = store;
  return {
    csvFile: university?.csvFile,
    csvErrors: university?.csvErrors,
    user: auth.user,
  };
};

export default PrivateRoute(connect(mapStateToProps, null)(StepThree));
