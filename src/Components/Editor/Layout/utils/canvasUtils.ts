import { BoxContent, Editor, EditorInterface } from "../../EditorTypings";
import { RefObject } from "react";
import { getObject, putObject, saveObject } from "../../../../utils/indexedDb";
import {
  BoundingBoxOperations,
  BoundingBoxProperty,
  CanvasBoundingBoxLabel,
} from "../CanvasTypes";
import { getRelativeBoxInXYWHFromX1Y1X2Y2, getScaledUpBox } from "./layoutInfo";
import { headingOptions, listTypes } from "../ContextMenuForm";
import { Box } from "@material-ui/core";

/* eslint-disable no-param-reassign */

export type Point = [number, number];

export const doesPointLieInBoxX1Y1X2Y2 = (
  point: Point,
  box: Editor.BoundingBoxType
) => {
  //console.log("clicked point (x, y): " + point[0] + ", " + point[1]);
  //console.log(`box x1y1x2y2: ${box[0]}, ${box[1]}, ${box[2]}, ${box[3]}`)
  return (
    point[0] >= box[0] &&
    point[0] <= box[2] &&
    point[1] >= box[1] &&
    point[1] <= box[3]
  );
};

export const cursorPosition = (
  canvas: HTMLCanvasElement,
  event: MouseEvent
) => {
  const ClientRect = canvas.getBoundingClientRect();
  //console.log(`canvas bounding box (width, height): (${ClientRect.right-ClientRect.left}, ${ClientRect.bottom-ClientRect.top} and canvas (width, height): (${canvas.width}, ${canvas.height})`);
  return {
    x:
      ((event.clientX - ClientRect.left) /
        (ClientRect.right - ClientRect.left)) *
      canvas.width,
    y:
      ((event.clientY - ClientRect.top) /
        (ClientRect.bottom - ClientRect.top)) *
      canvas.height,
  };
};

function drawBoundingBox(
  boundingBox: BoundingBoxProperty,
  context: CanvasRenderingContext2D | null | undefined
) {
  if (context) {
    context.strokeStyle = boundingBox.color;
    context.lineWidth = boundingBox.lineWidth || 1;
    context?.beginPath();
    context?.rect(boundingBox.x, boundingBox.y, boundingBox.w, boundingBox.h);
    context?.stroke();
  } else {
    console.error("couldn't get canvas context");
  }
}

function drawBoundingBoxLabel(
  boundingBox: BoundingBoxProperty,
  context: CanvasRenderingContext2D | null | undefined
) {
  // Box for label
  if (context) {
    context?.rect(boundingBox.x, boundingBox.y, 15, 13);
    context?.stroke();
    // Label text
    context.font = "bold 12px Arial";
    context.fillStyle = boundingBox.color;
    context?.fillText(boundingBox.label, boundingBox.x + 2, boundingBox.y + 12);
  } else {
    console.error("couldn't get context");
  }
}

function drawBoundingBoxReadingOrder(
  boundingBox: BoundingBoxProperty,
  context: CanvasRenderingContext2D | null | undefined
) {
  if (context) {
    // Box for reading order
    context?.rect(boundingBox.x + boundingBox.w, boundingBox.y, 15, 13);
    context?.stroke();
    // Reading order text
    context.font = "bold 12px Arial";
    context.fillStyle = boundingBox.color;
    context?.fillText(
      String(boundingBox.order) || "unknown",
      boundingBox.x + boundingBox.w + 2,
      boundingBox.y + 10
    );
  } else {
    console.error("couldn't get canvas context");
  }
}

function drawConflictingBoundingBoxSign(
  boundingBox: BoundingBoxProperty,
  context: CanvasRenderingContext2D | null | undefined
) {
  if (context) {
    // Box for reading order
    context.strokeStyle = "#FF0000";
    context.beginPath();
    context?.arc(
      boundingBox.x + boundingBox.w + 10,
      boundingBox.y + 8,
      8,
      0,
      360
    );
    context?.stroke();
    // Reading order text
    context.font = "bold 12px Arial";
    context.fillStyle = "#FF0000";
    context?.fillText(
      "i",
      boundingBox.x + boundingBox.w + 8,
      boundingBox.y + 12
    );
  } else {
    console.error("couldn't get canvas context");
  }
}

