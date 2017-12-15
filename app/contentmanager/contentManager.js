var express = require('express');
var router = express.Router();

//models
var userProfile = require('../app/models/userProfile');
var cm_Message = require('../app/models/cm_Messages');


var configDB = require('../config/database.js');
var discuss = require('mongodb-discuss')({mongoUrl: 'mongodb://localhost'});

module.exports = function(app){
  
};
