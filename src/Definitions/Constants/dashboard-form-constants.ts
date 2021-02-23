export enum AFCRequestOutputFormat {
  PDF = "PDF",
  TEXT = "TXT",
  WORD = "DOCX",
  MP3 = "MP3",
  HTML = "HTML",
}

export enum AfcRequestInputFormat {
  PDF = "PDF",
  JPG = "JPG",
  JPEG = "JPEG",
  PNG = "PNG",
  TIFF = "TIFF",
  BMP = "BMP",
}

export enum VCCustomModelInputFormat {
  PDF = "PDF",
  TXT = "TXT",
  JPG = "JPG",
  JPEG = "JPEG",
  PNG = "PNG",
  TIFF = "TIFF",
  BMP = "BMP",
}

export enum VCRequestInputVideoFormat {
  WEBM = "WEBM",
  MXF = "MXF",
  GXF = "GXF",
  ASF = "ASF",
  AVI = "AVI",
  MKV = "MKV",
  MPG = "MPG",
  MPEG = "MPEG",
  THREEGP = "3GP",
  THREEGPP = "3GPP",
  WMV = "WMV",
  TS = "TS",
  FLV = "FLV",
  MP4 = "MP4",
  M4P = "M4A",
  M4V = "M4V",
  ISMA = "ISMA",
  ISMV = "ISMV",
  DVRMS = "DVR-MS",
  WAV = "WAV",
  MOV = "MOV",
  NSV = "NSV",
  F4V = "F4V",
  MP2 = "MP2",
}

export enum VCRequestInputAudioFormat {
  MP3 = "MP3",
  OGG = "OGG",
  WAV = "WAV",
  WMA = "WMA",
  WEBM = "WEBM",
  M4A = "M4A",
  AAC = "AAC",
}

export enum JobPreferencesResumeFormat {
  PDF = "PDF",
  DOC = "DOC",
  DOCX = "DOCX",
}

export enum RemediatedFileFormat {
  DOCX = "DOCX",
  SRT = "SRT",
  TXT = "TXT",
  ZIP = "ZIP",
}

export type FileFormat =
  | RemediatedFileFormat
  | VCCustomModelInputFormat
  | JobPreferencesResumeFormat
  | VCRequestInputAudioFormat
  | VCRequestInputVideoFormat
  | AfcRequestInputFormat;

export const outputFormatsListAFC = new Map([
  [AFCRequestOutputFormat.HTML, "html"],
  [AFCRequestOutputFormat.WORD, "word (.docx)"],
  [AFCRequestOutputFormat.TEXT, "text (.txt)"],
  [AFCRequestOutputFormat.MP3, "mp3"],
]);
export const outputFormatsListVC = ["srt", "txt"];
export const modelsList: string[] = ["Standard Model", "Custom Model"];
