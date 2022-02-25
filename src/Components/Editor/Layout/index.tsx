/* eslint-disable no-param-reassign */
import React, { RefObject } from "react";
import { Col, Row } from "react-bootstrap";
import { ContextMenu } from "@Components/Basic/ContextMenu";
import { IStore } from "@Redux/IStore";
import { RemediationActions } from "@Actions";
import { Canvas } from "./Canvas";
import {
  convert,
  createBoundingBox,
  cursorPosition,
  deleteSelectedBoxes,
  drawImageOnCanvas,
  drawRectangleWithLabel,
  drawRectangleWithoutLabels,
  extractImageData,
  findCurrentArea,
  findNearestBox,
  getBase64ImageData,
  getBoundingBoxesForCanvasFromRelativeXYWH,
  getCanvasBoundingBoxFromAPIData,
  LineOrientation,
  searchClickedLines,
  toBoolean,
  toJson,
  transposeColor,
} from "./utils/canvasUtils";
import { ContextMenuForm } from "./ContextMenuForm";
import {
  BoundingBoxOperations,
  BoundingBoxProperty,
  CanvasBoundingBoxLabel,
  LayoutState,
} from "./CanvasTypes";
import { PageActivityInterface, TimeTracking } from "@Interfaces";
import { LayoutMessage } from "./LayoutMessage";
import { Menu, MenuItem } from "@material-ui/core";
import { calculateConflictsBetweenNewLayoutBoxAndOldEditorStateBox } from "../Content/ConflictUtils";
import { connect, ConnectedProps } from "react-redux";
import { EditorInterface } from "../EditorTypings";
import { EditorNotificationManager } from "../NotificationManager";

let drawingTime = 0;
let draggingTime = 0;
let resizingTime = 0;

const SHIFT_KEY = 16;
const CONTROL_KEY = 17;
const DELETE_KEY = 46;
const M_KEY = 77;

class LayoutEditorComponent extends React.Component<LayoutProps, LayoutState> {
  canvasRef: RefObject<HTMLCanvasElement>;

  o = createBoundingBox({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    label: CanvasBoundingBoxLabel.PARAGRAPH,
    color: "",
    lineWidth: 1,
    ind: -1,
    order: 0,
  });

  // a variable to store the mouse position
  m = { x: 0, y: 0 };

  // a variable to store the point where you begin to draw the rectangle
  start = { x: 0, y: 0 };
  // a boolean

  isDrawing = false;
  isMovingBox = false;

  keyPressed = false;

  clickedArea = { box: -1, pos: "o" };

  drawMode = false;

  x1 = -1;

  y1 = -1;

  x2 = -1;

  y2 = -1;

  translatePos = {
    x: 0,
    y: 0,
  };

  contextPosition = {
    x: 0,
    y: 0,
  };

  annotation = createBoundingBox({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    label: CanvasBoundingBoxLabel.PARAGRAPH,
    order: 0,
    ind: -1,
    color: "",
  });

  timeTracking: TimeTracking;

  constructor(props: LayoutProps) {
    super(props);
    this.state = {
      selectedBox: { ind: -1, label: CanvasBoundingBoxLabel.PARAGRAPH },
      boundingBoxes: [],
      selectedBoxes: new Set(),
      drawMode: false,
      showMenu: false,
      layoutColor: "#008A5AB3",
      lineWidth: 1,
      showLabels: true,
      isSaving: false,
      anchorEl: null,
    };
    this.timeTracking = {};
    this.canvasRef = React.createRef<HTMLCanvasElement>();
  }

  componentDidMount() {
    const canvas = this.canvasRef.current;
    canvas?.addEventListener("mousedown", this.handleMouseDown);
    canvas?.addEventListener("mousemove", this.handleMouseMove);
    canvas?.addEventListener("mouseup", this.handleMouseUp);
    canvas?.addEventListener("keydown", this.handleKeyDown);
    canvas?.addEventListener("keyup", this.handleKeyUp);
    canvas?.addEventListener("dblclick", this.handleDoubleClick);
    canvas?.addEventListener("contextmenu", this.handleContextMenu);
  }

