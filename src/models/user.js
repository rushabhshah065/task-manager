const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 7) {
                throw new Error("Password length should be greater than 6")
            }

            if (value.toLowerCase().includes("password")) {
                throw new Error("Password should not contain password word")
            }

        }

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps : true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {

    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

// generate auth token
userSchema.methods.generateAuthToken = async function () {

    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.PORT)

    user.tokens = user.tokens.concat({
        token
    })

    await user.save()

    return token
}

// find user by credential
userSchema.statics.findByCredential = async (email, password) => {

    const user = await User.findOne({
        email
    })

    console.log(user)

    if (!user) {
        throw new Error('Unable to login user not exist!')
    }

    const match = await bcryptjs.compare(password, user.password)

    console.log(match)

    if (!match) {
        throw new Error('Unable to login user password not match!')
    }

    return user

}


// convert plain text to hash
userSchema.pre('save', async function (next) {

    const user = this
    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8)
    }

    next()

})

// delete user task when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({
        owner: user._id
    })

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User