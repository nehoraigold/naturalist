//region imports
const mongoose = require('mongoose');
//endregion

const ListSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	items: {
		type: Array,
		required: true
	}
});

ListSchema.statics.create = async (listTitle, callback) => {
	const list = new List({title: listTitle, items: []});
	await list.save();
	return callback ? callback(list) : list;
};

ListSchema.statics.delete = async (list, callback) => {
	//delete a list
};

ListSchema.statics.update = async (listId, listFields, callback) => {
	let list = await List.findByIdAndUpdate(listId, listFields);
	return callback ? callback(list) : list;
};

ListSchema.statics.loadMany = async (listIdArray) => {
	let lists = [];
	listIdArray.forEach(async (listId) => {
		let list = await List.findById(listId);
		lists.push(list);
	});
	return lists;
};

const List = mongoose.model('List', ListSchema);

module.exports = List;