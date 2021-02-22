const request = require('supertest')
const app = require("../src/app")
const User = require("../src/models/user")
const jwt = require("jsonwebtoken")
const mongoos = require("mongoose")

const userID = new mongoos.Types.ObjectId()

const User1 = {
    _id: userID,
    name: "Rushabh Test Before",
    email: "test1bb@gmail.com",
    password: "12345678",
    tokens: [{
        token: jwt.sign({
            _id: userID
        }, process.env.SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(User1).save()
})

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: "Rushabh Test",
        email: "test1@gmail.com",
        password: "12345678"
    }).expect(201)

})

test('Should login existing user', async () => {
    await request(app).post("/users/login").send({
        name: "Rushabh Test Before",
        email: "test1bb@gmail.com",
        password: "12345678"
    }).expect(200)
})

test('Should not login existing user', async () => {
    await request(app).post("/users/login").send({
        name: "Rushabh Test Before",
        email: "test1bb@gmail.com",
        password: "123456789"
    }).expect(400)
})

test("Should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization",`Bearer ${User1.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should not get for unauth user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization",``)
        .send()
        .expect(401)
})

test("Should delete account for user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization",`Bearer ${User1.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should not delete unauth user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization",``)
        .send()
        .expect(401)
})