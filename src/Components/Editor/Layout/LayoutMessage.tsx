import { GreenButton } from "@Components/HOC/Dashboard";
import React from "react";
import { Heading } from "../styled";

export const LayoutMessage: React.FC<LayoutMessageProps> = (
  props: LayoutMessageProps
) => {
  const { setPageColumn, twoColumn } = props;
  return (
    <>
      <Heading>HOW MANY COLUMNS DOES THE DOC HAVE?</Heading>
      <div>
        <input
          type="radio"
          value="false"
          name="reading-order"
          id="single-col"
          checked={twoColumn === "false"}
          onChange={e => {
            setPageColumn({
              twoColumn: e.target.value,
            });
          }}
        />
        <label htmlFor="single-col" className="f-16 ml-12">
          1 column
        </label>
      </div>
      <div>
        <input
          type="radio"
          value="true"
          name="reading-order"
          id="double-col"
          checked={twoColumn === "true"}
          onChange={e => {
            setPageColumn({
              twoColumn: e.target.value,
            });
          }}
        />
        <label htmlFor="double-col" className="f-16 ml-12">
          2 columns
        </label>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Heading>CHECKLIST</Heading>
        <ul style={{ marginLeft: "24px" }}>
          <li>Adjust all layout height and width.</li>
          <li>Check if any content is missed by AI. </li>
          <li>Adjust tags according to content type.</li>
        </ul>
      </div>
    </>
  );
};

interface LayoutMessageProps {
  setPageColumn: (payload: { twoColumn: string }) => void;
  twoColumn: "true" | "false";
}
