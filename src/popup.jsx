/*global chrome*/
import React, { useEffect } from "react";
import { StrictMode, userState } from "react";
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
import { Provider } from "react-redux";
import { setJwtInRequestHeader } from "./api/httpService";
import jwt_decode from "jwt-decode";
import store from "./store";
import { loginSucccess,loginStart } from "./store/userSlice";
import { getAllCollections } from "./api/collectionService";
import { getCollectionDataStart, getCollectionSuccess } from "./store/collectionsSlice";
import { dataSortByType } from "./utils/utilty";
const Popup = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  console.log(userState)
  useEffect(() => {
    chrome.storage.local.get(["token"], (res) => {
     
      if (res.token) {
        dispatch(loginStart());
        const response = jwt_decode(res.token);
        console.log(response)
        dispatch(
          loginSucccess({
            token: res.token,
            user: { userId: response.userId, username: response.username },
          })
        );
      }
    });
  }, []);

  useEffect(() => {
    async function init() {
      if (userState.token) {
        setJwtInRequestHeader(userState.token);
        //Gettgn alll the data and fixed it to the state;
        dispatch(getCollectionDataStart());
        const res = await getAllCollections();
        const sortingType = await chrome.storage.local.get(["linkcollect_sorting_type"])
        const sortedData = dataSortByType(res.data.data,sortingType.linkcollect_sorting_type)
        dispatch(getCollectionSuccess(sortedData))
      }
    }

    init();
  }, [userState.token]);

  

  if (userState.loading) {
    return "Loading..";
  }


  return (
    <>
      <Layout token={userState.token}>
        <Routes>
          <Route
            path="/"
            element={
              !userState.token ? <Splash /> : <Navigate to="/collection" />
            }
          />
          {userState.token && (
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
