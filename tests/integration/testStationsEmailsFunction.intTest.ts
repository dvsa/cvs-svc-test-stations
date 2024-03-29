import LambdaTester from "lambda-tester";
import { getTestStationsEmails } from "../../src/functions/getTestStationsEmails";
import { ITestStation } from "../../src/models/ITestStation";
import { HTTPError } from "../../src/models/HTTPError";
import { emptyDatabase, populateDatabase } from "../util/dbOperations";
import { HTTPResponse } from "../../src/models/HTTPResponse";

describe("getTestStationsEmail", () => {
  beforeAll(async () => {
    await emptyDatabase();
  });

  beforeEach(async () => {
    await populateDatabase();
  });

  afterEach(async () => {
    await emptyDatabase();
  });

  afterAll(async () => {
    await populateDatabase();
  });

  it("should return an error when sending no parameters", () => {
    return LambdaTester(getTestStationsEmails).expectResolve((error: Error) => {
      expect(error).toBeTruthy();
      expect(error).toBeInstanceOf(HTTPResponse);
      expect((error as HTTPError).statusCode).toEqual(400);
    });
  });
  it("should return a promise when sending parameters", () => {
    return LambdaTester(getTestStationsEmails)
      .event({
        pathParameters: {
          testStationPNumber: "87-1369569",
        },
      })
      .expectResolve((result: ITestStation[]) => {
        expect(result).toBeTruthy();
      });
  });
  it("should throw and error when requesting non-existent record", () => {
    return LambdaTester(getTestStationsEmails)
      .event({
        pathParameters: {
          testStationPNumber: "111",
        },
      })
      .expectReject((error: Error) => {
        expect(error).toBeTruthy();
        expect(error).toBeInstanceOf(HTTPError);
        expect((error as HTTPError).statusCode).toEqual(404);
      });
  });
  it("should trigger validation when testStationPNumber is undefined", () => {
    return LambdaTester(getTestStationsEmails)
      .event({
        pathParameters: {
          testStationPNumber: undefined,
        },
      })
      .expectResolve((error: Error) => {
        expect(error).toBeTruthy();
        expect(error).toBeInstanceOf(HTTPResponse);
        expect((error as HTTPError).statusCode).toEqual(400);
      });
  });
  it("should trigger validation when testStationPNumber is null", () => {
    return LambdaTester(getTestStationsEmails)
      .event({
        pathParameters: {
          testStationPNumber: null,
        },
      })
      .expectResolve((error: Error) => {
        expect(error).toBeTruthy();
        expect(error).toBeInstanceOf(HTTPResponse);
        expect((error as HTTPError).statusCode).toEqual(400);
      });
  });
  it("should trigger validation when testStationPNumber is an empty string", () => {
    return LambdaTester(getTestStationsEmails)
      .event({
        pathParameters: {
          testStationPNumber: " ",
        },
      })
      .expectResolve((error: Error) => {
        expect(error).toBeTruthy();
        expect(error).toBeInstanceOf(HTTPResponse);
        expect((error as HTTPError).statusCode).toEqual(400);
      });
  });
});