export const drawRectangleWithLabel = (
  boundingBox: BoundingBoxProperty,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const context = (canvasRef.current?.getContext(
    "2d"
  ) as unknown) as CanvasRenderingContext2D;
  drawBoundingBox(boundingBox, context);
  drawBoundingBoxLabel(boundingBox, context);
  drawAnchorsOnEdges(boundingBox, context);
};

export const drawRectangleWithReadingOrder = (
  boundingBox: BoundingBoxProperty,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  showLabels: boolean
) => {
  const context = canvasRef.current?.getContext("2d");
  if (showLabels) {
    drawRectangleWithLabel(boundingBox, canvasRef);
    drawBoundingBoxReadingOrder(boundingBox, context);
  } else drawRectangleWithoutLabels(boundingBox, canvasRef);

  // drawConflictingBoundingBox(boundingBox, context);
};
export const drawRectangleForContentEditor = (
  boundingBox: BoundingBoxProperty,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  showLabels: boolean
) => {
  const context = canvasRef.current?.getContext("2d");
  if (showLabels) drawRectangleWithLabel(boundingBox, canvasRef);
  else drawRectangleWithoutLabels(boundingBox, canvasRef);
  if (boundingBox.hasConflict)
    drawConflictingBoundingBoxSign(boundingBox, context);
};

export const drawRectangleWithoutLabels = (
  boundingBox: BoundingBoxProperty,
  canvasRef: React.RefObject<HTMLCanvasElement>
) => {
  const context = canvasRef.current?.getContext("2d");
  drawBoundingBox(boundingBox, context);
};

export const getCanvasLabelFromHierLabels = (
  label: Editor.DigitalLabels,
  metadata: { hLevel: number } | null
) => {
  switch (label) {
    case Editor.DigitalLabels.FIGURE:
      return CanvasBoundingBoxLabel.FIGURE;

    case Editor.DigitalLabels.FOOTER:
      return CanvasBoundingBoxLabel.FOOTER;

    case Editor.DigitalLabels.FOOTNOTES:
      return CanvasBoundingBoxLabel.FOOTNOTES;

    case Editor.DigitalLabels.HEADING:
      return CanvasBoundingBoxLabel.HEADING + metadata?.hLevel;

    case Editor.DigitalLabels.LIST:
      return CanvasBoundingBoxLabel.LIST;

    case Editor.DigitalLabels.DOC_TITLE:
      return CanvasBoundingBoxLabel.HEADING + "1";

    case Editor.DigitalLabels.PARAGRAPH:
      return CanvasBoundingBoxLabel.PARAGRAPH;

    case Editor.DigitalLabels.TABLE:
      return CanvasBoundingBoxLabel.TABLE;

    default:
      return "OO";
  }
};

export const formatLabelForCanvas = (
  label: Editor.AIServicesLabel,
  metadata: BoxContent["metadata"] | null
) => {
  switch (label) {
    case Editor.AIServicesLabel.FIGURE:
      return CanvasBoundingBoxLabel.FIGURE;

    case Editor.AIServicesLabel.FOOTNOTES:
      return CanvasBoundingBoxLabel.FOOTNOTES;

    case Editor.AIServicesLabel.FOOTER:
      return CanvasBoundingBoxLabel.FOOTER;

    case Editor.AIServicesLabel.HEADING:
      return metadata?.level || CanvasBoundingBoxLabel.HEADING;

    case Editor.AIServicesLabel.LINK:
      return CanvasBoundingBoxLabel.LINK;

    case Editor.AIServicesLabel.LIST:
      return metadata?.listType || CanvasBoundingBoxLabel.LIST;

    case Editor.AIServicesLabel.MATH:
      return CanvasBoundingBoxLabel.MATH;

    case Editor.AIServicesLabel.PARAGRAPH:
      return CanvasBoundingBoxLabel.PARAGRAPH;

    case Editor.AIServicesLabel.TABLE:
      return CanvasBoundingBoxLabel.TABLE;

    case Editor.AIServicesLabel.TEXTBOX:
      return CanvasBoundingBoxLabel.TEXTBOX;

    default:
      return CanvasBoundingBoxLabel.PARAGRAPH;
  }
};

