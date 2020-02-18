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

    no_reviews: {
        type: Number,
        default: 0
    }, 
   
    rating: {
        type: Number

    }

});

module.exports = mongoose.model('User', User);