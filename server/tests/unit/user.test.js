const request = require('supertest');
const express = require('express');
const User = require('../../models/User')
const routesUrls = require('../../routes/user')
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const app = express()
require('dotenv').config()
require('mongoose');

mongoose.connect(process.env.DATABASE_ACCESS, () => console.log('Database connected'))
app.use(express.json())
app.use(routesUrls)

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
let result = "";
const charactersLength = characters.length;

for (let i = 0; i < 16; i ++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
}

const email = `${result}@cptest.cptest`
const password = result;

const headerName = "x-access-token";
let user;
let headerValue;

describe('User', () => {

    it('Register', async() => {
        const body = { email: email, password: password, sendEmail: false };

        await request(app).post('/register').send(body).expect(200);
    })

    it('Confirm', async() => {
        const body = { email: email, password: password };

        await request(app).post('/confirm-account').send(body).expect(200);
    })

    it('Login', async () => {
        const body = { email: email, password: password };

        user = await User.findOne({ 'email': email });
        const userId = user._id;
        headerValue = jwt.sign({userId}, process.env.mySecretKey, {
            expiresIn: 3000,
        })

        await request(app).post('/login').send(body).expect(200);
    })

    it('Forgot password', async () => {
        const body = { email: email, sendEmail: false, isTest: true };

        await request(app).post('/forgot-password').send(body).expect(200);
    })

    it('Paginate users', async () => {
        const body = { params: { resultsPerPage: 5, currentPageNumber: 1, state: 'initial' } }

        const response = await request(app).post('/users/paginated').set(headerName, headerValue).send(body);
        expect(typeof response.res).toBe('object');
    })

    it('Paginate history', async () => {
        const user = await User.findOne({ 'email': email });
        const body = { params: { resultsPerPage: 5, currentPageNumber: 1, state: 'initial' } }

        const response = await request(app).post(`/users/${user._id}/history/paginated`).set(headerName, headerValue).send(body);
        expect(typeof response.res).toBe('object');
    })

    it('Delete', async () => {
        const body = { userId: user._id, currentUserEmail: email, sendEmail: false }

        await request(app).post('/users/delete-user').set(headerName, headerValue).send(body).expect(200);
    })
})

afterAll((done) => {
    mongoose.connection.close();
    done();
});
