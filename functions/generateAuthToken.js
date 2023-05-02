const jwt = require('jsonwebtoken')

const generateAuthToken = async function (id, user) {


    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1000days' })
   
    user.tokens = user.tokens.concat({
        token
    })

    return token
}


module.exports = generateAuthToken
