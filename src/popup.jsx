import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import Splash from "./Screens/Splash";
import Layout from "./Layout/Layout";
import Login from "./Screens/Login";
import Home from "./Screens/Home";
const Popup = () => {
  return (
    <>
      <Layout>
        
        {/* <Splash /> */}
        {/* <Login/> */}
        <Home/>
      </Layout>
    </>
  );
};

const rootElement = document.getElementById("linkcollect-target");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Popup />
  </StrictMode>
);
