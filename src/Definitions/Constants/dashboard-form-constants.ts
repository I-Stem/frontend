export enum AFCRequestOutputFormat {
    PDF="PDF",
    TEXT = "TXT",
    WORD="DOCX",
    MP3 = "MP3",
    HTML="HTML"
}
export const outputFormatsListAFC = new Map([
    [AFCRequestOutputFormat.HTML, "html"], 
    [AFCRequestOutputFormat.WORD, "word (.docx)"], 
    [AFCRequestOutputFormat.TEXT, "text (.txt)"], 
    [AFCRequestOutputFormat.MP3, "mp3"]
]);
export const outputFormatsListVC = ["srt", "txt"];
export const modelsList: string[] = ["Standard Model", "Custom Model"];
