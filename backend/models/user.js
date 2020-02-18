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
    },

    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]

});

module.exports = mongoose.model('User', User);