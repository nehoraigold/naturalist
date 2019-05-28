//region imports
const express    = require('express');
const path       = require('path');
const bodyParser = require('body-parser');
const config     = require('../config.json');
//endregion

const app = express();

app.use(
	bodyParser.json(),
	express.static(path.resolve(__dirname, '../', config.client.buildPath))
);

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../', config.client.buildPath) + "/index.html");
});

app.post('/register', (req, res) => {
	//registration
});

app.post('/login', (req, res) => { // for now, 50% chance of logging in just to see that it works
	console.log(req.body);
	res.json({authenticated: Math.random() > 0.5});
});

app.listen(config.server.port, () => {
	console.log(`Server started on port ${config.server.port}...`);
});