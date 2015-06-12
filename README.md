# client-voice-review-view.and.data.api
This sample is a scenario that the user can review the model with voice. It uses Node.js as the server, and MongoDB as the database to store the voice record.

## Description
This sample demonstrates a scenario that the user can review a model by voice in a web application with the Autodesk View & Data API. This web application implements a basic Node.js server and JavaScript/HTML5 client. It does not demonstrate how to upload a model to the Autodesk server for translation. See instructions below on how to prepare a model to be consumed in this sample.

Please refer to the video [client-voice-review-demo.mp4](https://github.com/Developer-Autodesk/client-voice-review-view.and.data.api/blob/master/client-voice-review-demo.mp4) for a demo of the detailed workflow. 


## Dependencies
Install Node.js on your machine and clone this repo. Download the project dependencies using npm before launching the app by running 
the following command in the project root directory:
```
npm install
```
This will install the following node.js modules in the project:
- express
- request
- serve-favicon
- body-parser
- mongodb
- multipart
- bson

Install [MongoDB](http://www.mongodb.org/) on your machine. Create a database and a collection.

As said, this sample does not include the workflow of uploading models to the server.
It depends on other workflow samples to upload models and retrieve the model URNs, as explained in the Setup/Usage Instructions.


## Setup/Usage Instructions
 
* Apply for your own credentials (API keys) from [developer.autodesk.com](http://developer.autodesk.com)
* From the sample root folder, rename or copy the ./credentials_.js file into ./credentials.js <br />
  * Windows <br />
    ```
    copy credentials_.js credentials.js 
	```
  * OSX/Linux <br />
    ```
    cp credentials_.js credentials.js  
	```
* Replace the placeholders with your own keys in credentials.js, line #23 and #24 <br />
  ```
  client_id: process.env.CONSUMERKEY || '<replace with your consumer key>';
  
  client_secret: process.env.CONSUMERSECRET || '<replace with your consumer secret>';
  ```
* Upload one of your models to your account and get its URN using another workflow sample, for example:
  - Windows: [.NET WPF application workflow sample](https://github.com/Developer-Autodesk/workflow-wpf-view.and.data.api) 
  - Mac: [Mac OS Swift workflow sample](https://github.com/Developer-Autodesk/workflow-macos-swift-view.and.data.api)
  - Browser: [models.autodesk.io web page](http://models.autodesk.io) or [javalmvwalkthrough web page](http://javalmvwalkthrough-vq2mmximxb.elasticbeanstalk.com)
* Copy the URN which was generated in the previous step in file /www/viewer.js at line #19 <br />
  ```
  var defaultUrn = '<replace with your encoded urn>';
  ```
  
* Replace the db name and collection name with yours in routes/mongomodule.js, line #32 and #33 <br />
  var MongoDbName = "mongodb://localhost:27017/testdb";
  var mongoCollectionName = 'voicedemo';

* make the map of the email addresses of your users at viewe.js line#36 <br />
  var userMap = {
	'user1@xxx.com':'user1.png',
	'user2@xxx.com':'user2.png' 
   };

* put some photos in /www/images for the users.

* Run MongoDb. e.g.<br />
   mongod --dbpath="C:\Program Files\MongoDB\testdb
   
* Run the server from the Node.js console, by running the following command: <br />
  ```
  node server.js
  ```
* Connect to you local server using a WebGL-compatible browser: [http://localhost:3001/](http://localhost:3001/)


This sample can also work with the Autodesk staging server (vs. production) or using someone else's credentials as long you can get a valid token. 
By default, the project is setup with the production server, and use your own credentials. 
If you are interested in a different setup, see the Options below.

## Options



## License

That samples are licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.


## Written by 

Written by [Xiaodong Liang](http://adndevblog.typepad.com/aec/xiaodong-liang.html), Autodesk Developer Network.
