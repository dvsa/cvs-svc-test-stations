import supertest from 'supertest';
import expect, { assert } from 'expect';
import HTTPResponseStatus from '../../models/HTTPResponseStatus';
import getATFList from '../../clients/getATFList';
import { ATF } from '../../models';

describe('getATFList', () => {
    it("should return a populated list of atfs", () => {
        
        getATFList().then((ATFs: ATF[]) => {
            expect(ATFs.length).toBeGreaterThan(0);
        });
    })
});
