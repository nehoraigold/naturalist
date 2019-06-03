//region imports
const User     = require('./models/User');
const List     = require('./models/List');
const ListItem = require('./models/ListItem');
const mongoose = require('mongoose');
const config   = require('../config.json');
const PRIVATE  = require('./private');
const utils    = require('./utils');

//endregion

class Server {
	constructor() {
		let {protocol, username, url, name} = config.server.db;
		mongoose.connect(`${protocol}://${username}:${PRIVATE.db.password}@${url}/${name}`, {useNewUrlParser: true})
			.then(() => console.log("Connected to database!")).catch(err => console.log(err));
		this.db = mongoose.connection;
		this.db.on('error', console.error);
		this.saveFunctions = {
			"list": this.saveList,
			"item": this.saveListItem,
			"user": this.saveUser
		};
		this.save          = this.save.bind(this);
	}

	async login(req, res) {
		User.authenticate(req.body.email, req.body.password, response => {
			res.json(response);
		});
	}

	async register(req, res) {
		User.create(req.body.email, req.body.password, response => {
			res.json(response);
		});
	}

	async logout(req, res) {

	}

	async save(req, res) {
		let type = req.query.type;
		console.log(type);
		if (this.saveFunctions[type]) {
			return this.saveFunctions[type](req, res);
		}
		return res.json(utils.getResponse(401, "Attempting to save something that is not savable", null));
	}

	async saveListItem(req, res) {
		if (req.body.id) {
			console.log("UPDATING LIST ITEM", req.body);
			return ListItem.updateListItem(req.body.id, req.body, response => {
				res.json(response);
			});
		} else {
			console.log("SAVING LIST ITEM", req.body);
			return ListItem.create(req.body.description, response => {
				res.json(response);
			});
		}
	}

	async saveList(req, res) {

	}

	async saveUser(req, res) {

	}

}

module.exports = new Server();