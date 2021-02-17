const mongoose = require('mongoose')
const {
    MONGO_URL
} = require('../index')

console.log('MONGO_URL',process.env.MONGO_URL)

// mongoose.connect(process.env.MONGO_URL + '/task-mager-api', {
//     useNewUrlParser: true,
//     useCreateIndex: true
// })


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://rushabh:<rushabh123>@cluster0.hhehm.mongodb.net/<task-mager-api>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

// const me = new User({
//     name: 'Rushabh',
//     age: 27
// })

// me.save().then(() => {
//     console.log('data save success' + me)
// }).catch((errror) => {
//     console.log('data save error' + errror)
// })