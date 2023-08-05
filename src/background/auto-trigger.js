

import annyang, { addCommands, start } from 'annyang';
// PROD: API URL CHANGE
const api = "https://api.linkcollect.io/api/v1/collections";



const getUserMedia = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .catch(function() {
      chrome.tabs.create({
        url: chrome.runtime.getURL("options.html"),
        selected: true
      });
    });
};

setTimeout(getUserMedia, 100);


if (annyang) {
  // Let's define a command.

  console.log("annyang is working")
  var commands = {
    'hello': function() { console.log('Hello world! i listend to you'); },
    'save this tab': function() { console.log('Hello world! i listend to you'); },
  };

  // Add our commands to annyang
  addCommands(commands);
  // Start listening.
  annyang.start({ autoRestart: true, continuous: true });

  // Convert speech to text
  annyang.addCallback('result', function(phrases) {
    var spokenText = phrases[0]; // Get the first phrase recognized
    console.log('Spoken text:', spokenText);
    // Perform any necessary actions with the spoken text
  });
}