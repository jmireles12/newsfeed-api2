const path = require('path')
const express = require('express')
const axios = require('axios')
const config = require('../config')

const newsRouter = express.Router()
const jsonParser = express.json()

const serializeNews = result => ({
    id: result.id,
    title: result.fields.headline,
    body: result.fields.body,
    url: result.fields.shortUrl,
    publication: result.webPublicationDate,
    thumbnail: result.fields.thumbnail
})

newsRouter
    .route('/')
    .get((req, res, next) => {
        axios.get(config.API_URL)
            .then(function (feed) {
                results = feed.data.response.results
                res.json(results.map(serializeNews))
            })
            .catch(function(error) {
                console.error(error)
            })
    })

module.exports = newsRouter