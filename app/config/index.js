require('dotenv').config()

const config = {
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    iexURL: process.env.IEX_URL,
    iexKey: process.env.IEX_KEY,
    iexSecret: process.env.IEX_SECRET
}

module.exports = config
