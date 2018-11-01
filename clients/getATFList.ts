import * as fs from 'fs';
import { ATF } from '../models';
import HTTPResponseStatus from '../models/HTTPResponseStatus';
import * as path from 'path';

function getATFList(): Promise<ATF[]> {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../mocks/mock-atf.json'), 'utf8')));
        } catch (error) {
            reject(new HTTPResponseStatus(500, error.stack));
        }
    })
}

export default getATFList;