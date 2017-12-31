import * as messaging from "messaging";
import { me } from "companion";
import { openHABAPI } from "./openHAB.js"
import { settingsStorage } from "settings";


var itemsToSend = [];

/*
 * Entry point for the companion app
 */

console.log("Companion starting! LaunchReasons: " + JSON.stringify(me.launchReasons));

settingsStorage.onchange = function(evt) {
  console.log("Settings have changed! " + JSON.stringify(evt));
  sendItems();
}

// Helpful to check whether we are connected or not.
//setInterval(function() {
//  console.log("openHAB App (" + me.buildId + ") running - Connectivity status=" + messaging.peerSocket.readyState + 
//              " Connected? " + (messaging.peerSocket.readyState == messaging.peerSocket.OPEN ? "YES" : "no"));
//}, 3000);

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  console.log("Connection open, sending items.");
  sendItems();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log("Received message: " + JSON.stringify(evt.data));
  
  var state = evt.data.state;
  var name = evt.data.name;
  
  var openHAB = new openHABAPI();
  openHAB.setItemState(name, state).then(function(status) {
    console.log("set Item State returned with: " + status);
    updateItem(name);
  }).catch(function (e) {
    console.log("error"); console.log(e)
  });
}

// Amount of buffered data has decreased, continue sending data
messaging.peerSocket.onbufferedamountdecrease = function() {
  console.log("Buffer Amount Decreased, sending more data!");
  sendData();
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

//send one item at a time as long as our buffer is happy
function sendData() {
  console.log("sendData called with bufferedAmount: " + messaging.peerSocket.bufferedAmount);
  console.log("messaging.peerSocket.readyState: " + messaging.peerSocket.readyState);
  console.log("itemsToSend size: " + itemsToSend.length);

  while (messaging.peerSocket.bufferedAmount < 64 && itemsToSend.length > 0 && messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send an item if one is there
    var item = itemsToSend.shift();

    console.log("Sending Item: " + JSON.stringify(item));

    //if the item is too large just don't send it
    if(JSON.stringify(item).length > messaging.MessageSocket.MAX_MESSAGE_SIZE) {
      console.log("Error item is too large to send!");
    }
    else {
      messaging.peerSocket.send(item);
    }
    
    console.log("itemsToSend size: " + itemsToSend.length);
  }
}

//send/update a single item
function updateItem(itemName) {
  var openHAB = new openHABAPI();
  
  //get item from openHAB
  openHAB.getItem(itemName).then(function(item){
    //send it
    itemsToSend.push(item);
    sendData();
  }).catch(function (e) {
    console.log("error"); console.log(e)
  });  
}

//send/update all items from openHAB
function sendItems() {
  var openHAB = new openHABAPI();
  
  //get all items from openHAB
  openHAB.getItems().then(function(items){
    //Queue all items and start sending them
    while (items.length > 0) {
      itemsToSend.push( items.shift() );
    }
    
    sendData();
  }).catch(function (e) {
    console.log("error"); console.log(e)
  });  
}