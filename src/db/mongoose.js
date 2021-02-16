const connectionURL = "mongodb://127.0.0.1:27017"
const mongoose = require('mongoose')

mongoose.connect(connectionURL + '/task-mager-api', {
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