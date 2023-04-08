
chrome.runtime.onMessage.addListener((request)=>{
  if(request.message === "LOGIN_SUCCESS"){
    token=localStorage.getItem("token")
    if(token){
      chrome.storage.local.set({"token":token});
    }
  }
})

console.log("Hello")

