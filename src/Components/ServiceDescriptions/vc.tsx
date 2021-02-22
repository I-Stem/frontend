import React from "react";
import { Col, Row } from "react-bootstrap";
import "./style.scss";

export const VcDescription = (props: any) => {
  return (
    <Col>
      <h4 className="des-heading">Service options</h4>
      <p>Captions, text extraction or both</p>
      <h4 className="des-heading">Input formats</h4>
      <p>An audio/video (MP3, MP4, WAV etc.) under 200MB.</p>
      <h4 className="des-heading"> Features </h4>
      <ul className="ul-list">
        <li>
          In case of captions, you can optionally train a custom model if your
          audio/video contains domain-specific content (e.g., in case of
          specialized courses such as Indian History, Biology etc.) by uploading
          relevant content (e.g. textbook). This will produce better captions.
        </li>
        <li>
          You can create and use optional tags during the conversion process
          which help you to organize your files better. Think of them as
          folders.
        </li>
      </ul>
      <h4 className="des-heading"> Output formats </h4>
      <ul className="ul-list">
        <li>Output format for captions: SRT or TXT</li>
        <li>Output format for text extraction from videos: TXT</li>
        <li>Output format for both: zip file containing both the outputs</li>
      </ul>
      <h4 className="des-heading"> Credits used </h4>
      <ul className="ul-list">
        <li>1 credit/10 s for video captioning/text extraction</li>
        <li>1 credit/page for training custom model</li>
      </ul>
      <h4 className="des-heading">How it works?</h4>
      <p>
        Once the file is converted, you will receive an email to a link to
        download the file and the file will also be available on the I-Stem
        portal under the "audio/video accessibility" tab.
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
      <p>25 credits/Min.</p>
      <p>For any questions/concerns, email us at info@inclusivestem.org</p>
    </Col>
  );
};
