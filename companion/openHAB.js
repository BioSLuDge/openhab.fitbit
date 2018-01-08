import { settingsStorage } from "settings";

export function openHABAPI(url) {
  for (let index = 0; index < settingsStorage.length; index++) {
    let key = settingsStorage.key(index);
    if (key && key === "oauth") {
      // We already have an oauth token
      let data = JSON.parse(settingsStorage.getItem(key))
      this.token = data.access_token;
    }
  }  

  this.url = "https://openhab.tolboe.com";
};

openHABAPI.prototype.setItemState = function(item, state) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var myUrl = self.url + "/rest/items/" + item;
    console.log("Sending request to server: " + myUrl);
    
    fetch(myUrl, {
      body: state,
      method: "POST",
      mode: 'no_cors',
      headers: {
        "Authorization": `Bearer ${self.token}`
      }
    })
    .then(function(response) {
      console.log("Got response from server: " + response.statusText);
      
      if(response.ok) {
        resolve(response.statusText);
      }
      else {
        reject(response.statusText);
      }
    }).catch(function (error) {
      console.log("Fetching " + myUrl + " failed: " + JSON.stringify(error));
      reject(error);
    });
  });
}

openHABAPI.prototype.getItems = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var myUrl = self.url + "/rest/items";
    console.log("Sending request to server: " + myUrl);

    fetch(myUrl, {
      method: "GET",
      mode: 'no_cors',
      headers: {
        "Authorization": `Bearer ${self.token}`
      }
    })
    .then(function(response) {
      console.log("Got response from server");
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));
      var items = [];

      for(var itemNum in json) {
        var item = json[itemNum];
        var valid = false;
        
        for(var tagNum in item.tags) {
          var tag = item.tags[tagNum];
          
          switch(tag) {
            case "Lighting":
            case "Switchable":
              valid = true;
              break;
          }
        }

        if(valid) {
          var device = {
            type: item.type,
            state: item.state,
            name: item.name,
            label: item.label
          };

          items.push(device);
        }
      }
      
      console.log("Received supported items:" + JSON.stringify(items));

      resolve(items);
    }).catch(function (error) {
      console.log("Fetching " + myUrl + " failed: " + JSON.stringify(error));
      reject(error);
    });
  });    
}

openHABAPI.prototype.getItem = function(item) {
  var self = this;
  return new Promise(function(resolve, reject) {
    var myUrl = self.url + "/rest/items/" + item;
    console.log("Sending request to server: " + myUrl);
    
    fetch(myUrl, {
      method: "GET",
      mode: 'no_cors',
      headers: {
        "Authorization": `Bearer ${self.token}`
      }
    })
    .then(function(response) {
      console.log("Got response from server!");
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));
      
      var device = {
        type: json.type,
        state: json.state,
        name: json.name,
        label: json.label
      };
      
      console.log("Received supported item:" + JSON.stringify(device));

      resolve(device);
    }).catch(function (error) {
      console.log("Fetching " + myUrl + " failed: " + JSON.stringify(error));
      reject(error);
    });
  });
}