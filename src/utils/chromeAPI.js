export const getCurrentTab = async () =>{
    let tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    return tabs[0];
}
export const getLocalData = async (key1,...rest) =>{
    const values = await chrome.storage.local.get([key1])
    return values;
}
export const upadteLatestCollection =async (id,collectionName) =>{
   await chrome.storage.local.set({collection:{id:id,collectionName:collectionName}})
}

export const sendMessage = (hasError = false, userMessage) => {
    console.log("Hello");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log(tabs)
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