const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
//const jwt = require('jsonwebtoken')
//const postmark = require('postmark')
//const fs = require('fs')
//const path = require('path')
//const Handlebars = require('handlebars')

/*const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1]

        jwt.verify(token, "mySecretKey", (err, user) => {
            if (err) {
                return res.status(403).json("Token is not valid!")
            }

            req.user = user;
            next();
        })
    } else {
        res.status(401).json('Access denied!');
    }
}*/

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const accountExists = await User.findOne(
        { 'email': email }
    )

    if (accountExists)
        return res.status(400).json('User already exists!');

    const emailRegex = /^[-!#$%&'*+\/\d=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/\d=?A-Z^_a-z`{|}~])*@[a-zA-Z\d](-*\.?[a-zA-Z\d])*\.[a-zA-Z](-?[a-zA-Z\d])+$/;

    if (!email)
        return res.status(400).json('Input is not an email!');

    if (email.length > 254)
        return res.status(400).json('Email is too long!');

    const valid = emailRegex.test(email)
    if (!valid)
        return res.status(400).send('The email format is not correct!');

    const parts = email.split('@');
    if(parts[0].length>64)
        return res.status(400).send('First half of email is too long!')

    const domainParts = parts[1].split('.');
    if(domainParts.some(function(part) { return part.length>63; }))
        return res.status(400).send('Email domain length is too long!')

    if(!password || (password.length < 8))
        return res.status(400).send('Password is too short! Must be more 8 or more characters long.')

    const hashedPassword = await bcrypt.hash(password, 10)

    const registeredUser = new User({
        email: email,
        password: hashedPassword,
        verified: false,
    })
    registeredUser.save()
        .then(data => {
            res.json(data)
        })
        .catch(error => {
            res.json(error)
        })
/*
    const client = new postmark.ServerClient("fd6205c9-41c4-41ae-b4d7-8245db00d1d8");

    const emailValidationLink = 'http://localhost:3000/confirm-account';
    const emailValues = { emailValidationLink:  emailValidationLink };

    const source = fs.readFileSync(path.join(__dirname, '..', 'emailTemplates', 'registered.hbs'), 'utf8');
    const template = Handlebars.compile(source);
    const html = template(emailValues);

    await client.sendEmail({
        "From": "lmikola@tlu.ee",
        "To": email,
        "Subject": "Hello from Postmark",
        "HtmlBody": html,
        "TextBody": "Hello from Postmark!",
        "MessageStream": "outbound"
    });

    console.log("email sent");*/
    return res.status(201);
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne(
        { 'email': email }
    )

    if (!user)
        return res.status(400).json('A user with that email does not exist!');

    try {
        if ((await bcrypt.compare(password, user.password)) && user.verified) {
            console.log('All good');
            const timestamp = new Date().getTime();
            await User.updateOne({ 'email': email }, { $push: { 'loginHistory': timestamp } })

            res.status(200);
        } else if (!user.verified) {
            console.log('Verification none');
            return res.status(400).json('Please check your email and confirm your registration first!');
        } else {
            console.log('Login fail');
            return res.status(400).json('Login failed!');
        }
    } catch (error) {
        res.status(400).json(`Something went wrong... ${error}`);
    }
    return res.status(201);
})

router.post('/confirm-account', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne(
        { 'email': email }
    )

    if (!user)
        return res.status(400).json('A user with that email does not exist!');

    try {
        if (await bcrypt.compare(password, user.password)) {
            console.log('Confirmation success');

            res.status(200);

            await User.updateOne({ 'email': email }, { 'verified': true })
        } else {
            console.log('Confirmation failed');
            return res.status(400).json('Login failed!');
        }
    } catch (error) {
        res.status(400).json(`Something went wrong... ${error}`);
    }
})

router.get('/users', async (req, res) => {
    const users = await User.find({}, { 'email': 1 });
    res.json(users);
})

router.get('/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);

    let readableDateTimes = [];
    user.loginHistory.forEach((timestamp) => {
        readableDateTimes.push(new Date(timestamp).toString());
    })

    res.json(readableDateTimes);
})

module.exports = router