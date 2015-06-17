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
      self.save(function (err, user) {
        if (err) return fn(err);
        fn();
      });
    });
  },

  deleteContact: function (selectContact, fn) {
    var self = this;
    check.object(selectContact, { index: 'number', email: is.email });
    var id = selectContact.index;
    var email = selectContact.email;
    if (!self.user.contacts[id])
      return fn('contact id not exists');
    if (self.user.contacts[id].email !== email)
      return fn('contact email not equals');
    self.user.contacts.splice(id, 1);
    self.save(function (err, user) {
      if (err) return fn(err);
      fn();
    });
  },

  updateContact: function (selectContact, newContact, fn) {
    var self = this;
    check.object(selectContact, { index: 'number', email: is.email });
    check.object(newContact, { email: is.email, nickname: 'string' });
    var id = selectContact.index;
    var email = selectContact.email;
    if (!self.contacts || !self.contacts[id])
      return fn('contact not exists');
    if (selectContact.email !== self.contacts[id].email)
      return fn('contact email not equals');
    if (email !== newContact.email)
    {
      self.haveContact(newContact.email, function (have) {
        if (have)
          return fn('contact already exists');
        self.user.contacts.splice(id, 1);
        self.user.contacts.push(newContact);
        self.save(function (err, user) {
          if (err) return fn(err);
          fn();
        });
      });
      return ;
    }
    self.contacts[id].nickname = newContact.nickname;
    self.save(function (err, user) {
      if (err) return fn(err);
      return err;
    });
  },

};

var User = mongoose.model('User', UserSchema);
module.exports = User;
