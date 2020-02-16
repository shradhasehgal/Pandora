const mongoose = require('mongoose');
const uuid = require('uuid');

let Token = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        default: () => uuid.v4(),
    },
    expire: {
        type: Date,
        default: () => Date.now() + 3600*1000,
    },
});

module.exports = mongoose.model('Token', Token);