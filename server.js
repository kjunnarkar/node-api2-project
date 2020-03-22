const express = require('express');
const postsRouter = require('./posts/posts-router');

const server = express();
server.use(express.json());

server.use('/api/posts', postsRouter);

// default route handler and test the server
server.get('/', (req, res) => {
    const messageMOTD = process.env.MOTD;
    res.send({ message: messageMOTD })
});

module.exports = server;