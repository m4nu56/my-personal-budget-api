const request = require('supertest');
const moment = require('moment');
const app = require('../app'); // our Node application

describe('Movements', () => {
    it('succeeds list of movements', async () => {
        const response = await request(app)
            .get(`/movements`)
            .expect(200);
        console.log(response.body);
        let body = response.body;
        expect(body.length).toBeGreaterThan(1);
    });
    it('creates a new movement', async () => {
        const movement = {
            date: '2019-07-02',
            amount: 350,
            label: 'PRAGUE2019',
            category: 'Coucou'
        };
        await post(`/movements`, movement).expect(201);
    });
    it('test parsing date', () => {
        let date = moment('2019-02-04T00:00:00+01:00');
        expect(date.isValid()).toBeTruthy();
        expect(date.format('DD')).toBe('04');
        expect(date.format('D')).toBe('4');
        expect(date.format('M')).toBe('2');
        expect(date.format('YYYY')).toBe('2019');
    });
});

// a helper function to make a POST request
function post(url, body) {
    const httpRequest = request(app).post(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json');
    httpRequest.set('Origin', 'http://localhost:3000');
    return httpRequest;
}
