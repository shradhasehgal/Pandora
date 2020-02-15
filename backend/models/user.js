const mongoose = require('mongoose');

let User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: ['C', 'V']
    },

    password:{
        type: String,
        required: true,
    }

});

module.exports = mongoose.model('User', User);