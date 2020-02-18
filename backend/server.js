const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose')

const app = express();
const PORT = 4000;
// const userRoutes = express.Router();
// const router = express();

const api = require('./api');
let User = require('./models/user');
let Token = require('./models/token');
let Review = require('./models/review');
let Order = require('./models/order');
let Product = require('./models/product');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', api);
// Connection to mongodb

const eraseDatabaseOnSync = false;

mongoose.connect('mongodb://127.0.0.1:27017/assaa2', { useNewUrlParser: true })
.then(async () => {
    if (eraseDatabaseOnSync) {
        await Promise.all([
            User.deleteMany({}), User.remove({}),
            Token.deleteMany({}),
            Order.deleteMany({}),
            // Review.deleteMany({}),
            Product.deleteMany({}),
        ]);
    }
    app.listen(PORT, () =>
        console.log(`Example app listening on port ${PORT}!`),
    );
});;


const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established succesfully.");
})
