import { Col } from "react-bootstrap";
import React, { MutableRefObject, RefObject, useState } from "react";
import { PageToolbar } from "../PageToolbar";
import "./style.scss";
import { Loader } from "@Components/Basic/Loader";
import { ColorChangeHandler } from "react-color";
import { BoundingBoxProperty } from "./CanvasTypes";
import { drawImagesFromPdf } from "./utils/pdfUtils";
import {
  drawBoundingBoxesBasedOnInterfaceType,
  drawImageOnCanvas,
} from "./utils/canvasUtils";
import { EditorInterface } from "../EditorTypings";

interface PageCanvasState {
  width: number;
  height: number;
  pageImageLoaded: boolean;
  zoom: number;
  showLabels: boolean;
}

export class Canvas extends React.Component<Props, PageCanvasState> {
  divRef: RefObject<HTMLDivElement>;
  drawingCanvas: RefObject<HTMLCanvasElement>;
  zoomRatio = 0.25;

  constructor(props: Props) {
    super(props);
    this.state = {
      width: 1,
      height: 1,
      zoom: 1,
      pageImageLoaded: false,
      showLabels: true,
    };
    this.divRef = React.createRef<HTMLDivElement>();
    this.drawingCanvas = React.createRef();
  }

  decreaseZoom = () => {
    this.setState({ zoom: this.state.zoom - this.zoomRatio });
  };

  increaseZoom = () => {
    this.setState({ zoom: this.state.zoom + this.zoomRatio });
  };

  componentDidMount() {
    console.log(
      "trying to load hidden image of file in componentDidMount " +
        this.props.fileId +
        " at page: " +
        this.props.currentPage +
        " with props: %o",
      this.props
    );

    this.props.fetchBoundingBoxes();
    drawImagesFromPdf(
      this.props.currentPage,
      this.props.fileId,
      (width: number, height: number, image: string) => {
        console.log(
          "hiddent image is loaded in componentDidMount: " +
            width +
            ", " +
            height
        );
        this.setState({
          pageImageLoaded: true,
          width,
          height,
        });

        this.drawPageImageAndBoxes();
      }
    );
  }

  drawPageImageAndBoxes() {
    const canvas = this.drawingCanvas?.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      //drawImageOnCanvas(canvas, context, pageImage);
      drawBoundingBoxesBasedOnInterfaceType(
        this.drawingCanvas,
        this.props.boundingBoxes,
        this.state.showLabels,
        this.props.editerInterfaceType
      );
    } else console.log("error: drawing canvas not yet loaded...");
  }

  componentDidUpdate(prevProps: Props, prevState: PageCanvasState) {
    //console.log("updating canvas");
    if (
      this.state.pageImageLoaded &&
      this.props.currentPage !== prevProps.currentPage
    ) {
      this.setState({ pageImageLoaded: false });
      console.log(
        "trying to load hidden image in componentDidUpdate of file " +
          this.props.fileId +
          " at page: " +
          this.props.currentPage
      );
      this.props.fetchBoundingBoxes();
      drawImagesFromPdf(
        this.props.currentPage,
        this.props.fileId,
        (width: number, height: number, image: string) => {
          this.setState({
            pageImageLoaded: true,
            width,
            height,
          });

          this.drawPageImageAndBoxes();

          console.log("hiddent image is loaded.");
        }
      );
    }

    if (this.state.showLabels !== prevState.showLabels) {
      this.drawPageImageAndBoxes();
    }

    if (this.props.boundingBoxes !== prevProps.boundingBoxes) {
      if (this.state.pageImageLoaded) this.drawPageImageAndBoxes();
    }
  }

  render() {
    const { canvasRef, width, height } = this.props;
    const { zoom, pageImageLoaded } = this.state;
    this.drawingCanvas = canvasRef;
    return (
      <Col>
        <PageToolbar
          handleFullScreen={() => {
            const elem = this.divRef.current;
            if (document?.fullscreenElement) {
              document.exitFullscreen();
            } else if (elem) elem.requestFullscreen();
          }}
          handleDecreaseZoomLevel={() => this.decreaseZoom()}
          handleIncreaseZoomLevel={() => {
            this.increaseZoom();
          }}
          toggleLabels={() =>
            this.setState({ showLabels: !this.state.showLabels })
          }
          showLabels={this.state.showLabels}
          {...this.props}
        />
        <div ref={this.divRef} className="pl-0 pr-0 canvas-div">
          {!pageImageLoaded && <Loader message="Loading Page" />}

          <div id="canvas-div" style={{ overflow: "auto" }}>
            <canvas
              ref={canvasRef}
              id="canvas"
              style={{
                border: "1px solid #D9D9D9",
                transform: `scale(${zoom})`,
                transformOrigin: "0px 0px 0px",
              }}
              width={"1000px"}
              height={"1000px"}
              tabIndex={1}
            >
              {this.props.boundingBoxes && (
                <ul>
                  {this.props.boundingBoxes.map((data, index) => {
                    return (
                      <li
                        key={index}
                        id={String(data.order)}
                        onClick={() => {
                          if (this.props.selectBox) this.props.selectBox(data);
                        }}
                      >
                        <a onClick={() => "nothing"}>
                          Tag: {data.label}, box id: {String(data.ind)}, order:{" "}
                          {data.order}, isDeleted: {String(data.isDeleted)}{" "}
                          {", "}
                          conflicts:{" "}
                          {data.conflictingBoxIndicesFromOldState?.join(",")}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </canvas>
            <canvas
              style={{ display: "none" }}
              id="image"
              width={width || "1000px"}
              height={height || "1000px"}
            />
          </div>
        </div>
      </Col>
    );
  }
}

interface Props {
  fileId: string;
  currentPage: number;
  editerInterfaceType: EditorInterface;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  width?: number;
  height?: number;
  fetchBoundingBoxes: () => void;
  drawModeToggle?: () => void;
  isPageLoading?: boolean;
  showDelete?: boolean;
  showMerge?: boolean;
  boundingBoxes: BoundingBoxProperty[];
  selectBox?: (box: BoundingBoxProperty) => void;
  color?: string;
  onChangeColor?: ColorChangeHandler;
  handleDelete?: () => void;
  handleMerge?: () => void;
  saveColorChanges?: () => void;
  resetColorChanges?: () => void;
}
