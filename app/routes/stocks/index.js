const router = require('express').Router() 
const model = require('../../model')

const { restricted, getAssetData } = require('../../utils')

router.get('/', async (req, res) => {
    try {
        res.status(200).json({ message: `[Route] --> ${req.url} <-- Welcome to the Portfolio Boi <-> IEX API!` })
    } catch({ message }) {
        res.status(500).json({ message })
    }
})

router.get('/:ticker', async (req, res) => {
    const { ticker } = req.params 
    try{
        if(ticker) {
            const success = await getAssetData(ticker) 
            if(success) {
                res.status(200).json(success)
            } else {
                res.status(404).json({ message: `There was no stock found at this ticker.` })
            }
        }
    } catch({ message }) {
        res.status(500).json({ message })
    }

})

router.post('/purchase', restricted, async (req, res) => {
    const { price, quantity, ticker, order_type, company_name } = req.body
    const id = req.decoded.user

    try {
        const cost = (price * quantity).toFixed(2)
        const user = await model.findBy('Accounts', { id })
        
        if(user.balance >= cost) {
            const newBalance = user.balance - cost 
            const newOrder = { price, quantity, ticker, order_type, company_name, user_id: id }

            const [ order_id ] = await model.add('Orders', newOrder)
            if(order_id) {
                const order = await model.findBy('Orders', { id: order_id })
                await model.update('Accounts', id, { balance: newBalance })
                return res.status(201).json({ message: `Buy Order submitted!`, order })
            }
        } else {
            return res.status(400).json({ message: `The cost is too high.` })
        }
    } catch({ message }) {
        return res.status(500).json({ message })
    }
})

router.post('/sell', restricted, async (req, res) => {
    const { price, quantity, ticker, order_type, company_name } = req.body
    const id  = req.decoded.user
    try {
        const user = await model.findBy('Accounts', { id })
        if(user) {
            const newBalance = (user.balance + price * quantity).toFixed(2)
            const newOrder = { price, quantity, ticker, order_type, company_name, user_id: id}
            const [ order_id ] = await model.add('Orders', newOrder)
            if(order_id) {
                const order = await model.findBy('Orders', { id: order_id })
                await model.update('Accounts', id, { balance: newBalance })
                return res.status(201).json({ message: `Sell Order Submitted!`, order })
            }
        }  
    } catch({ message }) {
        res.status(500).json({ message })
    }
})

module.exports = router