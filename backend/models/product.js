const mongoose = require('mongoose');

let Product = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },

    price_per_unit: {
        type: Number,
    },

    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    dispatch: {
        type: Boolean,
        default: false,
    },

});

module.exports = mongoose.model('Product', Product);