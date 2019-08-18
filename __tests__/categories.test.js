const {post, buildRandomString} = require('../testUtils');
const request = require('supertest');
const app = require('../app'); // our Node application

const categoryRandom = () => {
    return {
        name: buildRandomString()
    };
};

async function createRandomCategory() {
    const response = await post(`/categories`, categoryRandom()).expect(201);
    return JSON.parse(response.body).id;
}

module.exports = {
    createRandomCategory
};

describe('Categories', () => {
    it('succeeds list of categories', async () => {
        const categoryId = await createRandomCategory();

        const response2 = await request(app).get(`/categories`).expect(200);
        expect(response2.body.length).toBeGreaterThan(1);

        await request(app).delete(`/categories/${categoryId}`).expect(200);
    });

    it('succeeds get unique category', async () => {
        const response = await post(`/categories`, categoryRandom()).expect(201);
        const body = JSON.parse(response.body);
        expect(body.id).toBeGreaterThan(0);

        const response2 = await request(app).get(`/categories/${body.id}`).expect(200);
        expect(parseInt(response2.body[0].id)).toEqual(body.id);

        await request(app).delete(`/categories/${body.id}`).expect(200);
    });

    it('succeeds creates and deletes a category', async () => {
        const response = await post(`/categories`, categoryRandom()).expect(201);
        const body = JSON.parse(response.body);
        expect(body.id).toBeGreaterThan(0);
        await request(app).delete(`/categories/${body.id}`).expect(200);
    });

    it('cannot creates a category with no name', async () => {
        const category = {
            name: null
        };
        await post(`/categories`, category).
            expect(400);
    });

    it('cannot creates a category with existing name', async () => {
        let category = categoryRandom();
        const response = await post(`/categories`, category).expect(201);
        const body = JSON.parse(response.body);
        await post(`/categories`, category).expect(400);
        await request(app).delete(`/categories/${body.id}`).expect(200);
    });

    it('update category name', async () => {
        let category = categoryRandom();
        const response = await post(`/categories`, category).expect(201);
        const body = JSON.parse(response.body);
        category.name = buildRandomString();
        await request(app).put(`/categories/${body.id}`).send(category).expect(200);
        const response2 = await request(app).get(`/categories/${body.id}`).expect(200);
        expect(parseInt(response2.body[0].id)).toEqual(body.id);
        expect(response2.body[0].name).toEqual(category.name);
        await request(app).delete(`/categories/${body.id}`).expect(200);
    });
});
