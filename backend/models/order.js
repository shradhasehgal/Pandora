const mongoose = require('mongoose');

let Order = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    quantity: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['Waiting', 'Placed', 'Dispatched', 'Canceled']
    },

    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

});

module.exports = mongoose.model('Order', Order);