const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require('cors')
const path = require('path')

// importowanie routera
const friendsRouter = require('./routers/friends')
const universalRouter = require('./routers/universal')
const initRouter = require('./routers/init')
const profileRouter = require('./routers/profile')

app.use(express.json())
app.use(cors())

// uzycie routera
app.use(friendsRouter)
app.use(universalRouter)
app.use(initRouter)
app.use(profileRouter)

app.use((err, req, res, next) => {
    res.status(err.statusCode).send()
})

mongoose.connect(
    process.env.MONGO_URI
)
path.resolve(__dirname, "./client/build", "index.html")
const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log('the server is up on port ' + port);
})