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

ListItemSchema.methods.update = async (itemId, itemFields, callback) => {
	let listItem = await ListItem.findByIdAndUpdate(itemId, itemFields);
	return callback ? callback(listItem) : listItem;
};

const ListItem = mongoose.model('ListItem', ListItemSchema);

module.exports = ListItem;