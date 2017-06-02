var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');
var MongoClient = require(mongodb).MongoClient
var app = express();

var db;
MongoClient.connect('mongodb://admin:admin@ds147599.mlab.com:47599/nakidb',(err ,database) => {
    if(err) return console.log(err)
    db = database
})

var express = require('express');
var bp=require('body-parser');
var _=require('underscore');

var app = express();
var pid=1;