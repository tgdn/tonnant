import { getTimestampInSeconds, isoDateToTimestamp } from "../datetime";
describe("datetime", () => {
    it("should convert ISO date to timestamp", () => {
        const isoDate = "2021-01-01T00:00:00.000Z";
        expect(isoDateToTimestamp(isoDate)).toBe(1609459200);
    });
    it("should get timestamp in seconds", () => {
        const date = new Date("2021-01-01T00:00:00.000Z");
        expect(getTimestampInSeconds(date)).toBe(1609459200);
    });
});
