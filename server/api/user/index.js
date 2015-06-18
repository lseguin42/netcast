'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

function isLatestVersion(req, res, next) {
	var user = req.user;
	console.log(req.headers);
	if (!req.headers.version)
		return res.status(400).send('Version is required');
	if (req.headers.version != user.version)
		return res.status(409).send('Bad version given, please update your contacts.');
	next();
}

router.get('/me', auth.isAuthenticated(), controller.getMe);
router.post('/', controller.create);

router.post('/me/contacts/:index', auth.isAuthenticated(), isLatestVersion, controller.updateContact);
router.put('/me/contacts/', auth.isAuthenticated(), isLatestVersion, controller.createContact);
router.delete('/me/contacts/:index', auth.isAuthenticated(), isLatestVersion, controller.deleteContact);

router.get('/me/contacts/', auth.isAuthenticated(), controller.getContacts);


module.exports = router;
