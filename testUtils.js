const request = require('supertest');
const app = require('./app'); // our Node application

const buildRandomString = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// a helper function to make a POST request
const post = (url, body) => {
    const httpRequest = request(app).post(url);
    httpRequest.send(body);
    httpRequest.set('Accept', 'application/json');
    httpRequest.set('Origin', 'http://localhost:3000');
    return httpRequest;
};

module.exports = {
    buildRandomString, post
};
