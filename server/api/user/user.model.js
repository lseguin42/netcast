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
  contacts: {},
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

  /**
   * Contacts
   */

  addContact: function (contact) {
    check.object(contact, { email: is.email, nickname: 'string' });
    var key = contact.email.replace('.', '#');
    if (!this.contacts)
      this.contacts = {};
    if (this.contacts[key])
      throw 'contact already exists';
    this.contacts[key] = contact;
    console.log('new key ==> ', key, 'contact list ==> ', this.contacts);
    this.save(function (err, obj) {
      console.log('ERROR => ', err);
      console.log('OBJ ==> ', obj);
      User.findOne({_id: obj._id}, function (err, o) {
        console.log('ERR ====> ', err, 'OBJ2 ==> ', o);
      })
    });
  },

  deleteContact: function (email) {
    if (!is.email(email))
      throw 'isn\'t an email';
    var key = email.replace('.', '#');
    if (!this.contacts[key])
      throw 'contact not exists';
    delete this.contacts[key];
    this.save();
  },

  updateContact: function (email, contact) {
    if (!is.email(email))
        throw 'isn\'t an email';
    check.object(contact, { email: is.email, nickname: 'string' });
    var key = email.replace('.', '#');
    if (!this.contacts[key])
        throw 'contact not exists';
    if (contact.email !== email)
    {
      var key2 = contact.email.replace('.', '#');
      if (this.contacts[key2])
        throw 'contact already exists';
      delete this.contacts[key];
      this.contacts[key2] = contact;
    }
    else
      this.contacts[key].nickname = contact.nickname;
    this.save();
  },

};

var User = mongoose.model('User', UserSchema);
module.exports = User;
