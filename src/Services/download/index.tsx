import { Http } from "@Services";
import FileSaver from "file-saver";

export const downloadFile = (url: string): Promise<any> => {
  return Http.getFile(url)
    .then(response => {
      FileSaver.saveAs(
        response.data,
        response.headers["content-disposition"]
          .split("filename=")[1]
          .replaceAll('"', "")
      );
      return { error: false };
    })
    .catch(err => {
      console.log("encountered error: %o", err);
      return { error: true };
    });
};
