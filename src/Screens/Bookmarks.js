import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import BackArrow from "../assets/Icons/arrow.svg";
import logo from "../assets/Logo.svg";
import dots from "../assets/Icons/3dot-menu.svg";
import AddIcon from "../assets/Icons/add.svg";

import BookmarkItem from "../Components/BookmarkItem/BookmarkItem";
import PopupMenu from "../Components/Menu/PopupMenu";
import NoResult from "../Components/NoResult/NoResult";
import Loader from "../Components/Loader/Loader";
import Tooltip from "../Components/Tooltip/Tooltip";

import { getCurrentTab } from "../utils/chromeAPI";

import { getCollection, togglePrivacy } from "../api/collectionService";
import { deleteTimeline, createTimeline } from "../api/timelineService";
import { useSelector } from "react-redux";

const Bookmarks = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigate();
  const { collectionId } = useParams();
  const [collection, setCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const auth = useSelector((state) => state.auth.userId);

  useEffect(() => {
    setIsLoading(true);
    console.log(isLoading);
    try {
      async function gettingCollection() {
        const { data } = await getCollection(collectionId);
        console.log(data);
        setCollection(data.data);
        setIsLoading(false);
      }
      gettingCollection();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, []);

  // Delete Bookmark
  const deleleteBookmark = async (timeLineId) => {
    try {
      //DB delete
      await deleteTimeline(collection._id, timeLineId);
      // state update
      const tempCollection = { ...collection };
      tempCollection.timelines = tempCollection.timelines.filter(
        (timeline) => timeline._id !== timeLineId
      );
      setCollection(tempCollection);
    } catch (error) {
      console.log(error);
    }
  };

  //Add bookmark
  const addBookMarkHandler = async () => {
    setIsAdding(true);
    try {
      const time = new Date("14 Jun 2017 00:00:00 PDT").toUTCString();
      const getTab = await getCurrentTab();
      console.log(getTab);
      const timeline = { link: getTab.url, note: getTab.title, time };
      // DB Add
      const { data } = await createTimeline(collection._id, timeline);

      // Instant state update
      const tempCollection = collection;
      tempCollection.timelines.push(data.data);
      console.log(tempCollection);
      setCollection(tempCollection);
    } catch (error) {
      // Need to provide a error message
      console.log(error);
    }
    setIsAdding(false);
  };

  // Collection copy
  const collectionCopyHandler = () => {
    navigator.clipboard.writeText(
      `http://localhost:3000/collections/${collectionId}`
    );
  };

  // COllection privacy update
  const prvaciyTogglerHandler = async () => {
    // UI update
    const tempCollection ={...collection};
    tempCollection.isPublic = !tempCollection.isPublic;
    setCollection(tempCollection);
    //DB update
    const { data } = await togglePrivacy(collectionId);
    console.log(data);

  };

  const backScreenHandler = (e) => {
    e.preventDefault();
    navigation(-1);
  };
console.log("render")
  return (
    <>
      {/* Back button container */}
      <div className="pt-4 pl-6 bg-bgPrimary border-b border-bgGrey px-4 pb-4 drop-shadow-md">
        <button
          onClick={backScreenHandler}
          className="cursor-pointer flex items-center gap-3 [&>img]:rotate-[90deg] [&>img]:w-[22px]"
        >
          <img src={BackArrow} />{" "}
          <p className="text-textPrimary font-medium text-[22px]">
            All Collections
          </p>
        </button>
      </div>
      {isLoading ? (
        <div className="flex w-full h-[70vh] justify-center items-center">
          <Loader />
        </div>
      ) : collection.timelines && collection.timelines.length > 0 ? (
        <div className="h-[88%]">
          {/* Collection Heading */}
          <div className="bg-primary p-2 flex justify-between items-center pr-4 my-3 mx-3 rounded-md">
            <div className="flex">
              <div className="flex flex-col justify-center ml-3 ">
                <p className="text-[14px] font-medium text-bgPrimary">
                  {collection.title}
                </p>
                <p className="text-bgPrimary text-xs">
                  {collection.timelines.length} Bookmarks
                </p>
              </div>
            </div>
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => setShowMenu((preState) => !preState)}
              >
                <img src={dots} />
              </div>
              <div className="absolute text-[#ffff] top-[30px] left-[-170px] z-[999999]">
                {showMenu && (
                  <PopupMenu
                    onCopyCollection={collectionCopyHandler}
                    onPrivacyToggle={prvaciyTogglerHandler}
                    isPublic={collection.isPublic}
                    collectionLink={`http://localhost:3000/collections/${collectionId}`}

                  />
                )}
              </div>
            </div>
          </div>

          {/* Collection list */}
          <div className="h-[60%] w-full px-3 overflow-y-auto">
            {collection.timelines.map((timeline) => (
              <BookmarkItem
                key={timeline._id}
                id={timeline._id}
                name={timeline.note}
                url={timeline.link}
                onDelete={deleleteBookmark}
              />
            ))}
          </div>

          {/* Add bookmark */}
          <div className="flex justify-center border-t-2 border-t-secodaryLight p-3">
            <Tooltip name="Add bookmark">
              <button
                className="bg-primary rounded-full py-2 px-[8px] flex justify-center items-center"
                onClick={addBookMarkHandler}
              >
                {!isAdding ? (
                  <img src={AddIcon} className="w-[23px]" />
                ) : (
                  <Loader />
                )}
              </button>
            </Tooltip>
          </div>
        </div>
      ) : (
        <NoResult title="Add bookmarks" noResultName="bookmarks" />
      )}
    </>
  );
};

export default Bookmarks;
