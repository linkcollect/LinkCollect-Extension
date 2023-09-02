// PROD: API URL CHANGE
const api = "https://api.linkcollect.io/api/v1/collections";


chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    // Change : Need to change the click while uploading
    // PROD Change : url https://linkcollect.io/ ==> now, when other pages upadte other url https://linkcollect.io/usernamer
    const url = new URL(activeTab?.url);
    if (url.hostname === "linkcollect.io") {
      chrome.tabs.sendMessage(tabId, {
        message: "LOGIN_SUCCESS",
      },
      (response) => {
        if (!chrome.runtime.lastError) {
          // console.log(response);
        } else {
          // console.log(response);
        }
      });
    }
  });
});

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ "tab-session": 0 });
  chrome.contextMenus.create({
    id: "linkcollect-12",
    title: "Save to LinkCollect",
    contexts: ["page"],
  });

  chrome.contextMenus.create({
    id: "save-link-to-recent",
    title: "Save Link To Random Collection",
    contexts: ["link"],
  });


  chrome.contextMenus.create({
    title: "Save This Tab To Random Collection (ALT + C)",
    parentId: "linkcollect-12",
    id: "save-current-tab",
    contexts: ["page"],
  });

  chrome.contextMenus.create({
    title: "Save All Tabs (of this window) - (ALT + A)",
    parentId: "linkcollect-12",
    id: "save-all-tabs",
    contexts: ["page"],
  });

});

// Context menu click listeners
chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  await acionDistaptcher(item);
});

// Commands listeners
chrome.commands.onCommand.addListener(async (command) => {
  console.log("item", item )
  await acionDistaptcher(command);
});

// API Action creator based on event
const acionDistaptcher = async (item) => {
  let name = item.menuItemId ||  item;
  switch (name) {
    case "save-current-tab":
    //   await saveCurrentTab();
    await saveCurrentTab();
      break;
    case "save-all-tabs":
      await saveAlltabs();
      break;
    case "save-link-to-recent":
      await saveLinkToRecent(item);
      break;
  }
};


// Save tab to Random Collection
const saveCurrentTab = async () => {
  let rc = []
  const token = await chrome.storage.local.get(["token"]);
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const structuredTimeLine = structureTimeline(tabs[0]);
  try {
    const allCollections = await fetch(`${api}`, {
      method: "GET",
      headers: {
        // "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      }
    });
    const collections = await allCollections.json();
    const randomCollectionExist = collections.data.filter(collection => collection.title.includes("Random Collection"))
    console.log(randomCollectionExist)

    // find a collection with space to add the link
    for (let i = 0; i < randomCollectionExist.length; i++) {
      const collection = randomCollectionExist[i];
      if(collection.timelines.length < 99) {
        rc = [collection]
        break;
      }
    }

    if (rc.length === 0) {
      rc = await createRandomCollection(randomCollectionExist.length+1, token) // create random collection 1
      console.log("created rc", rc)
    }

    const res = await fetch(`${api}/${rc[0]._id}/timelines`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      },
      body: JSON.stringify(structuredTimeLine),
    });
    const data = await res.json();
    if (res.status >= 300 && res.status < 500) {
      throw Error();
    }
  } catch (error) {
    console.log(error);
    var hasError = true;
  }
  sendMessage(hasError || false, !hasError ? "Link Saved" : "Unable To Save");
}

