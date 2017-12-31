/*
 * Entry point for the watch app
 */
import document from "document";
import * as messaging from "messaging";
import { openHABUI } from "./ui.js";

console.log("Watch: App Started");

var ui = new openHABUI(sendCommand);
ui.updateUI("disconnected");

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  console.log("Watch: Socket opened");
  ui.updateUI("loading");
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log("Watch: Got JSON message from companion:" + JSON.stringify(evt.data));
  ui.updateItem(evt.data);
  ui.updateUI("loaded");
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Watch: Connection error: " + err.code + " - " + err.message);
  ui.updateUI("error");
}

function sendCommand(name, state) {
  var command = {
    name: name,
    state: state
  };
  
  console.log("Watch: sending command: " + JSON.stringify(command));
  
  messaging.peerSocket.send(command);
}
