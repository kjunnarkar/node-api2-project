const express = require('express');
const postsRouter = require('./posts/posts-router');

const server = express();
server.use(express.json());

server.use('/api/posts', postsRouter);

// default route handler and test the server
server.get('/', (req, res) => {
    res.send('The server is returning data for the api2 project')
});

module.exports = server;