  async componentDidUpdate(prevProps: LayoutProps, prevState: LayoutState) {
    if (this.props.triggerSave) {
      if (!this.state.isSaving) {
        this.setState({ isSaving: true });
        const error = await this.props.saveLayoutInfo(this.canvasRef);
        if (!error.hasError) {
          setTimeout(
            () =>
              this.props.updateInterface({
                interface: EditorInterface.CONTENT,
              }),
            1000
          );
        } else
          EditorNotificationManager.notifyError(
            error.errorMessage || "Unknown error"
          );
        this.props.updateSaveErrorStatus(error.hasError);
      }
    }

    if (prevProps.currentPage !== this.props.currentPage) {
      const { currentPage } = this.props;
      const { id, analytics } = this.props;
      if (!(currentPage in analytics)) {
        analytics[currentPage] = {
          draggingTime: [],
          drawingTime: [],
          resizingTime: [],
          readingOrderTime: [],
          editingTime: [],
          totalTime: [{ startTime: new Date().toISOString() }],
        };
      }
    }

    //console.log("component updated");
    if (this.props.boundingBoxesLoaded.hasLoaded) {
      if (this.props.boundingBoxesLoaded.errorMessage) {
        this.setState({ boundingBoxes: [] });
        EditorNotificationManager.notifyError(
          this.props.boundingBoxesLoaded.errorMessage
        );
        this.props.setBoundingBoxesLoaded(false, null);
        return;
      }
      const scaledUpBoxes = getBoundingBoxesForCanvasFromRelativeXYWH(
        this.props.boundingBoxes,
        this.canvasRef.current?.width || 1,
        this.canvasRef.current?.height || 1
      );
      this.setState({ boundingBoxes: scaledUpBoxes }, () => {
        this.props.setBoundingBoxesLoaded(false, null);
      });
      console.log("next page boxes loaded on step1");
    }
  }

  saveAndDrawBoxes() {
    this.props.setBoundingBoxes({
      boundingBoxes: this.state.boundingBoxes.map(box => {
        /*
      if(box.label === CanvasBoundingBoxLabel.TABLE) {
        box.content = getBase64ImageData(this.canvasRef, [box.x, box.y, box.w, box.h]);
      }
      */
        return {
          ...box,
          x: box.x / this.canvasRef.current!.width,
          y: box.y / this.canvasRef.current!.height,
          w: box.w / this.canvasRef.current!.width,
          h: box.h / this.canvasRef.current!.height,
        };
      }),
    });
  }

  contextMenu = () => {
    const { showMenu, selectedBox, boundingBoxes } = this.state;
    return (
      <ContextMenu position={this.contextPosition} show={showMenu}>
        <>
          <ContextMenuForm
            onLabelChange={e => {
              const boxes = [...boundingBoxes];
              let newBox;
              let labelIndex = boxes[selectedBox.ind]?.operations?.findIndex(
                box => box.opType === BoundingBoxOperations.LABEL
              );
              if (typeof labelIndex == "number" && labelIndex >= 0) {
                boxes[selectedBox.ind].operations![labelIndex].params?.push(
                  e.target.value
                );
                newBox = createBoundingBox({
                  ...boxes[selectedBox.ind],
                  label: e.target.value,
                  operations: boxes[selectedBox.ind].operations,
                });
              } else {
                newBox = createBoundingBox({
                  ...boxes[selectedBox.ind],
                  label: e.target.value,
                  operations: [
                    ...(boxes[selectedBox.ind].operations || []),
                    {
                      opType: BoundingBoxOperations.LABEL,
                      params: [boxes[selectedBox.ind].label, e.target.value],
                    },
                  ],
                });
              }
              boxes.splice(selectedBox.ind, 1, newBox);
              this.setState(
                {
                  boundingBoxes: boxes,
                  selectedBox: {
                    ...selectedBox,
                    label: e.target.value,
                  },
                },
                this.saveAndDrawBoxes
              );
              if (e.target.value !== "H" && e.target.value !== "L") {
                this.setState({ showMenu: !showMenu });
              }
            }}
            onLevelChange={e => {
              const boxes = [...boundingBoxes];
              boxes.splice(selectedBox.ind, 1, {
                ...boxes[selectedBox.ind],
                label: e.target.value,
                level: e.target.value,
              });
              this.setState({ boundingBoxes: boxes }, this.saveAndDrawBoxes);
              this.setState({ showMenu: !showMenu });
            }}
            onListTypeChange={e => {
              const boxes = [...boundingBoxes];
              boxes.splice(selectedBox.ind, 1, {
                ...boxes[selectedBox.ind],
                label: e.target.value,
                type: e.target.value,
              });
              this.setState({ boundingBoxes: boxes }, this.saveAndDrawBoxes);
              this.setState({ showMenu: !showMenu });
            }}
            onSubmit={() => this.setState({ showMenu: !showMenu })}
            selectedBox={selectedBox}
          />
        </>
      </ContextMenu>
    );
  };

  handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    this.contextPosition = { x: event.pageX, y: event.pageY };
    const { selectedBox } = this.state;
    console.log(selectedBox);
    if (selectedBox.ind !== -1) {
      const canvasDiv = document.getElementById("canvas-div");
      this.setState({ showMenu: !this.state.showMenu });
      this.setState({ anchorEl: canvasDiv });
    }
  };

  handleDoubleClick = (event: MouseEvent) => {
    const canvas = this.canvasRef.current;
    if (canvas) {
      const clickedLineOrientation = searchClickedLines(
        canvas,
        event,
        this.state.boundingBoxes
      );

      if (clickedLineOrientation) {
        const boxes = [...this.state.boundingBoxes];
        boxes.splice(
          clickedLineOrientation.box.ind,
          1,
          createBoundingBox({
            ...boxes[clickedLineOrientation.box.ind],
            operations: [
              ...(boxes[clickedLineOrientation.box.ind].operations || []),
              { opType: BoundingBoxOperations.SPLIT },
            ],
            isDeleted: true,
          })
        );

        if (clickedLineOrientation.orientation === LineOrientation.HORIZONTAL) {
          const [x, y] = clickedLineOrientation.clickedPoint;
          const firstRectangleWidth = x - clickedLineOrientation.box.x;
          const firstRectangleheight = clickedLineOrientation.box.h;
          const secondRectangleWidth =
            clickedLineOrientation.box.w - firstRectangleWidth;
          const secondRectangleHeight = firstRectangleheight;

          this.setState(
            {
              boundingBoxes: [
                ...boxes,
                createBoundingBox({
                  x: clickedLineOrientation.box.x,
                  y: clickedLineOrientation.box.y,
                  w: firstRectangleWidth,
                  h: firstRectangleheight,
                  label: CanvasBoundingBoxLabel.PARAGRAPH,
                  color: this.state.layoutColor,
                  lineWidth: this.state.lineWidth,
                  ind: boxes.length,
                  order: boxes.length + 1,
                  isDeleted: false,
                  operations: [
                    {
                      opType: BoundingBoxOperations.CREATE,
                      params: [
                        BoundingBoxOperations.SPLIT,
                        clickedLineOrientation.box.ind,
                      ],
                    },
                  ],
                }),
                createBoundingBox({
                  x,
                  y,
                  w: secondRectangleWidth,
                  h: secondRectangleHeight,
                  color: this.state.layoutColor,
                  lineWidth: this.state.lineWidth,
                  label: CanvasBoundingBoxLabel.PARAGRAPH,
                  ind: boxes.length + 1,
                  order: boxes.length + 2,
                  isDeleted: false,
                  operations: [
                    {
                      opType: BoundingBoxOperations.CREATE,
                      params: [
                        BoundingBoxOperations.SPLIT,
                        clickedLineOrientation.box.ind,
                      ],
                    },
                  ],
                }),
              ],
            },
            this.saveAndDrawBoxes
          );
        } else if (
          clickedLineOrientation &&
          clickedLineOrientation.orientation === LineOrientation.VERTICAL
        ) {
          const [x, y] = clickedLineOrientation.clickedPoint;
          const firstRectangleWidth = clickedLineOrientation.box.w;
          const firstRectangleheight = y - clickedLineOrientation.box.y;
          const secondRectangleWidth = firstRectangleWidth;
          const secondRectangleHeight =
            clickedLineOrientation.box.h - firstRectangleheight;
          this.setState(
            {
              boundingBoxes: [
                ...boxes,
                createBoundingBox({
                  x: clickedLineOrientation!.box!.x,
                  y: clickedLineOrientation.box.y || 0,
                  w: firstRectangleWidth,
                  h: firstRectangleheight,
                  label: CanvasBoundingBoxLabel.PARAGRAPH,
                  color: this.state.layoutColor,
                  lineWidth: this.state.lineWidth,
                  ind: boxes.length,
                  order: boxes.length + 1,
                  isDeleted: false,
                  operations: [
                    {
                      opType: BoundingBoxOperations.CREATE,
                      params: [
                        BoundingBoxOperations.SPLIT,
                        clickedLineOrientation.box.ind,
                      ],
                    },
                  ],
                }),
                createBoundingBox({
                  x: clickedLineOrientation.box.x,
                  y,
                  w: secondRectangleWidth,
                  h: secondRectangleHeight,
                  color: this.state.layoutColor,
                  lineWidth: this.state.lineWidth,
                  label: CanvasBoundingBoxLabel.PARAGRAPH,
                  ind: boxes.length + 1,
                  order: boxes.length + 2,
                  isDeleted: false,
                  operations: [
                    {
                      opType: BoundingBoxOperations.CREATE,
                      params: [
                        BoundingBoxOperations.SPLIT,
                        clickedLineOrientation.box.ind,
                      ],
                    },
                  ],
                }),
              ],
            },
            this.saveAndDrawBoxes
          );
        }
      }
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    const canvas = this.canvasRef.current;
    const { analytics, setAnalytics, currentPage } = this.props;

    //const analyticsDrawingTime = analytics[currentPage]?.drawingTime;
    //const analyticsDraggingTime = analytics[currentPage]?.draggingTime;
    //const analyticsResizingTime = analytics[currentPage]?.resizingTime;
    if (canvas) {
      canvas.style.cursor = "default";
      this.isDrawing = false;

      if (this.isMovingBox) {
        this.state.selectedBoxes.clear();
        this.setState({ selectedBoxes: this.state.selectedBoxes });
        const boxes = this.state.boundingBoxes.map(
          (bbox: BoundingBoxProperty, i) => {
            bbox.color = this.state.layoutColor;
            bbox.lineWidth = 1;
            return bbox;
          }
        );
        this.setState({ boundingBoxes: boxes });
        this.isMovingBox = false;
      }
      /*
      if (this.state.drawMode) {
        this.timeTracking.operation = {
          end: new Date().toISOString(),
          ...this.timeTracking.operation,
        };

        drawingTime +=
          ((new Date(this.timeTracking.operation.end!) as any) -
            (new Date(this.timeTracking.operation.start!) as any)) /
          1000;

        analytics[currentPage]! = {
          ...analytics[currentPage]!,
          drawingTime: [
            ...analytics[currentPage]!.drawingTime,
            this.timeTracking.operation,
          ],
        };
        this.timeTracking.operation = {};
      } else if (this.clickedArea.box !== -1 && !this.state.drawMode) {
        this.timeTracking.operation = {
          end: new Date().toISOString(),
          ...this.timeTracking.operation,
        };
        if (this.timeTracking.operation.name === "drag") {
          draggingTime +=
            ((new Date(this.timeTracking.operation.end!) as any) -
              (new Date(this.timeTracking.operation.start!) as any)) /
            1000;
          analytics[currentPage]! = {
            ...analytics[currentPage]!,
            draggingTime: [
              ...analytics[currentPage]!.draggingTime,
              this.timeTracking.operation,
            ],
          };

        } else if (this.timeTracking.operation.name === "resize") {
          resizingTime +=
            ((new Date(this.timeTracking.operation.end!) as any) -
              (new Date(this.timeTracking.operation.start!) as any)) /
            1000;
          analytics[currentPage]! = {
            ...analytics[currentPage]!,
            resizingTime: [
              ...analytics[currentPage]!.resizingTime,
              this.timeTracking.operation,
            ],
          };
        }
        this.timeTracking.operation = {};
      }
      setAnalytics({ analytics });
      */

      this.clickedArea = { box: -1, pos: "o" };
      if (this.state.drawMode) {
        const box = Object.create(this.annotation);
        box.x = this.o.x;
        box.y = this.o.y;
        box.w = this.o.w;
        box.h = this.o.h;
        box.ind = this.state.boundingBoxes.length;
        box.order = this.state.boundingBoxes.length + 1;
        box.color = this.state.layoutColor;
        box.label = this.o.label;
        box.isDeleted = false;
        if (
          !isNaN(box.w) &&
          !isNaN(box.h) &&
          box.x &&
          box.y &&
          box.w > 0 &&
          box.h > 0
        ) {
          const boundingBoxes = [...this.state.boundingBoxes];
          //const { id } = this.props;

          boundingBoxes.push(
            createBoundingBox({
              ...box,
              operations: [{ opType: BoundingBoxOperations.CREATE }],
            })
          );
          this.setState({ boundingBoxes }, this.saveAndDrawBoxes);
        }

        this.o.h = 0;
        this.o.w = 0;
        this.o.x = 0;
        this.o.y = 0;
        this.o.label = CanvasBoundingBoxLabel.PARAGRAPH;
        this.o.color = this.state.layoutColor;
        this.m = { x: 0, y: 0 };
      }

      this.setState({ drawMode: false });
    }
  };

  handleMouseDown = (event: MouseEvent) => {
    const {
      selectedBoxes,
      boundingBoxes,
      layoutColor,
      showLabels,
    } = this.state;
    const canvas = this.canvasRef.current;
    const context = this.canvasRef.current?.getContext("2d");
    if (canvas && context) {
      this.start = cursorPosition(canvas, event);
      if (event.button === 0) {
        this.isDrawing = true;
        this.setState({ showMenu: false });
      }
      if (this.state.drawMode) {
        this.timeTracking.operation = {
          start: new Date().toISOString(),
          name: "draw",
          ...this.timeTracking.operation,
        };
      }
      this.clickedArea = findCurrentArea(
        boundingBoxes,
        this.start.x,
        this.start.y
      );
      this.x1 = event.offsetX;
      this.y1 = event.offsetY;
      this.x2 = event.offsetX;
      this.y2 = event.offsetY;

      if (this.clickedArea.box === -1) {
        selectedBoxes.clear();
        this.setState({ selectedBoxes });
      } else {
        /*
      const nearestBox = findNearestBox(
        boundingBoxes,
        this.start.x,
        this.start.y
      );
      */

        if (selectedBoxes.has(this.clickedArea.box)) {
          selectedBoxes.delete(this.clickedArea.box);
        } else selectedBoxes.add(this.clickedArea.box);
        this.setState({
          selectedBox: {
            ind: this.clickedArea.box,
            label: boundingBoxes[this.clickedArea.box]?.label,
          },
          selectedBoxes,
        });
      }
      //todo: do we really need the following map function? we are not using it returned values
      const boxes = boundingBoxes.map((bbox: BoundingBoxProperty, i) => {
        if (selectedBoxes.has(i)) {
          bbox.color = `#002852`;
          bbox.lineWidth = 2;
        } else {
          bbox.color = layoutColor;
          bbox.lineWidth = 1;
        }

        return bbox;
      });
      this.setState({ boundingBoxes: boxes });
    }
  };

  handleKeyDown = (e: any) => {
    if (e.which === SHIFT_KEY || e.keyCode === SHIFT_KEY) {
      this.keyPressed = true;
    }
  };

  deleteBBox = () => {
    const { selectedBoxes, boundingBoxes } = this.state;

    const modifiedBoxes: BoundingBoxProperty[] = [];
    boundingBoxes.forEach(box => {
      if (selectedBoxes.has(box.ind))
        modifiedBoxes.push(
          createBoundingBox({
            ...box,
            operations: [
              ...(box.operations || []),
              { opType: BoundingBoxOperations.DELETE },
            ],
            isDeleted: true,
          })
        );
      else modifiedBoxes.push(box);
    });

    selectedBoxes.clear();
    this.setState(
      {
        boundingBoxes: modifiedBoxes,
        selectedBox: { ind: -1, label: CanvasBoundingBoxLabel.PARAGRAPH },
        selectedBoxes,
      },
      this.saveAndDrawBoxes
    );
  };

  mergeBBox = () => {
    const { boundingBoxes, layoutColor, selectedBoxes } = this.state;
    const newBoundingBoxes = deleteSelectedBoxes(
      boundingBoxes,
      layoutColor,
      selectedBoxes
    );
    this.setState({ boundingBoxes: newBoundingBoxes }, this.saveAndDrawBoxes);
  };

  handleKeyUp = (e: any) => {
    if (e.keyCode === SHIFT_KEY) {
      this.keyPressed = false;
    }
    if (e.keyCode === DELETE_KEY) {
      this.deleteBBox();
    }
    if (e.keyCode === M_KEY) {
      this.mergeBBox();
    }
  };

  draw = () => {
    const lineWidth = 2;
    this.o.x = this.start.x; // start psition of x
    this.o.y = this.start.y; // start pthis.ositithis.on this.of y
    this.o.w = this.m.x - this.start.x; // width
    this.o.h = this.m.y - this.start.y; // height
    this.o.label = CanvasBoundingBoxLabel.PARAGRAPH;
    this.o.color = this.state.layoutColor;
    this.o.lineWidth = this.state.lineWidth || 1;
    this.o.ind = this.state.boundingBoxes.length;
    this.o.order = this.state.boundingBoxes.length + 1;
    // draw the actual rectangle
    if (
      !isNaN(this.o.w) &&
      !isNaN(this.o.h) &&
      this.o.x > 0 &&
      this.o.y > 0 &&
      this.o.w > 0 &&
      this.o.h > 0
    ) {
      if (this.o.w > lineWidth && this.o.h > lineWidth)
        drawRectangleWithLabel(this.o, this.canvasRef);
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    const canvas = this.canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      if (this.state.drawMode) canvas.style.cursor = "crosshair";
      else canvas.style.cursor = "default";
      if (
        this.isDrawing &&
        this.clickedArea.box !== -1 &&
        !this.state.drawMode
      ) {
        this.isMovingBox = true;
        const { boundingBoxes } = this.state;
        const currentBox = boundingBoxes[this.clickedArea?.box];
        if (this.clickedArea?.pos === "i") {
          this.timeTracking.operation = {
            start: new Date().toISOString(),
            ...this.timeTracking.operation,
            name: "drag",
          };
          //currentBox.operation = BoundingBoxOperations.DRAG;
          if (!currentBox.operations?.length) {
            currentBox.operations = [
              ...(currentBox.operations || []),
              { opType: BoundingBoxOperations.DRAG },
            ];
          } else if (
            currentBox.operations[currentBox.operations.length - 1].opType !==
            BoundingBoxOperations.DRAG
          )
            currentBox.operations = [
              ...(currentBox.operations || []),
              { opType: BoundingBoxOperations.DRAG },
            ];
        } else {
          this.timeTracking.operation = {
            start: new Date().toISOString(),
            ...this.timeTracking.operation,
            name: "resize",
          };
          //currentBox.operation = BoundingBoxOperations.RESIZE;
          if (!currentBox.operations?.length) {
            currentBox.operations = [
              ...(currentBox.operations || []),
              { opType: BoundingBoxOperations.RESIZE },
            ];
          } else if (
            currentBox.operations[currentBox.operations.length - 1].opType !==
            BoundingBoxOperations.RESIZE
          )
            currentBox.operations = [
              ...(currentBox.operations || []),
              { opType: BoundingBoxOperations.RESIZE },
            ];
        }

        this.x2 = e.offsetX;
        this.y2 = e.offsetY;
        const xOffset = this.x2 - this.x1;
        const yOffset = this.y2 - this.y1;
        this.x1 = this.x2;
        this.y1 = this.y2;

        switch (this.clickedArea?.pos) {
          case "i":
            canvas.style.cursor = "grabbing";
            currentBox.x += xOffset;
            currentBox.y += yOffset;
            break;

          case "b":
            canvas.style.cursor = "s-resize";
            currentBox.h += yOffset;
            break;

          case "t":
            canvas.style.cursor = "n-resize";
            if (yOffset < 0) {
              currentBox.y += yOffset;
              currentBox.h += Math.abs(yOffset);
            } else {
              currentBox.y += yOffset;
              currentBox.h -= yOffset;
            }
            break;

          case "tr":
            canvas.style.cursor = "ne-resize";
            if (yOffset < 0) {
              currentBox.y += yOffset;
              currentBox.w += xOffset;
              currentBox.h += Math.abs(yOffset);
            } else {
              currentBox.y += yOffset;
              currentBox.w += xOffset;
              currentBox.h -= yOffset;
            }
            break;

          case "l":
            canvas.style.cursor = "w-resize";
            if (xOffset < 0) {
              currentBox.x += xOffset;
              currentBox.w += Math.abs(xOffset);
            } else {
              currentBox.x += xOffset;
              currentBox.w -= xOffset;
            }
            break;

          case "tl":
            canvas.style.cursor = "nw-resize";
            currentBox.y += yOffset;
            if (xOffset < 0) {
              currentBox.x += xOffset;
              currentBox.w += Math.abs(xOffset);
              currentBox.h += Math.abs(yOffset);
            } else {
              currentBox.x += xOffset;
              currentBox.w -= xOffset;
              currentBox.h -= yOffset;
            }
            break;

          case "bl":
            canvas.style.cursor = "sw-resize";
            if (xOffset < 0) {
              currentBox.x += xOffset;
              currentBox.w += Math.abs(xOffset);
              currentBox.h += yOffset;
            } else {
              currentBox.x += xOffset;
              currentBox.w -= Math.abs(xOffset);
              currentBox.h += yOffset;
            }
            break;

          case "r":
            canvas.style.cursor = "e-resize";
            currentBox.w += xOffset;
            break;

          case "br":
            canvas.style.cursor = "se-resize";
            currentBox.w += xOffset;
            currentBox.h += yOffset;
            break;
        }

        const _boundingBoxes = [...boundingBoxes];
        _boundingBoxes.splice(
          currentBox.ind,
          1,
          createBoundingBox({ ...currentBox })
        );
        this.setState({ boundingBoxes: _boundingBoxes }, this.saveAndDrawBoxes);
      }

      if (this.isDrawing && this.state.drawMode) {
        this.m = cursorPosition(canvas, e);
        this.setState({ boundingBoxes: [...this.state.boundingBoxes] });
        this.draw();
      }
    }
  };

  render() {
    const { layoutColor, drawMode } = this.state;
    return (
      <Row className="m-0">
        <Canvas
          key={101}
          currentPage={this.props.currentPage}
          fileId={this.props.id}
          canvasRef={this.canvasRef}
          editerInterfaceType={EditorInterface.LAYOUT}
          fetchBoundingBoxes={this.props.fetchLayoutBoundingBoxes}
          drawModeToggle={() => this.setState({ drawMode: !drawMode })}
          saveColorChanges={() => {
            console.log("save color changes called");
            //todo: shouldn't we set the state again after mapping?
            this.setState({
              boundingBoxes: this.state.boundingBoxes.map(box => {
                box.color = layoutColor;
                return box;
              }),
            });
            //document.body.click();
          }}
          resetColorChanges={() => {
            console.log("reset color changeccalled");
            this.setState({ layoutColor: "#008A5AB3" });
          }}
          color={layoutColor}
          onChangeColor={color => {
            console.log("onColorChange called");
            this.setState({ layoutColor: `${transposeColor(color.hex)}B3` });
          }}
          handleDelete={this.deleteBBox}
          handleMerge={this.mergeBBox}
          showDelete={this.state.selectedBoxes.size > 0}
          showMerge={this.state.selectedBoxes.size > 1}
          boundingBoxes={this.state.boundingBoxes}
        />
        <Col md={3} sm={3} xs={3} className="right-section">
          <LayoutMessage {...this.props} />
        </Col>
        {this.contextMenu()}
      </Row>
    );
  }
}

