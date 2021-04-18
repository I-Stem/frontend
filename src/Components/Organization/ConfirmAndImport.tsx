import React, { useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
import { useRouter } from "next/router";
// #endregion Global Imports

// #region Local Imports
import "./style.scss";
import { IStemServices, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import { useAppAbility } from "src/Hooks/useAppAbility";
import { BlueButton } from "@Components/HOC/Dashboard";
import { Table } from "react-bootstrap";
import { UniversityPortal } from "@Services";
import { STUDENTS } from "@Definitions/Constants/universityRoutes";
import { DialogMessageBox } from "@Components/Basic/Dialog";
import { UserType } from "@Definitions/Constants";
import { UniversityPortalActions } from "src/Actions/UniversityActions";
import { getInvitationResponseMessage } from "@Services/helper/utils";
import Pagination from "@Components/HOC/Pagination";
import Error from "next/error";

const ConfirmImportComponent: React.FC = (props: any) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { can } = useAppAbility();
  const access = can("VIEW", "STUDENTS");
  const studentData = props.csvFile;

  const [currentPage, setCurrentPage] = useState(1);
  const indexLastStud = currentPage * 10;
  const indexFirstStud = indexLastStud - 10;
  const currentStudents = studentData.slice(indexFirstStud, indexLastStud);
  const [messageBox, setMessageBox] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogHeading, setDialogHeading] = useState("");
  const { organizationCode, userType } = props.user;
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
  const handlePageNumber = (val: any) => {
    setCurrentPage(Number(val));
  };
  const toggleMessageModal = () => {
    setMessageBox(!messageBox);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };
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
          const message = getInvitationResponseMessage(
            results.data.newUsers,
            results.data.existingUsers
          );
          setDialogMessage(message);
          setDialogHeading("Invitation Success");
          setMessageBox(!messageBox);
          props.resetCsv();
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

  return access ? (
    <Wrapper>
      <Head>
        <title>Confirm and Import | I-Stem</title>
      </Head>
      <FormLayout form="confirmAndMerge" hideFooter={true}>
        <div className="lip-margin">
          <div tabIndex={-1} ref={initialFocus}>
            <h2 className="mt-8 lip-title">
              STEP 3: CONFIRM AND IMPORT ({studentData.length}{" "}
              {userType === UserType.BUSINESS ? "EMPLOYEES" : "STUDENTS"})
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
          <Pagination
            totalItems={studentData.length}
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            handlePageNumber={handlePageNumber}
          />
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
  ) : (
    <Error statusCode={404} title="Page Not Found" />
  );
};

const mapStateToProps = (store: IStore) => {
  const { university, auth } = store;
  return {
    csvFile: university?.csvFile,
    csvErrors: university?.csvErrors,
    user: auth?.user,
  };
};

const mapDispatchToProps = {
  resetCsv: UniversityPortalActions.ResetCsvData,
};
const ConfirmImport = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmImportComponent);

export { ConfirmImport };
