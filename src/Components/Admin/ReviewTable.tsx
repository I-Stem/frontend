import { AllServiceReviews } from "@Services/API/Admin/IAdminResponse";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Moment from "moment";
import { AdminPanelServices } from "@Services";
import Pagination from "@Components/HOC/Pagination";
import { requestTypeConstants } from ".";

export const ReviewTable: React.FC<IRequestProps> = props => {
  const [requests, setRequests] = useState<
    Array<AllServiceReviews> | undefined
  >(undefined);
  const { requestType, totalItems } = props;
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    AdminPanelServices.allReviewDetails({
      requestType,
      offset: (currentPage - 1) * 10,
    }).then(res => {
      setRequests(
        ((res.data.allRequests as unknown) as AllServiceReviews[]) || []
      );
    });
  }, [currentPage]);

  const handlePageNumber = (val: any) => {
    setCurrentPage(Number(val));
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const rows = requests?.map(request => (
    <tr key={`${request.reviewedOn}`}>
      <td>{request.name}</td>
      <td>{request.currentStatus}</td>
      <td>{Moment(request.reviewedOn).format("DD MMM, hh:mm a")}</td>
      <td>{request.reviewedBy}</td>
      <td>{request.action}</td>
    </tr>
  ));

  return (
    <>
      <Table>
        <thead style={{ borderTop: "hidden" }}>
          <tr>
            <th>Name / Organization Name</th>
            <th>Status</th>
            <th>Reviewed On</th>
            <th>Reviewed By</th>
            <th>Action</th>
          </tr>
        </thead>
        {requests && <tbody> {rows} </tbody>}
      </Table>
      <Pagination
        totalItems={totalItems}
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        handlePageNumber={handlePageNumber}
      />
    </>
  );
};

interface IRequestProps {
  requestType: requestTypeConstants;
  totalItems: number;
}
