//region imports
const mongoose = require('mongoose');
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

ListSchema.statics.create = async (listTitle, callback) => {
	const list = new List({
		_id: new mongoose.Types.ObjectId(),
		title: listTitle,
		items: []
	});
	await list.save();
	console.log("SAVING LIST", list);
	return callback ? callback(list) : list;
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