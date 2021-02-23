import { AllServiceRequests } from "@Services/API/Admin/IAdminResponse";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Moment from "moment";
import Link from "next/link";
import { AdminPanelServices } from "@Services";
import Pagination from "@Components/HOC/Pagination";
import { requestTypeConstants } from ".";

export const RequestTable: React.FC<IRequestTableProps> = props => {
  const [requests, setRequests] = useState<
    Array<AllServiceRequests> | undefined
  >(undefined);
  const { pageURL, requestType, totalItems } = props;
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    AdminPanelServices.allRequests({
      requestType,
      offset: (currentPage - 1) * 10,
    }).then(res => {
      setRequests(
        ((res.data.allRequests as unknown) as AllServiceRequests[]) || []
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
    <tr key={`${request.requestedOn}`}>
      <td>
        <Link href={`${pageURL}/${request.id}`}>
          <a>{request.name}</a>
        </Link>
      </td>
      <td>{request.currentStatus}</td>
      <td>{Moment(request.requestedOn).format("DD MMM, hh:mm a")}</td>
    </tr>
  ));

  return (
    <>
      <Table>
        <thead style={{ borderTop: "hidden" }}>
          <tr>
            <th>Name / Organization Name</th>
            <th>Status</th>
            <th>Requested On</th>
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

interface IRequestTableProps {
  pageURL: string;
  requestType: requestTypeConstants;
  totalItems: number;
}
