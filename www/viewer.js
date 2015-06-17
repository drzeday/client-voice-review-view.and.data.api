/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Xiaodong Liang 2015 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
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
//model that is for reviewing
var defaultUrn = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6eGlhb2Rvbmd0ZXN0YnVja2V0L0NsYXNoVGVzdC5ud2Q=';

//variables of recording
var audio_context;
var recorder;

//current selected objects
var selectDbArray=[];
//all review items (sync with mongodb)
var mongoDbValue =[];
//new items added by the current user.
var newMongoDbValue =[];
//viewer object
var _viewer;

//----------------utilities-----------------------------
//user images map
var userMap = {
	'xiaodong.liang@autodesk.com':'xiaodong.png',
	'user1@xxx.com':'user1.png',
	'user2@xxx.com':'user2.png'
};

//get parameter from url
function GetLocationParam(param){
	var request = {
	QueryString : function(val) {
	var uri = window.location.search;
	var re = new RegExp("" +val+ "=([^&?]*)", "ig");
	return ((uri.match(re))?(decodeURI(uri.match(re)[0].substr(val.length+1))):'');
	}
	}
	return request.QueryString(param);
}


function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    recorder = new Recorder(input);
}

//----------------end utilities-----------------------------

//----------------windows loading-----------------------------
var useremail;
window.onload = function init() {

	//get user email
	useremail =GetLocationParam("useremail");
	console.log(useremail);
	//load the corresponding icon of this user
	if(userMap[useremail])
		$('#useremailimg').attr("src","images/"+ userMap[useremail] );
	else
		$('#useremailimg').attr("src","images/"+ 'adsk.png' );

	//display user email in the label
	$('#useremail').text(useremail);

	//load recording
    try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;

      audio_context = new AudioContext;
      console.log('Audio context set up.');
      console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
      alert('No web audio support in this browser!');
    }
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
     console.log('No live audio input: ' + e);
    });
  };//window.onload
 //----------------end windows loading-----------------------------


//----------------document loading-----------------------------
$(document).ready(function () {

	//load view of the model
    var tokenurl = 'http://' + window.location.host + '/api/token';
    var config = {
        environment : 'AutodeskProduction'
		//environment : 'AutodeskStaging'
    };
    // Instantiate viewer factory
    var viewerFactory = new Autodesk.ADN.Toolkit.Viewer.AdnViewerFactory(
        tokenurl,
        config);

    // Allows different urn to be passed as url parameter
    var paramUrn = Autodesk.Viewing.Private.getParameterByName('urn');
    var urn = (paramUrn !== '' ? paramUrn : defaultUrn);

    viewerFactory.getViewablePath (urn,
        function(pathInfoCollection) {
            var viewerConfig = {
                viewerType: 'GuiViewer3D'
            };

            var viewer = viewerFactory.createViewer(
                $('#viewerDiv')[0],
                viewerConfig);

            viewer.load(pathInfoCollection.path3d[0].path);

			 viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT,
				   function(event){
				   //record the current selection
				   selectDbArray=[];
					if (event.dbIdArray.length > 0) {
						selectDbArray = event.dbIdArray;
					}
				});

			_viewer = viewer;
        },
        onError);

}); //$(document).ready

function onError(error) {
    console.log('Error: ' + error);
};

// refresh the review list
function refreshList()
{
	$("#reviewList").empty();
	for(item in mongoDbValue)
	{
		//user icon
		var user = mongoDbValue[item].user;
		var imgDiv = "<img src=\"/images/";;
		if(userMap[mongoDbValue[item].user])
			imgDiv = imgDiv + userMap[mongoDbValue[item].user];
		else
			imgDiv = imgDiv +'adsk.png';
		imgDiv = imgDiv+ "\">";

		//date of the review item
		var date =  new Date(Date.parse(mongoDbValue[item].date))
		var year = date.getFullYear() ;
		var month = date.getMonth();
		var day = date.getDay();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var text = year +'-' + month +'-' + day + '  ' + hour + ':' + minute;

		//var text = "   " + mongoDbValue[item].user +" " + date;
		//add this item to the review list
		$('#reviewList').append('<li><a>'+imgDiv +'<h2>'+ text +'</h2></a></li>');
	}
	$('#reviewList').listview('refresh');

	//delegate the selection event of the review list.
	$("#reviewList LI").each(function (index,item) {
		$(item).bind("vclick",function(e){

				console.log("clicked"+index);
				$("#recordingslist").empty();

				//get info of this item
				var thisSel = mongoDbValue[index];
				var dbId = parseInt(thisSel.viewdbids);
				var blob = thisSel.blob;

				//parse the json of voice to blob
				var i, l, d, array;
				l = blob.length;
				array = new Uint8Array(l);
				for (var i = 0; i < l; i++){
					array[i] = blob.charCodeAt(i);
				}
				var b = new Blob([array], {type: 'application/octet-stream'});

				//create the temporary audio element to play the voice
				var url = URL.createObjectURL(b);
				var li = document.createElement('li');
				var au = document.createElement('audio');
				var hf = document.createElement('a');

				au.controls = true;
				au.src = url;
				hf.href = url;
				hf.download = new Date().toISOString() + '.wav';
				hf.innerHTML = hf.download;
				li.appendChild(au);
				recordingslist.appendChild(li);
				//auto play
				au.setAttribute('autoplay', 'autoplay');
				li.style.visibility = 'hidden';

				//highlight the corresponding objects of this reviewing
				_viewer.showAll();
				_viewer.isolateById(dbId);

			});
		});
}

