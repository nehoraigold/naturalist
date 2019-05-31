//region imports
const User     = require('./models/User');
const mongoose = require('mongoose');
const config   = require('../config.json');
const PRIVATE  = require('./private');

//endregion

class Server {
	constructor() {
		let {protocol, username, url, name} = config.server.db;
		mongoose.connect(`${protocol}://${username}:${PRIVATE.db.password}@${url}/${name}`, {useNewUrlParser: true})
			.then(() => console.log("Connected to database!")).catch(err => console.log(err));
		this.db = mongoose.connection;
		this.db.on('error', console.error);
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