const request = require('supertest');
const moment = require('moment');
const app = require('../app'); // our Node application

describe('Analyze Movements', () => {
    it('succeeds list of analyze movements', async () => {
        const response = await request(app)
            .get(`/analyze`)
            .expect(200);
        let body = response.body;
        console.log(body)
        expect(body.length).toBeGreaterThan(1);
    });

    it('succeeds map of analyzed movements grouped by category / month', async () => {
        const response = await request(app)
            .get(`/analyze/summary`)
            .expect(200);
        let summary = JSON.parse(response.body);
        expect(summary.length).toBeGreaterThan(1);
        summary.forEach(categoryEntry => console.log(categoryEntry[1]))
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
