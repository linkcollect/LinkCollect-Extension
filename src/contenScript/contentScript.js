import { createRoot } from "react-dom/client";
import React from "react";

const imageUrl = chrome.runtime.getURL("approve.png");
const failedUrl = chrome.runtime.getURL("failed.png");

const ContentScript = () => {
  const toastWrapper = {
    padding: "1px 16px",
    display: "flex",
    height: "272px",
    width: "113px",
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
    transform: "translateX(-390px)",
    transition: "all 0.3s ease-in",
  };
  const imageSizer = {
    width: "24px",
    height: "24px",
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
    transform: "translateX(-390px)",
    transition: "all 0.3s ease-in",
  };
  return (
    <>
      <div id="toast-content-failure" style={failWrapper}>
        <img src={failedUrl} style={imageSizer} />
        <p>Unable to Save</p>
      </div>
      <div
        id="toast-content-success"
        style={{
          margin: 0,
          display: "flex",
          padding: "17px 11px 16px 11px",
          justifyContent: "center",
          alignItems: "center",
          width: 250,
          height: 80,
          color: "#6166f1",
          fontSize: 20,
          borderRadius: 8,
          boxShadow: "0px 2px 13px 0px rgba(43, 30, 43, 1)",
          position: "fixed",
          zIndex: 999999999,
          backgroundColor: "#ffff",
          top: 10,
          left: 14,
          fontWeight: 500,
          transform: "translateX(-390px)",
          transition: "all 0.3s ease-in"
        }}
      >
        <div
          className="content"
          style={{
            margin: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            gap: 24,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div
            className="message"
            style={{
              margin: 0,
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              justifyContent: "space-between"
            }}
          >
            <img
              src={imageUrl}
              style={{ margin: 0, width: 24, height: 24 }}
            />
            <p className="" style={{ margin: 0 }}>
              Saved To linkCollect
            </p>
            <div style={{ margin: 0, height: '24px', width: '24px' }} />
          </div>
          <button
            className="cta"
            style={{
              margin: 0,
              display: "flex",
              width: "100%",
              minHeight: 32,
              padding: 6,
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              borderRadius: 4,
              background: "#6166F1",
              border: "none"
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#F9F9FB",
                fontSize: 16,
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "100%"
              }}
            >
              Add note
            </p>
          </button>
        </div>
      </div>
    </>
  );
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "LOGIN_SUCCESS") {
    const token = localStorage.token;

    if (token) {
      chrome.storage.local.set({ token: token });
      sendResponse({resMsg:"Done!"})
    }
    return;
  }
  if (request.message === "ALL_TABS_SAVED") {
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
  const toastComponent = getInnerRoot.querySelector(idName);
  toastComponent.querySelector('p').innerText=msg
  toastComponent.style.transform = "translateX(0px)";
  setTimeout(() => {
    toastComponent.style.transform = "translateX(-690px)";
  }, 2900);
};

// display: flex; width: 225px; color: rgb(97, 102, 241); justify-content: center; gap: 24px; align-items: center; font-size: 16px; font-family: Lexend; border-radius: 20px; box-shadow: rgb(43, 30, 43) 0px 2px 13px 0px; position: fixed; z-index: 999999999; background-color: rgb(255, 255, 255); top: 10px; left: 14px; font-weight: 500;