export const formatLabelForAPI = (label: CanvasBoundingBoxLabel) => {
  switch (label) {
    case CanvasBoundingBoxLabel.FIGURE:
      return Editor.AIServicesLabel.FIGURE;

    case CanvasBoundingBoxLabel.FOOTER:
      return Editor.AIServicesLabel.FOOTER;

    case CanvasBoundingBoxLabel.FOOTNOTES:
      return Editor.AIServicesLabel.FOOTNOTES;

    case CanvasBoundingBoxLabel.HEADING:
      return Editor.AIServicesLabel.HEADING;

    case CanvasBoundingBoxLabel.LIST:
      return Editor.AIServicesLabel.LIST;

    case CanvasBoundingBoxLabel.LINK:
      return Editor.AIServicesLabel.LINK;

    case CanvasBoundingBoxLabel.MATH:
      return Editor.AIServicesLabel.MATH;

    case CanvasBoundingBoxLabel.PARAGRAPH:
      return Editor.AIServicesLabel.PARAGRAPH;

    case CanvasBoundingBoxLabel.TABLE:
      return Editor.AIServicesLabel.TABLE;

    case CanvasBoundingBoxLabel.TEXTBOX:
      return Editor.AIServicesLabel.TEXTBOX;

    default:
      if (headingOptions.includes(label)) {
        return Editor.AIServicesLabel.HEADING;
      } else if (listTypes.includes(label)) return Editor.AIServicesLabel.LIST;
      return Editor.AIServicesLabel.PARAGRAPH;
  }
};

export const findCurrentArea = (
  boundingBoxes: BoundingBoxProperty[],
  x: number,
  y: number
) => {
  const lineOffset = 4;
  const matchedBoxes = [];
  const matchedBoxAreas = [];
  for (let i = 0; i < boundingBoxes.length; i++) {
    const box = boundingBoxes[i];
    if (box.isDeleted) {
      continue;
    }
    const x1 = box.x;
    const y1 = box.y;
    const x2 = box.x + box.w;
    const y2 = box.y + box.h;
    const xCenter = x1 + (x2 - x1) / 2;
    const yCenter = y1 + (y2 - y1) / 2;
    if (x1 - lineOffset < x && x < x1 + lineOffset) {
      if (y1 - lineOffset < y && y < y1 + lineOffset) {
        // return { box: i, pos: "tl" };
        matchedBoxes.push({ box: i, pos: "tl" });
        matchedBoxAreas.push(box.h * box.w);
      }
      if (y2 - lineOffset < y && y < y2 + lineOffset) {
        // return { box: i, pos: "bl" };
        matchedBoxes.push({ box: i, pos: "bl" });
        matchedBoxAreas.push(box.h * box.w);
      }
      if (yCenter - lineOffset < y && y < yCenter + lineOffset) {
        // return { box: i, pos: "l" };
        matchedBoxes.push({ box: i, pos: "l" });
        matchedBoxAreas.push(box.h * box.w);
      }
    } else if (x2 - lineOffset < x && x < x2 + lineOffset) {
      if (y1 - lineOffset < y && y < y1 + lineOffset) {
        // return { box: i, pos: "tr" };
        matchedBoxes.push({ box: i, pos: "tr" });
        matchedBoxAreas.push(box.h * box.w);
      }
      if (y2 - lineOffset < y && y < y2 + lineOffset) {
        // return { box: i, pos: "br" };
        matchedBoxes.push({ box: i, pos: "br" });
        matchedBoxAreas.push(box.h * box.w);
      }
      if (yCenter - lineOffset < y && y < yCenter + lineOffset) {
        // return { box: i, pos: "r" };
        matchedBoxes.push({ box: i, pos: "r" });
        matchedBoxAreas.push(box.h * box.w);
      }
    } else if (xCenter - lineOffset < x && x < xCenter + lineOffset) {
      if (y1 - lineOffset < y && y < y1 + lineOffset) {
        // return { box: i, pos: "t" };
        matchedBoxes.push({ box: i, pos: "t" });
        matchedBoxAreas.push(box.h * box.w);
      }
      if (y2 - lineOffset < y && y < y2 + lineOffset) {
        // return { box: i, pos: "b" };
        matchedBoxes.push({ box: i, pos: "b" });
        matchedBoxAreas.push(box.h * box.w);
      }
      if (y1 - lineOffset < y && y < y2 + lineOffset) {
        // return { box: i, pos: "i" };
        matchedBoxes.push({ box: i, pos: "i" });
        matchedBoxAreas.push(box.h * box.w);
      }
    } else if (x1 - lineOffset < x && x < x2 + lineOffset) {
      if (y1 - lineOffset < y && y < y2 + lineOffset) {
        // return { box: i, pos: "i" };
        matchedBoxes.push({ box: i, pos: "i" });
        matchedBoxAreas.push(box.h * box.w);
      }
    }
  }

  // return { box: -1, pos: "o" };

  const result =
    matchedBoxes.length > 0
      ? matchedBoxes[matchedBoxAreas.indexOf(Math.min(...matchedBoxAreas))]
      : { box: -1, pos: "o" };
  return result;
};

