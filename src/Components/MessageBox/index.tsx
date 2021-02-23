import React from "react";
import Moment from "moment";

import "./styles.scss";

export const MessageBox: React.FC<Props> = props => {
  return (
    <ul>
      {props.messageData.map(data => {
        return (
          <li className="notes-li">
            <div>
              <p className="notes-by">{data.actionBy}</p>
              <p className="notes-p">{Moment(data.actionAt).fromNow()}</p>
            </div>
            <p className="">{data.comment}</p>
          </li>
        );
      })}
    </ul>
  );
};

interface Props {
  messageData: Message[];
}

interface Message {
  actionBy: string;
  actionAt: string;
  comment: string;
}
