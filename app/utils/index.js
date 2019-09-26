const jwt = require('jsonwebtoken')
const axios = require('axios')

const config = require('../config')
const jwtSecret = config.jwtSecret 

// General middleware to protect routes
const restricted = async (req, res, next) => {
    const token = req.headers.authorization 
    if(token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err) {
                res.status(401).json({ message: `Invalid token.` })
            } else {
                req.decoded = decodedToken 
                next()
            }
        })
    } else {
        res.status(401).json({ message: `No token provided.` })
    }
}

// Function to generate tokens for user authorization
const generateToken = async (user) => {
    const jwtPayload = { user: user.id }
    const jwtOptions = {
        expiresIn: '2h' // Upping to 2h to test longer
    }

    return jwt.sign(jwtPayload, jwtSecret, jwtOptions)
}

// Function to retrieve asset data
const getAssetData = async (asset) => {
    const ticker = asset.toLocaleLowerCase()
    const success = await axios.get(`${config.iexURL}/stable/stock/${ticker}/quote?token=${config.iexKey}`)
    if(success.data) {
        return success.data 
    } else {
        return null 
    }
}

module.exports = {
    restricted,
    generateToken,
    getAssetData
}