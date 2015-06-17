'use strict';

var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var User = require('./user.model');

function handleError (res, err) {
  console.log(err);
  return res.status(500).send(err);
}

/**
 * Creates a new user in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  if (req.body.contacts)
    return handleError(res, "contacts given on signup");
  req.body.contacts = [];
  User.create(req.body, function (err, user) {
    if (err) { return handleError(res, err); }
    var token = jwt.sign(
      { _id: user._id },
      config.secrets.session,
      { expiresInMinutes: 60 * 5 }
    );
    res.status(201).json({ token: token, user: user });
  });
};

/**
 * Return the current logged user.
 *
 * @param req
 * @param res
 */
exports.getMe = function (req, res) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -passwordHash', function (err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.json(401); }
    console.log(user);
    res.status(200).json(user);
  });
};

exports.createContact = function (req, res) {
  var user = req.user;
  var contact = req.body;

  try {
    user.addContact(contact, function (err) {
      if (err)
        return handleError(res, err);
      res.status(200).json({ success: true });
    });    
  } catch (e) {
    handleError(res, e);
  }
};

exports.updateContact = function (req, res) {
  var user = req.user;
  var data = req.body;
  
  try {
    var selectContact = data.select;
    var contact = data.contact;
    user.updateContact(selectContact, contact, function (err) {
      if (err) return handleError(res, err);
      res.status(200).json({ success: true });
    });
    res.status(200).json({ success: true });
  } catch (e) {
    handleError(res, e);
  }
};

exports.deleteContact = function (req, res) {
  var user = req.user;
  var data = req.body;

  try {
    var selectContact = data.select;
    user.deleteContact(selectContact);
    res.status(200).json({ success: true });
  } catch (e) {
    return handleError(res, e);
  }
};

exports.getContacts = function (req, res) {
  var user = req.user;

  res.status(200).json(user.contacts);
};