const mapStateToProps = (store: IStore) => {
  const { escalation, remediation, auth } = store;
  return {
    escalation,
    id: escalation.inputFileId,
    currentPage: remediation.currentPage,
    user: auth.user._id,
    boundingBoxes: remediation.layoutBoundingBoxes,
    boundingBoxesLoaded: remediation.boundingBoxesLoaded,
    analytics: remediation.analytics,
    twoColumn: remediation.twoColumn,
  };
};

const mapDispatchToProps = {
  setCurrentPage: RemediationActions.SetCurrentPage,
  remediatePage: RemediationActions.pageRemediated,
  setBoundingBoxes: RemediationActions.setLayoutBoundingBoxes,
  setBoundingBoxesLoaded: RemediationActions.setBoundingBoxesLoaded,
  updateInterface: RemediationActions.UpdateInterface,
  updateBoxColor: RemediationActions.UpdateBoxColor,
  setPageColumn: RemediationActions.SetPageColumn,
  setAnalytics: RemediationActions.SetAnalytics,
  saveLayoutInfo: RemediationActions.saveLayoutInfo,
  fetchLayoutBoundingBoxes: RemediationActions.fetchLayoutBoundingBoxes,
};

export interface LayoutProps extends propsFromRedux {
  updateBoxColor: (params: { color: string }) => void;
  setPageColumn: (params: { twoColumn: string }) => void;
  triggerSave: boolean;
  updateSaveErrorStatus: (hasError: boolean) => void;
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type propsFromRedux = ConnectedProps<typeof connector>;

export const LayoutEditor = connector(LayoutEditorComponent);
