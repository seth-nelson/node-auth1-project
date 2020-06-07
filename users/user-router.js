const router = require('express').Router();
const restricted = require('../auth/restricted-middleware.js');
const Users = require('./user-model.js');


router.get('/', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});


module.exports = router;