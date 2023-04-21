// PROD: API URL CHANGE
const api = "http://localhost:7000/api/v1/collections";

chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    console.log(activeTab);
    // Change : Need to change the click while uploading
    // PROD Change : url https://linkcollect.io/ ==> now, when other pages upadte other url https://linkcollect.io/username
    if (activeTab?.url === "http://localhost:3000/") {
      console.log("Hello");
      chrome.tabs.sendMessage(tabId, {
        message: "LOGIN_SUCCESS",
      });
    }
  });
});

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ "tab-session": 0 });
  chrome.contextMenus.create({
    id: "linkcollect-12",
    title: "Save to Linkcollect",
    contexts: ["page"],
  });
  chrome.contextMenus.create({
    title: "Save All tabs",
    parentId: "linkcollect-12",
    id: "save-all-tabs",
    contexts: ["page"],
  });

  chrome.contextMenus.create({
    title: "Save this tab to recent collection",
    parentId: "linkcollect-12",
    id: "save-current-tab",
    contexts: ["page"],
  });
});

// Context menu click listeners
chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  await acionDistaptcher(item.menuItemId);
});

// Commands listeners
chrome.commands.onCommand.addListener(async (command) => {
  await acionDistaptcher(command);
});

// API Action creator based on event
const acionDistaptcher = async (name) => {
  switch (name) {
    case "save-current-tab":
      await saveCurrentTab();
      break;
    case "save-all-tabs":
      await saveAlltabs();
      break;
  }
};

// Saving the current tab to the latest collection
const saveCurrentTab = async () => {
  const collection = await chrome.storage.local.get(["collection"]);
  const token = await chrome.storage.local.get(["token"]);
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const structuredTimeLine = structureTimeline(tabs[0]);
  try {
    const res = await fetch(`${api}/${collection.collection.id}/timelines`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      },
      body: JSON.stringify(structuredTimeLine),
    });
    const data = await res.json();
    if (data.status >= 300 && data.status < 500) {
      throw Error();
    }
  } catch (error) {
    console.log(error);
    var hasError = true;
  }
  sendMessage(hasError || false, !hasError ? "Link saved" : "Unable to save");
};

//Save all tabs
const saveAlltabs = async () => {
  const token = await chrome.storage.local.get(["token"]);
  const tabs = await chrome.tabs.query({});
  const currentTabSession = await chrome.storage.local.get(["tab-session"]);
  const structuredTimelines = tabs.filter(filteredTimeline).map(structureTimeline);
  console.log(structuredTimelines);
  try {
    //1. Need to create new collection
    let tabSessionNum = currentTabSession["tab-session"] + 1;
    const form = new FormData();
    console.log(tabSessionNum);
    form.append("title", `tabs session ${tabSessionNum}`);
    const collection = await fetch(`${api}`, {
      method: "POST",
      headers: {
        // "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      },
      body: form,
    });
    const collectionData = await collection.json();

    if (collectionData.status >= 300 && collectionData.status < 500) {
      throw Error();
    }

    // 2. Now add all tabs
    const res = await fetch(
      `${api}/${collectionData.data._id}/timelines/create-multiple`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
        },
        body: JSON.stringify(structuredTimelines),
      }
    );
    const data = await res.json();
    if (data.status >= 300 && data.status < 500) {
      throw Error();
    }

    await chrome.storage.local.set({ "tab-session": tabSessionNum });
  } catch (error) {
    var hasError = true;
  }
  sendMessage(
    hasError || false,
    !hasError ? "All tabs saved" : "Unable to save"
  );
};

const sendMessage = (hasError = false, userMessage) => {
  console.log("Hello");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab.id,
      {
        message: "ALL_TABS_SAVED",
        hasError: hasError,
        userMessage: userMessage,
      },
      (response) => {
        if (!chrome.runtime.lastError) {
          // if you have any response
          console.log(response);
        } else {
          // if your document doesn’t have any response, it’s fine but you should actually handle
          // it and we are doing this by carefully examining chrome.runtime.lastError
          console.log(response);
        }
      }
    );
  });
};

const structureTimeline =(tab) =>{
  const time = new Date("14 Jun 2017 00:00:00 PDT").toUTCString();
    return {
  
        link: tab.url,
        title: tab.title,
        favicon: tab.favIconUrl,
        time,
    };
}

const filteredTimeline  = (tab) => {
  
  if (
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
      tab.url
    )
  )
    return {
      tab,
    };
};
