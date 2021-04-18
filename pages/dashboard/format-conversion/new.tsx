import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { Form, Input } from "antd";
import { Select } from "@material-ui/core";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { logEvent } from "@Services/monitoring/GoogleAnalytics";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { IStemServices, IStore, ReduxNextPageContext } from "@Interfaces";
import { Wrapper } from "@Components";
import {
  AFCRequestOutputFormat,
  outputFormatsListAFC,
} from "@Definitions/Constants/dashboard-form-constants";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import { AfcServiceActions, UploadActions, TagsActions } from "@Actions";
import {
  AFC_SUCCESS,
  AFC_SUCCESS_UPLOADING,
} from "@Definitions/Constants/pageroutes";
import RadioCheck from "@Components/HOC/Dashboard/RadioCheck";
import DropdownWrapper from "@Components/StemServices/DropdownComponent";
import Upload from "@Components/Upload";
import { RemediationSetting, VALID_FILE_NAME } from "@Definitions/Constants";
import PrivateRoute from "../../_privateRoute";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";
import { serviceTypeEnum } from "@Components/Upload/constants";
import { event } from "react-ga";

const NewFile: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [tag, setTag] = useState<string>();
  const [pagesValue, setPagesValue] = useState("");
  const [showEscalationFields, setShowEscalationFields] = useState(false);
  const formSubmit = (values: any) => {
    const documentData = {
      documentName: values.fileName,
      tag: tag,
      outputFormat: values.outputFormat,
      docType: values.docType,
      range: values.range || "ALL",
      otherRequests: values.otherRequests,
      resultType:
        values.resultType ||
        props.user?.handleAccessibilityRequests ||
        RemediationSetting.AUTO,
    };
    console.log("Document data: " + JSON.stringify(documentData));
    props
      .addAfc(documentData)
      .then((result: any) => {
        logEvent(props.user?.id, "AFC", "file_submitted");
        if (result.inputFileId && result.inputFileLink) {
          console.log("Successfully uploaded the file.", result.inputFileId);
          router.push(AFC_SUCCESS);
        } else {
          console.log("Uploading the file.", result);
          router.push(AFC_SUCCESS_UPLOADING);
        }
      })
      .catch((error: any) => {
        console.log("Error occurred while sending request.", error);
      });
  };
  const { can } = useAppAbility();
  const access: boolean = can("VIEW", "AI_SERVICES");
  useEffect(() => {
    props.resetList();
    initialFocus?.current?.focus();
  }, [props]);

  console.log("updated tag value: " + tag);
  const [form] = Form.useForm();
  const setFilenameValue = (value: string): void => {
    const filename = value.replace(new RegExp(/[.].{3,4}$/, "i"), "");
    form.setFieldsValue({ fileName: filename });
  };
  const [hideNonMathFormat, setHideNonMathFormat] = useState(false);

  const handleMathChange = (event: any) => {
    if (event.target.value === "MATH") {
      setHideNonMathFormat(true);
    } else {
      setHideNonMathFormat(false);
    }
  };
  const handleResultTypeChange = (event: any) => {
    if (event.target.value === RemediationSetting.AUTO) {
      setShowEscalationFields(false);
    } else {
      setShowEscalationFields(true);
    }
  };
  const outputFormat = Array.from(outputFormatsListAFC)
    .filter(([key]) => {
      return hideNonMathFormat
        ? [AFCRequestOutputFormat.HTML, AFCRequestOutputFormat.WORD].includes(
            key
          )
        : true;
    })
    .map(([k, val]) => {
      return (
        <option className="lip-button format-button" value={k} key={k}>
          {val}
        </option>
      );
    });

  return (
    <Wrapper>
      <Head>
        <title>New DOC Accessibility Request | I-Stem</title>
      </Head>
      {access ? (
        <FormLayout form="afcForm" hideFooter={false}>
          <section className="pl-20 pt-12">
            <Form
              aria-live="polite"
              className="width-50p"
              size="large"
              id="afcForm"
              onFinish={formSubmit}
              form={form}
            >
              <div ref={initialFocus} tabIndex={-1}>
                <h2 className="font-semibold text-3xl mb-12">
                  New Document Accessibility Request
                </h2>
              </div>

              <Form.Item>
                <label>
                  <h3 className="font-semibold text-xl leading-9">
                    Upload your file *
                  </h3>
                  <p className="font-medium leading-normal">
                    Supported Input Formats: PDF, Image (JPG, JPEG, PNG, TIFF,
                    BMP, etc.). Max file size limit - 20 mb
                  </p>
                </label>
                <div className="width-40p pt-4">
                  <Upload
                    type="afcService"
                    label="Upload File"
                    serviceType={serviceTypeEnum.afc}
                    size={20}
                    accept="image/*,.pdf"
                    onUpload={setFilenameValue}
                  />
                </div>
              </Form.Item>

              <label htmlFor="fileNameElement">
                <h3 className="font-semibold text-xl leading-9">File name *</h3>
              </label>
              <Form.Item
                id="fileNameElement"
                name="fileName"
                rules={[
                  { required: true, message: "File name is required" },
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

              <label htmlFor="tagElement">
                <h3 className="font-semibold text-xl leading-9">
                  Tag (Optional)
                </h3>
              </label>
              <div className="tags-dropdown" aria-live="off">
                <DropdownWrapper
                  setSelectedOrTypedInputValue={setTag}
                  name="tagElement"
                  id="tagElement"
                  getDropdownListItems={props.searchTag}
                  label="Choose existing tag or create new tag for this request by typing new value"
                />
              </div>
              <Form.Item
                className="width-41p"
                name="docType"
                // rules={[{ required: true, message: "Category is required" }]}
              >
                <fieldset className="afc-fieldset">
                  <legend
                    className="font-semibold text-xl leading-9"
                    style={{ width: "max-content" }}
                  >
                    Does this document contain math? *
                  </legend>
                  <RadioCheck
                    value="MATH"
                    htmlType="radio"
                    name="docType"
                    label="Yes"
                    id="yesMath"
                    onChange={handleMathChange}
                  />
                  <RadioCheck
                    value="NONMATH"
                    htmlType="radio"
                    name="docType"
                    label="No"
                    id="noMath"
                    onChange={handleMathChange}
                  />
                </fieldset>
              </Form.Item>
              {props.user?.handleAccessibilityRequests ===
                RemediationSetting.ASK_USER && (
                <>
                  <Form.Item
                    className="width-41p"
                    name="resultType"
                    // rules={[{ required: true, message: "Category is required" }]}
                  >
                    <fieldset className="afc-fieldset">
                      <legend
                        className="font-semibold text-xl leading-9"
                        style={{ width: "max-content" }}
                      >
                        What to do with this request?{" "}
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
                  {" "}
                  <label htmlFor="pagesElement">
                    <h3 className="font-semibold text-xl leading-9">
                      Pages for Manual Remediation *
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
                          Page ranges, separated by dash and commas, e.g. 2-3,
                          5-7 etc.
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
                              "Page ranges must be separated by dash and commas",
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

              <label>
                <h3 className="font-semibold text-xl leading-9">
                  Select output format *
                </h3>
              </label>
              <Form.Item
                className="width-41p"
                name="outputFormat"
                id="selectOutputFormatElement"
                rules={[{ required: true, message: "Select an option" }]}
              >
                <Select
                  native
                  label="Accessible PDF"
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
                  {outputFormat}
                </Select>
              </Form.Item>
            </Form>
          </section>
        </FormLayout>
      ) : (
        <Error statusCode={403} title="Access Denied" />
      )}
    </Wrapper>
  );
};
NewFile.getInitialProps = async (
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
  addAfc: AfcServiceActions.Add,
  resetList: UploadActions.resetUploadList,
  searchTag: TagsActions.Search,
};

const Extended = connect(mapStateToProps, mapDispatchToProps)(NewFile);

export default PrivateRoute(Extended);
