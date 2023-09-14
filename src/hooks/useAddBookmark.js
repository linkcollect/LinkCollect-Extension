import { useState } from "react";
// Utility
import { addBookmark } from "../store/collectionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentTab, sendMessage } from "../utils/chromeAPI";
import { createTimeline } from "../api/timelineService";

export const useAddBookmarks = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let bookmarkId = null;
  const addBookmarkHook = async (collectionId) => {
    setIsAdding(true);
    try {
      const time = new Date("14 Jun 2017 00:00:00 PDT").toUTCString();
      const getTab = await getCurrentTab();
      const timeline = {
        link: getTab.url,
        title: getTab.title,
        favicon: getTab.favIconUrl,
        time,
      };
      // DB Add
      const res = await createTimeline(collectionId, timeline);
      bookmarkId=res.data.data._id
      // Instant state update
      dispatch(addBookmark({ collectionId, bookmark: res.data.data }));
    } catch (error) {
      console.log(error);
      setHasError(true);
    }
    setIsAdding(false);
    console.log(collectionId, bookmarkId);
    sendMessage(hasError || false, {
      message: !hasError ? "Link Saved" : "Unable To Save",
      bookmarkId: !hasError ? bookmarkId : null,
      collectionId: !hasError ? collectionId : null,
      isOneLinkedSaved: !hasError ? true : false,
      token: !hasError ? token : token,
    });
  };

  return { isAdding, addBookmarkHook };
};
