import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { NextPage } from "next";
import Head from "next/head";
import { Col, Row, Typography } from "antd";
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
// import { Pagination } from "react-bootstrap";
import { AfcService } from "@Services";
import Pagination from "@Components/HOC/Pagination";

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
  const [searchResults, setSearchResults] = useState(false);
  const { userType, role, escalationSetting } = props.user;
  const { totalCredits } = props;
  const isCreditEnough = totalCredits > 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [requestCount, setRequestCount] = useState(0);
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
  const handlePageNumber = (val: any) => {
    fetchRequests(val, searchText);
    setCurrentPage(Number(val));
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    fetchRequests(currentPage + 1, searchText);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
    fetchRequests(currentPage - 1, searchText);
  };

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
      <Pagination
        totalItems={requestCount}
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePageNumber={handlePageNumber}
        handlePreviousPage={handlePreviousPage}
      />
    </div>
  );
  return (
    <Wrapper>
      <Head>
        <title>Document Accessibility Service | I-Stem</title>
      </Head>
      {access ? (
        <DashboardLayout
          userType={userType}
          role={role}
          escalationSetting={escalationSetting}
          hideBreadcrumb
        >
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
