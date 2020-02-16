const router = require('express').Router();
let User = require('./models/user');
let Product = require('./models/product');
let Token = require('./models/token');
let Order = require('./models/order');
let Review = require('./models/review');
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
            if(!token) {return null;}
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
    let username = req.body.username, password = req.body.password;
    if(!username || !password) return res.status(400).send({'message': 'Please enter all fields'});

    User.findOne({ username: username })
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

// Add Products
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
                
                // if(req.body.type == 1)
                // {
                Product.find({vendor: user, dispatch: false})
                .then( products => {
                    products.forEach(product => {
                        product.vendor = undefined;
                    })
                    res.status(200).json(products)
                })
                .catch(err => {
                    res.status(400).send(err);
                });
               // }

                // // else if(req.body.type == 2)
                // // {
                //     Product.find({vendor: user, dispatch: true})
                //     .then( products => {
                //         products.forEach(product => {
                //             product.vendor = undefined;
                //         })
                //         res.status(200).json(products)
                //     })
                //     .catch(err => {
                //         res.status(400).send(err);
                //     });
                // }
                
            })
            .catch(err => {1
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

// Delete
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
                            order.save();
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

router.post('/products/search', (req, res) => {

    Product.find({name: req.body.name, quantity: {$gt: 0}})
        .then(products => res.json(products))
        .catch(err => {res.status(400).send(err); });

});

// Tokens

router.route('/tokens').get((req, res) => {
    Token.find()
      .then(tokens => res.json(tokens))
      .catch(err => res.status(400).json(err));
});

// Orders

router.post('/orders/place', (req, res) => {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(400).json({'message': 'User not found'});
        User.findOne({_id: user})
            .then(user => {
                if(!user) return res.status(400).json({'message': 'User not found'});
                if(user.type != "C") 
                    return res.status(401).json({'message': 'User not authorized to place orders'});
                
                Product.findOne({ _id: req.body.product })
                .then(product => {
                    if(!product) return res.status(400).json({'message': 'Product not found'});
                    if(product.quantity < req.body.quantity) return res.status(400).json({'message': 'Order cannot be placed, quantity exceeded'});
    
                    product.quantity -= req.body.quantity;
                    product.save();
    
                    let order = new Order(req.body);
                    order.customer = user;
                    if(product.quantity == 0)
                        order.status = "Placed";
                    order.save();
                    res.status(200).json(order);
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


router.get('/orders/view', (req, res) => {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(400).json({'message': 'User not found'});
        User.findOne({_id: user})
            .then(user => {
                if(!user) return res.status(400).json({'message': 'User not found'});
                if(user.type != "C") 
                    return res.status(401).json({'message': 'Vendor type: user does not have any orders'});
                

                Order.find({customer: user})
                .populate({
                    path: 'product',
                    populate: {
                        path: 'vendor'
                    }
                })
                .exec((err, orders) => {
                    if(err) res.status(400).json(err);
                    else 
                    {
                        orders.forEach(order => {
                            order.product.vendor.password = undefined;
                        })
                        res.status(200).json(orders);
                    }
                })
            })
            .catch(err => {
                res.status(400).send(err);
            });
     })
    .catch(err => {res.status(400).send(err);});    
});

router.post('/orders/edit', (req, res) => {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(400).json({'message': 'User not found'});
        User.findOne({_id: user})
            .then(user => {
                if(!user) return res.status(400).json({'message': 'User not found'});
                // if(user.type != "C") 
                //     return res.status(401).json({'message': 'Vendor type: user does not have any orders'});
                
                // console.log("wheee")
                Order.findOne({_id: req.body.id})
                    .then( order => {
                        console.log(order)
                        if(!order) return res.status(400).json({'message': 'Order not found'});
                        Product.findOne({ _id: order.product })
                        .then(product => {
                            if(!product)
                            { 
                                console.log(order)
                                return res.status(400).json({'message': 'Product not found'});
                            }
                            if(product.quantity + order.quantity - req.body.quantity < 0) return res.status(400).json({'message': 'Order cannot be placed, quantity exceeded'});
                            product.quantity  = product.quantity + order.quantity - req.body.quantity;
                            product.save();
                            order.quantity = req.body.quantity;
                            order.save()
                            res.status(200).json(order);
                        })
                        .catch(err => {
                            res.status(400).send(err);
                        });
                        
                    })
                    .catch(err => res.status(400).json(err));
                })
                
            .catch(err => {
                res.status(400).send(err);
            });
     })
    .catch(err => {
        res.status(400).send(err);
    });    
});

router.route('/orders').get((req, res) => {
    Order.find()
      .then(orders => {
        //   console.log(orders)
          res.json(orders)
        })
      .catch(err => res.status(400).json(err));
});


// Reviews

router.post('/reviews', (req, res) => {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(400).json({'message': 'User not found'});
        User.findOne({_id: user})
            .then(user => {
                if(!user) return res.status(400).json({'message': 'User not found'});
                Order.findOne({ _id: req.body.id })
                .then(order => {
                    if(!order) return res.status(400).json({'message': 'Order not found'});
                    if(!order.customer.equals(user._id))
                    { 
                        console.log(order.customer, user._id);                           
                        return res.status(400).json({'message':'Order not placed by user, cannot review'});
                    }
                    // if(order.status!= "Dispatched") return res.status(400).json({'message':'Product not dispatched, cannot review'});
    
                    Product.findOne({ _id: order.product })
                        .then(product => {
                            if(!product) return res.status(400).json({'message': 'Product not found'});
                            let review = new Review({vendor: product.vendor, customer: user, review: req.body.review, rating: req.body.rating});
                            review.save(); 
                            res.status(200).json(review);
                        })
                        .catch(err => {
                            res.status(400).json(err);
                        });
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



router.get('/vendors/view', (req, res) => {

    Review.find({vendor: req.body.id})
        .then(reviews => { res.status(200).json(reviews) })
        .catch(err => {
            res.status(400).send(err);
        });
        
});


module.exports = router;
