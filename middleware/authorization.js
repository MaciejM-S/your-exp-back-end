const jwt = require('jsonwebtoken')
const User = require('../models/User')


const authorizate = async (req, res, next) => {

    try {
        const token = req.header("Authorization").split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({ id: decoded.id, 'tokens.token': token })


        if (!user) {
            console.log("brak autoryzacji");
            throw new Error()
        }
        req.user = user
        req.token = token

        next()
    } catch (e) {
        res.status(401).send({ error: "Please authorizate" })
    }

}


module.exports = authorizate