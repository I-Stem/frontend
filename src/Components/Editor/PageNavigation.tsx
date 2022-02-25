import "./style.scss";
import React, { useState } from "react";
import { useEffect } from "react";

const imagePath = "/static/images";
export const PageNavigation = (props: PageNavigationProps) => {
  const currentPageNum = Number(props.page.currentPage);
  const jumpToPage = (relativeNextPage: number) => {
    for (let i = 0; i < props.page.pageRanges.length; i++) {
      const currentRange = props.page.pageRanges[i];
      if (relativeNextPage > currentRange.end - currentRange.start + 1) {
        relativeNextPage -= currentRange.end - currentRange.start + 1;
        continue;
      }

      props.setCurrentPage(currentRange.start + relativeNextPage - 1);
      break;
    }
  };
  const handleNextPage = () => {
    const rangeIndex = props.page.pageRanges.findIndex(
      range => range.start <= currentPageNum && currentPageNum <= range.end
    );
    if (rangeIndex < 0) console.error("shouldn't happen");
    else {
      if (currentPageNum < props.page.pageRanges[rangeIndex].end)
        props.setCurrentPage(currentPageNum + 1);
      else if (rangeIndex < props.page.pageRanges.length - 1)
        props.setCurrentPage(props.page.pageRanges[rangeIndex + 1].start);
    }
  };
  const handlePreviousPage = () => {
    const rangeIndex = props.page.pageRanges.findIndex(
      range => range.start <= currentPageNum && currentPageNum <= range.end
    );
    if (rangeIndex < 0) console.error("shouldn't happen");
    else {
      if (currentPageNum > props.page.pageRanges[rangeIndex].start)
        props.setCurrentPage(currentPageNum - 1);
      else if (rangeIndex > 0)
        props.setCurrentPage(props.page.pageRanges[rangeIndex - 1].end);
    }
  };
  const getRelativePageFromAbsolute = (absolutePage: number) => {
    let relativePage = 0;
    let currentRange = props.page.pageRanges[0];
    for (let i = 0; i < props.page.pageRanges.length; i++) {
      currentRange = props.page.pageRanges[i];

      if (absolutePage > currentRange.end) {
        relativePage += currentRange.end - currentRange.start + 1;
        continue;
      }

      break;
    }
    return relativePage + absolutePage - currentRange?.start + 1;
  };
  const { page } = props;
  const [currPage, setCurrPage] = useState(
    String(getRelativePageFromAbsolute(Number(page.currentPage)))
  );

  return (
    <div className="toolbar-section">
      <button
        type="button"
        style={{
          padding: "8px 18px 8px 18px",
        }}
        className="toolbar-button"
        onClick={() => {
          setCurrPage(String(Number(currPage) - 1));
          handlePreviousPage();
        }}
        disabled={page?.currentPage === page?.pageRanges[0].start}
      >
        <img src={`${imagePath}/prev.svg`} alt="previous page" />
      </button>
      <div
        style={{
          padding: "8px 18px 8px 18px",
        }}
        className="toolbar-button font-semibold"
      >
        <span>
          <input
            type="number"
            placeholder="page"
            className="page-number"
            value={currPage.toString()}
            onBlur={e => {
              const currentNumber = parseInt(e.target.value);
              if (
                !isNaN(currentNumber) &&
                currentNumber > 0 &&
                currentNumber <= props.page.totalPage
              ) {
                jumpToPage(Number(e.target.value));
              } else
                setCurrPage(
                  String(getRelativePageFromAbsolute(props.page.currentPage))
                );
            }}
            onChange={e => {
              setCurrPage(e.target.value);
            }}
          />{" "}
          / {page?.totalPage}
        </span>
      </div>
      <button
        type="button"
        style={{
          padding: "8px 18px 8px 18px",
        }}
        className="toolbar-button"
        onClick={() => {
          setCurrPage(String(Number(currPage) + 1));
          handleNextPage();
        }}
        disabled={
          page?.currentPage === page?.pageRanges[page.pageRanges.length - 1].end
        }
      >
        <img src={`${imagePath}/next.svg`} alt="next page" />
      </button>
    </div>
  );
};

interface PageNavigationProps {
  setCurrentPage: (page: number) => void;
  page: PdfPageInterface;
}

interface PdfPageInterface {
  pageRanges: { start: number; end: number }[];
  currentPage: number;
  totalPage: number | string;
}
