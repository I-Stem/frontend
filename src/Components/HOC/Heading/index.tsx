import React, { forwardRef } from "react";

type HeadingProps = { children: React.ReactNode };
const Heading = forwardRef<HTMLDivElement, HeadingProps>((props, ref) => (
  <div ref={ref} tabIndex={-1}>
    <h2 className="font-semibold lip-title heading-color">{props.children}</h2>
  </div>
));

export default Heading;
