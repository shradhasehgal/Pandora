const router = require('express').Router();
let User = require('./models/user');
let Product = require('./models/product');
const bcrypt = require('bcrypt');

router.route('/users').get((req, res) => {
    User.find()
      .then(users => res.json(users))
      .catch(err => res.status(400).json('Error: ' + err));
});

// userRoutes.route('/add').post(function(req, res) {
//     let user = new User(req.body);
//     user.save()
//         .then(user => {
//             res.status(200).json({'User': 'User added successfully'});
//         })
//         .catch(err => {
//             res.status(400).send('Error');
//         });
// });

router.route('/products').get((req, res) => {
    Product.find()
      .then(products => res.json(products))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/users/add', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) res.status(400).send(err);
        else
        {
            let user = new User(req.body);
            user.password = hash;
            user.save()
            .then(user => {
                res.status(200).json({'User': 'User added successfully'});
            })
            .catch(err => {
                res.status(400).send(err);
    
            });
        }
    });
});

router.post('/products/add', (req, res) => {

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

router.route('/products/delete').delete((req, res)=> {
    Product.findByIdAndDelete(req.body.id)
    .then(() => res.json('Product deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// router.post('/users/login', (req, res) => {
//     let username = req.body.username;
//     User.findOne({ username: username })
//         .then(user => {
//             if(user){
//                 bcrypt.compare(req.body.password, user.password, (err, result) => {
//                     if (result){
//                         models.Token.findOne({user,})
//                             .then(token => {
//                                 if(!token) {
//                                     token = new modelsrouter.post('/user/login', (req, res) => {
//                                         let find = req.body.username || req.body.email;
//                                         models.User.findOne({
//                                             username: find
//                                         })
//                                             .then(user => {
//                                                 if(!user) res.status(400).send({"message": "User not found"});
//                                                 else {
//                                                     bcrypt.compare(req.body.password, user.password, (err, result) => {
//                                                         if (result){
//                                                             models.Token.findOne({
//                                                                 user,
//                                                             })
                            
//                                                         }
//                                                         else res.status(400).send({"message": "password is wrong."});
//                                                     });
//                                                 }
//                                             })
//                                             .catch(err => console.log(err));
//                                     });.Token({user: user});
//                                     token.save();
//                                 }
//                                 else if(Date.now() > token.expire)
//                                 {
//                                     token.delete();
//                                     token = new models.Token({user: user});
//                                     token.save();
//                                 }
//                                 res.status(200).send({token: token.token});
//                             })
//                     }
//                     else res.status(400).send({"message": "password is wrong."});
//                 });
//             }
//         else res.status(400).send({"Message": "User not found"});
//         })
//         .catch(err => console.log(err));
// });

module.exports = router;
