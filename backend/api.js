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
    // console.log('Authorization');
    // console.log(token);
    return Token.findOne({ token: token })
        .then(token => {
            if(!token) {return null;}
            // if(Date.now() > token.expire) {
            //     let user = token.user;
            //     token.delete();
            //     token = new Token({user});
            //     token.save();
            // }
            // // console.log(token.user)
            return token.user;
        })
        .catch(err => {
            console.log("Error!");
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
                console.log(err);
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
                            .populate({
                                path: 'user'
                            })
                            .then(token => {
                                if(!token)
                                {
                                    token = new Token({user: user});
                                    token.save();
                                }
                                token.user.password = undefined;
                                token.expire = undefined;
                                token._id = undefined;
                                res.status(200).send({token});
                            })
                            .catch(err => {
                                res.status(400).send({'message': 'Token invalid'});
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
                if(!user) 
                {
                    console.log("C");
                    return res.status(400).json({'message': 'User not found'});
                }
                if(user.type != "V") 
                {
                    console.log(user.type);
                    return res.status(401).json({'message': 'User not authorized'});
                }
                console.log(req);
                let product = new Product(req.body);
                console.log(product);
                product.vendor = user;
                product.save()
                .then(product => {
                    res.status(201).json(product);
                })
                .catch(err => {
                    console.log(err);
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
router.post('/products/view', (req, res) => {

    Authorize(req)
    .then(user =>{
        if(!user) return res.status(400).json({'message': 'User not found'});
        User.findOne({_id: user})
            .then(user => {
                if(!user) return res.status(400).json({'message': 'User not found'});
                if(user.type != "V") 
                    return res.status(401).json({'message': 'User not authorized'});
                
            if(req.body.type == 1)
            {
                Product.find({vendor: user, dispatch: false, isDeleted: false, $where: "this.quantity > this.no_orders"}) // All orders
                .then( products => {
                    products.forEach(product => {
                        product.vendor = undefined;
                    })
                    res.status(200).json(products)
                })
                .catch(err => {
                    res.status(400).send(err);
                });
            }

            else if(req.body.type == 2)
            {
                Product.find({vendor: user, dispatch: true, isDeleted: false})  
                .then( products => {
                    products.forEach(product => {
                        product.vendor = undefined;
                    })
                    res.status(200).json(products)
                })
                .catch(err => {
                    res.status(400).send(err);
                });
            }

            else if(req.body.type == 3)
            {
                Product.find({vendor: user, dispatch: false,  $where: "this.quantity <= this.no_orders", isDeleted: false })
                .then( products => {
                    products.forEach(product => {
                        product.vendor = undefined;
                    })
                    res.status(200).json(products)
                })
                .catch(err => {
                    res.status(400).send(err);
                });
            }
                
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
                if(product.quantity > product.no_orders) return res.status(400).json({'message': 'Product not ready to dispatch'});

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
router.route('/products/delete').post((req, res)=> {
    console.log(req.body);
    console.log(req.headers);
    Authorize(req)
    .then(user =>{
        if(!user) 
        {
            // console.log("REEEE");
            return res.status(401).json({'message': 'User not found'});
        }
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

                    product.isDeleted = true;
                    product.save();
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

    if(req.body.type == 1)
    {
        Product.find({name: req.body.name, dispatch: false, isDeleted: false})
        .populate({
            path: 'vendor',
            
        }).sort({price: 1})
        .then(products => {
            products.forEach(product => {
                product.vendor.password = undefined;
                console.log(product.vendor);
            })
            res.json(products);
            console.log(products);
        })
        .catch(err => {res.status(400).send(err); });

    }

    
    else if(req.body.type == 2)
    {
        Product.find({name: req.body.name, dispatch: false, isDeleted: false})
        .populate({
            path: 'vendor',
            
        })
        .then(products => {
            products.forEach(product => {
                product.vendor.password = undefined;
                console.log(product.vendor);
            }).sort({ no_orders: -1})
            res.json(products);
            console.log(products);
        })
        .catch(err => {res.status(400).send(err); });

    }
    
    if(req.body.type == 3)
    {
        Product.find({name: req.body.name, dispatch: false, isDeleted: false})
        .populate({
            path: 'vendor',
            
        }).sort({rating: -1})
        .then(products => {
            products.forEach(product => {
                product.vendor.password = undefined;
                console.log(product.vendor);
            })
            res.json(products);
            console.log(products);
        })
        .catch(err => {res.status(400).send(err); });

    }


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
                
                Product.findOne({ _id: req.body.product, dispatch: false})
                .then(product => {
                    if(!product) return res.status(400).json({'message': 'Product not found'});    
                    // console.log("whaaa");
                    console.log(product.no_orders, req.body.quantity);
                    product.no_orders += parseInt(req.body.quantity);
                    let order = new Order(req.body);
                    order.customer = user;

                    console.log(product.no_orders, product.quantity);
                    if(product.quantity <= product.no_orders)
                    {
                        Order.find({product: product})
                        .then(orders => {
                            orders.forEach(order => {
                                order.status = "Placed";
                                order.save();
                            })
                            res.json(products)})
                        .catch(err => {res.status(400).send(err); });
                        order.status = "Placed";

                    }
                    order.save();
                    product.save();
                    res.status(200).json(order);
                })
                .catch(err => {
                    console.log("eee");
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
        if(!user) 
            return res.status(400).json({'message': 'User not found'});
        User.findOne({_id: user})
            .then(user => {
                if(!user) 
                    return res.status(400).json({'message': 'User not found'});
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
                    if(err) 
                    {
                        console.log("erro");
                        res.status(400).json(err);
                    }
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
                console.log("Error! ");
                res.status(400).send(err);
            });
     })
    .catch(err => {res.status(400).send(err);});    
});



router.post('/orders/type-view', (req, res) => {

    // .log("EEEe");
    Authorize(req)
    .then(user =>{
        if(!user) 
            return res.status(400).json({'message': 'User not found'});
        User.findOne({_id: user})
            .then(user => {
                if(!user) 
                    return res.status(400).json({'message': 'User not found'});
                if(user.type != "C") 
                return res.status(401).json({'message': 'Vendor type: user does not have any orders'});
                

                if(req.body.type == "1")
                {
                    Order.find({customer: user, status:"Placed"})
                    .populate({
                        path: 'product',
                        populate: {
                            path: 'vendor'
                        }
                    })
                    .exec((err, orders) => {
                        if(err) 
                        {
                            console.log("error");
                            res.status(400).json(err);
                        }
                        else 
                        {
                            orders.forEach(order => {
                                order.product.vendor.password = undefined;
                            })
                            res.status(200).json(orders);
                        }
                    })
                }

                else 
                {
                    Order.find({customer: user, status: "Dispatched"})
                    .populate({
                        path: 'product',
                        populate: {
                            path: 'vendor'
                        }
                    })
                    .exec((err, orders) => {
                        if(err) 
                        {
                            console.log("erro");
                            res.status(400).json(err);
                        }
                        else 
                        {
                            orders.forEach(order => {
                                order.product.vendor.password = undefined;
                            })
                            res.status(200).json(orders);
                        }
                    })
                }
   
            })
            .catch(err => {
                console.log("Error! ");
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
                            product.no_orders  =  parseInt(req.body.quantity) - order.quantity;
                            if(product.no_orders < product.quantity)
                                product.status = "Waiting";
                            product.save();
                            order.quantity = int(req.body.quantity);
                            order.save();
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
    // Order.find()
    //   .then(orders => {
    //     //   console.log(orders)
    //       res.json(orders)
    //     })
    //   .catch(err => res.status(400).json(err));
});


// Reviews

router.post('/products/review', (req, res) => {

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
                    if(order.status!= "Dispatched") return res.status(400).json({'message':'Product not dispatched, cannot review'});
    
                    Product.findOne({ _id: order.product })
                        .then(product => {
                            if(!product) return res.status(400).json({'message': 'Product not found'});
                            let review = new Review({review: req.body.review, rating: req.body.rating});
                            review.save(); 
                            product.reviews.push(review);
                            console.log(product.reviews)
                            product.save();
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

router.post('/vendors/reviews', (req, res) => {
+    console.log(req.body);
    Authorize(req)
    .then(user =>{
        if(!user) return res.status(400).json({'message': 'User not found'});
        User.findOne({_id: user})
            .then(user => {
                if(!user) return res.status(400).json({'message': 'User not found'});
                // console.log("Eee2");
                User.findOne({ _id: req.body.id })
                    .then(vendor => {
                        if(!vendor) return res.status(400).json({'message': 'Product not found'});
                        // let review = new Review({rating: parseInt(req.body.rating)});
                        console.log(vendor.no_reviews);
                        let rating = parseInt(req.body.rating);
                        if(vendor.no_reviews == 0) vendor.rating = rating;
                        else vendor.rating = (vendor.rating*vendor.no_reviews + rating)/(vendor.no_reviews+1);
                        vendor.no_reviews = vendor.no_reviews + 1;
                        console.log(vendor.rating);
                        vendor.save();
                        console.log(vendor.rating);
                        res.status(200).json(vendor);
                })
            })
            .catch(err => {
                res.status(400).json(err);
            });
                
    })
    .catch(err => {
        res.status(400).send(err);
    });    
});

// router.get('/vendors/review', (req, res) => {
    
//     Product.find({vendor: req.body.id}) // All orders
//     .then( products => {
//         products.forEach(product => {
//             let reviews = product.reviews;
//             reviews.forEach({vendor: req.body.id}) // All orders
//             .then( products => {
//                 products.forEach(product => {
//                     product.review.review = ;
//             })
//         })
//         res.status(200).json(products)
//     })
//     .catch(err => {
//         res.status(400).send(err);
//     });
        
// });


router.post('/pro', (req, res) => {
    
    Product.find({vendor: req.body.id, dispatch: true})
    .populate({ path: 'reviews'})
    .exec((err, products) => {
    if(err) 
    {
        console.log("erro");
        res.status(400).json(err);
    }
    else
        res.status(200).json(products);
        
    });


});

module.exports = router;
