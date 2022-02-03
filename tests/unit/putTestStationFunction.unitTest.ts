import { TestStationService } from "../../src/services/TestStationService";
import { HTTPError } from "../../src/models/HTTPError";
import { putTestStation } from "../../src/functions/putTestStation";

jest.mock("../../src/services/TestStationService");

describe("putTestStation Handler", () => {
  context("Service puts without exception", () => {
    it("resolves without exception", async () => {
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.resolve();
        });
      expect(await putTestStation({})).resolves;
    });
  });

  context("Service throws error", () => {
    it("should throw that error upwards and ultimately return it", async () => {
      const errorMessage = "Bad thing happened";
      TestStationService.prototype.putTestStation = jest
        .fn()
        .mockImplementation(() => {
          return Promise.reject(new HTTPError(418, errorMessage));
        });
      try {
        await putTestStation({});
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect(e.statusCode).toEqual(418);
        expect(e.body).toEqual(errorMessage);
      }
    });
  });
});
