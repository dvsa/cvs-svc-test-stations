import { Handler, APIGatewayProxyResult } from "aws-lambda";
import getATFList from "../clients/getATFList";
import { ATF } from "../models";
import HTTPResponseStatus from "../models/HTTPResponseStatus";


const getATFs: Handler = async (): Promise<APIGatewayProxyResult> => {
    return await getATFList()
        .then((ATFs: ATF[]) => {
            return {
                statusCode: 200,
                body: JSON.stringify(ATFs)
            }
        })
        .catch((error: HTTPResponseStatus) => {
            return {
                statusCode: error.statusCode,
                body: JSON.stringify(error.body)
            };
        });
};

export default getATFs;