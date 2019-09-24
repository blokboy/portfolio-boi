const express = require('express') 
const logger = require('morgan')
const cors = require('cors') 
const helmet = require('helmet')

const routes = require('../routes')

const configureMiddleware = app => {
    app.use(helmet())
    app.use(logger('combined'))
    app.use(cors())
    app.use(express.json())
    app.use('/API', routes)
}

module.exports = configureMiddleware 