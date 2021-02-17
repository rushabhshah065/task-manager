const mongoose = require('mongoose')
const {
    MONGO_URL
} = require('../index')

console.log('MONGO_URL',process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL + '/task-mager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})


// const me = new User({
//     name: 'Rushabh',
//     age: 27
// })

// me.save().then(() => {
//     console.log('data save success' + me)
// }).catch((errror) => {
//     console.log('data save error' + errror)
// })