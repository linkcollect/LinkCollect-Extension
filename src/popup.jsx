/*global chrome*/
import React, { useEffect } from "react";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import Layout from "./Layout/Layout";
import Splash from "./Screens/Splash";
import Home from "./Screens/Home";
import NewCollection from "./Screens/NewCollection";
import Bookmarks from "./Screens/Bookmarks";
import EditCollection from "./Screens/EditCollection";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import reducers from "./reducers";
import { Provider } from "react-redux";
import { authStart, authSuccess } from "./actions/authActions";
import { createStore } from "redux";
import { setJwtInRequestHeader } from "./api/httpService";
import jwt_decode from "jwt-decode";

const Popup = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    chrome.storage.local.get(["token"], async (res) => {
      if (res.token) {
        dispatch(authStart());
        const response = jwt_decode(res.token);
        dispatch(
          authSuccess({
            token: res.token,
            user: { userId: response.userId, username: response.username },
          })
        );
      }
    });
  }, []);

  useEffect(() => {
    function init() {
      if (authState.token) {
        setJwtInRequestHeader(authState.token);
      }
    }

    init();
  }, [authState.token]);

  

  if (authState.loading) {
    return "Loading..";
  }

  return (
    <>
      <Layout token={authState.token}>
        <Routes>
          <Route
            path="/"
            element={
              !authState.token ? <Splash /> : <Navigate to="/collection" />
            }
          />
          {authState.token && (
            <>
              <Route path="/collection" element={<Home/>} />
              <Route path="/:collectionId" element={<Bookmarks />} />
              <Route path="/new-collection" element={<NewCollection />} />
              <Route
                path="/edit-collection/:collectionId"
                element={<EditCollection />}
              />
            </>
          )}
        </Routes>
      </Layout>
    </>
  );
};

const store = createStore(reducers);
const rootElement = document.getElementById("linkcollect-target");
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Popup />
      </HashRouter>
    </Provider>
  </StrictMode>
);
