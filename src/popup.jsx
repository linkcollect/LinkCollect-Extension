import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css"
const Popup = ()=>{
    return <div className="text-5xl">LinkCollect</div>
}

const rootElement = document.getElementById("linkcollect-target");
const root = createRoot(rootElement);


root.render(
    <StrictMode>
      <Popup />
    </StrictMode>
  );
  