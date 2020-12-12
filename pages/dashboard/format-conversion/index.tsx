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

const { ALTERNATE_FORMAT_CONVERSION_SPLASH } = fileNames;

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
  const [pageNumber, setPageNumber] = useState(1);
  const { userType, role } = props.user;
  const { totalCredits } = props;
  const isCreditEnough = totalCredits > 0;
  const fetchRequests = useCallback((page: number) => {
    props.search({ page }).then((result: any) => {
      const appendData: any = requestTableData.concat(result.data);
      if (result.data.length === 0) {
        setEnd(true);
      } else {
        changeRequestTableData(appendData || []);
        setPageNumber(pageNumber + 1);
      }
    });
  }, []);
  const fetchResults = (searchString: String) => {
    props.search({ searchString }).then((result: IAfcServiceResponse) => {
      changeRequestTableData(result.data || []);
    });
  };
  useEffect(() => {
    fetchRequests(1);
    initialFocus.current?.focus();
  }, [fetchRequests]);
  const searchList = (values: any) => {
    const { searchQuery } = values;
    fetchResults(searchQuery);
  };
  window.onscroll = debounce(() => {
    if (reachedEnd) {
      return;
    }
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchRequests(pageNumber);
    }
  }, 100);

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
    <Row justify="center">
      <Col span="12">
        <img
          className="w-full lip-img"
          src={ALTERNATE_FORMAT_CONVERSION_SPLASH}
          alt=""
        />
        <div className="mt-4 lip-img">
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
    </Row>
  );
  const hasRequests = (
    <div className="m-4">
      <Title level={4}>Previous Requests</Title>
      <SearchDocument searchAction={searchList} />
      <RequestTable
        serviceType="afc"
        updateFunction={fetchResults}
        tableData={requestTableData}
      />
    </div>
  );

  return (
    <Wrapper>
      <Head>
        <title>Document Accessibility Service | I-Stem</title>
      </Head>
      {access ? (
        <DashboardLayout userType={userType} role={role} hideBreadcrumb={true}>
          <Row>
            <Col span={16}>
              <div ref={initialFocus} tabIndex={-1}>
                <Title className="mt-8 lip-title">
                  Document Accessibility Service
                </Title>
              </div>
              <Text className="lip-subtext">
                This I-Stem service lets you convert documents and images in
                accessible formats
              </Text>
            </Col>
            {requestTableData && requestTableData.length ? (
              sideCTA
            ) : (
              <Fragment />
            )}
          </Row>
          {requestTableData && requestTableData.length ? hasRequests : isNew}
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
