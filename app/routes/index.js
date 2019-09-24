const router = require('express').Router() 
const stockAPI = require('./stocks')
const userAPI = require('./users') 

router.use('/stocks', stockAPI)
router.use('/users', userAPI)

router.get('/', async (req, res) => {
    try {
        res.status(200).json({ message: `[Route] --> ${req.url} <-- Welcome to Portfolio Arcade API!` })
    } catch({ message }) {
        res.status(404).json({ message })
    }
})

module.exports = router