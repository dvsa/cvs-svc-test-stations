import { TestStationService } from "../services/TestStationService";
import { TestStationDAO } from "../models/TestStationDAO";
import { HTTPResponse } from "../models/HTTPResponse";
import { ITestStation } from "../models/ITestStation";
import {HTTPError} from "../models/HTTPError";

export const updateTestStation = async (event: any) => {
  console.log("Event: ", event);
  const testStationDAO = new TestStationDAO();
  const service = new TestStationService(testStationDAO);

  const testStationId = event.pathParameters?.testStationId;

  return service.updateTestStation(event.body, testStationId)
    .then((data: ITestStation[]) => {
      return new HTTPResponse(202, data);
    })
    .catch((error: any) => {
      console.error(error);
      throw new HTTPError(error.statusCode, error.body);
    });
};
