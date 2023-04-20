
chrome.runtime.onMessage.addListener((request)=>{
  console.log("Running content script",request)
  if(request.message === "LOGIN_SUCCESS"){
    token=localStorage.getItem("token")
    if(token){
      chrome.storage.local.set({"token":token});
    }
  }
  console.log(request);
  if(request.message === "ALL_TABS_SAVED"){
    console.log("Worked")
  }
})


