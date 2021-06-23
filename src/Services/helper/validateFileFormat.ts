import { serviceTypeEnum } from "@Components/Upload/constants";
import {
  AfcRequestInputFormat,
  JobPreferencesResumeFormat,
  RemediatedFileFormat,
  VCCustomModelInputFormat,
  VCRequestInputAudioFormat,
  VCRequestInputVideoFormat,
} from "@Definitions/Constants/dashboard-form-constants";

const validateFileFormat = (fileName: string, serviceType: serviceTypeEnum) => {
  const extensionExist = fileName.lastIndexOf(".");
  if (serviceType === serviceTypeEnum.afc) {
    if (extensionExist > -1) {
      const extension = fileName.split(".").pop();
      if (
        !Object.values(AfcRequestInputFormat).includes(
          extension?.toUpperCase()! as any
        )
      ) {
        window.alert("File type not supported");
        return false;
      }
    } else {
      window.alert("File type not supported");
      return false;
    }
  } else if (serviceType === serviceTypeEnum.caption) {
    if (extensionExist > -1) {
      const extension = fileName.split(".").pop();
      if (
        !(
          Object.values(VCRequestInputAudioFormat).includes(
            extension?.toUpperCase()! as any
          ) ||
          Object.values(VCRequestInputVideoFormat).includes(
            extension?.toUpperCase()! as any
          )
        )
      ) {
        window.alert("File type not supported");
        return false;
      }
    } else {
      window.alert("File type not supported");
      return false;
    }
  } else if (serviceType === serviceTypeEnum.ocr) {
    if (extensionExist > -1) {
      const extension = fileName.split(".").pop();
      if (
        !Object.values(VCRequestInputVideoFormat).includes(
          extension?.toUpperCase()! as any
        )
      ) {
        window.alert("File type not supported");
        return false;
      }
    } else {
      window.alert("File type not supported");
      return false;
    }
  } else if (serviceType === serviceTypeEnum.customModel) {
    if (extensionExist > -1) {
      const extension = fileName.split(".").pop();
      if (
        !Object.values(VCCustomModelInputFormat).includes(
          extension?.toUpperCase()! as any
        )
      ) {
        window.alert("File type not supported");
        return false;
      }
    } else {
      window.alert("File type not supported");
      return false;
    }
  } else if (serviceType === serviceTypeEnum.job) {
    if (extensionExist > -1) {
      const extension = fileName.split(".").pop();
      if (
        !Object.values(JobPreferencesResumeFormat).includes(
          extension?.toUpperCase()! as any
        )
      ) {
        window.alert("File type not supported");
        return false;
      }
    } else {
      window.alert("File type not supported");
      return false;
    }
  } else if (serviceType === serviceTypeEnum.escalation) {
    if (extensionExist > -1) {
      const extension = fileName.split(".").pop();
      if (
        !Object.values(RemediatedFileFormat).includes(
          extension?.toUpperCase()! as any
        )
      ) {
        window.alert("File type not supported");
        return false;
      }
    } else {
      window.alert("File type not supported");
      return false;
    }
  }

  return true;
};

export { validateFileFormat };
