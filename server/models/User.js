//region imports
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const List = require('./List');
const ListItem = require('./ListItem');
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
		type: Array,
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

UserSchema.statics.create = (email, password, callback) => {
	User.findOne({email}, (err, user) => {
		if (err) {
			return console.log(err);
		}
		if (user) {
			let response = {
				msg: "User exists",
				status: 401,
				user: user,
			};
			return callback(response);
		}
		bcrypt.hash(password, 10, async (err, password) => {
			if (err) {
				return console.log(err);
			}
			const listItem = await ListItem.create('Buy milk');
			const toDoList = await List.create('To Do');
			let data = {email, password, lists: [toDoList._id], theme: "blue"};
			let user = new User(data);
			await user.save(err => console.log(err));
			let response = {
				msg: "User created",
				status: 201,
				user: user
			};
			return callback(response);
		})
	});
};

UserSchema.statics.authenticate = (email, password, callback) => {
	User.findOne({email}, (err, user) => {
		if (err) {
			return console.log(err);
		}
		if (!user) {
			let response = {
				user: null,
				status: 404,
				msg: "User not found"
			};
			return callback ? callback(response) : response;
		}
		bcrypt.compare(password, user.password, (err, result) => {
			if (err) {
				return console.log(err);
			}
			if (result) {
				//load all lists and list items
			}
			let response = {
				user: result ? user : null,
				status: result ? 200 : 401,
				msg: result ? "User found" : "Incorrect credentials"
			};
			return callback ? callback(response) : response;
		})
	});
};

const User = mongoose.model('User', UserSchema);

module.exports = User;