import request from 'supertest';
import { endPool } from '../src/services/db-config';

import http from 'http';

let app, server;

beforeAll(done => {
  app = require('../app');
  server = http.createServer(app);
  server.listen(done);
});

afterAll(done => {
  endPool();
  server.close(done);
});

describe('Analyze Movements', () => {
  it('succeeds list of analyze movements', async () => {
    const response = await request(app)
      .get(`/analyze`)
      .expect(200);
    let body = response.body;
    expect(body.length).toBeGreaterThan(1);
  });

  it('succeeds map of analyzed movements grouped by category / month', async () => {
    const response = await request(app)
      .get(`/analyze/summary`)
      .expect(200);
    let summary = JSON.parse(response.body);
    expect(summary.length).toBeGreaterThan(1);
    // summary.forEach(categoryEntry => console.log(categoryEntry[1]))
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
