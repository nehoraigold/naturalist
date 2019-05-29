//region imports
const express    = require('express');
const path       = require('path');
const bodyParser = require('body-parser');
const config     = require('../config.json');
const User       = require('./dbutils/User');
const mongoose   = require('mongoose');
const PRIVATE    = require('./private');
//endregion

const app = express();
mongoose.connect(`${config.server.db.protocol}://${config.server.db.username}:${PRIVATE.db.password}@${config.server.db.url}/${config.server.db.name}`, {useNewUrlParser: true})
	.then(() => console.log("Connected to database!")).catch(err => console.log(err));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(
	bodyParser.json(),
	express.static(path.resolve(__dirname, '../', config.client.buildPath))
);

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../', config.client.buildPath) + "/index.html");
});

app.post('/register', async (req, res) => {
	let user = new User({email: req.body.email, password: req.body.password});
	user.save((err, user) => {
		if (err) {
			return console.log(err);
		}
		res.json({status: 200, msg: "New user created", user, authenticated: true})
	});
});

app.post('/login', (req, res) => {
	User.authenticate(req.body.email, req.body.password, response => {
		console.log(response);
		if (response.user !== null) {
			res.json({authenticated: true, userId: response.user._id});
		} else {
			res.json({authenticated: false, userId: null});
		}
	});
});

app.listen(config.server.port, () => {
	console.log(`Server started on port ${config.server.port}...`);
});