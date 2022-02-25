import { RefObject } from "react";
import {
  createBoundingBox,
  formatLabelForAPI,
  formatLabelForCanvas,
  getCanvasLabelFromHierLabels,
  toJson,
} from "./canvasUtils";
import { BoxContent, Editor } from "../../EditorTypings";
import { BoundingBoxProperty, CanvasBoundingBoxLabel } from "../CanvasTypes";
import { saveBoundingBoxesInIndexedDB } from "./LayoutInfoDBManager";
import { getRelativeBoxesInX1Y1X2Y2FromRelativeXYWH } from "./layoutInfo";
import { getContentForBoxDigital } from "@Components/Editor/Content/ckeditor/InitialRichEditorState";
import { saveEditorStateInDB } from "@Components/Editor/Content/ConflictUtils";
import { generateHtmlForPage } from "@Components/Editor/Html/HtmlViewerHelpers";

const layoutDBName = "i-stem";

export const mapCanvasBoundingBoxesToRemediationAPISchema = (
  boundingBoxes: Array<BoundingBoxProperty>,
  zeroIndexedBasedPage: number,
  ocrJson: Editor.OCRJsonSchema | any,
  type: string,
  version: string,
  twoColumn: boolean
) => {
  const corrections: Editor.BoxCorrections[] = [];
  let layoutInfo: Editor.LayoutInfo;
  if (type === "DIGITAL") {
    layoutInfo = {
      page_width: 0,
      page_height: 0,
      page_numbers: [zeroIndexedBasedPage],
      ocr_text: ocrJson.elements[zeroIndexedBasedPage],
      table_results: [],
      corrections: [],
      line_data: "",
      word_data: "",
      detections: [],
      two_column: twoColumn,
      is_math: ocrJson.math,
      type,
      version,
    };
  } else {
    layoutInfo = {
      page_width: 0,
      page_height: 0,
      page_numbers: [zeroIndexedBasedPage],
      ocr_text: ocrJson.meta?.ocr_text
        ? ocrJson.meta?.ocr_text[zeroIndexedBasedPage]
        : ocrJson.ocr_text[zeroIndexedBasedPage],
      table_results: ocrJson.meta?.table_results
        ? ocrJson.meta?.table_results[zeroIndexedBasedPage]
        : ocrJson.table_results[zeroIndexedBasedPage] || [],
      corrections: [],
      line_data: ocrJson.meta?.line_data
        ? ocrJson.meta.line_data[zeroIndexedBasedPage]
        : "",
      word_data: ocrJson.meta?.word_data
        ? ocrJson.meta.word_data[zeroIndexedBasedPage]
        : "",
      detections: ocrJson.meta?.detections
        ? ocrJson.meta?.detections[zeroIndexedBasedPage]
        : ocrJson[zeroIndexedBasedPage].filter(
            (pageColumn: { idx: number }) => pageColumn.idx === -1
          )[0].content.detections,
      two_column: twoColumn,
      is_math: ocrJson.math,
      type,
      version,
    };
  }
  boundingBoxes.forEach(box => {
    corrections.push({
      id: box.ind,
      label: formatLabelForAPI(box.label),
      relative_box: getRelativeBoxesInX1Y1X2Y2FromRelativeXYWH([
        box.x,
        box.y,
        box.w,
        box.h,
      ]),
      reading_order: box.order,
      page: zeroIndexedBasedPage,
      is_partial: false,
      level: box.level ?? undefined,
      type: box.type ?? undefined,
      hierId: box.hierId,
      scenario: box.scenario,
      isDeleted: box.isDeleted,
      operations: box.operations,
    });
  });
  layoutInfo.corrections = corrections;
  return layoutInfo;
};
const getOCRDetectionsForPageDigital = (
  ocrJson: Editor.OCRJsonSchemaDigital,
  zeroBasedPageNumber: number
): Editor.digitalOCRElements => {
  return ocrJson.elements[zeroBasedPageNumber];
};

const getOCRDetectionsForPage = (
  ocrJson: Editor.OCRJsonSchema | any,
  zeroBasedPageNumber: number
): Editor.OCRDetections => {
  if (ocrJson.math) {
    return ocrJson.meta.detections[zeroBasedPageNumber];
  } else {
    return ocrJson[zeroBasedPageNumber].filter(
      (pageColumn: { idx: number }) => pageColumn.idx === -1
    )[0].content.detections;
  }
};

