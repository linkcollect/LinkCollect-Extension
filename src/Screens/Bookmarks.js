import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import BackArrow from "../assets/Icons/arrow.svg";
import logo from "../assets/Logo.svg";
import dots from "../assets/Icons/3dot-menu.svg";
import AddIcon from "../assets/Icons/add.svg";

import BookmarkItem from "../Components/BookmarkItem/BookmarkItem";
import PopupMenu from "../Components/Menu/PopupMenu";
import NoResult from "../Components/NoResult/NoResult";
import Loader from "../Components/Loader/Loader";
import { ToolTip2 } from "../Components/Tooltip/Tooltip";

import { getCurrentTab, sendMessage } from "../utils/chromeAPI";

import { deleteCollection, getCollection } from "../api/collectionService";
import { deleteTimeline, createTimeline } from "../api/timelineService";
import { useSelector } from "react-redux";
import PageLoader from "../Components/Loader/PageLoader";
import { nameShortner } from "../utils/utilty";

const Bookmarks = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigate();
  const { collectionId } = useParams();
  const [collection, setCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const popupref = useRef();
  const menuRef= useRef();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    setIsLoading(true);
    try {
      async function gettingCollection() {
        const { data } = await getCollection(collectionId);
        setCollection(data.data);
        setIsLoading(false);
      }
      gettingCollection();
    } catch (error) {
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
      // console.log(error);
    }
  };

  //Add bookmark
  const addBookMarkHandler = async () => {
    setIsAdding(true);
    try {
      const time = new Date("14 Jun 2017 00:00:00 PDT").toUTCString();
      const getTab = await getCurrentTab();
      const timeline = { link: getTab.url, title: getTab.title,favicon:getTab.favIconUrl, time };
      // DB Add
      const  res  = await createTimeline(collection._id, timeline);
      console.log(res);
      // Instant state update
      const tempCollection = collection;
      tempCollection.timelines.push(res.data.data);
      setCollection(tempCollection);
      // setIsAdding(false);
    } catch (error) {
      // Need to provide a error message
      console.log(error);
      var hasError=true;
      // setIsAdding(false);
    }
    setIsAdding(false);
    sendMessage(
      hasError || false,
      !hasError ? "Link Saved" : "Unable To Save"
    );
  };

  // Collection copy
  const collectionCopyHandler = () => {
    navigator.clipboard.writeText(
      `http://linkcollect.io/${auth.user.username}/c/${collectionId}`
    );
  };

  // Delete collection
  const collectionDeleter = async () =>{
    setShowMenu(false);
    setIsLoading(true);
    try{
      await deleteCollection(collectionId);
      setIsLoading(false)
      navigation("/collection")
    }catch(error){
      setIsLoading(false);
    }
  }

  // opening all tabs at one go
  const openAllLinks = ()=>  {
    var linksToOpen = collection.timelines.map(tl=>tl.link);
    chrome.windows.create({url: linksToOpen}, function(window) {});
  }

  const backScreenHandler = (e) => {
    e.preventDefault();
    navigation(-1);
  };

  // Need to think more bettor solution
  // Popup menu close functiinality if users clocked outside of it
    window.addEventListener("click",e=>{
      if(e.target !== popupref.current && e.target !== menuRef.current){
        setShowMenu(false);
      }
    })

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
          {!isLoading && <div className="bg-primary p-2 flex justify-between items-center pr-4 my-3 mx-3 rounded-md">
            <div className="flex">
              <div className="flex flex-col justify-center ml-3 ">
                <p className="text-[14px] font-medium text-bgPrimary">
                  {collection.title && nameShortner(collection.title,30)}
                </p>
                <p className="text-bgPrimary text-xs">
                  {collection.timelines?.length || 0} Bookmarks
                </p>
              </div>
            </div>
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => setShowMenu((preState) => !preState)}
              >
                <img src={dots} ref={menuRef}/>
              </div>
              <div className="absolute text-[#ffff] top-[30px] left-[-170px] z-[999999]">
                {showMenu && (
                  <PopupMenu
                    ref={popupref}
                    onCopyCollection={collectionCopyHandler}
                    collectionLink={`http://linkcollect.io/${auth.user.username}/c/${collectionId}`}
                    collectionId={collectionId}
                    title={collection.title}
                    privacy={collection.isPublic}
                    onDelete={collectionDeleter}
                    onOpenAllLink={openAllLinks}
                  />
                )}
              </div>
            </div>
      </div>}
      {isLoading ? (
        <div className="flex w-full h-[70vh] justify-center items-center">
          <PageLoader/>
        </div>
      ) : collection.timelines && collection.timelines.length > 0 ? (
        <div className="h-[88%]">
          {/* Collection Heading */}
          

          {/* Collection list */}
          <div className="h-[60%] w-full px-3 overflow-y-auto">
            {collection.timelines.map((timeline) => (
              <BookmarkItem
                key={timeline._id}
                id={timeline._id}
                name={timeline.title}
                url={timeline.link}
                favicon={timeline.favicon}
                onDelete={deleleteBookmark}
              />
            ))}
          </div>

          {/* Add bookmark */}
          <div className="flex justify-center border-t-2 border-t-secodaryLight p-3">
            <ToolTip2 name="Bookmark the current tab in one click" top="full" right="-100px">
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
            </ToolTip2>
          </div>
        </div>
      ) : (
        <NoResult title="Add bookmarks" noResultName="bookmarks" onClickHandler={addBookMarkHandler} bookMark={true} loading={isAdding}/>
      )}
    </>
  );
};

export default Bookmarks;
