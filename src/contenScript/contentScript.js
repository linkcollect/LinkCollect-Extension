import { createRoot } from "react-dom/client";
import React, { useRef, useState } from "react";

const imageUrl = chrome.runtime.getURL("approve.png");
const failedUrl = chrome.runtime.getURL("failed.png");

// Global varibale for configurations
let token = null;
let collectionId = null;
let bookmarkId = null;
let timerId = null; // if the user click on the addClick then current timer id should be removed

const ContentScript = () => {
  const [showNote, setShowNote] = useState(false);
  const successRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState("");
  // Global class
  const toastWrapperClass = {
    padding: "12px 16px",
    borderRadius: "20px",
    boxShadow: "0px 2px 13px 0px rgba(43,30,43,1)",
    position: "fixed",
    zIndex: "999999999",
    backgroundColor: "#ffff",
    top: "10px",
    left: "14px",
    width: "250px",
    transform: "translateX(-390px)",
    transition: "all 0.3s ease-in",
  };

  const imageSizer = {
    width: "28px",
    height: "28px",
  };

  // Classes specificc to toast : success
  const successToastHeader = {
    display: "flex",
    height: "47px",
    color: "#6166F1",
    justifyContent: "center",
    gap: "11px",
    alignItems: "center",
    fontWeight: "500",
    fontSize: "20px",
  };

  const actionContainer = {
    width: "full",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    transition: "all 0.02s ease-in",
  };
  const actionButtonWrapper = {
    width:"full",
    display:"flex",
    gap:"5px"
  }
  const addNoteButton = {
    width: "100%",
    height: "32px",
    padding: "6px",
    backgroundColor: "#6166F1",
    color: "#F9F9FB",
    textAlign: "center",
    borderRadius: "4px",
    border: "none",
    outline: "none",
    cursor:"pointer"
  };
  const cancelButton = {
    width: "100%",
    height: "32px",
    padding: "6px",
    backgroundColor: "#F3F3F6",
    color: "#0A0A0A",
    textAlign: "center",
    borderRadius: "4px",
    border: "1px solid #6166F1",
    outline: "none",
    cursor:"pointer"
  };

  const textArea = {
    width: "full",
    padding: "16px 12px",
    height: "72px",
    resize: "none",
    borderRadius: "8px",
    border: "2px solid #ADAEFF",
    backgroundColor: "white",
  };

  const toastWrapperAllTabs = {
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
    transform: "translateX(-390px)",
    transition: "all 0.3s ease-in",
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
    fontColor: "red",
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

  const toggleShowNote = () => {
    if (!showNote) {
      console.log(collectionId);
      console.log(bookmarkId);
      setShowNote(true);
      clearTimeout(timerId);
    } else {
      setShowNote(false);
      setIsLoading(false);
      collectionId = null;
      bookmarkId = null;
      token=null;
      successRef.current.style.transform = "translateX(-390px)";
    }
  };
  const addButtonClickHandler = async () => {
    // Opening the note input on fisrt click
    if (!showNote) {
      toggleShowNote();
      return;
    }
    if (note === "") {
      return;
    }
    // if add note clicked and text area is open and there is something then we can save the note
    try {
      setIsLoading(true);
      const timeline = { note: note };
      console.log(collectionId, bookmarkId);
      const res = await fetch(
        `https://api.linkcollect.io/api/v1/collections/${collectionId}/timelines/${bookmarkId}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`, // notice the Bearer before your token
          },
          body: JSON.stringify(timeline),
        }
      );
      console.log(res);
      toggleShowNote();
    } catch (error) {
      console.log(error);
      toggleShowNote();
    }
  };
  return (
    <>
      {/* Toast for failer message */}
      <div id="toast-content-failure" style={failWrapper}>
        <img src={failedUrl} style={imageSizer} />
        <p className="msg">Unable to Save</p>
      </div>
      {/* For now just get the objective done later need to use new way to implement content script for scalibilty  */}
      {/* Saved for the Single link */}
      <div id="toast-content-success-all-tabs" style={toastWrapperAllTabs}>
        <img src={imageUrl} style={imageSizer} />
        <p className="msg">Link Saved</p>
      </div>
      {/* Toast Modal for the single link saved for now */}
      <div
        id="toast-content-success"
        style={toastWrapperClass}
        ref={successRef}
      >
        <div style={successToastHeader}>
          <img src={imageUrl} style={imageSizer} />
          <p className="msg">Link Saved</p>
        </div>

        {/* Adding note feature on popup will only availbe when single link is saved for a particular link */}
        <div style={actionContainer}>
          {showNote && (
            <textarea
              style={textArea}
              onChange={(e) => setNote(e.target.value)}
            />
          )}
          <div style={actionButtonWrapper}>
          {showNote && <button style={cancelButton} disabled={isLoading} onClick={toggleShowNote}>Cancel</button>}
          <button
            onClick={addButtonClickHandler}
            style={addNoteButton}
            disabled={isLoading}
          >
            {!isLoading ? "Add Note" : "Adding..."}
          </button>
          </div>
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
      sendResponse({ resMsg: "Done!" });
    }
    return;
  }
  if (request.message === "ALL_TABS_SAVED") {
    showToast(request.hasError, request.userMessage);
    sendResponse({ resMsg: "Done!" });
  }
});

const hostFile = document.createElement("div");
hostFile.id = "linkcollect-extenstion-content";
hostFile.style.color = "red";
document.body.appendChild(hostFile);

//Using Shadow root
const host = document.getElementById("linkcollect-extenstion-content");
const root = host.attachShadow({ mode: "open" });

const style = document.createElement("style");
style.innerText = `
  @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap')
  div{
    font-family: 'Lexend', sans-serif;
  }
  `;
root.appendChild(style);

const div = document.createElement("div");
div.id = "toast-id";
root.appendChild(div);
const toastRoot = createRoot(div);
toastRoot.render(<ContentScript />);

const showToast = (hasError = false, userMessage) => {
  const toastId = document.querySelector("#linkcollect-extenstion-content");
  const shadowRoot = toastId.shadowRoot;
  const getInnerRoot = shadowRoot.getElementById("toast-id");
  const idName = hasError
    ? "#toast-content-failure"
    : userMessage.isOneLinkedSaved
    ? "#toast-content-success"
    : "#toast-content-success-all-tabs";
  const toastComponent = getInnerRoot.querySelector(idName);
  toastComponent.querySelector(".msg").innerText = userMessage.message;
  if (userMessage.isOneLinkedSaved) {
    collectionId = userMessage.collectionId;
    bookmarkId = userMessage.bookmarkId;
    token = userMessage.token;
  }
  toastComponent.style.transform = "translateX(0px)";
  let timeToBeShown = userMessage.isOneLinkedSaved ? 5000 : 2900
  timerId = setTimeout(() => {
    collectionId = null;
    bookmarkId = null;
    token = null;
    toastComponent.style.transform = "translateX(-690px)";
  }, timeToBeShown);
};

// display: flex; width: 225px; color: rgb(97, 102, 241); justify-content: center; gap: 24px; align-items: center; font-size: 16px; font-family: Lexend; border-radius: 20px; box-shadow: rgb(43, 30, 43) 0px 2px 13px 0px; position: fixed; z-index: 999999999; background-color: rgb(255, 255, 255); top: 10px; left: 14px; font-weight: 500;