function getHierListBounds(box: Editor.HierList | any) {
  const length = box.listItems!.length;
  const firstItemBounds = box.listItems[0].Children[0].Bounds;
  let x1 = firstItemBounds[0];
  let y1 = firstItemBounds[3];
  let x2 = firstItemBounds[2];
  let y2 = firstItemBounds[1];
  box.listItems?.map((item: any) => {
    let listBox;
    if (item.marker_type == Editor.DigitalLabels.LIST) {
      listBox = getHierListBounds(item.Children[0]);
      listBox = [listBox[0], listBox[3], listBox[2], listBox[1]];
    } else listBox = item.Children[0].Bounds;
    if (listBox[0] < x1) x1 = listBox[0];
    if (listBox[3] > y1) y1 = listBox[3];
    if (x2 < listBox[2]) x2 = listBox[2];

    if (y2 > listBox[1]) y2 = listBox[1];
  });

  return [x1, y1, x2, y2];
}

function getSpanningBoxAndContent(
  boxes: any[],
  pageSize: { width: number; height: number }
) {
  let minX1 = 99999,
    minY1 = 99999;
  let maxX2 = 0,
    maxY2 = 0;
  boxes.map((child, spanningIndex) => {
    if (child.Bounds[0] < minX1) minX1 = child.Bounds[0];

    if (child.Bounds[1] < minY1) minY1 = child.Bounds[1];

    if (child.Bounds[2] > maxX2) maxX2 = child.Bounds[2];

    if (child.Bounds[3] > maxY2) maxY2 = child.Bounds[3];
  });

  return {
    bbox: [
      minX1 / pageSize.width,
      (pageSize.height - maxY2) / pageSize.height,
      maxX2 / pageSize.width,
      (pageSize.height - minY1) / pageSize.height,
    ] as Editor.BoundingBoxType,
    content: boxes.map(child => child.Text).join(" "),
  };
}

export const getBoundsForDigital = (
  box: Editor.DigitalBoxContent,
  pageSize: { height: number; width: number }
): { bbox: Editor.BoundingBoxType; content: string; scenario?: string }[] => {
  switch (box.type) {
    case Editor.DigitalLabels.HEADING:
    case Editor.DigitalLabels.PARAGRAPH:
    case Editor.DigitalLabels.DOC_TITLE:
    case Editor.DigitalLabels.FOOTNOTES:
      {
        if (box.Children.length > 1) {
          let column1 = [box.Children[0]],
            column2 = [];
          let i = 1;
          while (i < box.Children.length) {
            if (
              column1[column1.length - 1].Bounds[2] < box.Children[i].Bounds[0]
            )
              break;
            else column1.push(box.Children[i]);
            i++;
          }

          for (let j = i; j < box.Children.length; j++)
            column2.push(box.Children[j]);

          if (column2.length > 0) {
            return [
              {
                ...getSpanningBoxAndContent(column1, pageSize),
                scenario: "COLSPAN",
              },
              {
                ...getSpanningBoxAndContent(column2, pageSize),
                scenario: "COLSPAN",
              },
            ];
          } else return [getSpanningBoxAndContent(column1, pageSize)];
        } else
          return [
            {
              bbox: [
                box.Children[0].Bounds[0] / pageSize.width,
                (pageSize.height - box.Children[0].Bounds[3]) / pageSize.height,
                box.Children[0].Bounds[2] / pageSize.width,
                (pageSize.height - box.Children[0].Bounds[1]) / pageSize.height,
              ],
              content: getContentForBoxDigital(box, -1),
            },
          ];
      }
      break;

    case Editor.DigitalLabels.FIGURE:
    case Editor.DigitalLabels.TABLE:
      if (box.Bounds)
        return [
          {
            bbox: [
              box.Bounds[0] / pageSize.width,
              (pageSize.height - box.Bounds[3]) / pageSize.height,
              box.Bounds[2] / pageSize.width,
              (pageSize.height - box.Bounds[1]) / pageSize.height,
            ],
            content: getContentForBoxDigital(box, -1),
          },
        ];
      break;

    case Editor.DigitalLabels.LIST:
      const listBox = getHierListBounds(box);
      return [
        {
          bbox: [
            listBox[0] / pageSize.width,
            (pageSize.height - listBox[1]) / pageSize.height,
            listBox[2] / pageSize.width,
            (pageSize.height - listBox[3]) / pageSize.height,
          ],
          content: getContentForBoxDigital(box, -1),
        },
      ];
      break;
  }

  return [
    {
      bbox: [0, 0, 0, 0],
      content: "unknown",
    },
  ];
};

