'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

router.get('/me', auth.isAuthenticated(), controller.getMe);
router.post('/', controller.create);


router.post('/me/contacts/:email', auth.isAuthenticated(), controller.updateContact);
router.put('/me/contacts/', auth.isAuthenticated(), controller.createContact);
router.delete('/me/contacts/:email', auth.isAuthenticated(), controller.deleteContact);
router.get('/me/contacts/', auth.isAuthenticated(), controller.getContacts);


module.exports = router;
