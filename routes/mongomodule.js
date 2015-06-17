/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Xiaodong Liang 2015 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this softwin
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////

var express =require ('express') ;
var request =require ('request') ;
var bson =require ('bson') ;
var BSON = bson.BSONPure.BSON;
var Long = bson.BSONPure.Long;
var multipart = require('multipart');
var sys = require('sys');

var currentVoiceBinary;


// Retrieve mongodb
var MongoClient = require('mongodb').MongoClient;
var MongoDbName = "mongodb://localhost:27017/testdb";
var mongoCollectionName = 'voicedemo';

var router_mongo =express.Router () ;

//add one new item to mongodb collection
router_mongo.post('/addItemToMongodb', function (req, res) {

	MongoClient.connect(MongoDbName, function(err, db) {
	  if(!err) {

		console.log(new Date().toISOString() +　"MongoDB connected");
		var collection = db.collection(mongoCollectionName);

		var user=	req.body.user;
		var viewdbids=	req.body.viewdbids;
		var blob=	req.body.blob;
		var date = req.body.date;

		  collection.insert(
	  	   [
			  {	user:user,blob:blob,viewdbids:viewdbids,date:date}
			], function(err, result) {
				console.log(new Date().toISOString() +"Inserted 1 item into the document collection");
				 res.setHeader('Content-Type', 'application/json');
				 var str = {data:'success'};
				  res.send(str);
				db.close();
		  });
	  }
	  else
	  {
		console.log(new Date().toISOString() +　"MongoDB NOT connected");
	  }
	 });

}) ;

//add multi new items to mongodb collection

router_mongo.post('/addItemsToMongodb', function (req, res) {

	MongoClient.connect(MongoDbName, function(err, db) {
	  if(!err) {
		console.log(new Date().toISOString() +　"MongoDB connected");
		var collection = db.collection(mongoCollectionName);

		console.log(new Date().toISOString() +　"add items from Mongodb");

		  collection.insert(req.body.data, function(err, result) {
				console.log(new Date().toISOString() +"Inserted multi items into the document collection");
				res.setHeader('Content-Type', 'application/json');
				var str = {data:'success'};
				res.send(str);
				db.close();
		  });
	  }
	  else
	  {
	   console.log(new Date().toISOString() +　"MongoDB NOT connected");
	  }
	 });

}) ;

//get all items of these mongodb
router_mongo.get('/getItemsFromMongodb', function (req, res) {

  MongoClient.connect(MongoDbName, function(err, db) {

	  if(!err) {
		console.log(new Date().toISOString() +　"MongoDB connected");
		var col = db.collection(mongoCollectionName);
		console.log(new Date().toISOString() +　"get items from Mongodb");

		col.find({}).toArray(function(err, docs) {
			 console.log(new Date().toISOString() +　"Found"　+ docs.length +"records");
			 res.setHeader('Content-Type', 'application/json');
             res.send(docs);
			 console.log(docs.length);
			 db.close();
		  });
	  }
	  else
	  {
	    console.log(new Date().toISOString() +　"MongoDB NOT connected");
	  }
	});
}) ;



module.exports =router_mongo ;
