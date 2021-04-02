import React from "react";
import { Pagination as BsPagination } from "react-bootstrap";
import { PaginationProps } from "./PaginationProps";

const Pagination: React.FC<PaginationProps> = props => {
  const {
    handlePageNumber,
    currentPage,
    handleNextPage,
    handlePreviousPage,
    totalItems,
    firstPage,
    lastPage,
  } = props;
  const pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(totalItems / 10); i += 1) {
    pageNumbers.push(i);
  }
  const handleOnClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    handlePageNumber(event.currentTarget.innerText);
  };
  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <BsPagination.Item
        key={number}
        value={number}
        onClick={handleOnClick}
        active={currentPage === number}
        disabled={currentPage === number}
      >
        {number}
      </BsPagination.Item>
    );
  });
  return totalItems > 0 ? (
    <div className="lip-pagination auto-x-overflow">
      <BsPagination>
        {firstPage && <BsPagination.First onClick={firstPage} />}
        <BsPagination.Prev
          onClick={handlePreviousPage}
          disabled={currentPage - 1 === 0}
        >
          Previous
        </BsPagination.Prev>
        {renderPageNumbers}
        <BsPagination.Next
          onClick={handleNextPage}
          disabled={currentPage + 1 > pageNumbers[pageNumbers.length - 1]}
        >
          Next
        </BsPagination.Next>
        {lastPage && (
          <BsPagination.Last onClick={() => lastPage(pageNumbers.length)} />
        )}
      </BsPagination>
    </div>
  ) : (
    <> </>
  );
};

export default Pagination;
