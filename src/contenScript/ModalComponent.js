import React from "react";

const imageUrl = chrome.runtime.getURL("approve.png");
const failedUrl = chrome.runtime.getURL("failed.png");

const ModalComponent = () => {
  const toastWrapper = {
    display: "inline-flex",
    padding: "17px 11px 16px 11px",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    border: "1px solid #B3B3B3",
    background: "#F3F3F6"
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
    // position: "fixed",
    zIndex: "9999999999",
    backgroundColor: "#ffff",
    // top: "10px",
    // left: "14px",
    fontWeight: "500",
    // transform: "translateX(-390px)",
    transition: "all 0.3s ease-in",
  };
  return (
    <>
      <div id="toast-content-failure" style={failWrapper}>
        <img src={failedUrl} style={imageSizer} />
        <p>Unable to Save</p>
      </div>
      <div id="toast-content-success" style={toastWrapper}>
        <div
          id="content"
          style={{
            width: "250px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px"
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem"
            }}
          >
            <img src={imageUrl} style={imageSizer} />
            <p
              style={{
                color: "#6166F1",
                textAlign: "center",
                fontFamily: "Lexend, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "100%"
              }}
            >
              Saved To linkCollect
            </p>
            <div style={{height: '24px', width: '24px'}} />
          </div>
          <button
            style={{
              display: "flex",
              width: "113px",
              height: "32px",
              padding: "6px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "4px",
              background: "#6166F1"
            }}
          >
            Add Note
          </button>
        </div>
      </div>
    </>
  )
}

export default ModalComponent