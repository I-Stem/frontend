import * as pdfJS from "pdfjs-dist/es5/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { getObject } from "../../../../utils/indexedDb";
import { EditorInterface } from "@Components/Editor/EditorTypings";

pdfJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface RemediationFileData {
  file: any;
  currentPage: number;
  editorInterface: EditorInterface;
}

export const drawImagesFromPdf = (
  currentPage: number,
  id: string,
  imageCallback?: (width: number, height: number, imageBase64: string) => void
) => {
  getObject(
    "i-stem",
    "layout",
    id,
    async (data: RemediationFileData, error) => {
      if (error) {
        console.error("error reading pdf file data");
        return;
      }

      await pdfJS.getDocument({ data: data.file }).promise.then(pdf => {
        pdf.getPage(currentPage).then(page => {
          // Get viewport (dimensions)
          // const viewport = page.getViewport({ scale: 1.5 });

          // // Get div#the-svg
          // const container = document.getElementById("image");
          // if (container) {
          //   // Set dimensions
          //   container.style.width = viewport.width + "px";
          //   container.style.height = viewport.height + "px";

          //   // SVG rendering by PDF.js
          //   page
          //     .getOperatorList()
          //     .then(function(opList) {
          //       const svgGfx = new pdfJS.SVGGraphics(page.commonObjs, page.objs);
          //       return svgGfx.getSVG(opList, viewport);
          //     })
          //     .then(function(svg) {
          //       // set it as the source of the img element

          //       imageCallback(image64);
          //     });
          // }

          const viewport = page.getViewport({ scale: 1.5 });
          // Prepare canvas using PDF page dimensions
          const canvas: HTMLCanvasElement | null = document.getElementById(
            "image"
          ) as HTMLCanvasElement;
          if (canvas) {
            // Render PDF page into canvas context
            const context = canvas.getContext("2d") as CanvasRenderingContext2D;
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderContext = {
              canvasContext: context,
              viewport,
            };
            if (context) {
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.beginPath();
            }

            page.render(renderContext).promise.then(() => {
              if (imageCallback)
                imageCallback(
                  viewport.width,
                  viewport.height,
                  canvas.toDataURL("image/png")
                );
            });
          }
        });
      });
    }
  );
};

export const getNumberOfPages = (dbName: string, id: string) =>
  new Promise((res, err) => {
    getObject(dbName, "layout", id, async (data: any) => {
      await pdfJS
        .getDocument({
          data: data.file,
        })
        .promise.then(pdf => {
          res(pdf.numPages);
        });
    });
  });
