const mongoose = require('mongoose');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
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
        ref: 'Review'
    }],

    isDeleted: {
        type: Boolean,
        default: false,
    },

});

const EventsSchema = mongoose.Schema(Product);
EventsSchema.plugin(mongoose_fuzzy_searching, {fields: ['name']});
const Events = mongoose.model('Events', EventsSchema);
Events.fuzzySearch('Nodejs meetup').then(console.log).catch(console.error);

module.exports = mongoose.model('Product', Product);