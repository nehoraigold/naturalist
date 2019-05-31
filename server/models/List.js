//region imports
const mongoose = require('mongoose');
const ListItem = require('./ListItem');
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

ListSchema.statics.find = async (listId, callback) => {
	return await List.findOne({_id: listId})
		.populate({path: "items"})
		.exec((err, list) => {
			if (err) {
				return console.log(err);
			}
			return callback ? callback(list) : list;
		})
};

ListSchema.statics.create = async (listTitle, callback, items) => {
	const list = new List({
		_id: new mongoose.Types.ObjectId(),
		title: listTitle,
		items: items ? items.map(item => item._id) : []
	});
	await list.save(err => console.log(err));
	console.log("SAVING LIST", list);
	return callback ? callback(list) : list;
};

ListSchema.statics.createDefault = async (callback) => {
	let defaultItem = await ListItem.create("Buy milk");
	let defaultList = await List.create("To Do", null, [defaultItem]);
	defaultList = defaultList.toObject();
	defaultList.items = [defaultItem.toObject()];
	console.log(defaultList);
	return callback ? callback(defaultList) : defaultList;
};

ListSchema.methods.update = async (listId, listFields, callback) => {
	let list = await List.findByIdAndUpdate(listId.toString(), listFields);
	return callback ? callback(list) : list;
};

ListSchema.methods.delete = async (callback) => {
	//delete a list
};

const List = mongoose.model('List', ListSchema);

module.exports = List;