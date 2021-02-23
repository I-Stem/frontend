export interface PaginationProps {
  handlePageNumber: (event: any) => void;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  totalItems: number;
}
