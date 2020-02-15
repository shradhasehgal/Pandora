const mongoose = require('mongoose');

let Review = new mongoose.Schema({
    
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    feedback: {
        type: String,
    },
    
    rating:{
        type: Number,
        enum: [1, 2, 3, 4, 5]
    },
    
    customer


});

module.exports = mongoose.model('Review', Review);