import supertest from "supertest";
import LambdaTester from "lambda-tester";
import { getTestStations } from "../../src/functions/getTestStations";
import { HTTPResponse } from "../../src/models/HTTPResponse";
import { emptyDatabase, populateDatabase } from "../util/dbOperations";
const url = "http://localhost:3004/";
const request = supertest(url);

describe("getTestStation", () => {
  beforeAll(async () => {
    jest.restoreAllMocks();
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

  context("when updating a record", () => {
    it("get should return the updated record", async () => {
      const originalResponse = [
        {
          testStationPNumber: "84-926821",
          testStationEmails: [
            "teststationname@dvsa.gov.uk",
            "teststationname1@dvsa.gov.uk",
          ],
          testStationId: "2",
        },
      ];

      const originalRes = await request.get("test-stations/84-926821");
      expect(originalRes.status).toEqual(200);
      expect(originalRes.body).toStrictEqual(originalResponse);

      const testStationUpdateEvent = {
        version: "0",
        id: "3b8d813d-9e1c-0c30-72f9-7539de987e31",
        source: "cvs.update.test.stations",
        account: "1234567",
        time: "2000-01-01T00:00:00Z",
        region: "eu-west-1",
        resources: [],
        detail: {
          testStationPNumber: "84-926821",
          testStationEmails: [
            "teststationname@dvsa.gov.uk",
            "teststationname1@dvsa.gov.uk",
            "teststationname2@dvsa.gov.uk",
          ],
          testStationId: "2",
        },
      };

      await request
        .post(
          "{apiVersion}/functions/cvs-svc-test-station-dev-getTestStations/invocations"
        )
        .send(testStationUpdateEvent);

      const updatedResponse = [
        {
          testStationPNumber: "84-926821",
          testStationEmails: [
            "teststationname@dvsa.gov.uk",
            "teststationname1@dvsa.gov.uk",
            "teststationname2@dvsa.gov.uk",
          ],
          testStationId: "2",
        },
      ];

      const res = await request.get("test-stations/84-926821");
      expect(res.status).toEqual(200);
      expect(res.body).toStrictEqual(updatedResponse);
    });
  });

  context("when inserting a record", () => {
    it("get should return the inserted record", async () => {
      const originalRes = await request.get("test-stations/84-123456");
      expect(originalRes.status).toEqual(200);
      expect(originalRes.body).toStrictEqual("");

      const testStationInsertEvent = {
        version: "0",
        id: "3b8d813d-9e1c-0c30-72f9-7539de987e31",
        source: "cvs.update.test.stations",
        account: "1234567",
        time: "2000-01-01T00:00:00Z",
        region: "eu-west-1",
        resources: [],
        detail: {
          testStationPNumber: "84-123456",
          testStationEmails: [
            "teststationname@dvsa.gov.uk",
            "teststationname1@dvsa.gov.uk",
          ],
          testStationId: "2",
        },
      };

      await request
        .post(
          "{apiVersion}/functions/cvs-svc-test-station-dev-getTestStations/invocations"
        )
        .send(testStationInsertEvent);

      const expectedResponse = [
        {
          testStationPNumber: "84-123456",
          testStationEmails: [
            "teststationname@dvsa.gov.uk",
            "teststationname1@dvsa.gov.uk",
          ],
          testStationId: "2",
        },
      ];

      const res = await request.get("test-stations/84-123456");
      expect(res.status).toEqual(200);
      expect(res.body).toStrictEqual(expectedResponse);
    });
  });
});
