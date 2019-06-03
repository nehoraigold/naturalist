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
	//TODO: Add mechanism that checks timestamp - save most recent message and if we get a message with a timestamp older than that one, ignore it
	constructor() {
		let {protocol, username, url, name} = config.server.db;
		mongoose.connect(`${protocol}://${username}:${PRIVATE.db.password}@${url}/${name}`, {useNewUrlParser: true})
			.then(() => console.log("Connected to database!")).catch(err => console.log(err));
		this.db = mongoose.connection;
		this.db.on('error', console.error);
		this.update = this.update.bind(this);
		this.create = this.create.bind(this);

		this.updateFunctions = {
			"list": this.updateList,
			"item": this.updateListItem,
			"user": this.updateUser
		}
		this.createFunctions = {
			"list": this.createList,
			"item": this.createListItem
		}
	}

	//region user functions
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
		//TODO: Implement logout
	}

	//endregion

	//region update functions
	update(req, res) {
		const {objectType, id} = req.params;
		if (!id || !objectType || !Object.keys(this.updateFunctions).includes(objectType)) {
			return res.json(utils.getResponse(
				401,
				"You are trying to update a non-permissible item or have forgotten to include the id.",
				null
			));
		}
		if (this.updateFunctions[objectType]) {
			return this.updateFunctions[objectType](id, req.body, res);
		}
		return res.json(utils.getResponse(400, "Something went wrong trying to update", null));
	}

	updateListItem(listItemId, listItem, res) {
		return ListItem.updateListItem(listItemId, listItem, response => {
			res.json(response);
		});
	}

	updateList(listId, listFields, res) {
		return List.updateList(listId, listFields, response => {
			res.json(response);
		})
	}

	updateUser(req, res) {
		//TODO: implement this for profile/theme changes
	}

	//endregion

	//region creation functions
	create(req, res) {
		const {objectType} = req.params;
		if (!objectType || !Object.keys(this.createFunctions).includes(objectType)) {
			return res.json(utils.getResponse(
				401,
				"You are trying to create a non-permissible item.",
				null
			));
		}
		try {
			return this.createFunctions[objectType](req.body, res);
		} catch (ex) {
			return res.json(utils.getResponse(400, "Something went wrong trying to update", null));
		}
	}

	createList(req, res) {

	}

	createListItem(requestBody, res) {
		console.log("REQUEST BODY", requestBody);
		return List.updateList(requestBody.listId, requestBody, response => {
			res.json(response);
		})
	}

	//endregion

}

module.exports = new Server();