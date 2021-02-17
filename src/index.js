require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const userrouter = require('./routers/user.js')
const taskrouter = require('./routers/task.js')


// intialize app
const app = express()

// define port
const port = process.env.PORT

// //middleware
// app.use((req, res, next) => {

//     if (req.method === "GET") {
//         res.send("GET requests are disabled!")
//     } else {
//         next()
//     }
// })

app.listen(port, () => {
    console.log("Server is up on port: " + port)
})

app.use(express.json())
app.use(userrouter)
app.use(taskrouter)

const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {

    // const task = await Task.findById('602bb6c94351e21cb816b1cc')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    const user = await User.findById('602bb61333d3d21c6c8f14fe')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

// main()