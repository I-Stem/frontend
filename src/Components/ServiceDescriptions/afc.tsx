import React from "react";
import { Col, Row } from "react-bootstrap";
import "./style.scss";

export const AfcDescription = (props: any) => {
  return (
    <Col>
      <h4 className="des-heading">Input file formats supported</h4>
      <p>PDF and image formats (JPEG, GIF, GIF, TIFF etc.) under 20 mb.</p>
      <h4 className="des-heading"> Features </h4>
      <ul className="ul-list">
        <li>Support for heavy math documents.</li>
        <li>
          Handle two-columns, headings, tables, lists etc. for non-math
          documents.
        </li>
        <li>
          You can create and use optional tags during the conversion process
          which help you to organize your files better. Think of them as
          folders.
        </li>
      </ul>
      <h4 className="des-heading">Current limitations</h4>
      <p>
        Does not handle two-column layouts for math documents, support for
        languages other than English is coming soon
      </p>
      <h4 className="des-heading">Output formats</h4>
      <p>
        HTML, docx and txt for non-math content, HTML and docx for math content
      </p>
      <h4 className="des-heading">Credits used</h4>
      <p>1 credit/page</p>
      <h4 className="des-heading">How it works?</h4>
      <p>
        Once the file is converted, you will receive an email to a link to
        download the file and the file will also be available on the I-Stem
        portal under the "document accessibility" tab.
      </p>
      <h4 className="des-heading">Providing feedback</h4>
      <p>
        Post your conversion, we would appreciate if you can leave feedback for
        the request by selecting the "add review" option which is available
        under the "more" menu against your request on the I-Stem portal.
      </p>
      <h4 className="des-heading">Manual remediation</h4>
      <p>
        In case of recognition failures or unsatisfactory results, you can
        escalate your document for manual remediation which is also available
        under the "more" menu against the request on the portal.
      </p>
      <h4 className="des-heading">Credits used for manual remediation</h4>
      <p>200 credits/page</p>
      <p>For any questions/concerns, email us at info@inclusivestem.org</p>
    </Col>
  );
};
