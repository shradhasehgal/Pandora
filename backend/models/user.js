const mongoose = require('mongoose');

let User = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type:{
        type: String,
        enum: ['C', 'V'],
        default: 'C'
    },

    password:{
        type: String,
        required: true,
    }

});

module.exports = mongoose.model('User', User);