import React, { Fragment, useEffect, useState, useRef } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { Col, Row, Typography } from "antd";
import { connect } from "react-redux";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import {
  ICaptioningServiceDocument,
  ICaptioningServiceResponse,
  IStemServices,
  IStore,
  ReduxNextPageContext,
} from "@Interfaces";
import { Wrapper } from "@Components";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout/index";
import { BlueButton } from "@Components/HOC/Dashboard/CTAButtons";
import fileNames from "@Definitions/Constants/image";
import { VC_STEPONE } from "@Definitions/Constants/pageroutes";
import { CreditsActions, VcServiceActions } from "@Actions";
import RequestTable from "@Components/StemServices/RequestTable";
import SearchDocument from "@Components/StemServices/SearchDocument";
import PrivateRoute from "../../_privateRoute";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";
import { VcDescription } from "@Components/ServiceDescriptions/vc";
import { Pagination } from "react-bootstrap";
import { CaptioningService } from "@Services";

const { STATUS_IMAGE_VC, VECTOR_DOWN, VECTOR_UP } = fileNames;
const { Title, Text } = Typography;
const VideoCaptioning: NextPage<
  IStemServices.IProps,
  IStemServices.InitialProps
> = (props: any) => {
  const [requestTableData, changeRequestTableData] = useState<
    [ICaptioningServiceDocument] | []
  >([]);
  const initialFocus = useRef<HTMLDivElement>(null);
  const [reachedEnd, setEnd] = useState(false);
  const [searchResults, setSearchResults] = useState(false);
  const [searchPayload, setSearchPayload] = useState({ page: 1 });
  const { can } = useAppAbility();
  const access: boolean = can("VIEW", "AI_SERVICES");
  const { userType, role, escalationSetting } = props.user;
  const { totalCredits } = props;
  const isCreditEnough = totalCredits > 0;
  const [showDescription, setShowDescription] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const indexLastRequest = currentPage * 10;
  const indexFirstRequest = indexLastRequest - 10;
  const [requestCount, setRequestCount] = useState(0);
  const pageNumbers = [];
  const fetchRequests = (payload: any) => {
    props.search(payload).then((result: any) => {
      const appendData: any =
        payload.page === 1 ? result.data : requestTableData.concat(result.data);
      if (result.data.length === 0) {
        setEnd(true);
      } else {
        changeRequestTableData(appendData || []);
        // setSearchPayload({ ...payload, page: payload.page + 1 });
      }
    });
  };
  const fetchResults = (searchString: string) => {
    const encodedSearchString = encodeURIComponent(searchString);

    setEnd(false);
    fetchRequests(
      encodedSearchString === ""
        ? { page: 1 }
        : { searchString: encodedSearchString, page: 1 }
    );
    setSearchResults(true);
  };
  useEffect(() => {
    CaptioningService.getVcCount().then(res => {
      setRequestCount(res.data?.count);
    });
    fetchRequests(searchPayload);
    initialFocus?.current?.focus();
  }, [searchPayload]);
  const searchList = (values: any) => {
    const { searchQuery } = values;
    fetchResults(searchQuery);
  };
  const handlePageNumber = (event: any) => {
    fetchResults(event.target.innerText);
    setCurrentPage(Number(event.target.innerText));
  };
  for (let i = 1; i <= Math.ceil(requestCount / 10); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map(number => {
    return (
      <Pagination.Item key={number} value={number} onClick={handlePageNumber}>
        {number}
      </Pagination.Item>
    );
  });
  const sideCTA = (
    <Col span={8}>
      <div className="m-auto mr-8 pt-8">
        <BlueButton href={VC_STEPONE} disabled={!isCreditEnough}>
          <span className="flex items-center">
            <span className="ml-2">Convert audio/video</span>
          </span>
        </BlueButton>
        {!isCreditEnough && (
          <div
            aria-describedby="credit-info"
            aria-hidden={isCreditEnough}
            role="region"
          >
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
          <img className="w-full lip-img" src={STATUS_IMAGE_VC} alt="" />
          <div className="mt-4 lip-img">
            {/* <BlueButton href={VC_STEPONE} disabled={!isCreditEnough}>
              <span className="flex items-center">
                <span className="ml-2">Convert audio/video</span>
              </span>
            </BlueButton> */}
            {!isCreditEnough && (
              <div
                aria-describedby="credit-info"
                aria-hidden={isCreditEnough}
                role="region"
              >
                <span id="credit-info">You have insufficient credits</span>
              </div>
            )}
          </div>
        </Col>
      </Row>
      <Row justify="start">
        <VcDescription />
      </Row>
    </div>
  );
  const hasRequests = (
    <div className="m-4">
      <Title level={4}>Previous Requests</Title>
      <SearchDocument searchAction={searchList} />
      {searchResults ? (
        <Row className="mt-2">
          <Col span={20}>
            <h4 className="lip-subtext font-semibold">Search results</h4>
          </Col>
          <Col>
            <span
              className="lip-subtext"
              role="button"
              onClick={() => {
                fetchRequests(searchPayload);
                setSearchResults(false);
              }}
            >
              Clear
            </span>
          </Col>
        </Row>
      ) : (
        <></>
      )}
      <RequestTable
        serviceType="vc"
        updateFunction={fetchResults}
        tableData={requestTableData}
      />
      <div className="lip-pagination">
        <Pagination>
          <Pagination.Prev
            onClick={() => {
              setCurrentPage(currentPage - 1);
              fetchRequests(currentPage - 1);
            }}
            disabled={currentPage - 1 == 0}
          >
            Previous
          </Pagination.Prev>
          {renderPageNumbers}
          <Pagination.Next
            onClick={() => {
              setCurrentPage(currentPage + 1);
              fetchRequests(currentPage + 1);
            }}
            disabled={currentPage + 1 > pageNumbers[pageNumbers.length - 1]}
          >
            Next
          </Pagination.Next>
        </Pagination>
      </div>
    </div>
  );
  return (
    <Wrapper>
      <Head>
        <title>Audio/Video Accessibility Service | I-Stem</title>
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
                  Audio/Video Accessibility Service
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
                  Get accurate captions and text extraction from videos.
                </Text>
              )}
            </Col>
            {showDescription ? <></> : sideCTA}
          </Row>
          {showDescription ? isNew : <></>}
          {requestTableData && requestTableData.length ? hasRequests : isNew}
        </DashboardLayout>
      ) : (
        <Error statusCode={403} title="Access Denied" />
      )}
    </Wrapper>
  );
};

VideoCaptioning.getInitialProps = async (
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
  search: VcServiceActions.Search,
  getCredits: CreditsActions.GetCredits,
};
const Extended = connect(mapStateToProps, mapDispatchToProps)(VideoCaptioning);

export default PrivateRoute(Extended);
