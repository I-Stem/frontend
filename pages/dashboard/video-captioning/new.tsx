import React, { useEffect, useState, useRef } from "react";
import { logEvent } from "@Services/monitoring/GoogleAnalytics";
import { NextPage } from "next";
import Head from "next/head";
import { Form, Input } from "antd";
import { connect } from "react-redux";
import { Select } from "@material-ui/core";
import { useRouter } from "next/router";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore, ReduxNextPageContext } from "@Interfaces";
import { Wrapper } from "@Components";
import DropdownWrapper from "@Components/StemServices/DropdownComponent";
import { BlueButton } from "@Components/HOC/Dashboard/CTAButtons";
import { FormLayout } from "@Components/HOC/Dashboard";
import { TagsActions, UploadActions, VcServiceActions } from "@Actions";
import {
  modelsList,
  outputFormatsListVC,
} from "@Definitions/Constants/dashboard-form-constants";
import { VIDEO_CAPTIONING_SUCCESS } from "@Definitions/Constants/pageroutes";
import Upload from "@Components/Upload";
import { RemediationSetting, VALID_FILE_NAME } from "@Definitions/Constants";
import PrivateRoute from "../../_privateRoute";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";
import { serviceTypeEnum } from "@Components/Upload/constants";
import RadioCheck from "@Components/HOC/Dashboard/RadioCheck";

