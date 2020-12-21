// #region Global Imports
import React from "react";
import { connect } from "react-redux";
import md5 from "blueimp-md5";
import { PaperClipOutlined } from "@ant-design/icons";
// #endregion Global Imports

// #region Local Imports
import { IStore } from "@Redux/IStore";
import { UploadActions } from "@Actions";
import "./style.scss";
// #endregion Local Imports

// #region Interface Imports
import { IUpload } from "./Upload";
// #endregion Interface Imports

const Upload: React.FunctionComponent<IUpload.IProps> = (
  props: IUpload.IProps
) => {
  function fileHash(file: File, callback: Function) {
    // Instantiate a reader
    const reader = new FileReader();

    reader.onload = function(e) {
      const hash = md5(e?.target?.result?.toString() || " ");
      callback(hash);
    };

    reader.readAsBinaryString(file);
  }

  function handleFileChange(event: any) {
    const { type = "", size = 0 } = props;
    if (
      (event.target as HTMLInputElement).files &&
      (event.target as HTMLInputElement).files?.length
    ) {
      const file = event.target?.files[0];
      if (file.size > size * 1024 * 1024) {
        alert("File is too big!");
        return;
      }
      props.initiateUploading({
        file,
        fileName: file.name,
        type,
        progress: 5,
      });

      fileHash(file, function(hash: string) {
        props.uploadFile({
          file,
          fileName: file.name,
          hash,
          type,
          progress: 10,
        });
      });
      if (props.onUpload) props.onUpload(file.name);
    }
  }
  const { accept, files, type = "", required } = props;
  return (
    <section id="upload" tabIndex={0}>
      <label htmlFor={`file${type}`} className="button-upload">
        <span role="button">{props.label}</span>
        <input
          onChange={handleFileChange}
          type="file"
          id={`file${type}`}
          accept={accept}
          required={required}
        />
      </label>
      <div>
        <div className="flex justify-between items-center">
          <span className="flex items-center">
            {files[type]?.progress === 100 && (
              <>
                <PaperClipOutlined />
                <span className="ml-2">{files[type]?.fileName}</span>
              </>
            )}
          </span>
        </div>
      </div>
    </section>
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
  initiateUploading: UploadActions.initiateUploading,
  uploadFile: UploadActions.uploadFile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
