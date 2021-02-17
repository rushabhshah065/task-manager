const jwat = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {

        console.log('header',req.header('Authorization'))

        const token = req.header('Authorization').replace('Bearer ', '')

        console.log("token",process.env.SECRET)

        const decoded = jwat.verify(token, process.env.SECRET)

        console.log("decoded",decoded)

        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        console.log("user",user)

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({
            error: "Please authenticate user!"
        })
    }
}

module.exports = auth