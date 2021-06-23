import {
  findPageCount,
  formatFilterName,
  getInvitationResponseMessage,
} from "./utils";

describe("test for helper functions", () => {
  it("should calculate page count", async () => {
    const totalPages = findPageCount("2-4,6-10");
    expect(totalPages).toEqual(-6);
  });

  it("should compose message", async () => {
    const message = getInvitationResponseMessage(
      ["hello", "hi"],
      ["john", "mary"]
    );
    expect(message.length).toBeGreaterThan(1);
  });

  it("should capitalize string", () => {
    const result = formatFilterName("john von hopkins et. al");
    expect(result[0]).toEqual("J");
  });
});
