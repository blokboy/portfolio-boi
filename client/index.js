const app = require('./app')
const config = require('./config')

const PORT = config.port || 5000 

// Error Handling Middleware

// 404 
app.use( async(err, req, res, next) => {
    if(err) {
        return res.status(404).json({ message: `[Route] --> ${req.url} <-- Not found.`, err })
    } else {
        next()
    }
})

// 500 - Any server error
app.use( async(err, req, res, next) => {
    if(err) {
        return res.status(500).json({ message: `[Route] --> ${req.url} <-- Caused a crash.`, err })
    } else {
        next()
    }
})

app.listen(PORT, () => console.log(`🔥 -------- listening on PORT: ${PORT} ---------- 🔥`));