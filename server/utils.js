const utils = {
	getResponse: (status, msg, data) => {
		if (data && data.user && data.user.password) {
			delete data.user.password;
		}
		return {status, msg, data};
	}
};

module.exports = utils;