const NewVideo: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [tag, setTag] = useState<string>();
  const formSubmit = (values: any) => {
    const apiData = {
      documentName: values.fileName,
      tag: tag,
      requestType: requestType,
      modelId: router.query.modelId,
      outputFormat: values.outputFormat || outputFormatsListVC[1],
      range: values.range || "ALL",
      otherRequests: values.otherRequests,
      resultType:
        values.resultType ||
        props.user?.handleAccessibilityRequests ||
        RemediationSetting.AUTO,
    };
    props
      .addVc(apiData)
      .then(() => {
        logEvent(props.user?.id, "VC", "file_submitted");
        router.push(VIDEO_CAPTIONING_SUCCESS);
      })
      .catch((error: any) => {
        console.log(error.message);
      });
  };
  const { can } = useAppAbility();
  const [showEscalationFields, setShowEscalationFields] = useState(false);
  const [pagesValue, setPagesValue] = useState("");
  const access: boolean = can("VIEW", "AI_SERVICES");
  const [choice, setChoice] = useState("");
  const [heading, setHeading] = useState("");
  const [requestType, setRequestType] = useState<string | string[]>();
  const [textExtract, setTextExtract] = useState<Boolean>(false);
  const optionSelected = (value: string, option: object) => {
    setChoice(value);
  };
  useEffect(() => {
    props.resetList();
    setRequestType(router.query.requestType);
    if (router.query.requestType === "OCR") {
      setHeading("Step 2: File details");
      setTextExtract(true);
    } else {
      setHeading("Step 3: File details");
    }
    initialFocus.current?.focus();
  }, [props]);
  const handleResultTypeChange = (event: any) => {
    if (event.target.value === RemediationSetting.AUTO) {
      setShowEscalationFields(false);
    } else {
      setShowEscalationFields(true);
    }
  };
  const [form] = Form.useForm();
  const setFilenameValue = (value: string): void => {
    const filename = value.replace(new RegExp(/[.].{3,}/, "i"), "");
    form.setFieldsValue({ fileName: filename });
    console.log("Filename value set...");
  };
  return (
    <Wrapper>
      <Head>
        <title>New A/V Accessibility Request | I-Stem</title>
      </Head>
      {access ? (
        <FormLayout form="vcForm" hideFooter={false}>
          <section className="pl-20 pt-12">
            <Form
              aria-live="polite"
              className="width-50p"
              size="large"
              id="vcForm"
              onFinish={formSubmit}
              form={form}
            >
              <div ref={initialFocus} tabIndex={-1}>
                <h2 className="font-semibold text-3xl mb-12">{heading}</h2>
              </div>

              <Form.Item>
                <label>
                  <h3 className="font-semibold text-xl leading-9">
                    Upload your file *
                  </h3>
                  <p className="font-medium leading-normal">
                    Supported Input Formats: Video and audio formats. Max file
                    size limit - 200 mb
                  </p>
                </label>
                <div className="width-40p pt-4">
                  <Upload
                    label="Upload File"
                    type="vcService"
                    size={200}
                    accept={
                      router.query.requestType === "OCR"
                        ? "video/*"
                        : "audio/*,video/*"
                    }
                    onUpload={setFilenameValue}
                    serviceType={
                      router.query.requestType === "OCR"
                        ? serviceTypeEnum.ocr
                        : serviceTypeEnum.caption
                    }
                  />
                </div>
              </Form.Item>

              <label>
                <h3 className="font-semibold text-xl leading-9">File name *</h3>
              </label>
              <Form.Item
                name="fileName"
                rules={[
                  { required: true, message: "File Name is required" },
                  {
                    pattern: new RegExp(VALID_FILE_NAME),
                    message: "File name should be atleast 3 characters",
                  },
                ]}
              >
                <Input
                  aria-live="off"
                  className="lip-button"
                  placeholder="File name"
                />
              </Form.Item>

              <label>
                <h3 className="font-semibold text-xl leading-9">
                  Tag (Optional)
                </h3>
              </label>
              <div className="tags-dropdown" aria-live="off">
                <DropdownWrapper
                  getDropdownListItems={props.searchTag}
                  setSelectedOrTypedInputValue={setTag}
                  name="tagElement"
                  id="tagElement"
                  label="Choose existing tag or create new tag for this request by typing new value"
                />
              </div>
              {props.user?.handleAccessibilityRequests ===
                RemediationSetting.ASK_USER && (
                <>
                  <Form.Item
                    className="width-41p"
                    name="resultType"
                    // rules={[
                    //   { required: true, message: "Category is required" },
                    // ]}
                  >
                    <fieldset className="afc-fieldset">
                      <legend
                        className="font-semibold text-xl leading-9"
                        style={{ width: "max-content" }}
                      >
                        What to do with this request?
                      </legend>
                      <RadioCheck
                        value={RemediationSetting.AUTO}
                        htmlType="radio"
                        name="resultType"
                        label="SEND AUTOMATED CONVERSION RESULTS FROM AI SERVICES"
                        id="auto"
                        onChange={handleResultTypeChange}
                      />
                      <RadioCheck
                        value={RemediationSetting.MANUAL}
                        htmlType="radio"
                        name="resultType"
                        label="SEND 100% ACCURATE RESULTS AFTER MANUAL REMEDIATION"
                        id="manual"
                        onChange={handleResultTypeChange}
                      />
                    </fieldset>
                  </Form.Item>
                </>
              )}
              {(props.user?.handleAccessibilityRequests ===
                RemediationSetting.MANUAL ||
                showEscalationFields) && (
                <>
                  <label htmlFor="pagesElement">
                    <h3 className="font-semibold text-xl leading-9">
                      Seconds/minutes for Manual Remediation *
                    </h3>
                  </label>
                  <Form.Item
                    className="width-41p"
                    name="pages"
                    id="pagesElement"
                  >
                    <Select
                      native
                      label="Accessible PDF"
                      className="lip-button format-button"
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      variant="outlined"
                      defaultValue="none"
                      onChange={e => setPagesValue(String(e.target.value))}
                    >
                      {" "}
                      <option value="none" disabled>
                        Select
                      </option>
                      <option value="ALL">All</option>
                      <option value="CUSTOM">Custom</option>
                    </Select>
                  </Form.Item>
                  {pagesValue === "CUSTOM" && (
                    <>
                      <label htmlFor="rangeElement">
                        <h3 className="font-semibold text-xl leading-9">
                          Seconds/minutes ranges, separated by dash and commas,
                          e.g. 2-3, 5-7 etc.
                        </h3>
                      </label>
                      <Form.Item
                        id="rangeElement"
                        name="range"
                        rules={[
                          {
                            pattern: new RegExp(
                              "[0-9]+-[0-9]+(?:,[0-9]+-[0-9]+)*"
                            ),
                            message:
                              "Seconds/minutes ranges must be separated by dash and commas",
                          },
                        ]}
                      >
                        <Input
                          aria-live="off"
                          className="lip-button"
                          placeholder="Custom range 1-5,8-10,10-15"
                        />
                      </Form.Item>
                    </>
                  )}
                  <label htmlFor="otherRequestsElement">
                    <h3 className="font-semibold text-xl leading-9">
                      Any other requests for manual conversion
                    </h3>
                    <p>
                      e.g. deadline for getting the results so that we could
                      customize and prioritize accordingly etc.
                    </p>
                  </label>
                  <Form.Item id="otherRequestsElement" name="otherRequests">
                    <Input
                      aria-live="off"
                      className="lip-button"
                      placeholder="Requests"
                    />
                  </Form.Item>{" "}
                </>
              )}

              {textExtract ? (
                <div></div>
              ) : (
                <div>
                  <label>
                    <h3 className="font-semibold text-xl leading-9">
                      Select output format *
                    </h3>
                  </label>
                  <Form.Item
                    className="width-41p"
                    name="outputFormat"
                    rules={[{ required: true, message: "Select an option" }]}
                  >
                    <Select
                      placeholder=".txt,.srt"
                      native
                      label=".txt,.srt"
                      className="lip-button format-button"
                      labelId="demo-simple-select-filled-label"
                      id="demo-simple-select-filled"
                      variant="outlined"
                      defaultValue="none"
                    >
                      {" "}
                      <option value="none" disabled>
                        Select output format
                      </option>
                      {outputFormatsListVC.map(option => {
                        return (
                          <option value={option} key={option}>
                            {option}
                          </option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
              )}
            </Form>
          </section>
        </FormLayout>
      ) : (
        <Error statusCode={403} title="Access Denied" />
      )}
    </Wrapper>
  );
};
NewVideo.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IStemServices.InitialProps> => {
  const { user, token } = ctx.store.getState().auth;
  return { namespacesRequired: ["common"], token, user };
};

const mapStateToProps = (store: IStore) => {
  const { auth, credits } = store;
  return {
    user: auth.user,
  };
};
const mapDispatchToProps = {
  addVc: VcServiceActions.Add,
  resetList: UploadActions.resetUploadList,
  searchTag: TagsActions.Search,
};
const Extended = connect(mapStateToProps, mapDispatchToProps)(NewVideo);
export default PrivateRoute(Extended);