export const getOcrJsonBoundingBoxesForPage = async (
  fileId: string,
  currentPage: number,
  docType: string
): Promise<BoundingBoxProperty[]> => {
  return new Promise((resolve, reject) => {
    toJson(
      `${fileId}-json`,
      (json: Editor.OCRJsonSchema & Editor.OCRJsonSchemaDigital) => {
        const bboxes: BoundingBoxProperty[] = [];

        if (docType === "DIGITAL") {
          console.log("parsing digital document");
          const boxContents: BoxContent[] = [];
          const cropBox = json.elements[currentPage - 1].boxes.CropBox;
          const pageSize = {
            height: cropBox[3],
            width: cropBox[2],
          };

          let boxIndex = 0;
          getOCRDetectionsForPageDigital(
            json,
            currentPage - 1
          ).page_content.map((box: Editor.DigitalBoxContent) => {
            const relativeBoxes = getBoundsForDigital(box, pageSize);
            relativeBoxes.forEach(relativeBox => {
              const boxObj: BoundingBoxProperty = createBoundingBox({
                label: getCanvasLabelFromHierLabels(box.type, {
                  hLevel: box.heading_level || 1,
                }) as CanvasBoundingBoxLabel,
                x: relativeBox.bbox[0],
                y: relativeBox.bbox[1],
                w: relativeBox.bbox[2] - relativeBox.bbox[0],
                h: relativeBox.bbox[3] - relativeBox.bbox[1],
                ind: boxIndex,
                hierId: box.element_id,
                scenario: relativeBox.scenario,
                color: "#008A5AB3",
                lineWidth: 1,
                order: boxIndex + 1,
                level:
                  box.type === Editor.DigitalLabels.HEADING
                    ? CanvasBoundingBoxLabel.HEADING + box.heading_level
                    : undefined,
                isDeleted: false,
              });
              bboxes.push(boxObj);

              const boxContent: BoxContent = {
                edited: false,
                id: boxObj.ind,
                label: boxObj.label,
                boxInX1Y1X2Y2: relativeBox.bbox,
                order: boxObj.order || 1,
                editorVersion: process.env.NEXT_PUBLIC_EDITOR_VERSION,
                content: relativeBox.content,
                metadata:
                  box.type === Editor.DigitalLabels.HEADING
                    ? {
                        level:
                          CanvasBoundingBoxLabel.HEADING + box.heading_level,
                      }
                    : undefined,
              };
              boxContents.push(boxContent);
              boxIndex += 1;
            });
          });

          if (boxContents.length > 0) {
            saveEditorStateInDB(fileId, currentPage, {
              hasPreviousState: false,
              currentState: {
                state: boxContents,
                boundingBoxes: bboxes,
              },
            });
            generateHtmlForPage(fileId, currentPage, null, docType, {
              hasPreviousState: false,
              currentState: {
                state: boxContents,
                boundingBoxes: bboxes,
              },
            });
          }
        } else
          getOCRDetectionsForPage(json, currentPage - 1).boxes.map(
            (box, ind) => {
              const object: BoundingBoxProperty = createBoundingBox({
                label: formatLabelForCanvas(
                  box.label,
                  null
                ) as CanvasBoundingBoxLabel,
                x: box.relative_box[0],
                y: box.relative_box[1],
                w: box.relative_box[2] - box.relative_box[0],
                h: box.relative_box[3] - box.relative_box[1],
                ind,
                color: "#008A5AB3",
                lineWidth: 1,
                order: ind + 1,
                isDeleted: false,
              });
              bboxes.push(object);
            }
          );

        saveBoundingBoxesInIndexedDB(fileId, currentPage, bboxes);

        return resolve(bboxes);
      }
    );
  });
};
