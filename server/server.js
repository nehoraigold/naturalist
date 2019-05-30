//region imports
const User = require('./dbutils/User');
const mongoose = require('mongoose');
const config = require('../config.json');
const PRIVATE = require('./private');
//endregion

class Server {
	constructor() {
		mongoose.connect(`${config.server.db.protocol}://${config.server.db.username}:${PRIVATE.db.password}@${config.server.db.url}/${config.server.db.name}`,
			{useNewUrlParser: true}).then(() => console.log("Connected to database!")).catch(err => console.log(err));
		this.db = mongoose.connection;
		this.db.on('error', console.error.bind(console, 'connection error:'));
	}

	async login(req, res) {
		User.authenticate(req.body.email, req.body.password, response => {
			console.log(response);
			if (response.user !== null) {
				res.json({authenticated: true, userId: response.user._id});
			} else {
				res.json({authenticated: false, userId: null});
			}
		});
	}

	async register(req, res) {
		User.create(req.body.email, req.body.password, response => {
			res.json(response);
		});
	}
}

module.exports = new Server();