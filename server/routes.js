const router = require('express').Router();
const config = require('../config.json');
const path   = require('path');
const server = require('./server');

router.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../', config.client.buildPath) + "/index.html");
});

router.post('/login', server.login);
router.post('/register', server.register);
router.post('/logout', server.logout);

// router.post('/:object', server.create);

router.put("/:objectType/:id", server.update);

// router.delete('/:object/:id', server.delete);

//TODO: CHANGE ROUTES TO BE MORE SPECIFIC

module.exports = router;