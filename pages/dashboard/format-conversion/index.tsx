import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { connect } from "react-redux";
import { NextPage } from "next";
import Head from "next/head";
import { Col, Row, Typography } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import {
  IAfcServiceDocument,
  IAfcServiceResponse,
  IStemServices,
  IStore,
  ReduxNextPageContext,
} from "@Interfaces";
import { Wrapper } from "@Components";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout/index";
import { BlueButton } from "@Components/HOC/Dashboard/CTAButtons";
import fileNames from "@Definitions/Constants/image";
import { AFC_NEW_REQUEST } from "@Definitions/Constants";
import { AfcServiceActions, CreditsActions } from "@Actions";
import RequestTable from "@Components/StemServices/RequestTable";
import SearchDocument from "@Components/StemServices/SearchDocument";
import { useAppAbility } from "src/Hooks/useAppAbility";
import PrivateRoute from "../../_privateRoute";
import Error from "next/error";
import { AfcDescription } from "@Components/ServiceDescriptions/afc";
import { Pagination } from "react-bootstrap";
import { AfcService } from "@Services";

const {
  ALTERNATE_FORMAT_CONVERSION_SPLASH,
  VECTOR_UP,
  VECTOR_DOWN,
} = fileNames;

const { Title, Text } = Typography;
const FormatConversion: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  const { can } = useAppAbility();
  const access: boolean = can("VIEW", "AI_SERVICES");
  const [requestTableData, changeRequestTableData] = useState<
    [IAfcServiceDocument] | []
  >([]);
  const initialFocus = useRef<HTMLDivElement>(null);
  const [reachedEnd, setEnd] = useState(false);
  const [searchResults, setSearchResults] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const { userType, role } = props.user;
  const { totalCredits } = props;
  const isCreditEnough = totalCredits > 0;
  const [currentPage, setCurrentPage] = useState(1);
  const indexLastRequest = currentPage * 10;
  const indexFirstRequest = indexLastRequest - 10;
  const [requestCount, setRequestCount] = useState(0);
  const pageNumbers = [];
  const [showDescription, setShowDescription] = useState(false);
  const [searchText, setSearchText] = useState("");
  const getAfcCount = (text: string) => {
    AfcService.getAfcCount({ params: { searchText: text } }).then(res => {
      if (res.data?.count > 0) {
        if (text !== "") setSearchResults(true);
      }
      setRequestCount(res.data?.count);
    });
  };
  const fetchRequests = (page: number, searchString: string) => {
    getAfcCount(searchString);
    props.search({ page, searchString }).then((result: any) => {
      if (result.data.length) {
        changeRequestTableData(result.data || []);
      } else {
        changeRequestTableData([]);
      }
    });
  };
  const fetchResults = (searchString: String) => {
    props.search({ searchString }).then((result: IAfcServiceResponse) => {
      changeRequestTableData(result.data || []);
    });
  };
  useEffect(() => {
    fetchRequests(1, "");
    initialFocus.current?.focus();
  }, []);
  const searchList = (values: any) => {
    const { searchQuery } = values;
    setSearchText(searchQuery);
    fetchRequests(currentPage, searchQuery);
    if (searchQuery !== "") setSearchResults(true);
  };
  const handlePageNumber = (event: any) => {
    fetchRequests(event.target.innerText, searchText);
    setCurrentPage(Number(event.target.innerText));
  };
  for (let i = 1; i <= Math.ceil(requestCount / 10); i++) {
    pageNumbers.push(i);
  }

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

  const sideCTA = (
    <Col span={8}>
      <div className="m-auto mr-8 pt-8">
        <BlueButton href={AFC_NEW_REQUEST} disabled={!isCreditEnough}>
          <span className="flex items-center">
            <span className="ml-2">Convert a document</span>
          </span>
        </BlueButton>
        {!isCreditEnough && (
          <div aria-describedby="credit-info" aria-hidden={isCreditEnough}>
            <span id="credit-info">You have insufficient credits</span>
          </div>
        )}
      </div>
    </Col>
  );

  const isNew = (
    <div>
      <Row justify="center">
        <Col span="12">
          <img
            className="w-full lip-img"
            src={ALTERNATE_FORMAT_CONVERSION_SPLASH}
            alt=""
          />
          <div className="mt-4 lip-img">
            {!isCreditEnough && (
              <div aria-describedby="credit-info" aria-hidden={isCreditEnough}>
                <span id="credit-info">You have insufficient credits</span>
              </div>
            )}
          </div>
        </Col>
      </Row>
      <Row justify="start">
        <AfcDescription />
      </Row>
    </div>
  );
  const hasRequests = (
    <div className="m-4">
      <Title level={4}>Previous Requests</Title>
      <SearchDocument
        searchAction={searchList}
        onClickAction={() => {
          fetchRequests(1, "");
          setSearchText("");
          setSearchResults(false);
        }}
        searchExists={searchResults}
      />
      <RequestTable
        serviceType="afc"
        updateFunction={fetchResults}
        tableData={requestTableData}
      />
      <br />
      {requestCount > 0 && (
        <div className="lip-pagination">
          <Pagination>
            <Pagination.Prev
              onClick={() => {
                setCurrentPage(currentPage - 1);
                fetchRequests(currentPage - 1, searchText);
              }}
              disabled={currentPage - 1 === 0}
            >
              Previous
            </Pagination.Prev>
            {renderPageNumbers}
            <Pagination.Next
              onClick={() => {
                setCurrentPage(currentPage + 1);
                fetchRequests(currentPage + 1, searchText);
              }}
              disabled={currentPage + 1 > pageNumbers[pageNumbers.length - 1]}
            >
              Next
            </Pagination.Next>
          </Pagination>
        </div>
      )}
    </div>
  );
  return (
    <Wrapper>
      <Head>
        <title>Document Accessibility Service | I-Stem</title>
      </Head>
      {access ? (
        <DashboardLayout userType={userType} role={role} hideBreadcrumb>
          <Row>
            <Col span={16}>
              <div ref={initialFocus} tabIndex={-1}>
                <Title className="mt-8 lip-title">
                  Document Accessibility Service
                </Title>
              </div>
              {requestTableData && requestTableData.length ? (
                <div>
                  <span
                    onClick={() => setShowDescription(!showDescription)}
                    className="lip-subtext display-flex desc-toggle"
                    role="button"
                    aria-expanded={showDescription}
                  >
                    Show how it works
                    <img
                      className="desc-toggle-icon"
                      src={showDescription ? VECTOR_UP : VECTOR_DOWN}
                    />
                  </span>
                </div>
              ) : (
                <Text className="lip-subtext">
                  Convert an image or inaccessible PDF into accessible digital
                  content.
                </Text>
              )}
            </Col>
            {showDescription ? <></> : sideCTA}
          </Row>
          {showDescription ? isNew : <></>}
          {(requestTableData && requestTableData.length) || searchResults
            ? hasRequests
            : isNew}
        </DashboardLayout>
      ) : (
        <Error statusCode={403} title="Access Denied" />
      )}
    </Wrapper>
  );
};

FormatConversion.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IStemServices.InitialProps> => {
  const { user, token } = ctx.store.getState().auth;

  return { namespacesRequired: ["common"], token, user };
};

const mapStateToProps = (store: IStore) => {
  const { auth, credits } = store;
  return {
    user: auth.user,
    totalCredits: credits.totalCredits,
  };
};

const mapDispatchToProps = {
  search: AfcServiceActions.Search,
  getCredits: CreditsActions.GetCredits,
};
const Extended = connect(mapStateToProps, mapDispatchToProps)(FormatConversion);

export default PrivateRoute(Extended);
