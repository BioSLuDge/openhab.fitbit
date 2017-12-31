import { MAX_ITEM_COUNT } from "../common/globals.js";

let document = require("document");

export function openHABUI(sendCommand) {
  this.itemListElement = document.getElementById("itemList");
  this.statusTextElement = document.getElementById("status");
  
  this.sendCommand = sendCommand;
  this.itemList = [];
  
  this.tiles = [];
  for (var i = 0; i < MAX_ITEM_COUNT; i++) {
    var tile = document.getElementById(`item-${i}`);
    if (tile) {
      //hide it and save it off
      tile.style.display = "none";
      this.tiles.push(tile);
    }
  }
}

openHABUI.prototype.updateUI = function(state) {
  console.log("WATCH: updateUI: " + state);

  if (state === "loaded") {
    this.itemListElement.style.display = "inline";
    this.statusTextElement.text = "";
  }
  else {
    this.itemListElement.style.display = "none";

    if (state === "loading") {
      this.statusTextElement.text = "Loading items ...";
    }
    else if (state === "disconnected") {
      this.statusTextElement.text = "Please check connection to phone and Fitbit App"
    }
    else if (state === "error") {
      this.statusTextElement.text = "Something terrible happened.";
    }
  }
}

openHABUI.prototype.updateItem = function(newItem) {
  //first we need to get the title
  var newItemName = newItem.name;
  var tile = null;
  var found = false;
  
  //run through all of the items to see if we already have it
  for (var itemNum in this.itemList) {
    //found it
    if(this.itemList[itemNum] == newItemName) {
      console.log("WATCH: Found exist item!");
            
      //save off the tile and item
      tile = this.tiles[itemNum];
      found = true;
      break;
    }
  }
  
  //we need to add it
  if(!found) {
    console.log("WATCH: Adding new item.");

    //make sure we are not over our max item count
    if(this.itemList.length >= MAX_ITEM_COUNT) {
      console.log("Can't add anymore items");
      return;
    }
    else {
      tile = this.tiles[this.itemList.length];
      this.itemList.push(newItem.name);
    }
  }
  
  
openHABUI.prototype.addItemToUI = function(newItem) {  
  
  //update the ui
  tile.style.display = "inline";
  var button = tile.getElementById("btn");
  var self = this;

  button.text = newItem.label;
        
  if(newItem.type == "Dimmer") {
    if(newItem.state < 1) {
      button.style.fill = "red";
      
      button.onactivate = function(e) {
        console.log("Button Pushed for " + newItem.name);
        self.sendCommand(newItem.name, "100");
      }
    }
    else {
      button.style.fill = "green";

      button.onactivate = function(e) {
        console.log("Button Pushed for " + newItem.name);
        self.sendCommand(newItem.name, "0");
      }
    }
  }
  else {
    if(newItem.state == "OFF") {
      button.style.fill = "red";

      button.onactivate = function(e) {
        console.log("Button Pushed for " + newItem.name);
        self.sendCommand(newItem.name, "ON");
      }
    }
    else {
      button.style.fill = "green";

      button.onactivate = function(e) {
        console.log("Button Pushed for " + newItem.name);
        self.sendCommand(newItem.name, "OFF");
      }    
    }
  }
}