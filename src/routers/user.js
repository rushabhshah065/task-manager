const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')
const multer = require('multer')
const upload = multer({
    // dest: 'user/avtar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        // const extention = file.originalname.match(/\.(doc | docx)$/)
        // if (!extention) {
        //     return cb(new Error('File must be a document.'))
        // }

        cb(undefined, true)

        // cb(new Error ('File must be a PDF'))
        // cb(undefined,true)
        // cb(undefined,false)
    }
})

router.post("/users", async (req, res) => {
    console.log(req.body)
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }


    // user.save().then(() => {
    //     res.startus(201).send(user)
    // }).catch((error) => {
    //     console.log(error)
    //     res.status(400).send(error)
    // })
})

router.post('/users/login', async (req, res) => {

    try {
        console.log(req.body)
        const user = await User.findByCredential(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            error: 'Email or Password is invalid.'
        })
    }
})

// logout user
router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }

})

// logout user from all device
router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = []

        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }

})

router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

    // User.find({}).then((users) => {
    //     res.status(200).send(users)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowUpdate = ['name', 'email', 'age', 'password']

    const isValidUpdate = updates.every((update) => allowUpdate.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({
            error: 'Invalid updates!'
        })
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        console.log(req.user)
        await req.user.save()
        res.send(req.user)
    } catch (e) {

        res.status(400)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if (!user) {
        //     return res.status(400).send()
        // }

        await req.user.remove()

        res.send(req.user)
    } catch (e) {
        res.status(500)
    }
})


const errorMiddleware = (req, res, next) => {

    throw new Error('My error')
}

router.post('/users/me/avtar', auth, upload.single('avatar'), async (req, res) => {


        const buffer = await sharp(req.file.buffer).resize({
            width: 250,
            height: 250
        }).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send({
            message: 'Profile image uploaded succesfully.'
        })
    },
    (error, req, res, next) => {
        console.log(error)
        res.status(400).send()
    })


router.delete('/users/me/avtar', auth, async (req, res) => {

    req.user.avatar = undefined;

    try {
        await req.user.save()
        res.send({
            message: 'Profile image deleted succesfully.'
        })
    } catch (e) {
        res.status(500).send({
            error: 'Profile image delete error occured.'
        })
    }
})

router.get('/users/me/avtar', auth, async (req, res) => {

    console.log('req.user.avatar', req.user.avatar)

    try {

        if (!req.user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(500).send({
            error: 'Profile image delete error occured.'
        })
    }
})

router.get('*', async (req, res) => {

    try {
        res.send({error : "404 Not found!"})
    } catch (e) {
        res.status(500).send({
            error: 'Profile image delete error occured.'
        })
    }
})



module.exports = router