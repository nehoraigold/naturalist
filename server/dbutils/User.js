const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	fname: {
		type: String
	},
	lname: {
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
			let user = new User({email, password});
			await user.save(err => {
				console.log("made it to save!");
				if (err) {
					return console.log(err)
				}
			});
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
			return callback(response);
		}
		bcrypt.compare(password, user.password, (err, result) => {
			if (err) {
				return console.log(err);
			}
			let response = {
				user: result ? user : null,
				status: result ? 200 : 401,
				msg: result ? "User found" : "Incorrect credentials"
			};
			return callback(response);
		})
	});
};

const User = mongoose.model('User', UserSchema);

module.exports = User;