export const findNearestBox = (
  boundingBoxes: Array<BoundingBoxProperty>,
  x: number,
  y: number
) => {
  console.log(" clicked point: " + x + ", " + y);
  let nearestDistance = 9999;
  let nearestBoxIndex = -1;
  let nearestBox = null;
  //console.log("bounding boxes for click point: " + JSON.stringify(boundingBoxes));
  for (let i = 0; i < boundingBoxes.length; i += 1) {
    const currBox = boundingBoxes[i];
    if (currBox.isDeleted) continue;
    const boxX = currBox.x + currBox.w;
    const boxY = currBox.y + currBox.h;
    //console.log("current box: " + x + ", " + y + ", " + boxX + ", " + boxY);
    if (x > currBox.x && x < boxX && y > currBox.y && y < boxY) {
      const distance = Math.sqrt(
        (boxX - currBox.x) ** 2 + (boxY - currBox.y) ** 2
      );
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestBoxIndex = i;
        nearestBox = currBox;
      }
    }
  }
  return { boxIndex: nearestBoxIndex, box: nearestBox };
};

export const drawAnchorsOnEdges = (
  box: BoundingBoxProperty,
  context: CanvasRenderingContext2D
) => {
  const anchrSize = 2;
  const x1 = box.x;
  const y1 = box.y;
  const x2 = box.x + box.w;
  const y2 = box.y + box.h;
  const xCenter = x1 + (x2 - x1) / 2;
  const yCenter = y1 + (y2 - y1) / 2;

  context.strokeStyle = box.color;
  context.fillStyle = box.color;

  // context.rect(x1, y1, x2 - x1, y2 - y1);
  // context.lineWidth = box.lineWidth;
  // context.stroke();
  context.fillRect(
    x1 - anchrSize,
    y1 - anchrSize,
    2 * anchrSize,
    2 * anchrSize
  );
  context.fillRect(
    x1 - anchrSize,
    yCenter - anchrSize,
    2 * anchrSize,
    2 * anchrSize
  );
  context.fillRect(
    x1 - anchrSize,
    y2 - anchrSize,
    2 * anchrSize,
    2 * anchrSize
  );
  context.fillRect(
    xCenter - anchrSize,
    y1 - anchrSize,
    2 * anchrSize,
    2 * anchrSize
  );
  context.fillRect(
    xCenter - anchrSize,
    y2 - anchrSize,
    2 * anchrSize,
    2 * anchrSize
  );
  context.fillRect(
    x2 - anchrSize,
    y1 - anchrSize,
    2 * anchrSize,
    2 * anchrSize
  );
  context.fillRect(
    x2 - anchrSize,
    yCenter - anchrSize,
    2 * anchrSize,
    2 * anchrSize
  );
  context.fillRect(
    x2 - anchrSize,
    y2 - anchrSize,
    2 * anchrSize,
    2 * anchrSize
  );
};

export enum LineOrientation {
  HORIZONTAL = "HORIZONTAL",
  VERTICAL = "VERTICAL",
}

