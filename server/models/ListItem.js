//region imports
const mongoose = require('mongoose');
const utils    = require('../utils');
//endregion

const ListItemSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true
	},
	completed: {
		type: Boolean,
		required: true
	},
	starred: {
		type: Boolean,
		required: true
	},
	dueDate: {
		type: String
	},
	notes: {
		type: String
	}
});

ListItemSchema.statics.create = async (itemDescription, callback) => {
	const listItem = new ListItem({
		_id: new mongoose.Types.ObjectId(),
		description: itemDescription,
		completed: false,
		starred: false,
		dueDate: "",
		notes: "",
	});
	await listItem.save(err => console.log(err));
	return callback ? callback(listItem) : listItem;
};

ListItemSchema.statics.updateListItem = async (itemId, itemFields, callback) => {
	let listItem = await ListItem.findOne({_id: itemId});
	if (!listItem) {
		let response = utils.getResponse(401, "List item not found", null);
		return callback ? callback(response) : response;
	}
	for (let field in itemFields) {
		if (listItem[field] !== undefined && itemFields.hasOwnProperty(field) && listItem[field] !== itemFields[field]) {
			listItem[field] = itemFields[field];
		}
	}
	await listItem.save(console.log);
	let response = utils.getResponse(200, "List item successfully updated", listItem);
	return callback ? callback(response) : response;
};

const ListItem = mongoose.model('ListItem', ListItemSchema);

module.exports = ListItem;