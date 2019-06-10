//region imports
const express          = require('express');
const path             = require('path');
const bodyParser       = require('body-parser');
const cors             = require('cors');
const config           = require('../config.json');
const router           = require('./routes');

//endregion

const app = express();

if (config.run.mode === "debug") {
	app.use(cors());
}

app.use(
	bodyParser.json(),
	express.static(path.resolve(__dirname, '../', config.client.buildPath)),
	router,
);

app.listen(config.server.port, () => {
	console.log(`Server started on port ${config.server.port}...`);
});