export const searchClickedLines = (
  canvas: HTMLCanvasElement,
  event: MouseEvent,
  boundingBoxes: BoundingBoxProperty[]
) => {
  //console.log("searching lines")
  const { x, y } = cursorPosition(canvas, event);
  for (let i = 0; i < boundingBoxes.length; i += 1) {
    const currBox = boundingBoxes[i];
    if (currBox.isDeleted) continue;

    const boxX = currBox.x + currBox.w;
    const boxY = currBox.y + currBox.h;

    const allowableOffsetFromLine = 2;
    if (
      //doesPointLieInBoxX1Y1X2Y2([x, y], [currBox.x- allowableOffsetFromLine, currBox.y + allowableOffsetFromLine, currBox.x + allowableOffsetFromLine, boxY - allowableOffsetFromLine]) ||
      doesPointLieInBoxX1Y1X2Y2(
        [x, y],
        [
          boxX - allowableOffsetFromLine,
          currBox.y + allowableOffsetFromLine,
          boxX + allowableOffsetFromLine,
          boxY - allowableOffsetFromLine,
        ]
      )
    ) {
      return {
        box: currBox,
        ind: i,
        orientation: LineOrientation.VERTICAL,
        clickedPoint: [x, y],
      };
    }

    if (
      doesPointLieInBoxX1Y1X2Y2(
        [x, y],
        [
          currBox.x + allowableOffsetFromLine,
          currBox.y - allowableOffsetFromLine,
          boxX - allowableOffsetFromLine,
          currBox.y + allowableOffsetFromLine,
        ]
      )
      //doesPointLieInBoxX1Y1X2Y2([x, y], [currBox.x+ allowableOffsetFromLine, boxY - allowableOffsetFromLine, boxX- allowableOffsetFromLine, boxY + allowableOffsetFromLine])
    ) {
      return {
        box: currBox,
        ind: i,
        orientation: LineOrientation.HORIZONTAL,
        clickedPoint: [x, y],
      };
    }
  }
  return null;
};

