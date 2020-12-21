import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { Form, Input, Radio } from "antd";
import { Select } from "@material-ui/core";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { logEvent } from "@Services/monitoring/GoogleAnalytics";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { ITagsData, ITagsResponse } from "@Interfaces";
import { IStemServices, ReduxNextPageContext } from "@Interfaces";
import { Wrapper } from "@Components";
import {
  AFCRequestOutputFormat,
  outputFormatsListAFC,
} from "@Definitions/Constants/dashboard-form-constants";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import { AfcServiceActions, UploadActions } from "@Actions";
import {
  AFC_SUCCESS,
  AFC_SUCCESS_UPLOADING,
} from "@Definitions/Constants/pageroutes";
import RadioCheck from "@Components/HOC/Dashboard/RadioCheck";
import DropdownWrapper from "@Components/StemServices/DropdownComponent";
import Upload from "@Components/Upload";
import { VALID_FILE_NAME } from "@Definitions/Constants";
import PrivateRoute from "../../_privateRoute";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";

const NewFile: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const initialFocus = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [tag, setTag] = useState<string>();
  const formSubmit = (values: any) => {
    const documentData = {
      documentName: values.fileName,
      tag: tag,
      outputFormat: values.outputFormat,
      docType: values.docType,
    };
    console.log("Document data: ", documentData);
    props
      .addAfc(documentData)
      .then((result: any) => {
        if (result.inputFileId) {
          console.log("Successfully uploaded the file.", result.inputFileId);
          logEvent("AFC", "file_submitted");
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
    if (event.target.value == "MATH") {
      setHideNonMathFormat(true);
    } else {
      setHideNonMathFormat(false);
    }
  };
  const outputFormat = Array.from(outputFormatsListAFC)
    .filter(([key, val]) => {
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
                    label="Upload File"
                    type="afcService"
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
const mapDispatchToProps = {
  addAfc: AfcServiceActions.Add,
  resetList: UploadActions.resetUploadList,
};

const Extended = connect(null, mapDispatchToProps)(NewFile);

export default PrivateRoute(Extended);
