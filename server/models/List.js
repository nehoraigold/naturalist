//region imports
const mongoose = require('mongoose');
const ListItem = require('./ListItem');
const utils    = require('../utils');
//endregion

const ListSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	items: {
		type: [{type: mongoose.Schema.Types.ObjectId, ref: "ListItem"}],
		required: true
	}
});

//region static functions
ListSchema.statics.findByListId = async (listId, callback) => {
	return List.findOne({_id: listId}).exec((err, list) => {
		if (err) {
			return console.log(err);
		}
		return callback ? callback(list) : list;
	});
};

ListSchema.statics.createList = async (listTitle, items, callback) => {
	const list = new List({
		_id: new mongoose.Types.ObjectId(),
		title: listTitle,
		items: items ? items.map(item => item._id) : []
	});
	await list.save(err => console.log(err));
	return callback ? callback(list) : list;
};

ListSchema.statics.createDefault = async (callback) => {
	let defaultItem   = await ListItem.create("Buy milk");
	let defaultList   = await List.create("To Do", [defaultItem]);
	defaultList       = defaultList.toObject();
	defaultList.items = [defaultItem.toObject()];
	console.log(defaultList);
	return callback ? callback(defaultList) : defaultList;
};

ListSchema.statics.updateList = async (listId, listFields, callback) => {
	let list = await List.findOne({_id: listId});
	console.log("LIST MODEL", list.toObject());
	if (!list || !listFields) {
		let response = utils.getResponse(
			401,
			!list ? "List could not be found" : "No list updates provided",
			null);
		return callback ? callback(response) : response;
	}
	let msg;
	if (listFields.hasOwnProperty("title") && listFields.title) {
		list.title = listFields.title;
		msg        = "List title changed to " + listFields.title;
	}
	if (listFields.hasOwnProperty("newItemDescription") && listFields.newItemDescription) {
		await list.addItem(listFields.newItemDescription);
		msg = "Added new item to list with description: " + listFields.newItemDescription;
	}
	if (listFields.hasOwnProperty('listItemId') && listFields.listItemId) {
		await list.deleteItem(listFields.listItemId);
		msg = "Deleted item with ID " + listFields.listItemId + " from list";
	}
	await list.save(console.log);
	let response = utils.getResponse(200, msg, list.toObject());
	return callback ? callback(response) : response;
};
//endregion

//region instance methods
ListSchema.methods.deleteItem = function (listItemId) {
	return ListItem.findOneAndDelete({_id: listItemId}, async (err, listItem) => {
		if (err) {
			return console.log(err);
		}
		this.items = this.items.filter(item => item !== listItem._id);
		await this.save(console.log);
		return this;
	});
};

ListSchema.methods.addItem = async function (itemDescription) {
	const listItem = await ListItem.create(itemDescription);
	this.items.push(listItem._id);
	await this.save(console.log);
	return this;
};
//endregion

const List = mongoose.model('List', ListSchema);

module.exports = List;