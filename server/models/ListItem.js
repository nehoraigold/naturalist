//region imports
const mongoose = require('mongoose');
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
		description: itemDescription,
		completed: false,
		starred: false,
		dueDate: "",
		notes: "",
	});
	await listItem.save(err => console.log(err));
	return callback ? callback(listItem) : listItem;
};

ListItemSchema.statics.update = async (itemId, itemFields, callback) => {
	let listItem = await ListItem.findByIdAndUpdate(itemId, itemFields);
	return callback ? callback(listItem) : listItem;
};

ListItemSchema.statics.loadMany = async (listItemIdArray) => {
	let listItems = [];
	listItemIdArray.forEach(async (listItemId) => {
		let item = await ListItem.findById(listItemId);
		listItems.push(item);
	});
	return listItems;
};

const ListItem = mongoose.model('ListItem', ListItemSchema);

module.exports = ListItem;