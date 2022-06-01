import { TestStationService } from "../services/TestStationService";
import { TestStationDAO } from "../models/TestStationDAO";
import { HTTPResponse } from "../models/HTTPResponse";
import { Handler } from "aws-lambda";
import { HTTPError } from "../models/HTTPError";
import { Validator } from "../utils/Validator";

export const getTestStationsEmails: Handler = async (event) => {
  const testStationDAO = new TestStationDAO();
  const service = new TestStationService(testStationDAO);
  const check: Validator = new Validator();

  if (
    !check.parameterIsValid(event.pathParameters) ||
    !check.parameterIsValid(event.pathParameters.testStationPNumber)
  ) {
    return new HTTPError(400, "Request missing Station P Number");
  }
  const testStationPNumber = event.pathParameters
    ? event.pathParameters.testStationPNumber
    : undefined;

  return service
    .getTestStationEmails(testStationPNumber)
    .then((data) => {
      return new HTTPResponse(200, data);
    })
    .catch((error: any) => {
      throw new HTTPError(error.statusCode, error.body);
    });
};
