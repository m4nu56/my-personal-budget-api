const {buildRandomString} = require('./utils');
const {createRandomCategory} = require('./categories.test');
const request = require('supertest');
const moment = require('moment');
const app = require('../app'); // our Node application

async function createRandomMovement () {
    const categoryId = await createRandomCategory();
    const movement = {
        date: '2019-07-02',
        amount: 350,
        label: buildRandomString(),
        category: {
            id: categoryId
        }
    };
    const response = await post(`/movements`, movement).expect(201);
    movement.id = JSON.parse(response.body).id;
    return movement;
}

async function deleteMovement (id) {
    await request(app).delete(`/movements/${id}`).expect(200);
}

describe('Movements', () => {
    it('succeeds list of movements', async () => {
        const response = await request(app).get(`/movements`).expect(200);
        console.log(response.body);
        let body = response.body;
        console.log(body);
        expect(body.length).toBeGreaterThan(1);
        expect(body[0].category.name).toBeDefined();
    });
    it('creates and deletes a movement', async () => {
        const {id} = await createRandomMovement();
        await deleteMovement(id);
    });
    it('updates a movement', async () => {
        const movement = await createRandomMovement();
        movement.amount = 1;
        await request(app).put(`/movements/${movement.id}`).send(movement).expect(200);
        const response = await request(app).get(`/movements/${movement.id}`).expect(200);
        console.log(response.body);
        expect(response.body.amount).toEqual(1);
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
function post (url, body) {
    const httpRequest = request(app).post(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json');
    httpRequest.set('Origin', 'http://localhost:3000');
    return httpRequest;
}
