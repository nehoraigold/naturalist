//region imports
const User     = require('./dbutils/User');
const mongoose = require('mongoose');
const config   = require('../config.json');
const PRIVATE  = require('./private');

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
			res.json({status: response.status, msg: response.msg, userId: response.user ? response.user._id : null});
		});
	}

	async register(req, res) {
		User.create(req.body.email, req.body.password, response => {
			res.json({status: response.status, msg: response.msg, userId: response.user._id});
		});
	}

	async logout(req, res) {

	}

}

module.exports = new Server();