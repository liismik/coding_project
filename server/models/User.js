const mongoose = require('mongoose')

const registerTemplate = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    loginHistory: {
        type: Array
    },
    verified: {
        type: Boolean,
        required: true,
    }
})

module.exports = mongoose.model('coding_project', registerTemplate)