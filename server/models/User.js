//region imports
const mongoose = require('mongoose');
const List     = require('./List');
const ListItem = require('./ListItem');
const bcrypt   = require('bcrypt');
const utils    = require('../utils');
//endregion

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	lists: {
		type: [{type: mongoose.Schema.Types.ObjectId, ref: "List"}],
		required: true
	},
	theme: {
		type: String,
		required: true,
		lowercase: true
	},
	sessionId: {
		type: String
	}
});

UserSchema.statics.find = async (identifyingFields, callback) => {
	const SEARCHABLE_FIELDS = ["sessionId", "_id", "email"];
	for (let field in identifyingFields) {
		if (field && identifyingFields.hasOwnProperty(field) && SEARCHABLE_FIELDS.includes(field)) {
			let query    = {};
			query[field] = identifyingFields[field];
			return await User.findOne(query)
				.populate({
					path: "lists",
					populate: {
						path: "items"
					}
				})
				.exec((err, user) => {
					if (err) {
						return console.log(err);
					}
					return callback ? callback(user) : user;
				});
		}
	}
};

UserSchema.statics.create = (email, password, callback) => {
	User.find({email}, user => {
		if (user) {
			const response = utils.getResponse(401, "User exists already", {user: user.toObject()});
			return callback ? callback(response) : response;
		}
		bcrypt.hash(password, 10, async (err, password) => {
			if (err) {
				return console.log(err);
			}
			const defaultList = await List.createDefault();
			let user          = new User({
				email,
				password,
				lists: [defaultList._id],
				theme: "blue"
			});
			await user.save(err => console.log(err));
			user           = user.toObject();
			user.lists     = [defaultList];
			const response = utils.getResponse(201, "User created", {user});
			return callback(response);
		})
	});
};

UserSchema.statics.updateUser = async (userId, userFields, callback) => {
	let user = await User.findOne({_id: userId});
	if (!user || !userFields) {
		let response = utils.getResponse(
			401,
			!user ? "User could not be found" : "No user updates provided",
			null);
		return callback ? callback(response) : response;
	}
	let msg;
	if (userFields.hasOwnProperty('newListTitle') && userFields.newListTitle) {
		await user.addList(userFields.newListTitle);
		msg = "Added new list " + userFields.newListTitle;
	}
	if (userFields.hasOwnProperty('theme') && userFields.theme) {
		//TODO: change theme! - maybe make this more general to change email/password/other string inputs
	}
	await user.save(console.log);
	let response = utils.getResponse(200, msg, user.toObject());
	return callback ? callback(response) : response;
};

UserSchema.statics.authenticate = (email, password, callback) => {
	User.find({email}, user => {
		if (!user) {
			let response = utils.getResponse(404, "User not found", null);
			return callback ? callback(response) : response;
		}
		bcrypt.compare(password, user.password, async (err, result) => {
			if (err) {
				return console.log(err);
			}
			let response = utils.getResponse(
				result ? 200 : 401,
				result ? "User found" : "Incorrect credentials",
				result ? {user: user.toObject()} : null);
			console.log(JSON.stringify(response));
			return callback ? callback(response) : response;
		});
	});
};

UserSchema.methods.addList = async function (listTitle, listItems = []) {
	const newList = await List.createList(listTitle, listItems);
	this.lists.push(newList._id);
	await this.save(console.log);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;