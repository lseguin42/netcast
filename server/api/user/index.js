'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

function checksumIsValid(req, res, next) {
	var user = req.user;
	console.log(req.headers);
	if (!req.headers.checksum)
		return res.status(400).send('Checksum is required');
	if (req.headers.checksum != user.checksum)
		return res.status(409).send('Bad checksum given, please update your contacts.');
	next();
}

router.get('/me', auth.isAuthenticated(), controller.getMe);
router.post('/', controller.create);

router.post('/me/contacts/:index', auth.isAuthenticated(), checksumIsValid, controller.updateContact);
router.put('/me/contacts/', auth.isAuthenticated(), checksumIsValid, controller.createContact);
router.delete('/me/contacts/:index', auth.isAuthenticated(), checksumIsValid, controller.deleteContact);

router.get('/me/contacts/', auth.isAuthenticated(), controller.getContacts);


module.exports = router;
