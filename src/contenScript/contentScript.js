import { createRoot } from "react-dom/client";
import React from "react";

const imageUrl = chrome.runtime.getURL("approve.png");
const failedUrl = chrome.runtime.getURL("failed.png");

const ContentScript = () => {
  const toastWrapper = {
    padding: "1px 16px",
    display: "flex",
    height: "47px",
    color: "#6166F1",
    justifyContent: "center",
    gap: "11px",
    alignItems: "center",
    fontSize: "20px",
    borderRadius: "20px",
    boxShadow: "0px 2px 13px 0px rgba(43,30,43,1)",
    position: "fixed",
    zIndex: "999999999",
    backgroundColor: "#ffff",
    top: "10px",
    left: "14px",
    fontWeight: "500",
    transform: "translateX(0px)",
    transition: "all 0.3s ease-in",
  };
  const imageSizer = {
    width: "28px",
    height: "28px",
  };

  const failWrapper = {
    padding: "1px 16px",
    display: "flex",
    height: "47px",
    color: "#6166F1",
    justifyContent: "center",
    gap: "11px",
    alignItems: "center",
    fontSize: "21px",
    fontColor:"red",
    borderRadius: "20px",
    boxShadow: "0px 2px 13px 0px rgba(43,30,43,1)",
    position: "fixed",
    zIndex: "9999999999",
    backgroundColor: "#ffff",
    top: "10px",
    left: "14px",
    fontWeight: "500",
    transform: "translateX(0px)",
    transition: "all 0.3s ease-in",
  };
  return (
    <>
      <div id="toast-content-failure" style={failWrapper}>
        <img src={failedUrl} style={imageSizer} />
        <p>Unable to Saved</p>
      </div>
      <div id="toast-content-success" style={toastWrapper}>
        <img src={imageUrl} style={imageSizer} />
        <p>All Tabs Saved</p>
      </div>
    </>
  );
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Running content script", request);
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.message === "LOGIN_SUCCESS") {
    const token = localStorage.token;

    if (token) {
      chrome.storage.local.set({ token: token });
      console.log(token);
      sendResponse({resMsg:"Done!"})
    }
    return;
  }
  console.log("Alert");
  if (request.message === "ALL_TABS_SAVED") {
    console.log("Worked");
    showToast(request.hasError,request.userMessage);
    sendResponse({resMsg:"Done!"})
  }
});

const hostFile = document.createElement("div");
hostFile.id = "linkcollect-extenstion-content";
hostFile.style.color = "red";
document.body.appendChild(hostFile);

//Using Shadow root
const host = document.getElementById("linkcollect-extenstion-content");
const root = host.attachShadow({ mode: "open" });

const style = document.createElement('style');
style.innerText=`
  @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap')
  div{
    font-family: 'Lexend', sans-serif;
  }
  `
root.appendChild(style)

const div = document.createElement("div");
div.id = "toast-id";
root.appendChild(div);
const toastRoot = createRoot(div);
toastRoot.render(<ContentScript />);

const showToast = (hasError=false,msg) => {
  const toastId = document.querySelector("#linkcollect-extenstion-content");
  const shadowRoot = toastId.shadowRoot;
  const getInnerRoot = shadowRoot.getElementById("toast-id");
  const idName = hasError ? "#toast-content-failure" : "#toast-content-success"; 
  console.log(idName)
  const toastComponent = getInnerRoot.querySelector(idName);
  toastComponent.querySelector('p').innerText=msg
  toastComponent.style.transform = "translateX(0px)";
  setTimeout(() => {
    toastComponent.style.transform = "translateX(-390px)";
  }, 2000);
};

// display: flex; width: 225px; color: rgb(97, 102, 241); justify-content: center; gap: 24px; align-items: center; font-size: 16px; font-family: Lexend; border-radius: 20px; box-shadow: rgb(43, 30, 43) 0px 2px 13px 0px; position: fixed; z-index: 999999999; background-color: rgb(255, 255, 255); top: 10px; left: 14px; font-weight: 500;
