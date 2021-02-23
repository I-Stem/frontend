import React, { Fragment, useEffect, useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import {
  Typography,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
// #endregion Global Imports

// #region Local Imports
import "../style.scss";
import { BlueButton, GreenButton } from "@Components/HOC/Dashboard/CTAButtons";
import { WhiteButton } from "@Components/HOC/Dashboard/CTAButtons";
import { IStemServices, IVCModels, IStore } from "@Interfaces";
import { Wrapper } from "@Components";
import { FormLayout } from "@Components/HOC/Dashboard/FormHOC";
import { VcServiceActions, UploadActions } from "@Actions";
import {
  VIDEO_CAPTIONING_NEW_REQUEST,
  TRAINING,
} from "@Definitions/Constants/pageroutes";
import Upload from "@Components/Upload";
import { VALID_FILE_NAME } from "@Definitions/Constants";
import PrivateRoute from "../../_privateRoute";
import { useAppAbility } from "src/Hooks/useAppAbility";
import Error from "next/error";
import { serviceTypeEnum } from "@Components/Upload/constants";

const Steptwo: NextPage<IStemServices.IProps, IStemServices.InitialProps> = (
  props: any
) => {
  const [selectedCustom, setSelectedCustom] = useState<Boolean>(false);
  const [opneDialog, setDialog] = useState(false);
  const [modelId, setModelId] = useState();
  const [modelName, setModelName] = useState("");
  const router = useRouter();
  const [modelsList, setModelsList] = useState([] as IVCModels[]);
  const { can } = useAppAbility();
  const access: boolean = can("VIEW", "AI_SERVICES");
  const { register, handleSubmit } = useForm();
  const [modelType, setModelType] = useState();
  const setFilenameValue = (value: string): void => {
    const filename = value.replace(new RegExp(/[.].{3,4}/, "i"), "");
    console.log("Filename value set...");
  };
  useEffect(() => {
    props.vcModelsList().then((result: any) => {
      setModelsList(result);
    });
  }, [props]);
  const trainModel = () => {
    setDialog(true);
  };
  const handleClose = () => {
    setDialog(false);
  };
  const handleServiceChange = (event: any, modelType: any) => {
    setModelType(modelType);
    if (modelType === "custom") {
      setSelectedCustom(true);
    } else {
      setSelectedCustom(false);
    }
  };
  const newTrainingModel = (data: any) => {
    console.log("data", data);
    const modelData = {
      name: modelName,
      dataFileId: props.dataFileId,
    };
    props.addModel(modelData).then((result: any) => {
      console.log("Result: ", result);
      props.resetList();
    });

    router.push(TRAINING);
  };
  const handleModelSubmit = () => {
    router.push({
      pathname: VIDEO_CAPTIONING_NEW_REQUEST,
      query: {
        requestType: router.query.requestType,
        modelId: selectedCustom ? modelId : "standard",
      },
    });
  };

  return (
    <Wrapper>
      <Head>
        <title>Select model | I-Stem</title>
      </Head>
      {access ? (
        <Fragment>
          <FormLayout form="vcModelSelectForm" hideFooter={false}>
            <form
              className="lip-margin"
              id="vcModelSelectForm"
              onSubmit={handleSubmit(handleModelSubmit)}
            >
              <Typography variant="h2" gutterBottom>
                Step 2: Choose a training model
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                You can choose a standard model or train your own custom model
                for better targetted results. If you are unsure about this, you
                can continue with the standard model.
              </Typography>
              <ToggleButtonGroup
                orientation="vertical"
                value={modelType}
                onChange={handleServiceChange}
                exclusive
              >
                <ToggleButton
                  className="lip-button lip-model-button"
                  value="standard"
                >
                  Standard Model
                </ToggleButton>
                <ToggleButton
                  className="lip-button lip-model-button"
                  value="custom"
                >
                  Custom Model
                </ToggleButton>
              </ToggleButtonGroup>
              {selectedCustom ? (
                <div className="custom-div">
                  <Typography variant="h3" gutterBottom>
                    Choose existing model or
                    <a className="train-model" onClick={trainModel}>
                      {" "}
                      train a new model
                    </a>
                  </Typography>
                  <Select
                    native
                    className="lip-button lip-model-button"
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    placeholder="Choose custom model"
                    onChange={(event: any, child: any) =>
                      setModelId(event.target.value)
                    }
                    variant="outlined"
                    defaultValue="none"
                  >
                    {" "}
                    <option value="none" disabled>
                      Choose custom model
                    </option>
                    {modelsList?.map(option => {
                      return (
                        <option value={option.modelId} key={option.modelId}>
                          {option.name}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              ) : (
                <div></div>
              )}
            </form>
          </FormLayout>

          <Dialog
            open={opneDialog}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle
              className="lip-title font-semibold text-xl leading-9"
              id="form-dialog-title"
            >
              TRAIN A NEW MODEL
            </DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit(newTrainingModel)}>
                <label className="lip-subtext font-semibold text-xl leading-9">
                  Model name
                </label>
                <br />
                <TextField
                  className="lip-button lip-dialog-button"
                  id="outlined-basic"
                  placeholder="Name with which you want to refer this model later in requests"
                  variant="outlined"
                  name="modelName"
                  ref={register}
                  onChange={event => setModelName(event.target.value)}
                />
                <br />
                <label className="lip-subtext font-semibold text-xl leading-9">
                  Upload file for custom training model
                </label>
                <Typography
                  className="lip-subtext"
                  variant="subtitle1"
                  gutterBottom
                >
                  Supported Input Formats: .pdf, .txt, word file, etc. File size
                  limit - 20 mb
                </Typography>
                <div className="lip-button lip-dialog-button">
                  <Upload
                    label="Upload Model"
                    type="customModel"
                    size={20}
                    accept=".pdf,.txt,image/*"
                    onUpload={setFilenameValue}
                    serviceType={serviceTypeEnum.customModel}
                  />
                </div>
                <div className="lip-button lip-dialog-button">
                  <GreenButton htmlType="submit" disabled={!props.dataFileId}>
                    TRAIN MODEL
                  </GreenButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </Fragment>
      ) : (
        <Error statusCode={403} title="Access Denied" />
      )}
    </Wrapper>
  );
};
const mapStateToProps = (store: IStore) => {
  const { vcService } = store;
  return {
    dataFileId: vcService.dataFileId,
  };
};

const mapDispatchToProps = {
  vcModelsList: VcServiceActions.GetVCModels,
  resetList: UploadActions.resetUploadList,
  addModel: VcServiceActions.AddModel,
};
const Extended = connect(mapStateToProps, mapDispatchToProps)(Steptwo);
export default PrivateRoute(Extended);
