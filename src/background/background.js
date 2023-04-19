
const api = "http://localhost:7000/api/v1/collections";

chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    console.log(activeTab)
    // Change : Need to change the click while uploading
    // PROD Change : url https://linkcollect.io/ ==> now, when other pages upadte other url https://linkcollect.io/username
    if (activeTab?.url === "http://localhost:3000/") {
      console.log("Hello")
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

// Chnage: contextmenu way
// chrome.runtime.onInstalled.addListener(async () => {
  // await chrome.storage.local.set({"tab-session":0})
  chrome.contextMenus.create({
     id: "linkcollect-12",
     title: "Save to Linkcollect",
     contexts: ["page"],
  });
// });


chrome.contextMenus.create({
  title: "Save All tabs",
  parentId: "linkcollect-12",
  id:"Save-All-tabs-linkcollect",
  contexts:["page"],
});

chrome.contextMenus.create({
  title: "Save this tab to recent collection",
  parentId: "linkcollect-12",
  id:"Save-this-tab-to-recent-collection-linkcollect",
  contexts:["page"],
});


chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  if(item.menuItemId === "Save-All-tabs-linkcollect"){
    await saveAlltabs()
  }else{
    await saveCurrentTab()
  }
})

const saveCurrentTab =  async () => {
  const data = await chrome.storage.local.get(["collection"]);
  const token = await chrome.storage.local.get(["token"]);
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const structuredTimeLine = structureTimeline(tabs[0]);
  console.log(structureTimeline)
  try { 
    const res = await fetch(`${api}/${data.collection.id}/timelines`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      },
      body: JSON.stringify(structuredTimeLine),
      
    })
    createNotification(`Added all tabs to ${data.collection.name}`,"See in the Linkcollect extension")
  } catch (error) {
    createNotification(`Unable to add!`,"May be try again later!!")    
  }
  
}


const saveAlltabs =  async () => {
  const data = await chrome.storage.local.get(["collection"]);
  const token = await chrome.storage.local.get(["token"]);
  const tabs = await chrome.tabs.query({});
  const username = await chrome.storage.local.get(["username"]);
  const currentTabSession = await chrome.storage.local.get(["tab-session"]);
  console.log(username,currentTabSession["tab-session"],token,data)
  const structuredTimelines = tabs.map(structureTimeline);
  try { 
    //1. Need to create new collection
    let tabSessionNum =currentTabSession["tab-session"]+1;
    const form = new FormData();
    console.log(tabSessionNum)
    form.append("title",`tabs session ${tabSessionNum}`);
    const collection = await fetch(`${api}`, {
      method: "POST",
      headers: {
        // "Content-type": "application/x-www-form-urlencoded",
         Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      },
      body: form,
      
    })
    const collectionData = await collection.json();

    const res = await fetch(`${api}/${collectionData.data._id}/timelines/create-multiple`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      },
      body: JSON.stringify(structuredTimelines),
      
    })
    console.log(res)
    await chrome.storage.local.set({"tab-session":tabSessionNum})
    createNotification(`Added all tabs to ${collectionData.data.title}`,"See in the Linkcollect extension")
  } catch (error) {
    createNotification(`Unable to add!`,"May be try again later!!")    
  }
  
}

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
