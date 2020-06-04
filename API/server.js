const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const userRouter = require('../users/user-router.js');
const authRouter = require('../auth/auth-router.js');

const server = express();


server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);


// Page shows h2 when properly running
server.get('/', (req, res) => {
    res.send(`<h2>Server is responding.</h2>`);
});


module.exports = server;