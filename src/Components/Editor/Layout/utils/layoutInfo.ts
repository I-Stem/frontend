import { Editor, State } from "@Components/Editor/EditorTypings";
import { PageActivityInterface } from "@Interfaces";
import { EditorServices } from "@Services/API/Editor";
import { getObject, putObject, saveObject } from "@utils/indexedDb";
import { RefObject } from "react";
import { BoundingBoxProperty } from "../CanvasTypes";
import { toJson } from "./canvasUtils";
import { mapCanvasBoundingBoxesToRemediationAPISchema } from "./parseData";

/*
export interface PageLayoutAndTextInfo {
  layoutInfo: Editor.BoundingBoxWithCorrectedOCRText;
}

export interface PagewiseLayoutAndTextInfo {
  [key: string]: {
    [key in State]: PageLayoutAndTextInfo;
  };
}

const versionMaintainerForLayoutInfo = (
  data: PagewiseLayoutAndTextInfo,
  currentPage: number,
  layoutInfo: Editor.BoundingBoxWithCorrectedOCRText[]
) => {
  let pageData = {};
  if (currentPage in data) {
    const currentPageData = data[currentPage];
    if (1 in currentPageData) {
      //delete currentPageData[0];
      pageData = {
        0: { layoutInfo: currentPageData[1].layoutInfo },
        1: { layoutInfo },
      };
    } else {
      pageData = {
        ...currentPageData,
        1: { layoutInfo },
      };
    }
  } else {
    pageData = {
      0: {
        layoutInfo,
      },
    };
  }

  return pageData;
};
*/

export const getRelativeBoxesInX1Y1X2Y2FromRelativeXYWH = (
  relativeXYWH: Editor.BoundingBoxType
): Editor.BoundingBoxType => {
  return [
    relativeXYWH[0],
    relativeXYWH[1],
    relativeXYWH[0] + relativeXYWH[2],
    relativeXYWH[1] + relativeXYWH[3],
  ];
};

export const getRelativeBoxInXYWHFromX1Y1X2Y2 = (
  relativeX1Y1X2Y2: Editor.BoundingBoxType
): Editor.BoundingBoxType => {
  return [
    relativeX1Y1X2Y2[0],
    relativeX1Y1X2Y2[1],
    relativeX1Y1X2Y2[2] - relativeX1Y1X2Y2[0],
    relativeX1Y1X2Y2[3] - relativeX1Y1X2Y2[1],
  ];
};

export const getScaledUpBox = (
  relativeBox: Editor.BoundingBoxType,
  canvasWidth: number,
  canvasHeight: number
): Editor.BoundingBoxType => {
  return [
    relativeBox[0] * canvasWidth,
    relativeBox[1] * canvasHeight,
    relativeBox[2] * canvasWidth,
    relativeBox[3] * canvasHeight,
  ];
};

export const getScaledDownBox = (
  absoluteBox: Editor.BoundingBoxType,
  canvasWidth: number,
  canvasHeight: number
) => {
  return [
    absoluteBox[0] / canvasWidth,
    absoluteBox[1] / canvasHeight,
    absoluteBox[2] / canvasWidth,
    absoluteBox[3] / canvasHeight,
  ];
};

export const getTextInfoForLayoutFromRemediationAPI = async (
  fileId: string,
  currentPage: number,
  boundingBoxes: Array<BoundingBoxProperty>,
  twoColumn: boolean,
  analytics: PageActivityInterface,
  type: string,
  version: string
): Promise<{
  hasError: boolean;
  errorMessage: string | null;
  data: Editor.BoundingBoxWithCorrectedOCRText[];
}> =>
  new Promise((resolve, reject) => {
    toJson(`${fileId}-json`, async (json: Editor.OCRJsonSchema) => {
      const layoutInfo = mapCanvasBoundingBoxesToRemediationAPISchema(
        boundingBoxes,
        currentPage - 1,
        json,
        type,
        version,
        twoColumn
      );
      if (!layoutInfo) {
        return resolve({
          hasError: true,
          errorMessage:
            "Couldn't make request for text, error while data conversion",
          data: [],
        });
      }

      try {
        const res = await EditorServices.layoutText(currentPage, fileId, {
          analytics,
          recreationApi: layoutInfo,
        });

        console.log("api response: " + JSON.stringify(res));
        if (!res) {
          return resolve({
            hasError: true,
            errorMessage:
              "Couldn't get text data from backend, please try again.",
            data: [],
          });
        }
        if (res.code !== 200) {
          return resolve({
            hasError: true,
            errorMessage: res.message,
            data: [],
          });
        } else {
          return resolve({
            hasError: false,
            errorMessage: null,
            data: res.layoutInfo,
          });
        }
      } catch (error) {
        return resolve({
          hasError: true,
          errorMessage: "Couldn't call text API.",
          data: [],
        });
      }
    });
    console.log("exiting backend api call");
  });
