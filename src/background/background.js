const api = "http://localhost:7000/api/v1/collections";

chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    // Change : Need to change the click while uploading
    if (activeTab?.url === "http://localhost:3000/") {
      chrome.tabs.sendMessage(tabId, {
        message: "LOGIN_SUCCESS",
      });
    }
  });
});

// let collectionId = ""
// let collectionName = ""

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log(request)
//     if (request.method == "getStatus"){
//       sendResponse({status: localStorage['token']});
//     }

//     else
//       sendResponse({}); // snub them.
// });

chrome.contextMenus.create({
  id: "linkcollect-12",
  title: "Save all tabs to recent",
  contexts: ["page"],
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  const data = await chrome.storage.local.get(["collection"]);
  const token = await chrome.storage.local.get(["token"]);
  const tabs = await chrome.tabs.query({});
  const structuredTimeLines = tabs.map(structureTimeline);
  try { 
    const res = await fetch(`${api}/${data.collection.id}/timelines/create-multiple`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      },
      body: JSON.stringify(structuredTimeLines),
      
    })
    createNotification(`Added all tabs to ${data.collection.name}`,"See in the Linkcollect extension")
  } catch (error) {
    
  }
  
});

const createNotification  = (title,message) =>{
  chrome.notifications.create({
    title:title,
    message:message,
    iconUrl: "./logo.png",
    type:"basic"
  })
}

const structureTimeline = (tab) => {
  const time = new Date("14 Jun 2017 00:00:00 PDT").toUTCString();
  return {
    link: tab.url,
    title: tab.title,
    favicon: tab.favIconUrl,
    time,
  };
};
