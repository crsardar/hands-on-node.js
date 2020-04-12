'use strict';

const express = require('express');

// Constants
const PORT = 8090;
const HOST = '0.0.0.0';

var count = 0;
// App
const app = express();
app.get('/hello-docker-nodejs', (req, res) => {
    count = count + 1;
    res.send('Hello World, NodeJS in Docker Container! Count = ' + count);
});

app.listen(PORT, HOST);
console.log(`Running on http://localhost:${PORT}/hello-docker-nodejs`);