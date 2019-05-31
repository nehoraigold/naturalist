//region imports
const User     = require('./models/User');
const List     = require('./models/List');
const ListItem = require('./models/ListItem');
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
		User.authenticate(req.body.email, req.body.password, async (response) => {
			res.json(response);
		});
	}

	async register(req, res) {
		User.create(req.body.email, req.body.password, async response => {
			res.json(response);
		});
	}

	async logout(req, res) {

	}

}

module.exports = new Server();