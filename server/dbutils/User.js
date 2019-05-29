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
		if (!user) {
			let user = new User({email, password});
			user.save()
				.then(user => callback(user))
				.catch(err => console.log(err));
		}
	});
};

UserSchema.statics.authenticate = (email, password, callback) => {
	User.findOne({email})
		.then(user => {
			if (!user) {
				let response = {
					user: null,
					status: 404,
					msg: "User not found"
				};
				return callback(response);
			}
			bcrypt.compare(password, user.password, (err, result) => {
				let response;
				if (err) {
					return err;
				} else if (result === true) {
					response = {
						user: user,
						status: 200,
						msg: "User found"
					};
				} else {
					response = {
						user: null,
						status: 401,
						msg: "Incorrect credentials"
					};
				}
				return callback(response);
			}).catch(err => console.log(err));
		}).catch(err => console.log(err))
};

UserSchema.pre('save', next => {
	let user = this;
	console.log(user);
	bcrypt.hash(user.password, 10, (err, hash) => {
		if (err) {
			return next(err);
		}
		user.password = hash;
		next();
	});
});

const User = mongoose.model('User', UserSchema);

module.exports = User;