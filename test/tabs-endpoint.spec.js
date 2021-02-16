const knex = require('knex')
const app = require('../src/app')
const { makeTabsArray } = require('./tabs.fixtures')
const supertest = require('supertest')
const { expect } = require('chai')
const { updateTab } = require('../src/tabs/tabs-service')

describe('Tabs Endpoint', function() {
    let db

    before('make knex instance', () => {

        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE tabs RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE tabs RESTART IDENTITY CASCADE'))

    describe(`GET /api/tabs`, () => {
        context(`Given no tabs`, () => {
            it(`responds with 200 and an empty tab`, () => {
                return supertest(app)
                    .get('/api/tabs')
                    .expect(200, [])
            })
        })

        context('Given there are tabs in the database', () => {
            const testTabs = makeTabsArray()

            beforeEach('insert tabs', () => {
                return db
                    .into('tabs')
                    .insert(testTabs)
            })

            it('responds with 200 and all of the tabs', () => {
                return supertest(app)
                    .get('/api/tabs')
                    .expect(200, testTabs)
            })
        })
    })

    describe(`GET /api/tabs/:tab_id`, () => {
        context(`Given no tabs`, () => {
            it(`responds with 404`, () => {
                const tabId = 123456
                return supertest(app)
                    .get(`/api/tabs/${tabId}`)
                    .expect(404, { error: { message: `Tab doesn't exist` } })
            })
        })

        context('Given there are tabs in the database', () => {
            const testTabs = makeTabsArray()

            beforeEach('insert tabs', () => {
                return db
                    .into('tabs')
                    .insert(testTabs)
            })

            it('responds with 200 and the specified tab', () => {
                const tabId = 2
                const expectedTab = testTabs[tabId - 1]
                return supertest(app)
                    .get(`/api/tabs/${tabId}`)
                    .expect(200, expectedTab)
            })
        })
    })

    describe(`POST /api/tabs`, () => {
        const testTabs = makeTabsArray()

        it(`create a tab, responds with 201 and the new tab`, () => {
            const newTab = {
                name: 'Test new tab'
            }
            return supertest(app)
                .post('/api/tabs')
                .send(newTab)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newTab.name)
                    expect(res.body).to.have.property('id')
                })
                .then(res =>
                    supertest(app)
                        .get(`/api/tabs/${res.body.id}`)
                        .expect(res.body)
                )
        })

        const requiredFields = [ 'name' ]

        requiredFields.forEach(field => {
            const newTab = {
                name: 'Test new tab'
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newTab[field]

                return supertest(app)
                    .post('/api/tabs')
                    .send(newTab)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })
    })

    describe(`DELETE /api/tabs/:tab_id`, () => {
        context(`Given no tabs`, () => {
            it(`responds with 404`, () => {
                const tabId = 123456
                return supertest(app)
                    .delete(`/api/tabs/${tabId}`)
                    .expect(404, { error: { message: `Tab doesn't exist` } })
            })
        })

        context('Given there are tabs in the database', () => {
            const testTab = makeTabsArray()

            beforeEach('insert tabs', () => {
                return db
                    .into('tabs')
                    .insert(testTab)
            })

            it('responds with 204 and removes the tab', () => {
                const idToRemove = 2
                const expectedTabs = testTab.filter(tab => tab.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/tabs/${idToRemove}`)
                    .expect(204)
                     .then(res =>
                        supertest(app)
                            .get(`/api/tabs`)
                            .expect(expectedTabs)
                    )
            })
        })
    })

    describe(`PATCH /api/tabs/:tab_id`, () => {
        context(`Given no tabs`, () => {
            it(`responds with 404`, () => {
                const tabId = 123456
                return supertest(app)
                    .delete(`/api/tabs/${tabId}`)
                    .expect(404, { error: { message: `Tab doesn't exist` } })
            })
        })

        context('Given there are tabs in the database', () => {
            const testTabs = makeTabsArray()

            beforeEach('insert tabs', () => {
                return db
                    .into('tabs')
                    .insert(testTabs)
            })

            it('responds with 204 and updates the tab', () => {
                const idToUpdate = 2
                const updateTab = {
                    name: 'updated tab name'
                }
                const expectedTab = {
                    ...testTabs[idToUpdate - 1],
                    ...updateTab
                }
                return supertest(app)
                    .patch(`/api/tabs/${idToUpdate}`)
                    .send(updateTab)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/tabs/${idToUpdate}`)
                            .expect(expectedTab)    
                    )
            })

            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/api/tabs/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain a 'name'`
                        }
                    })
            })

            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                const updateTab = {
                    name: 'updated tab name'
                }
                const expectedTab = {
                    ...testTabs[idToUpdate - 1],
                    ...updateTab
                }

                return supertest(app)
                    .patch(`/api/tabs/${idToUpdate}`)
                    .send({
                        ...updateTab,
                        fieldToIgnore: 'Should not be in GET responds'
                    })
                    .expect(204)
                    .then(res =>
                        supertest(app)
                        .get(`/api/tabs/${idToUpdate}`)
                        .expect(expectedTab)
                    )   
            })
        })
    })
})