const mongoose = require('mongoose')
// const {
//     MONGO_URL
// } = require('../index')

// console.log('MONGO_URL',process.env.MONGODB_URI)

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
})


// const MongoClient = require('mongodb').MongoClient;
// const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// const me = new User({
//     name: 'Rushabh',
//     age: 27
// })

// me.save().then(() => {
//     console.log('data save success' + me)
// }).catch((errror) => {
//     console.log('data save error' + errror)
// })