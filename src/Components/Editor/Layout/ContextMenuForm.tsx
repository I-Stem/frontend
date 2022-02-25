import { BlueButton } from "@Components/HOC/Dashboard";
import React from "react";
import { Form } from "react-bootstrap";
import { SaveButton } from "../styled";
import { BoundingBoxProperty, CanvasBoundingBoxLabel } from "./CanvasTypes";

const labelOptions: Record<string, CanvasBoundingBoxLabel> = {
  Footnotes: CanvasBoundingBoxLabel.FOOTNOTES,
  Footer: CanvasBoundingBoxLabel.FOOTER,
  Graphic: CanvasBoundingBoxLabel.FIGURE,
  Heading: CanvasBoundingBoxLabel.HEADING,
  //Link: CanvasBoundingBoxLabel.LINK,
  List: CanvasBoundingBoxLabel.LIST,
  //Math: CanvasBoundingBoxLabel.MATH,
  Paragraph: CanvasBoundingBoxLabel.PARAGRAPH,
  Table: CanvasBoundingBoxLabel.TABLE,
  Textbox: CanvasBoundingBoxLabel.TEXTBOX,
};

export const headingOptions = ["H1", "H2", "H3", "H4", "H5", "H6"];
export const listTypes = ["OL", "UL"];
export const ContextMenuForm: React.FC<ContextMenuFormProps> = props => {
  const {
    onLabelChange,
    onLevelChange,
    onListTypeChange,
    onSubmit,
    selectedBox,
  } = props;
  return (
    <div style={{ padding: "1em" }}>
      <Form.Group controlId="label">
        <Form.Control as="select" onChange={e => onLabelChange(e)}>
          <option disabled selected>
            Select Label
          </option>
          {Object.keys(labelOptions).map(option => (
            <option value={labelOptions[option]}>{option}</option>
          ))}
        </Form.Control>
      </Form.Group>
      {selectedBox.label === CanvasBoundingBoxLabel.HEADING && (
        <Form.Group>
          <Form.Control as="select" onChange={e => onLevelChange(e)}>
            <option disabled selected>
              Select Level
            </option>
            {headingOptions.map(option => (
              <option>{option}</option>
            ))}
          </Form.Control>
        </Form.Group>
      )}
      {selectedBox.label === CanvasBoundingBoxLabel.LIST && (
        <Form.Group>
          <Form.Control as="select" onChange={e => onListTypeChange(e)}>
            <option disabled selected>
              Select Type
            </option>
            {listTypes.map(option => (
              <option>{option}</option>
            ))}
          </Form.Control>
        </Form.Group>
      )}
      {/* <SaveButton className="w-100" onClick={onSubmit}>
        CLOSE
      </SaveButton> */}
    </div>
  );
};

interface ContextMenuFormProps {
  onLabelChange: (e: any) => void;
  onLevelChange: (e: any) => void;
  onListTypeChange: (e: any) => void;
  onSubmit: () => void;
  selectedBox: { label: CanvasBoundingBoxLabel; ind: number };
}
