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

    no_orders: {
        type: Number,
        default: 0
    },
    
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    dispatch: {
        type: Boolean,
        default: false,
    },

    reviews:
    [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],

    isDeleted: {
        type: Boolean,
        default: false,
    },

});

module.exports = mongoose.model('Product', Product);