// PROD: API URL CHANGE
const api = "https://api.linkcollect.io/api/v1/collections";

chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    // Change : Need to change the click while uploading
    // PROD Change : url https://linkcollect.io/ ==> now, when other pages upadte other url https://linkcollect.io/usernamer
    const url = new URL(activeTab?.url);
    if (url.hostname === "linkcollect.io") {
      chrome.tabs.sendMessage(
        tabId,
        {
          message: "LOGIN_SUCCESS",
        },
        (response) => {
          if (!chrome.runtime.lastError) {
            // console.log(response);
          } else {
            // console.log(response);
          }
        }
      );
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
  await acionDistaptcher(command);
});

// API Action creator based on event
const acionDistaptcher = async (item) => {
  let name = item.menuItemId || item;
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
  let rc = [];
  let errMessage = "Failed To Save";

  let bookmarkId = null;
  const token = await chrome.storage.local.get(["token"]);
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const structuredTimeLine = structureTimeline(tabs[0]);
  try {
    const allCollections = await fetch(`${api}`, {
      method: "GET",
      headers: {
        // "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      },
    });
    const collections = await allCollections.json();
    const randomCollectionExist = collections.data.filter((collection) =>
      collection.title.includes("Random Collection")
    );

    // find a collection with space to add the link
    for (let i = 0; i < randomCollectionExist.length; i++) {
      const collection = randomCollectionExist[i];
      if (collection.timelines.length < 99) {
        rc = [collection];
        break;
      }
    }

    if (rc.length === 0) {
      rc = await createRandomCollection(
        randomCollectionExist.length + 1,
        token
      ); // create random collection 1
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
    bookmarkId = data.data._id;
    if (res.status >= 300 && res.status < 500) {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log(error);
    if(error.message === "Link already exists"){
      errMessage = "Link Already Exists in " + rc[0].title;
    }
    var hasError = true;
  }
  sendMessage(hasError || false, {
    message: !hasError ? "Link Saved" : errMessage,
    bookmarkId: !hasError ? bookmarkId : null,
    collectionId: !hasError ? rc[0]._id : null,
    isOneLinkedSaved: !hasError ? true : false,
    token: !hasError ? token.token : null,
  });
};

//Save all tabs
const saveAlltabs = async () => {
  let ErrorMessage = "Failed To Save All Tabs";
  const token = await chrome.storage.local.get(["token"]);
  const tabs = await chrome.tabs.query({ currentWindow: true });
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
      },
    });
    const collections = await allCollections.json();
    const randomCollectionExist = collections.data.filter((collection) =>
      collection.title.includes("Tabs Session")
    );
    let tabSessionNum = randomCollectionExist.length + 1;
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
      throw new Error(collectionData.message);
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
    if (error.message === "Collection limit exceeded") {
      ErrorMessage = "Collection Limit (30) Exceeded, Upgrade For More";
    }
    var hasError = true;
  }
  sendMessage(hasError || false, {
    message: !hasError ? "All Tabs Saved" : ErrorMessage,
    isOneLinkedSaved: false,
  });
};

// Save link
const saveLinkToRecent = async (item) => {
  const token = await chrome.storage.local.get(["token"]);
  let errMessage = "Failed To Save";
  const structuredTimeLine = await getWebsiteData(item.linkUrl);
  let rc = [];
  let bookmarkId = null;
  try {
    const allCollections = await fetch(`${api}`, {
      method: "GET",
      headers: {
        // "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
      },
    });
    const collections = await allCollections.json();
    const randomCollectionExist = collections.data.filter((collection) =>
      collection.title.includes("Random Collection")
    );

    // find a collection with space to add the link
    for (let i = 0; i < randomCollectionExist.length; i++) {
      const collection = randomCollectionExist[i];
      if (collection.timelines.length < 99) {
        rc = [collection];
        break;
      }
    }
    if (rc.length === 0) {
      rc = await createRandomCollection(
        randomCollectionExist.length + 1,
        token
      ); // create random collection 1
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
    bookmarkId = data.data._id;
    if (res.status >= 300 && res.status < 500) {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log({ error });
    if(error.message === "Link already exists"){
      errMessage = "Link Already Exists in " + rc[0].title;
    }
    var hasError = true;
  }
  sendMessage(hasError || false, {
    message: !hasError ? "Link Saved" : errMessage,
    bookmarkId: !hasError ? bookmarkId : null,
    collectionId: !hasError ? rc[0]._id : null,
    isOneLinkedSaved: !hasError ? true : false,
    token: !hasError ? token.token : null,
  });
};

// Message Creatort to show the toast message in the browser
const sendMessage = (hasError = false, userMessage) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab?.id,
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
  let favicon = await getFaviconUrl(url);
  let title = "link from " + tabs[0]?.title;
  const response = await fetch(`https://jsonlink.io/api/extract?url=${url}`);
  const data = await response.json();
  if (!favicon) {
    favicon = getFaviconUrl(url);
  }
  if (data.description) {
    title = data.description;
  }
  return {
    link: url,
    title,
    favicon,
  };
};

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
  let rc = [randomCollection.data];
  if (collection.status >= 300 && collection.status < 500) {
    throw Error();
  }
  return rc;
}

