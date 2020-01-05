import request from 'supertest';

let app;

describe('Analyze Movements', () => {
  it.skip('succeeds list of analyze movements', async () => {
    const response = await request(app)
      .get(`/analyze`)
      .expect(200);
    let body = response.body;
    expect(body.length).toBeGreaterThan(1);
  });

  it.skip('succeeds map of analyzed movements grouped by category / month', async () => {
    const response = await request(app)
      .get(`/analyze/summary`)
      .expect(200);
    let summary = JSON.parse(response.body);
    expect(summary.length).toBeGreaterThan(1);
    // summary.forEach(categoryEntry => console.log(categoryEntry[1]))
  });
});