//Save all tabs
const saveAlltabs = async () => {
  let ErrorMessage = "Failed To Save";
  const token = await chrome.storage.local.get(["token"]);
  const tabs = await chrome.tabs.query({currentWindow: true});
  const structuredTimelines = tabs
    .filter(filteredTimeline)
    .map(structureTimeline);
  try {
    //1. Need to create new collection 
    const allCollections = await fetch(`${api}`, {
      method: "GET",
      headers: {
        // "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      }
    });
    const collections = await allCollections.json();
    const randomCollectionExist = collections.data.filter(collection => collection.title.includes("Tabs Session"))
    let tabSessionNum = randomCollectionExist.length+1;
    const form = new FormData();
    form.append("title", `Tabs Session - ${tabSessionNum}`);
    const collection = await fetch(`${api}`, {
      method: "POST",
      headers: {
        // "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      },
      body: form,
    });
    const collectionData = await collection.json();
    if (collection.status >= 300 && collection.status < 500) {
      if(collectionData.message === 'Collection limit exceeded') {
        ErrorMessage = "Collection Limit (30) Exceeded, Upgrade To Create More"
      }
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
    if (res.status >= 300 && res.status < 500) {
      throw Error();
    }

  } catch (error) {
    var hasError = true;
  }
  sendMessage(
    hasError || false,
    !hasError ? "All Tabs Saved" : ErrorMessage
  );
};

// Save link
const saveLinkToRecent = async (item) => {
  const token = await chrome.storage.local.get(["token"]);
  const structuredTimeLine = await getWebsiteData(item.linkUrl);
  let rc = []
  try {
    const allCollections = await fetch(`${api}`, {
      method: "GET",
      headers: {
        // "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      }
    });
    const collections = await allCollections.json();
    const randomCollectionExist = collections.data.filter(collection => collection.title.includes("Random Collection"))

    // find a collection with space to add the link
    for (let i = 0; i < randomCollectionExist.length; i++) {
      const collection = randomCollectionExist[i];
      if(collection.timelines.length < 99) {
        rc = [collection]
        break;
      }
    }
    if (rc.length === 0) {
      rc = await createRandomCollection(randomCollectionExist.length+1, token) // create random collection 1
    }

    const res = await fetch(`${api}/${rc[0]._id}/timelines`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      },
      body: JSON.stringify(structuredTimeLine),
    });
    const data = await res.json();
    if (res.status >= 300 && res.status < 500) {
      throw Error();
    }
  } catch (error) {
    console.log(error);
    var hasError = true;
  }
  sendMessage(hasError || false, !hasError ? "Link Saved" : "Unable To Save");
};

// Message Creatort to show the toast message in the browser
const sendMessage = (hasError = false, userMessage) => {
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
          // console.log(response);
        } else {
          // if your document doesn’t have any response, it’s fine but you should actually handle
          // // it and we are doing this by carefully examining chrome.runtime.lastError
          // console.log(response);
        }
      }
    );
  });
};

// Utilty funtions
const structureTimeline = (tab) => {
  const time = new Date("14 Jun 2017 00:00:00 PDT").toUTCString();
  return {
    link: tab.url,
    title: tab.title,
    favicon: tab.favIconUrl,
    time,
  };
};

const filteredTimeline = (tab) => {
  if (
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
      tab.url
    )
  )
    return {
      tab,
    };
};

const getWebsiteData = async (url) => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  // api call to fetch favicon 
  let favicon = await getFaviconUrl(url)
  let title = "link from " + tabs[0].title
  const response = await fetch(`https://jsonlink.io/api/extract?url=${url}`);
  const data = await response.json();
  console.log("data", data)
  if(!favicon) {
    favicon = tabs[0].favIconUrl
  }
  if(data.description) {
    title = data.description
  }
  console.log("r", title, favicon)
  return {
    link: url,
    title,
    favicon,
  };
};

// TODO
async function getFaviconUrl(url) {
  const response = await fetch(`https://www.google.com/s2/favicons?domain=${url}`);
  // // const data = await response.blob();
  // const blobNew = await response.blob();
  // let URLNew = URL.createObjectURL(blobNew);
  // console.log("URLNew", URLNew, blobNew)
  return null
}


async function createRandomCollection(count, token) {
  const form = new FormData();
  form.append("title", `Random Collection - ${count}`);
  form.append("description", `This is a random collection - ${count}`);
  form.append("isPinned", true);
  const collection = await fetch(`${api}`, {
    method: "POST",
    headers: {
      // "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
    },
    body: form,
  });
  const randomCollection = await collection.json();
  let rc = [randomCollection.data]
  console.log("created",randomCollection);
  if (collection.status >= 300 && collection.status < 500) {
    throw Error();
  }
  return rc
}