export const drawImageOnCanvas = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
) => {
  console.log("copying image");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

export function convert(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  canvas: HTMLCanvasElement
) {
  const actualX1 = x1 * canvas.width;
  const actualX2 = x2 * canvas.width;
  const actualY1 = y1 * canvas.height;
  const actualY2 = y2 * canvas.height;
  const width = actualX2 - actualX1;
  const height = actualY2 - actualY1;
  return {
    width,
    height,
  };
}

export const toJson = (key: string, callback: Function) => {
  getObject("i-stem", "layout", key, (data: any) => {
    const fileReader = new FileReader();
    fileReader.onload = function() {
      callback(JSON.parse(fileReader.result as string));
    };
    fileReader.readAsText(data.file);
  });
};

export const deleteSelectedBoxes = (
  boundingBoxes: Array<BoundingBoxProperty>,
  layoutColor: string,
  selectedBoxes: Set<number>
) => {
  let minX = 9999;
  let maxY = 0;
  let maxX = 0;
  let minY = 9999;
  boundingBoxes
    .filter(box => selectedBoxes.has(box.ind))
    .forEach(boxProperty => {
      if (boxProperty.x < minX) {
        minX = boxProperty.x;
      }
      if (boxProperty.y + boxProperty.h > maxY) {
        maxY = boxProperty.y + boxProperty.h;
      }
      if (boxProperty.y < minY) {
        minY = boxProperty.y;
      }

      if (boxProperty.x + boxProperty.w > maxX) {
        maxX = boxProperty.x + boxProperty.w;
      }
    });

  const newBoxes = boundingBoxes.map((box: BoundingBoxProperty) => {
    if (selectedBoxes.has(box.ind))
      return createBoundingBox({
        ...box,
        isDeleted: true,
        operations: [
          ...(box.operations || []),
          {
            opType: BoundingBoxOperations.MERGE,
            params: [boundingBoxes.length],
          },
        ],
      });
    else return box;
  });

  newBoxes.push(
    createBoundingBox({
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY,
      color: layoutColor,
      lineWidth: 1,
      label: CanvasBoundingBoxLabel.PARAGRAPH,
      order: boundingBoxes.length + 1,
      ind: boundingBoxes.length,
      isDeleted: false,
      operations: [
        {
          opType: BoundingBoxOperations.CREATE,
          params: [
            BoundingBoxOperations.MERGE,
            Array.from(selectedBoxes.keys()),
          ],
        },
      ],
    })
  );

  return newBoxes;
};

export const extractImageData = (imgData: ImageData) => {
  const canvas = document.createElement("canvas");
  canvas.width = imgData.width;
  canvas.height = imgData.height;
  const context = canvas.getContext("2d");
  if (context) {
    context.putImageData(imgData, 0, 0);
  }
  return canvas.toDataURL("image/jpeg");
};

export const transposeColor = (hex: string) => {
  if (hex.length === 9) {
    return hex.substring(0, 7);
  }
  return hex;
};

export const drawBoundingBoxesBasedOnInterfaceType = (
  canvasRef: RefObject<HTMLCanvasElement>,
  boundingBoxes: Array<BoundingBoxProperty>,
  showLabels: boolean,
  editorInterface: EditorInterface
) => {
  const canvas = canvasRef.current;
  const context = canvas?.getContext("2d");
  const img = document.getElementById("image") as HTMLImageElement;
  if (canvas && context && img) {
    context?.clearRect(0, 0, canvas?.width, canvas?.height);
    drawImageOnCanvas(canvas, context, img);
    boundingBoxes?.forEach(bbox => {
      switch (editorInterface) {
        case EditorInterface.LAYOUT:
          if (bbox.isDeleted) break;
          showLabels
            ? drawRectangleWithLabel(bbox, canvasRef)
            : drawRectangleWithoutLabels(bbox, canvasRef);
          //drawAnchorsOnEdges(bbox, context);
          break;

        case EditorInterface.CONTENT:
          drawRectangleForContentEditor(bbox, canvasRef, showLabels);
          break;

        case EditorInterface.ORDER:
          drawRectangleWithReadingOrder(bbox, canvasRef, showLabels);
          break;
      }
    });
  }
};

export const toBoolean = (value: string) => {
  if (value === "false") return false;
  return true;
};

export const getCanvasBoundingBoxFromAPIData = (
  apiBoxes: Editor.BoxCorrections[],
  layoutColor: string,
  editorContent: BoxContent[] | null
) => {
  const internalBoxes = apiBoxes.map((relativeBox: Editor.BoxCorrections) => {
    const box = getRelativeBoxInXYWHFromX1Y1X2Y2(relativeBox.relative_box);
    const canvasBoundingBox: BoundingBoxProperty = createBoundingBox({
      x: box[0],
      y: box[1],
      w: box[2],
      h: box[3],
      label: formatLabelForCanvas(relativeBox.label, {
        level: relativeBox.level,
        listType: relativeBox.type as Editor.ListType,
      }) as CanvasBoundingBoxLabel,
      ind: relativeBox.id,
      hierId: relativeBox.hierId,
      scenario: relativeBox.scenario,
      order: editorContent
        ? editorContent.filter(box => box.id === relativeBox.id)[0]?.order ||
          relativeBox.reading_order
        : relativeBox.reading_order,
      isDeleted: relativeBox.isDeleted,
      color: layoutColor,
      lineWidth: 1,
      level: relativeBox.level,
      type: relativeBox.type,
      operations: relativeBox.operations,
    });
    return canvasBoundingBox;
  });
  return internalBoxes;
};

export const getBoundingBoxesForCanvasFromRelativeXYWH = (
  boundingBoxes: BoundingBoxProperty[],
  canvasWidth: number,
  canvasHeight: number
) => {
  const scaledUpBoxes = boundingBoxes?.map(box => {
    let boundingBox = getScaledUpBox(
      [box.x, box.y, box.w, box.h],
      canvasWidth,
      canvasHeight
    );
    return {
      ...box,
      x: boundingBox[0],
      y: boundingBox[1],
      w: boundingBox[2],
      h: boundingBox[3],
    };
  });
  return scaledUpBoxes;
};

export const getBase64ImageData = (
  canvasRef: HTMLCanvasElement,
  imageBoundingBox: Editor.BoundingBoxType
) => {
  let base64Data;
  const context = canvasRef.getContext("2d");
  const canvas = canvasRef;
  const [x, y, w, h] = imageBoundingBox;
  if (context && canvas) {
    /*
      context.clearRect(x, y, w, h);
      const img = document.getElementById(
        "image"
      ) as HTMLImageElement;

      drawImageOnCanvas(canvas, context, img);
      */

    base64Data = extractImageData(context?.getImageData(x, y, w, h));
  } else base64Data = undefined;

  return base64Data;
};

export function createBoundingBox(box: BoundingBoxProperty) {
  return {
    x: box.x || 0,
    y: box.y || 0,
    w: box.w || 0,
    h: box.h || 0,
    label: box.label || CanvasBoundingBoxLabel.PARAGRAPH,
    color: box.color || "0000",
    lineWidth: box.lineWidth || 1,
    ind: box.ind,
    hierId: box.hierId,
    scenario: box.scenario,
    order: box.order || -1,
    type: box.type,
    level: box.level,
    isDeleted: box.isDeleted || false,
    operations: box.operations || [],
    hasConflict: box.hasConflict || false,
    conflictingBoxIndicesFromOldState: box.conflictingBoxIndicesFromOldState,
  };
}