//sync the review list from mongodb
function refreshDB()
{
	$.ajax({
		async:false,
		url: '/mongomodule/getItemsFromMongodb',
		dataType:'json',
		cache: false,
		success:function(result){
		  try{
			  //console.log(result);
			  mongoDbValue=[];
			  mongoDbValue = result;
			  refreshList();
			  alert('sync completed!');
		  }catch(e){
			alert(e.message);
		  }
		}
	  });
}



function toggleRecording( e ) {

    if (e.classList.contains("recording")) {
		//reset clocker
		clock.s = 5000;
        // stop recording
       recorder && recorder.stop();
        e.classList.remove("recording");
		//add the new item
        addNewItem();
		recorder.clear();

		//hide the timer element
		var thisSpan = document.getElementById("timer");
		thisSpan.style.visibility = 'hidden';

    } else {
        // start recording
        if (!recorder)
            return;
		if(selectDbArray==null || selectDbArray.length==0)
		{
			alert("no selection!");
			return;
		}
		else
		{
			e.classList.add("recording");
			recorder.clear();
			recorder.record();

			//show timer element
			var thisSpan = document.getElementById("timer");
			thisSpan.style.visibility = 'visible';

			//recording length < 5 seconds
			clock.s = 5000;
			timer = setInterval("clock.move()",10);
		}

    }
}

function addNewItem() {
//get the blob of the voice
recorder && recorder.exportWAV(function(blob) {


  var reader = new FileReader();
  reader.onloadend = onloadendHandler;
  reader.onerror = errorHandler;
  // Read the file asynchronously and use callbacks to handle
  reader.readAsBinaryString(blob);

 });
}

//error handler for reading out the voice blob
function errorHandler(evt) {
  if (evt.target.error.name == "NotReadableError") {
	//document.getElementById('alert').innerHTML = 'The file could not be read.';
  }
  else {
	//document.getElementById('alert').innerHTML = 'File error.';
  }
}


 function toggleSyncDB( e ) {

	if(newMongoDbValue.length >0){
		//if user created new items	, upload the items to mongdb

		$.ajax({
			  async:false,
			  type: "POST",
			  url: '/mongomodule/addItemsToMongodb',
			  data: {data:newMongoDbValue},
			  dataType:'json',
			  cache: false,
			  success:function(){
					   console.log('sucess!');
					   refreshDB();
					   newMongoDbValue = [];
			  },
			 onprogress: function (e) {
					if (e.lengthComputable) {
					console.log(e.loaded / e.total * 100 + '%');
					}
				}
		  });
		}
		else{
			 refreshDB();
		}
 }

function onloadendHandler(evt) {
	//read out the blob of the voice
  if (evt.target.readyState == FileReader.DONE) {

	  var thisuser = useremail;
	  var thisviewdbids = selectDbArray[0];
	  var thisblob = evt.target.result;
	  var thisdate = new Date().toISOString();
	  var newItem = {
		user : thisuser,
		viewdbids  : thisviewdbids,
		blob : thisblob,
		date:thisdate
		};

	  //add the new item to the array
	  mongoDbValue.push(newItem);
	  newMongoDbValue.push(newItem);
	  //refresh the review list
	  refreshList();
  }
}

//--------------------clock-----------------
//timer for recording, in order to have short voice.
var clock=new clock();
var timer;
function clock(){
    this.s=5000;
    this.move=function(){
        document.getElementById("timer").innerHTML=exchange(this.s);
        this.s=this.s-10;
        if(this.s<0){
            clearTimeout(timer);
			document.getElementById("timer").style.visibility = 'hidden';
			//stop recording
			if (document.getElementById("record").classList.contains("recording"))
				document.getElementById("record").click();

           }
        }
    }
function exchange(time){
	this.m=Math.floor(time/1000);
	this.s=(time%1000);
	this.text=this.m+ "   second   "+this.s+"  mili second";
	return this.text;
}



// ---------------------------------------------------------------------------------------------------------
