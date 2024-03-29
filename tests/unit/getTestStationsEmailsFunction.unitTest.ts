import { TestStationService } from "../../src/services/TestStationService";
import { getTestStationsEmails } from "../../src/functions/getTestStationsEmails";
import { HTTPError } from "../../src/models/HTTPError";
import stations from "../resources/test-stations.json";
import mockContext, { Context } from "aws-lambda";
import { HTTPResponse } from "../../src/models/HTTPResponse";
const ctx = mockContext as Context;

jest.mock("../../src/services/TestStationService");

describe("getTestStationsEmails Handler", () => {
  context("with valid event", () => {
    it("parses event correctly and returns response with data", async () => {
      const emails = stations[0].testStationEmails;
      const testPNumber = "12-345678";
      const mockFunction = (input: string) => {
        expect(input).toEqual(testPNumber);
        return Promise.resolve(emails);
      };
      TestStationService.prototype.getTestStationEmails = jest
        .fn()
        .mockImplementation(mockFunction);

      const event = { pathParameters: { testStationPNumber: testPNumber } };
      try {
        const res: HTTPResponse = await getTestStationsEmails(
          event,
          ctx,
          () => {
            return;
          }
        );
        expect(res).toBeInstanceOf(HTTPResponse);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(JSON.stringify(emails));
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
      }
    });
  });

  context("with invalid event", () => {
    it("returns an error without invoking the service", async () => {
      // TestStationService.prototype.getTestStationEmails = jest.fn().mockImplementation(() => expect.fail());
      const event = { invalid: true }; // Missing pathParameters
      try {
        await getTestStationsEmails(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(400);
      }
    });
    it("triggers validation when path parameters is null", async () => {
      const event = { pathParameters: null };
      try {
        await getTestStationsEmails(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(400);
      }
    });

    it("triggers validation when path parameters testPNumber is null", async () => {
      const event = { pathParameters: { testStationPNumber: null } };
      try {
        await getTestStationsEmails(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(400);
      }
    });
    it("triggers validation when path parameters testPNumber is undefined", async () => {
      const event = { pathParameters: { testStationPNumber: undefined } };
      try {
        await getTestStationsEmails(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(400);
      }
    });
    it("triggers validation when path parameters testPNumber is empty string", async () => {
      const event = { pathParameters: { testStationPNumber: " " } };
      try {
        await getTestStationsEmails(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(400);
      }
    });
  });

  context("Service throws error", () => {
    it("should throw that error upwards", async () => {
      const errorMessage = "Bad thing happened";
      TestStationService.prototype.getTestStationEmails = jest
        .fn()
        .mockImplementation(() => {
          return Promise.reject(new HTTPError(418, errorMessage));
        });
      const event = { pathParameters: { testStationPNumber: "12-345678" } };
      try {
        await getTestStationsEmails(event, ctx, () => {
          return;
        });
      } catch (e) {
        expect(e).toBeInstanceOf(HTTPError);
        expect((e as HTTPError).statusCode).toEqual(418);
        expect((e as HTTPError).body).toEqual(errorMessage);
      }
    });
  });
});
