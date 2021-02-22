import React, { useState, useRef, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Form, Input } from "antd";
import { Rating } from "@material-ui/lab";
import { TextareaAutosize } from "@material-ui/core";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import Head from "next/head";
import { CreditsService } from "@Services";
// #endregion Global Imports

// #region Local Imports
import { IStemServices } from "@Interfaces";
import { CREDITS_PAGE } from "@Definitions/Constants/pageroutes";
import { Wrapper } from "@Components";
import "./styles.scss";
import {
  FeedbackCategory,
  feedbackFormTitles,
} from "@Definitions/Constants/FeedbackFormConstants";

const Feedback: NextPage<IStemServices.InitialProps> = (props: any) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const router = useRouter();
  console.log(router.query);
  const [rating, setRating] = useState<number | null>(null);
  const formSubmit = (values: any) => {
    const feedbackData = {
      rating: values.rating,
      feedbackFor: router.query.for,
      purpose: values.purpose,
      likings: values.likings,
      dislikings: values.dislikings,
      creditsRequested: values.creditsRequested,
    };
    CreditsService.giveFeedback(feedbackData);
    router.push(CREDITS_PAGE);
  };
  useEffect(() => {
    initialFocus?.current?.focus();
  });
  const [form] = Form.useForm();
  return (
    <Wrapper>
      <Head>
        <title>Feedback | I-Stem</title>
      </Head>
      <FormLayout form="feedbackform" hideFooter={false}>
        <section className="pt-12">
          <Form
            className="lip-margin"
            onFinish={formSubmit}
            form={form}
            id="feedbackform"
          >
            <div tabIndex={-1} ref={initialFocus}>
              <h2 className="font-semibold text-3xl mb-12">
                Feedback For{" "}
                {feedbackFormTitles.get(router.query.for as FeedbackCategory)}
              </h2>
            </div>
            <label>
              <h3 className="font-semibold text-xl leading-9">
                Rate your overall experience
              </h3>
            </label>
            <Form.Item name="rating">
              <Rating
                name="simple-controlled"
                size="large"
                defaultValue={1}
                value={rating}
                onChange={(event, newRating) => setRating(newRating)}
              />
            </Form.Item>
            <label>
              <h3 className="font-semibold text-xl leading-9">
                What is the primary purpose of using this automated service?
              </h3>
            </label>
            <Form.Item name="purpose">
              <TextareaAutosize className="lip-textarea" />
            </Form.Item>
            <label>
              <h3 className="font-semibold text-xl leading-9">
                What do you like about it?
              </h3>
            </label>
            <Form.Item name="likings">
              <TextareaAutosize className="lip-textarea" />
            </Form.Item>
            <label>
              <h3 className="font-semibold text-xl leading-9">
                Your suggestions for improvements: what can we do better?
              </h3>
            </label>
            <Form.Item name="dislikings">
              <TextareaAutosize className="lip-textarea" />
            </Form.Item>
            <label>
              <h3 className="font-semibold text-xl leading-9">
                How many additional credits do you want?
              </h3>
            </label>
            <Form.Item name="creditsRequested">
              <Input className="lip-button" />
            </Form.Item>
          </Form>
        </section>
      </FormLayout>
    </Wrapper>
  );
};

export default Feedback;
