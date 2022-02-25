import { Col, OverlayTrigger, Row } from "react-bootstrap";
import React from "react";
import "./style.scss";
import { ToggleButton } from "./styled";
import { ColorPicker } from "./Layout/ColorPicker";
import { ColorChangeHandler } from "react-color";

const imagePath = "/static/images";

export const PageToolbar = (props: PageToolbarProps) => {
  const {
    handleDecreaseZoomLevel,
    handleFullScreen,
    handleIncreaseZoomLevel,
    drawModeToggle,
    toggleLabels,
    showLabels,
    toggleColorPopover,
    color,
    onChangeColor,
    resetColorChanges,
    saveColorChanges,
    handleDelete,
    handleMerge,
    showDelete,
    showMerge,
  } = props;
  return (
    <div>
      <Row className="m-0 toggle-container">
        <Col sm={8}>
          {drawModeToggle && (
            <ToggleButton className="text-sm" onClick={drawModeToggle}>
              + NEW LAYOUT
            </ToggleButton>
          )}
          <OverlayTrigger
            rootClose
            trigger="click"
            placement="bottom"
            overlay={
              ColorPicker({
                color,
                onChange: onChangeColor,
                resetChanges: resetColorChanges,
                saveChanges: saveColorChanges,
              })!
            }
          >
            <ToggleButton className="text-sm" onClick={toggleColorPopover}>
              COLOR
            </ToggleButton>
          </OverlayTrigger>

          <ToggleButton className="text-sm" onClick={toggleLabels}>
            {showLabels ? "HIDE LABELS" : "SHOW LABELS"}
          </ToggleButton>
          {showDelete && (
            <ToggleButton className="text-sm" onClick={handleDelete}>
              DELETE
            </ToggleButton>
          )}
          {showMerge && (
            <ToggleButton className="text-sm" onClick={handleMerge}>
              MERGE
            </ToggleButton>
          )}
        </Col>

        <Col>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <ToggleButton className="image" onClick={handleDecreaseZoomLevel}>
              <img src={`${imagePath}/minus.svg`} alt="zoom out" />
            </ToggleButton>
            <ToggleButton className="image" onClick={handleIncreaseZoomLevel}>
              <img src={`${imagePath}/add.svg`} alt="zoom in" />
            </ToggleButton>
            <ToggleButton className="image" onClick={handleFullScreen}>
              <img src={`${imagePath}/maximize.svg`} alt="fullscreen" />
            </ToggleButton>
          </div>
        </Col>
      </Row>
    </div>
  );
};

interface PageToolbarProps {
  toggleColorPopover?: () => void;
  showLabels: boolean;
  color?: string;
  onChangeColor?: ColorChangeHandler;
  saveColorChanges?: () => void;
  resetColorChanges?: () => void;
  toggleLabels?: () => void;
  drawModeToggle?: () => void;
  handleFullScreen: () => void;
  handleDecreaseZoomLevel: () => void;
  handleIncreaseZoomLevel: () => void;
  handleDelete?: () => void;
  handleMerge?: () => void;
  showDelete?: boolean;
  showMerge?: boolean;
}
