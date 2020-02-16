const router = require('express').Router();
let User = require('./models/user');
let Product = require('./models/product');
const bcrypt = require('bcrypt');


// Users

router.route('/users').get((req, res) => {
    User.find()
      .then(users => res.json(users))
      .catch(err => res.status(400).json(err));
});

function Authorize(req)
{
    const token = req.header('Authorization');
    return Token.findOne({ token: token })
        .then(token => {
            if(!token) return null;
            if(Date.now() > token.expire) {
                let user = token.user;
                token.delete();
                token = new Token({user});
                token.save();
            }
            return token.user;
        })
};


router.post('/users/add', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) res.status(400).send(err);
        else
        {
            let user = new User(req.body);
            user.password = hash;
            console.log(user);
            user.save()
            .then(user => {
                user.password = undefined;
                res.status(201).json(user);
            })
            .catch(err => {
                res.status(400).send(err);
    
            });
        }
    });
});

router.post('/users/login', (req, res) => {
    let email = req.body.email, password = req.body.password;
    if(!email || !password) return res.status(400).send({'message': 'Please enter all fields'});

    User.findOne({ email: email })
        .then(user => {
            if(user){
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (result){
                        Token.findOne({user})
                            .then(token => {
                                if(token) {
                                    token.delete();
                                    token = new Token({user: user});
                                    token.save();
                                }
                                else 
                                {
                                    token = new Token({user: user});
                                    token.save();
                                }
                                res.status(200).send({token: token.token});
                            })
                    }
                    else res.status(400).send({'Authorization': 'Password Incorrect'});
                });
            }
        else res.status(400).send({'User': "User not found"});
        })
        .catch(err => console.log(err));
});


// Products

router.route('/products').get((req, res) => {
    Product.find()
      .then(products => res.json(products))
      .catch(err => res.status(400).json(err));
});

router.post('/products/add', (req, res) => {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(401).json({'message': 'User not authorized'});
        if(user.type != 'V') return res.status(401).json({'message': 'User not authorized'});
        let product = new Product(req.body);
        product.vendor = user
        product.save()
        .then(product => {
            res.status(201).json(product);
        })
        .catch(err => {
            res.status(400).send(err);
        });
    })
    
});

router.route('/products/delete').delete((req, res)=> {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(401).json({'message': 'User not authorized'});
        if(user.type != 'V') return res.status(401).json({'message': 'User not authorized'});

        
        Product.findOne({ _id: req.body.id })
            .then(product => {
                if(!product) return res.status(400).json({'message': 'Product not found'});
                Order.find({product})
                    .then( orders => {
                        orders.forEach(order => {
                            order.status = "Canceled";
                            order.save()
                        })
                    });

                product.delete()
                
            });
    })
});


router.route('/products/dispatch').delete((req, res)=> {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(401).json({'message': 'User not authorized'});
        if(user.type != 'V') return res.status(401).json({'message': 'User not authorized'});

        
        Product.findOne({ _id: req.body.id })
            .then(product => {
                if(!product) return res.status(400).json({'message': 'Product not found'});
                if(product.quantity) return res.status(400).json({'message': 'Product not ready to dispatch'});

                product.dispatch = true
                product.save()
                Order.find({product})
                    .then( orders => {
                        orders.forEach(order => {
                            order.status = "Dispatched";
                            order.save()
                        })
                    });
                
            });
    })
});



router.post('/reviews', (req, res) => {

    let product = new Product(req.body);
    // User.findOne({ _id: product.vendor })
    // .then(exercise => res.json(exercise))
    // .catch(err => res.status(400).json('Error: ' + err));

    product.save()
    .then(product => {
        res.status(200).json({'Product': 'Product added successfully'});
    })
    .catch(err => {
        res.status(400).send(err);

    });
});

module.exports = router;
