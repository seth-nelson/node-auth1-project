const router = require('express').Router();
const Users = require('../users/user-model.js');
const bcrypt = require('bcryptjs');


// AUTH post (add users and hash passwords to store in the db)
router.post('/register', async (req, res) => {
    const user = req.body
    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash

    try {
        const saved = await Users.add(user);
        res.status(201).json(saved);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// AUTH login (search DB for users by hashed passwords)
router.post('/login', async (req, res) => {
    let { username, password } = req.body

    try {
        // first() returns undefined object if the array is empty
        // takes 2 args: the entered password, and the stored user's hash
        const user = await Users.findBy({ username }).first();
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.status(200).json({ message: `Welcome, ${username}.`})
        } else {
            res.status(401).json({ message: 'You shall not pass!'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error with login. Verify both username and password are correct.',  error: err });
    }
});

// AUTH logout (log the user out if there is a session found)
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy( err => {
            if (err) {
                res.send('Error logging out.')
            } else {
                res.send('You have logged out. See you next time!');
            }
        });
    } else {
        res.end();
    }
});

module.exports = router;