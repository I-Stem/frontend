import { BlueButton, GreenButton } from "@Components/HOC/Dashboard";
import React from "react";
import { Popover } from "react-bootstrap";
import { ColorChangeHandler, SketchPicker } from "react-color";

export const ColorPicker: React.FC<ColorPickerProps> = props => {
  const { color, onChange, saveChanges, resetChanges } = props;
  return (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Pick color</Popover.Title>
      <Popover.Content>
        <SketchPicker color={color} onChange={onChange} />
        <div style={{ margin: "6px" }}>
          <GreenButton onClick={saveChanges}>Apply</GreenButton>
        </div>
        <div style={{ margin: "6px" }}>
          <BlueButton onClick={resetChanges}>Reset</BlueButton>
        </div>
      </Popover.Content>
    </Popover>
  );
};

interface ColorPickerProps {
  color?: string;
  onChange?: ColorChangeHandler;
  saveChanges?: () => void;
  resetChanges?: () => void;
}
