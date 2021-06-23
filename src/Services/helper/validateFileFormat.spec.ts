import { serviceTypeEnum } from "@Components/Upload/constants";
import { DesktopAccessDisabledOutlined } from "@material-ui/icons";
import { validateFileFormat } from "./validateFileFormat";

describe("test file format of uploaded input file", () => {
  it("should check input file format", () => {
    expect(validateFileFormat("input.PDF", serviceTypeEnum.afc)).toBeTruthy();
    expect(validateFileFormat("input.mp3", serviceTypeEnum.afc)).toBeFalsy();
    expect(validateFileFormat("input", serviceTypeEnum.afc)).toBeFalsy();
    expect(
      validateFileFormat("input.pdf", serviceTypeEnum.caption)
    ).toBeFalsy();
    expect(validateFileFormat("input", serviceTypeEnum.caption)).toBeFalsy();
    expect(
      validateFileFormat("input.mp3", serviceTypeEnum.customModel)
    ).toBeFalsy();
    expect(
      validateFileFormat("input", serviceTypeEnum.customModel)
    ).toBeFalsy();
    expect(validateFileFormat("input.mp3", serviceTypeEnum.job)).toBeFalsy();
    expect(validateFileFormat("input", serviceTypeEnum.job)).toBeFalsy();
    expect(validateFileFormat("input.mp3", serviceTypeEnum.ocr)).toBeFalsy();
    expect(validateFileFormat("input", serviceTypeEnum.ocr)).toBeFalsy();
    expect(
      validateFileFormat("input.mp3", serviceTypeEnum.escalation)
    ).toBeFalsy();
    expect(validateFileFormat("input", serviceTypeEnum.escalation)).toBeFalsy();
  });
});