const importBookmarks = async () => {
  const folder = [];
  const maxBookmarksLimit = 90;
  chrome.bookmarks.getTree((tree) => {
    displayBookmarks(tree[0].children);
  });
  // Recursively display the bookmarks
  async function displayBookmarks(nodes) {
    // console.log(nodes)
    for (const node of nodes) {
      // If the node is a bookmark
      // If the node has children, recursively display them
      if (node.url) {
      }
      if (node.children) {
        // console.log(node.title)
        const folderData = {
          title: node.title,
          // children: node.children,
        };
        getFolderData(node.children, node.title, maxBookmarksLimit);
        folder.push(folderData);
        displayBookmarks(node.children);
      }
    }
  }
  sendMessage(false, "All bookmarks imported");
  // console.log(folder)
};

// importBookmarks();
async function getFolderData(folder, title, maxBookmarksLimit) {
  let tempArray = [];
  // console.log(folder)
  // console.log(title)
  for (const node of folder) {
    // console.log(node)
    if (!node.children) {
      const time = new Date("14 Jun 2017 00:00:00 PDT").toUTCString();
      try {
        const faviconDataUrl = await getFaviconUrl(node.url);
        const bookmark = {
          link: node.url,
          title: node.title || getMainSiteName(node.url),
          favicon: faviconDataUrl,
          time,
        };
        tempArray.push(bookmark);
      } catch (err) {
        if (err.code === "404") {
          const bookmark = {
            link: node.url,
            title: node.title || getMainSiteName(node.url),
            favicon: "https://linkcollect.io/logo_192_x_192.png", // Default URL
            time,
          };
          tempArray.push(bookmark);
        } else {
          throw err; // Re-throw the error if it's not a 404
        }
      }
    }
    function getMainSiteName(url) {
      try {
        const urlObject = new URL(url);
        return urlObject.hostname;
      } catch (error) {
        console.error(`Error extracting main site name from ${url}: ${error}`);
        return null;
      }
    }
  
    async function blobToDataUrl(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  }
  // console.log(tempArray, title)
  apirequest(tempArray.reverse(), title, maxBookmarksLimit);
}

async function getFaviconUrl(url) {
  const favIconBaseURL =
    "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=";
  const origin = new URL(url).origin;
  return `${favIconBaseURL}${origin}`;
}
// api call to save bookmarks
async function apirequest(bookmarks, title, maxBookmarksLimit) {
  const token = await chrome.storage.local.get(["token"]);
  try {
    let bookmarkLength = bookmarks.length;
    if (bookmarkLength < maxBookmarksLimit && bookmarkLength > 0) {
      //1. Need to create new collection
      const form = new FormData();
      form.append("title", `${title}`);
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
        throw Error();
      }
      // 2. Now to add all bookmarks
      const res = await fetch(
        `${api}/${collectionData.data._id}/timelines/create-multiple`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
          },
          body: JSON.stringify(bookmarks.slice(0, maxBookmarksLimit)),
        }
      );
      const data = await res.json();
      if (res.status >= 300 && res.status < 500) {
        throw Error();
      }
    } else if (bookmarkLength > maxBookmarksLimit) {
      let start = 0;
      let end = maxBookmarksLimit;
      // i want to add 30 bookmarks at a time
      while (bookmarkLength > 0) {
        //1. Need to create new collection
        const form = new FormData();
        form.append("title", ` Bookmarks ${title} ${start} - ${end}`);
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
          throw Error();
        }
        // 2. Now to add all bookmarks
        const res = await fetch(
          `${api}/${collectionData.data._id}/timelines/create-multiple`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token.token}`, // notice the Bearer before your token
            },
            body: JSON.stringify(bookmarks.slice(start, end)),
          }
        );
        const data = await res.json();
        if (res.status >= 300 && res.status < 500) {
          throw Error();
        }
        bookmarkLength = bookmarkLength - maxBookmarksLimit;
        start = start + maxBookmarksLimit;
        end = end + maxBookmarksLimit;
      }
    }
  } catch (err) {
    console.log(err);
  }
}

export { importBookmarks };
