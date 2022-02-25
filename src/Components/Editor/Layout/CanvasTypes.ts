import { DocumentAnalytics, IStore } from "@Interfaces";
import { Editor } from "../EditorTypings";
import { RefObject } from "react";

export interface LayoutState {
  selectedBox: { ind: number; label: CanvasBoundingBoxLabel };
  boundingBoxes: Array<BoundingBoxProperty>;
  selectedBoxes: Set<number>;
  drawMode: boolean;
  showMenu: boolean;
  layoutColor: string;
  lineWidth?: number;
  showLabels: boolean;
  isSaving: boolean;
  anchorEl: null | HTMLElement;
}

export enum BoundingBoxOperations {
  CREATE = "CREATE",
  SPLIT = "SPLIT",
  MERGE = "MERGE",
  LABEL = "LABEL",
  RESIZE = "RESIZE",
  DRAG = "DRAG",
  REORDER = "REORDER",
  EDITCONTENT = "EDITCONTENT",
  DELETE = "DELETE",
}

export enum CanvasBoundingBoxLabel {
  DOC_TITLE = "DT",
  FIGURE = "G",
  FOOTER = "FOOTER",
  FOOTNOTES = "FOOTNOTE",
  HEADING = "H",
  LINK = "LINK",
  LIST = "L",
  MATH = "MATH",
  PARAGRAPH = "P",
  TABLE = "T",
  TEXTBOX = "TEXTBOX",
}

export interface BoundingBoxProperty {
  x: number;
  y: number;
  w: number;
  h: number;
  label: CanvasBoundingBoxLabel;
  color: string;
  lineWidth?: number;
  ind: number;
  hierId?: string;
  scenario?: string;
  order?: number;
  type?: string;
  level?: string;
  isDeleted?: boolean;
  operations?: { opType: BoundingBoxOperations; params?: any[] }[];
  hasConflict?: boolean;
  conflictingBoxIndicesFromOldState?: number[];
}
