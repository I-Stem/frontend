// #region Global Imports
import React, {useEffect, useRef} from "react";
import { connect } from "react-redux";
import {
  DeleteOutlined,
  LoadingOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
// #endregion Global Imports

// #region Local Imports
import { UploadActions } from "@Actions";
import { IStore } from "@Redux/IStore";

import "./style.scss";
// #endregion Local Imports

// #region Interface Imports
import { IUpload } from "./Upload";

// #endregion Interface Imports

const UploadProgress: React.FunctionComponent<IUpload.IProgressProps> = (
  props: IUpload.IProgressProps
) => {
  const { isUploading, files = {}, handleDeleteClick } = props;
  const initialFocus = useRef<HTMLDivElement>(null);
  useEffect(() => {
    initialFocus.current?.focus();
    return () => {
      console.log('component will unmount');
      if (props.onChangeFocus) {
        props.onChangeFocus(true);
      }
    }
    
  }, [])

  return isUploading ? (
    <section id="upload" className="progress-section">
      <div ref={initialFocus} tabIndex={-1}>
      <h6 className="mb-3">
        <strong>Document upload in progress</strong>
      </h6>

      {Object.values(files).map((file: any) => {
        return (
          <div key={file.fileName}>
            <div className="sr-only" aria-live="polite">{file.progress}% </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                {file.progress === 100 ? (
                  <PaperClipOutlined />
                ) : (
                  <LoadingOutlined />
                )}
                <span className="ml-2">{file.fileName}</span>
              </span>
              <DeleteOutlined onClick={() => handleDeleteClick(file)} />
            </div>

            <div className="progress-bar">
              <div className="progress-inner">
                <div
                  className="progress-bg"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </section>
  ) : (
    <></>
  );
};

function mapStateToProps(store: IStore) {
  const { upload } = store;
  return {
    isUploading: upload?.isUploading,
    files: upload?.files,
  };
}

const mapDispatchToProps = {
  handleDeleteClick: UploadActions.cancelUploadAndRemove,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadProgress);
