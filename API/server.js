const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const knexSessionConnect = require('connect-session-knex');
// Can also do this for same result below
// const knexSessionConnect = require('connect-session-knex')(session);

const knexSessionStore = knexSessionConnect(session);


// Creates a session in memory, send that ID cookie to grant auth
// Cookie will be forcibly secured through the browser
const sessionConfig = {
    name: 'sethsession',
    secret: 'asupersecuresecret',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false, // should be true in production
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false,

    // This is so express session manager knows how to store
    // session info in db
    store: new knexSessionStore({
        knex: require('../data/db-config.js'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
};

const userRouter = require('../users/user-router.js');
const authRouter = require('../auth/auth-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/users', userRouter);
server.use('/api/auth', authRouter);

// Page shows h2 when properly running
server.get('/', (req, res) => {
    res.send(`<h2>Server is responding.</h2>`);
});


module.exports = server;