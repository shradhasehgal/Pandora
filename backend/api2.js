const router = require('express').Router();
let User = require('./models/user');
let Product = require('./models/product');
let Token = require('./models/token');
let Order = require('./models/order');
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
            if(!token) {console.log("what rey"); return null;}
            if(Date.now() > token.expire) {
                let user = token.user;
                token.delete();
                token = new Token({user});
                token.save();
            }
            // console.log(token.user)
            return token.user;
        })
        .catch(err => {
            res.status(400).send(err);
        });
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
                                // if(token) {
                                //     token.delete();
                                //     token = new Token({user: user});
                                //     token.save();
                                // }
                                if(!token)
                                {
                                    // console.log("wutt");
                                    token = new Token({user: user});
                                    token.save();
                                }
                                token.user.password = undefined;
                                token.expire = undefined;
                                token._id = undefined;
                                res.status(200).send({token});
                            })
                            .catch(err => {
                                res.status(400).send(err);
                            });
                    }
                    else res.status(400).send({'message': 'Password Incorrect'});
                });
            }
        else res.status(400).send({'message': "User not found"});
        })
        .catch(err => console.log(err));
});


// Products

router.route('/products').get((req, res) => {
    Product.find()
      .then(products => res.json(products))
      .catch(err => res.status(400).json(err));
});

// Add products
router.post('/products/add', (req, res) => {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(400).json({'message': 'User not found'});
        User.findOne({_id: user})
            .then(user => {
                if(!user) return res.status(400).json({'message': 'User not found'});
                if(user.type != "V") 
                {
                    console.log(user.type)
                    return res.status(401).json({'message': 'User not authorized'});
                }
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
            .catch(err => {
                res.status(400).send(err);
            });
    })
    .catch(err => {
        res.status(400).send(err);
    });    
});

// View Products
router.get('/products/view', (req, res) => {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(400).json({'message': 'User not found'});
        User.findOne({_id: user})
            .then(user => {
                if(!user) return res.status(400).json({'message': 'User not found'});
                if(user.type != "V") 
                    return res.status(401).json({'message': 'User not authorized'});
                
                Product.find({user})
                .then( products => {
                    products.forEach(product => {
                        product.vendor = undefined;
                    })
                    res.status(200).json(products)
                })
                .catch(err => {
                    res.status(400).send(err);
                });
            })
            .catch(err => {
                res.status(400).send(err);
            });
    })
    .catch(err => {
        res.status(400).send(err);
    });    
});

// Dispatch Product
router.route('/products/dispatch').post((req, res)=> {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(401).json({'message': 'User not found'});
        // if(user.type != 'V') return res.status(401).json({'message': 'User not authorized'});
        
        Product.findOne({ _id: req.body.id })
            .then(product => {
                if(!product) return res.status(400).json({'message': 'Product not found'});
                if(!product.vendor.equals(user._id)) return res.status(400).json({'message': 'User not authorized'});
                if(product.quantity) return res.status(400).json({'message': 'Product not ready to dispatch'});

                product.dispatch = true
                product.save()

                Order.find({product})
                    .then( orders => {
                        orders.forEach(order => {
                            order.status = "Dispatched";
                            order.save()
                        })
                    })
                    .catch(err => {
                        res.status(400).send(err);
                    });
                
            })
            .catch(err => {
                res.status(400).send(err);
            });
            res.status(200).json({'message': 'Product dispatched'});
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

// Delete Product
router.route('/products/delete').delete((req, res)=> {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(401).json({'message': 'User not found'});
        User.findOne({_id: user})
            .then(user => {
                if(!user) return res.status(400).json({'message': 'User not found'});
                Product.findOne({ _id: req.body.id })
                .then(product => {
                    if(!product) return res.status(400).json({'message': 'Product not found'});
                    if(!product.vendor.equals(user._id)) 
                    {
                        console.log(product.vendor, user._id)
                        return res.status(401).json({'message': 'User not authorized to perform this action'});
                    }
                    Order.find({product})
                    .then( orders => {
                        orders.forEach(order => {
                            order.status = "Canceled";
                            order.save()
                        })
                    })
                    
                    .catch(err => {
                        res.status(400).send(err);
                    });
                    product.delete();
                    res.status(200).json({'message': 'Product deleted'});
                    
                })
                
                .catch(err => {
                    res.status(400).send(err);
                });
            })
            .catch(err => {
                res.status(400).send(err);
            });
        
    })
    .catch(err => {
        res.status(400).send(err);
    });
});


router.route('/products/dispatch').post((req, res)=> {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(401).json({'message': 'User not found'});
        // if(user.type != 'V') return res.status(401).json({'message': 'User not authorized'});
        
        Product.findOne({ _id: req.body.id })
            .then(product => {
                if(!product) return res.status(400).json({'message': 'Product not found'});
                if(!product.vendor.equals(user._id)) return res.status(400).json({'message': 'User not authorized'});
                if(product.quantity) return res.status(400).json({'message': 'Product not ready to dispatch'});

                product.dispatch = true
                product.save()

                Order.find({product})
                    .then( orders => {
                        orders.forEach(order => {
                            order.status = "Dispatched";
                            order.save()
                        })
                    })
                    .catch(err => {
                        res.status(400).send(err);
                    });
                
            })
            .catch(err => {
                res.status(400).send(err);
            });
            res.status(200).json({'message': 'Product dispatched'});
    })
    .catch(err => {
        res.status(400).send(err);
    });
});

router.route('/products/search').delete((req, res)=> {

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

// Tokens

router.route('/tokens').get((req, res) => {
    Token.find()
      .then(tokens => res.json(tokens))
      .catch(err => res.status(400).json(err));
});

module.exports = router;
