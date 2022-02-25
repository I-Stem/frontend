import { getObject, putObject, saveObject } from "@utils/indexedDb";
import { Editor } from "../../EditorTypings";
import { BoundingBoxProperty } from "../CanvasTypes";
const dbName = "i-stem";

export type LayoutEditorBoundingBoxInfo = {
  [key in string]: BoundingBoxProperty[];
};

export const getLayoutEditorBoundingBoxForPage = async (
  fileId: string,
  currentPage: number
) => {
  return new Promise((resolve, reject) => {
    getObject(
      dbName,
      "layout",
      `${fileId}-box`,
      (data: LayoutEditorBoundingBoxInfo) => {
        if (!data || !data[currentPage]) {
          return resolve(null);
        }

        return resolve(data[currentPage]);
      }
    );
  });
};

/*
export const getLayoutAndTextInfoForPage = async (fileId: string, currentPage:number):Promise<{[key in string]:PageLayoutAndTextInfo} | null> => {
    return new Promise((resolve, reject) => {
        getObject("i-stem", "layout", `${fileId}-layout`, async (data: PagewiseLayoutAndTextInfo) => {
            if(data && currentPage in data)
            resolve(data[currentPage]);
            else
            resolve(null);
    });
});
}
*/

export const saveBoundingBoxesInIndexedDB = (
  fileId: string,
  currentPage: number,
  boundingBoxes: Array<BoundingBoxProperty>
) => {
  const keyPath = `${fileId}-box`;
  getObject(
    "i-stem",
    "layout",
    keyPath,
    (data: { [pageNumber: string]: BoundingBoxProperty[] }) => {
      if (data !== null) {
        putObject(
          dbName,
          "layout",
          { ...data, [currentPage]: boundingBoxes },
          "id",
          keyPath
        );
      } else
        saveObject(
          dbName,
          "layout",
          "id",
          { [currentPage]: boundingBoxes },
          keyPath
        );
    }
  );
};

export interface IndexedDBBoundingBoxSchema {
  //1 based page numbers
  [pageNumber: number]: BoundingBoxProperty[];
}
export const getBoundingBoxesForPageFromIndexedDb = async (
  fileId: string,
  currentPage: number
): Promise<BoundingBoxProperty[] | null> => {
  return new Promise((resolve, reject) => {
    getObject(
      dbName,
      "layout",
      `${fileId}-box`,
      (data: IndexedDBBoundingBoxSchema) => {
        if (data === null || !(currentPage in data)) {
          return resolve(null);
        }

        return resolve(data[currentPage]);
      }
    );
  });
};

export const updateCanvasBoxesWithReadingOrder = async (
  fileId: string,
  currentPage: number,
  boxes: BoundingBoxProperty[],
  layoutWithText: Editor.BoundingBoxWithCorrectedOCRText[]
) => {
  for (let i = 0; i < layoutWithText.length; i++) {
    boxes.filter(box => box.ind === layoutWithText[i].id)[0].order =
      layoutWithText[i].reading_order;
  }

  await saveBoundingBoxesInIndexedDB(fileId, currentPage, boxes);

  return boxes;
};

export const updateExistingBoundingBoxes = async (
  fileId: string,
  currentPage: number,
  updatedBoxes: BoundingBoxProperty[]
) => {
  const boxes =
    (await getBoundingBoxesForPageFromIndexedDb(fileId, currentPage)) || [];
  const result = updatedBoxes.forEach(box => {
    const boxIndex = boxes.findIndex(oldBox => box.ind === oldBox.ind);
    boxes[boxIndex] = box;
  });

  saveBoundingBoxesInIndexedDB(fileId, currentPage, boxes);
};
