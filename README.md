# client-voice-review-view.and.data.api
This sample is a scenario that the user can review the model with voice. It uses Node.js as the server, and MongoDB as the database that stores the voice records.

## Description
This sample demonstrates a scenario that the user can review a model by voice in a web application with the Autodesk View & Data API. This web application implements a basic Node.js server and JavaScript/HTML5 client. It does not demonstrate how to upload a model to the Autodesk server for translation. See instructions below on how to prepare a model to be consumed in this sample.

Please refer to the video [client-voice-review-demo.mp4](https://github.com/Developer-Autodesk/client-voice-review-view.and.data.api/blob/master/client-voice-review-demo.mp4) for a demo. 


## Dependencies
* Install [Node.js](https://nodejs.org/) on your machine and clone this repo. Download the project dependencies using npm before launching the app by running the following command in the project root directory:
```
npm install
```
This will install the following node.js modules in the project:

	express
	request
	serve-favicon
	body-parser
	mongodb
	multipart
	bson

* Install [MongoDB](http://www.mongodb.org/) on your machine. Assume MongoDB 3.0 has been installed at C:\Program Files\MongoDB\.
	* Create a database folder C:\Program Files\MongoDB\testdb. 
	* Open command prompt window with administrator privilege. Switch to the directory C:\Program Files\MongoDB\Server\3.0\bin. Run the command as below. In default, the port for MongoDB is 27017. <br/>
  ```
  mongod --dbpath="C:\Program Files\MongoDB\testdb"
  ```
 ![alt tag](https://github.com/Developer-Autodesk/client-voice-review-view.and.data.api/blob/master/help/start-mongo.png)
  
	* Open one more command prompt window with administrator privilege. Switch to the directory C:\Program Files\MongoDB\Server\3.0\bin. Run the command as below. MongoDB context will start. <br/>
  ```
  mongo
  ```
	* In MongoDB context, type <br/>
  ```
  use testdb
  ```
  this will create a new database named 'testdb'
  
	* type
  ```
  db.createCollection('voicedemo')
  ```
  this will create a collection (table) named 'voicedemo' in the database.
  
 ![alt tag](https://github.com/Developer-Autodesk/client-voice-review-view.and.data.api/blob/master/help/create-database-collection.png)
   
* As said, this sample does not include the workflow of uploading models to the server.
It depends on other workflow samples to upload models and retrieve the model URNs, as explained in the Setup/Usage Instructions.


## Setup/Usage Instructions
 
Currently this sample has been tested on Windows OS with Autodesk production server (vs. staging). It should also work with OSX/Linux, or Autodesk staging server, but has not yet been tested.

* Apply for your own credentials (API keys) from [developer.autodesk.com](http://developer.autodesk.com)
* From the sample root folder, rename or copy the ./credentials_.js file into ./credentials.js <br />
  * Windows  
  ```
  copy credentials_.js credentials.js 
  
  ```
* Replace the placeholders with your own keys in credentials.js, line #23 and #24 <br />
  ```
  client_id: process.env.CONSUMERKEY || '<replace with your consumer key>';
  
  client_secret: process.env.CONSUMERSECRET || '<replace with your consumer secret>';
  ```
* Upload one of your models to your account and get its URN using another workflow sample, for example:
  - Windows: [.NET WPF application workflow sample](https://github.com/Developer-Autodesk/workflow-wpf-view.and.data.api) 
   - Browser: [models.autodesk.io web page](http://models.autodesk.io) or [java lmv walk through web page](http://javalmvwalkthrough-vq2mmximxb.elasticbeanstalk.com)
* Copy the URN which was generated in the previous step in file /www/viewer.js at line #19 <br />
  ```
  var defaultUrn = '<replace with your encoded urn>';
  ```
  
* Replace the db name and collection name with yours in routes/mongomodule.js, line #32 and #33 <br />
  var MongoDbName = "mongodb://localhost:27017/testdb";
  var mongoCollectionName = 'voicedemo';

* Make a map of the email addresses of your users at viewe.js line#36 <br />
  ```
  var userMap = {
	'xiaodong.liang@autodesk.com':'xiaodong.png',
	'user1@xxx.com':'user1.png',
	'user2@xxx.com':'user2.png' 
   };
  ```
* Put some photos of the users in /www/images, e.g. user1.png, user2.png etc.

* In command window, run you database of MongoDB. e.g. assume you have setup your database at c:\Program Files\MongoDB\testdb. In default, the port for MongoDB is 27017 <br />
   ``` 
  mongod --dbpath="C:\Program Files\MongoDB\testdb
   ```
  <br/>
  make sure the database runs without error. 
  
* Run the server from the Node.js console, by running the following command: <br />
  ```
  node server.js
  ```
* Connect to your local server using a WebGL-compatible browser: [http://localhost:3001/](http://localhost:3001/)


## Options



## License

That samples are licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.


## Written by 

Written by [Xiaodong Liang](http://adndevblog.typepad.com/aec/xiaodong-liang.html), Autodesk Developer Network.  
