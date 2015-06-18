'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var check = require('../../config/tools/checker').check;
var is = require('../../config/tools/checker').tools.is;

var UserSchema = new Schema({
  email: String,
  passwordHash: String,
  salt: String,
  contacts: [],
  checksum: String,
});

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.passwordHash = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

/**
 * Validations
 */

UserSchema
  .path('email')
  .validate(function (value, respond) {
    var self = this;
    this.constructor.findOne({ email: value }, function (err, user) {
      if (err) { throw err; }
      if (user) {
        if (self.id === user.id) { return respond(true); }
        return respond(false);
      }
      respond(true);
    });
  }, 'email already used');

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate
   *
   * @param {String} password
   * @return {Boolean}
   */
  authenticate: function (password) {
    return this.encryptPassword(password) === this.passwordHash;
  },

  /**
   * Make salt
   *
   * @return {String}
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) { return ''; }
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },

  haveContact: function (email, fn) {
    User.findOne({ _id: this._id, 'contacts.email': email }, function (err, user) {
      console.log(err, user);
      if (!err && user)
        return fn(true);
      fn(false);
    });
  },

  updateContactChecksum: function (chunk) {
    var str = chunk + Date.now() + this.checksum ;
    this.checksum = crypto.createHash('md5').update(str).digest('hex');
  },

  /**
   * Contacts
   */

  addContact: function (contact, fn) {
    var self = this;
    check.object(contact, { email: is.email, nickname: 'string' });
    if (!self.contacts)
      self.contacts = [];
    self.haveContact(contact.email, function (have) {
      if (have)
        return fn('contact already exists');
      self.contacts.push(contact);
      self.updateContactChecksum('add' + (self.contacts.length - 1));
      self.save(function (err, user) {
        if (err) return fn(err);
        fn();
      });
    });
  },

  deleteContact: function (index, fn) {
    var self = this;
    if (!self.contacts || !self.contacts[index])
      return fn('contact id not exists');
    self.contacts.splice(index, 1);
    self.updateContactChecksum('delete' + index);
    self.save(function (err, user) {
      if (err) return fn(err);
      fn();
    });
  },

  updateContact: function (index, newContact, fn) {
    var self = this;
    check.object(newContact, { email: is.email, nickname: 'string' });
    if (!self.contacts || !self.contacts[index])
      return fn('contact not exists');
    var update = function () {
      self.contacts[index] = newContact;
      self.updateContactChecksum('update' + index);
      self.save(function (err, user) {
        if (err) return fn(err);
        fn();
      });
    }
    if (self.contacts[index].email !== newContact.email)
      self.haveContact(newContact.email, function (have) {
        if (have) return fn('contact already exists');
        update();
      });
    else
      update();
    
  },

};

var User = mongoose.model('User', UserSchema);
module.exports = User;
