import supertest from 'supertest';
import expect from 'expect';

var atfs = require('../../mocks/mock-atf.json');
const url = 'http://localhost:3000/atf';
const request = supertest(url);

describe('atfs', () => {

	context('GET', () => {

		context('all atfs', () => {

			it('should return all atfs', (done) => {
                request
					.get('/')
					.set('Context-Type', 'application/json')
					.set('authorization', 'allow')
					.expect(200)
					.expect('Content-Type', 'application/json; charset=utf-8')
					.end((err, res) => {
						if (err) throw err;
						expect(res.body.length).toBeGreaterThan(0);
						done();
					});

            });
        })
    })
});