const path = require('path')
const express = require('express')
const TabsService = require('./tabs-service')

const tabsRouter = express.Router()
const jsonParser = express.json()

const serializeTab = tab => ({
    id: tab.id,
    name: tab.name,
})

tabsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        TabsService.getAllTabs(knexInstance)
            .then(tabs => {
                res.json(tabs.map(serializeTab))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body
        const newTab = { name }

        for(const [key, value] of Object.entries(newTab))
            if(value == null)
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })

            TabsService.insertTab(
                req.app.get('db'),
                newTab
            )
                .then(tab => {
                    res
                        .status(201)
                        .location(path.posix.join(req.originalUrl + `/${tab.id}`))
                        .json(serializeTab(tab))
                })
                .catch(next)
    })

tabsRouter
    .route('/:tab_id')
    .all((req, res, next) => {
        TabsService.getById(
            req.app.get('db'),
            req.params.tab_id
        )
            .then(tab => {
                if(!tab) {
                    return res.status(404).json({
                        error: { message: `Tab doesn't exist` }
                    })
                }
                res.tab = tab
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeTab(res.tab))
    })
    .delete((req, res, next) => {
        TabsService.deleteTab(
            req.app.get('db'),
            req.params.tab_id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name } = req.body
        const tabToUpdate = { name }

        const numberOfValues = Object.values(tabToUpdate).filter(Boolean).length
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain a 'name'`
                }
            })
        }

        TabsService.updateTab(
            req.app.get('db'),
            req.params.tab_id,
            tabToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = tabsRouter