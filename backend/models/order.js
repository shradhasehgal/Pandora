const mongoose = require('mongoose');

let Order = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },

    status: {
        type: String,
        enum: ['Waiting', 'Placed', 'Dispatched', 'Canceled'],
        default: 'Waiting'
    },

});

module.exports = mongoose.model('Order', Order);