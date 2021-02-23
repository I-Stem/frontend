import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import Moment from "moment";
import { Button, Table, Typography } from "antd";
import { connect } from "react-redux";
import { BlueButton, GreenButton } from "@Components/HOC/Dashboard/CTAButtons";

// #endregion Global Imports

// #region Local Imports
import {
  FeedbackData,
  FeedbackFlagsData,
  ICreditTransaction,
  ICreditsData,
  IStemServices,
  ReduxNextPageContext,
  IStore,
} from "@Interfaces";
import { CreditsActions } from "@Actions";
import { Wrapper } from "@Components";
import { DashboardLayout } from "@Components/Layouts/DashboardLayout/index";
import PrivateRoute from "../_privateRoute";
import "./styles.scss";
import { response } from "express";
import { FeedbackCategory } from "@Definitions/Constants/FeedbackFormConstants";

const { Title, Text } = Typography;
const Credits: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const [credits, setCredits] = useState<ICreditsData>({
    totalCredits: 0,
  });
  const { userType, role, escalationSetting } = props.user;

  const [feedbackFlags, setFeedbackFlags] = useState<FeedbackFlagsData>();

  useEffect(() => {
    props
      .getCreditsHistory()
      .then((response: ICreditsData) => setCredits(response));
    props
      .GetFeedbackFlags()
      .then((response: FeedbackFlagsData) => setFeedbackFlags(response));
  }, [props]);

  const columns = [
    {
      title: "Title",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Date-time",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Credits",
      dataIndex: "credits",
      key: "credits",
    },
  ];

  const mappedData =
    credits?.transactions &&
    (credits?.transactions as Array<ICreditTransaction>)?.map(
      (transaction: ICreditTransaction) => {
        const { debited, credited, createdAt } = transaction;
        const date = createdAt
          ? Moment(createdAt).format("DD MMM, hh:mm a")
          : "";
        return {
          ...transaction,
          credits: credited ? `+${credited} Credits` : `-${debited} Credits`,
          date,
        };
      }
    );
  return (
    <Wrapper>
      <Head>
        <title>Credit Balance | I-Stem</title>
      </Head>
      <DashboardLayout
        userType={userType}
        role={role}
        hideBreadcrumb
        escalationSetting={escalationSetting}
      >
        {credits && (
          <>
            <div className="flex justify-between credit-bar">
              <Title className="mt-8 lip-title">CREDIT BALANCE</Title>
              <Title className="mt-8 lip-title">{credits?.totalCredits}</Title>
            </div>
            <Title className="mt-8 lip-title">EARN CREDITS</Title>
            <div className="flex justify-between mt-8">
              <Text className="lip-text">
                <p>Give feedback on Alternate Format Conversion</p>
              </Text>

              <div className="lip-but">
                {feedbackFlags?.afcServiceUsed ? (
                  <BlueButton
                    href="/credits/feedback"
                    queryParams={{ for: FeedbackCategory.AFC_SERVICE }}
                  >
                    {feedbackFlags.afcFeedbackProvided === 0
                      ? `EARN 100 CREDITS`
                      : `GIVE FEEDBACK`}
                  </BlueButton>
                ) : (
                  <GreenButton href="/dashboard/format-conversion">
                    LOCKED
                  </GreenButton>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <Text className="lip-text">
                <p>
                  Give feedback on Escalation for Alternate Format Conversion
                </p>
              </Text>

              <div className="lip-but">
                {feedbackFlags?.afcEscalated ? (
                  <BlueButton
                    href="/credits/feedback"
                    queryParams={{
                      for: FeedbackCategory.AFC_SERVICE_ESCALATION,
                    }}
                  >
                    {feedbackFlags.afcEscalateFeedbackProvided === 0
                      ? `EARN 100 CREDITS`
                      : `GIVE FEEDBACK`}
                  </BlueButton>
                ) : (
                  <GreenButton href="/dashboard/format-conversion">
                    LOCKED
                  </GreenButton>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <Text className="lip-text">
                <p>Give feedback on Standard Model for Video Captioning</p>
              </Text>

              <div className="lip-but">
                {feedbackFlags?.vcServiceUsed ? (
                  <BlueButton
                    href="/credits/feedback"
                    queryParams={{ for: FeedbackCategory.VC_SERVICE }}
                  >
                    {feedbackFlags.vcStandardFeedbackProvided === 0
                      ? `EARN 100 CREDITS`
                      : `GIVE FEEDBACK`}
                  </BlueButton>
                ) : (
                  <GreenButton href="/dashboard/video-captioning">
                    LOCKED
                  </GreenButton>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <Text className="lip-text">
                <p>Give feedback on Custom Model for Video Captioning</p>
              </Text>

              <div className="lip-but">
                {feedbackFlags?.vcCustomModelServiceUsed ? (
                  <BlueButton
                    href="/credits/feedback"
                    queryParams={{ for: FeedbackCategory.VC_CUSTOM_SERVICE }}
                  >
                    {feedbackFlags.vcCustomFeedbackProvided === 0
                      ? `EARN 100 CREDITS`
                      : `GIVE FEEDBACK`}
                  </BlueButton>
                ) : (
                  <GreenButton href="/dashboard/video-captioning">
                    LOCKED
                  </GreenButton>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <Text className="lip-text">
                <p>Give feedback on Escalation for Video Captioning</p>
              </Text>
              <div className="lip-but">
                {feedbackFlags?.vcEscalated ? (
                  <BlueButton
                    href="/credits/feedback"
                    queryParams={{
                      for: FeedbackCategory.VC_SERVICE_ESCALATION,
                    }}
                  >
                    {feedbackFlags.vcEscalateFeedbackProvided === 0
                      ? `EARN 100 CREDITS`
                      : `GIVE FEEDBACK`}
                  </BlueButton>
                ) : (
                  <GreenButton href="/dashboard/video-captioning">
                    LOCKED
                  </GreenButton>
                )}
              </div>
            </div>

            <Title className="lip-title mt-8">Transactions</Title>
            <Table
              pagination={false}
              dataSource={mappedData}
              columns={columns}
            />
          </>
        )}
      </DashboardLayout>
    </Wrapper>
  );
};

Credits.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IStemServices.InitialProps> => {
  const { user, token } = ctx.store.getState().auth;

  return { namespacesRequired: ["common"], token, user };
};
const mapStateToProps = (store: IStore) => {
  const { auth } = store;
  return {
    user: auth.user,
  };
};
const mapDispatchToProps = {
  getCreditsHistory: CreditsActions.GetCreditsHistory,
  GetFeedbackFlags: CreditsActions.GetFeedbackFlags,
};
const Extended = connect(mapStateToProps, mapDispatchToProps)(Credits);

export default PrivateRoute(Extended);
