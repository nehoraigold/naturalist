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
						path: "items",
						model: "ListItem"
					}
				})
				.exec((err, user) => {
					if (err) {
						return console.log(err);
					}
					return callback ? callback(user) : user;
				})
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
			user = user.toObject();
			user.lists = [defaultList];
			const response = utils.getResponse(201, "User created", {user});
			return callback(response);
		})
	});
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

const User = mongoose.model('User', UserSchema);

module.exports = User;