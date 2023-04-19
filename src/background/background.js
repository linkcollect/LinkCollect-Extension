chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab=tabs[0];
    if(activeTab?.url==="http://localhost:3000/"){
      chrome.tabs.sendMessage(tabId,{
        message:"LOGIN_SUCCESS"
      })
    }
})})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStatus"){
      sendResponse({status: localStorage['token']});
    }
    else
      sendResponse({}); // snub them.
});