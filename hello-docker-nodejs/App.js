'use strict';

const express = require('express');

// Constants
const PORT = 8090;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/hello-docker-nodejs', (req, res) => {
    res.send('Hello World, NodeJS inside a Docker Container!');
});

app.listen(PORT, HOST);
console.log(`Running on http://localhost:${PORT}/hello-docker-nodejs`);