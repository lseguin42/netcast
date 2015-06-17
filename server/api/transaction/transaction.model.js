'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var check = require('../../config/tools/checker').check;
var is = require('../../config/tools/checker').tools.is;

var TransactionSchema = new Schema({
  files: [{}], // { name: String, size: Number }
  recipients: [{}], // { email: String, accessNumber: Number }
  creator: String,
  message: String,
});

TransactionSchema
	.path('files')
	.validate(function (files, respond) {
		try {
			files.forEach(function (file) {
				check.object(file, { name:'string', size:'number' });
			});
		} catch (e) {
			console.log(e);
			respond(false);
		}
		respond(true);
	}, 'files error');

TransactionSchema
	.path('recipients')
	.validate(function (recipients, respond) {
		try {
			recipients.forEach(function (recipient) {
				check.object(recipient, { email:is.email, accessNumber:'number' });
			});
		} catch (e) {
			console.log(e);
			respond(false);
		}
		respond(true);
	}, 'recipients error');

TransactionSchema
	.path('creator')
	.validate(function (creator, respond) {
		try {
			respond(is.email(creator));
		} catch (e) {
			console.log(e);
			respond(false);
		}
	}, 'creator is not a valid email');

module.exports = mongoose.model('Transaction', TransactionSchema);
