const request = require('supertest');
const express = require('express');
const userController = require("../../controllers/user");
require('mongoose');
const routesUrls = require('../../routes/user')
const mongoose = require("mongoose");
require('dotenv').config()
mongoose.connect(process.env.DATABASE_ACCESS, () => console.log('Database connected'))
const app = express()
app.use(express.json())
app.use(routesUrls)

describe('User', () => {

    it('login', async () => {
        const email = "cptest@test.test";
        const password = "Cptest123";
        const body = { email: email, password: password }

        await request(app).post('/login').send(body).expect(200);
    })
})
