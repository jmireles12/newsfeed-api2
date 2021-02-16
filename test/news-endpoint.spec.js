const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')

describe('News Endpoint', () => {
    it('GET /api/news responds with 200', () => {
        return supertest(app)
        .get('/api/news')
        .expect(200)
    })
})