const mongoose = require('mongoose');

let User = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    type:{
        type: String,
        enum: ['C', 'V'],
        default: 'C'
    },

    password:{
        type: String,
        required: true,
        minlength: 3
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