const router = require('express').Router() 
const model = require('../../model')

const { restricted, getAssetData } = require('../../utils')

router.get('/', async (req, res) => {
    try {
        res.status(200).json({ message: `[Route] --> ${req.url} <-- Welcome to the Portfolio Boi Users API!` })
    } catch({ message }) {
        res.status(500).json({ message })
    }
})

router.get('/dashboard', restricted, async (req, res) => {
    const id = req.decoded.user
    try {
        if(id) {
            const user = await model.findBy('Accounts', { id })
            res.status(200).json({ message: 'User found!',  user })
        }
    } catch({ message }) {
        res.status(500).json({ message })
    }
})

router.get('/all', async (req, res) => {
    try {
        const users = await model.get('Accounts')
        if(users) {
            return res.status(200).json(users)
        } else {
            return res.status(404).json({ message: `There are currently no users in the DB.` })
        }
    } catch({ message }) {
        return res.status(500).json({ message })
    }
})

router.get('/transactions', restricted, async (req, res) => {
    const id = req.decoded.user
    try {
        const stocks = await model.findAllBy('Orders', { user_id: id })
        return res.status(200).json(stocks)
    } catch({ message }) {
        return res.status(500).json({ message })
    }
})

router.get('/analytics', restricted, async (req, res) => {
    const id = req.decoded.user 
    const holdings = {}
    try {
        const stocks = await model.findAllBy('Orders', { user_id: id })
        if(stocks) {
            // Grab all the stocks this user currently holds
            for(const stock of stocks) {
                if(!holdings[stock.ticker]) {
                    holdings[stock.ticker] = stock.quantity
                } else {
                    if(stock.order_type == 'B') {
                        holdings[stock.ticker] += stock.quantity 
                    } else {
                        holdings[stock.ticker] -= stock.quantity
                    }
                }
            }

            // Make sure none of the holding quantities are negative values
            for(const key of Object.keys(holdings)) {
                if(holdings[key] < 0) { holdings[key] = 0 }
            }
        }
        return res.status(200).json(holdings)
    } catch({ message }) {
        return res.status(500).json({ message })
    }
})

router.post('/register', async (req, res) => {
    // Make additional checks for validity of password + conf and email and names
    if(!req.body.first_name || 
       !req.body.last_name  || 
       !req.body.password   || 
       !req.body.email) {
          return res.status(409).json({ message: `Registration fields not completed.` })
       }
       
    try {
        const user = await model.findBy('Accounts', { email: req.body.email })
        if(user) {
            return res.status(200).json({ message: `There is already an account registered with this email address.` })
        } else {
            const token = await model.register({ ...req.body })
            if(token) { // token will be false if user already found in DB.
                return res.status(201).json({ 
                    message: `User successfully registered.`,
                    token 
                })
            } 
        }
    } catch({ message }) {
        return res.status(500).json({ message })
    }
})

router.post('/login', async (req, res) => {
    // Make additional checks on validity of email and password
    if(!req.body.email || !req.body.password) {
        return res.status(401).json({ message: `Must enter valid email and password.` })
    }

    try {
        const token = await model.login({ ...req.body })
        if(token === null) {
            res.status(200).json({ message: `Invalid credentials entered.` })
        } else {
            res.status(201).json({
                message: `User successfully logged in.`,
                token
            })
        }
    } catch({ message }) {
       return res.status(500).json({ message })
    }
})

module.exports = router