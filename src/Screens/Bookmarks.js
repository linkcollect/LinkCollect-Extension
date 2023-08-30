import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BackArrow from "../assets/Icons/arrow.svg";
import logo from "../assets/Logo.svg";
import dots from "../assets/Icons/3dot-menu.svg";
import AddIcon from "../assets/Icons/add.svg";
import approveIconWhite from '../assets/Icons/approve-white.svg'

import BookmarkItem from "../Components/BookmarkItem/BookmarkItem";
import PopupMenu from "../Components/Menu/PopupMenu";
import NoResult from "../Components/NoResult/NoResult";
import Loader from "../Components/Loader/Loader";
import { ToolTip2 } from "../Components/Tooltip/Tooltip";
import PopupModal from "../Components/PopupModal/PopupModal";

import { deleteCollection} from "../api/collectionService";
import { deleteTimeline, togglePin } from "../api/timelineService";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "../Components/Loader/PageLoader";
import { dataSortByType, nameShortner } from "../utils/utilty";
import { deleteBookmark, pinTimelineToggle, removeCollection } from "../store/collectionsSlice";

import { motion, AnimatePresence } from "framer-motion";
import { useAddBookmarks } from "../hooks/useAddBookmark";
import { getCurrentTab } from "../utils/chromeAPI";
const Bookmarks = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { isAdding, addBookmarkHook } = useAddBookmarks();
  const navigation = useNavigate();
  const { collectionId } = useParams();
  const collection = useSelector(state=>state.collection.data.filter(collection=>collection._id===collectionId)[0]);
  const [isLoading, setIsLoading] = useState(false);
  const popupref = useRef();
  const menuRef= useRef();
  const auth = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const sortedData = useMemo(()=>{
    if (isLoading) {
        return [];
    }
    return dataSortByType([...collection.timelines],"RECENTLY_UPDATE")
    
  },[collection])

  // Delete Bookmark
  const deleteBookmarkHandler = async (timeLineId) => {
    try {
      console.log(timeLineId)
       // collection data update
      dispatch(deleteBookmark({collectionId,timeLineId}))

      //DB delete
      await deleteTimeline(collection._id, timeLineId);
      
      // state update
    } catch (error) {
      // console.log(error);
    }
  };

  // error message state
  const [linkLimitError, setLinkLimitError] = useState(false);
  function showLinkLimitError() {setLinkLimitError(true)}
  function closeLinkLimitError() {setLinkLimitError(false)}

  const handleLinkLimitError = () => {
    linkLimitError ? closeLinkLimitError() : showLinkLimitError();
  }

  // Check tab match with current tab and show Icon
  const [tabExists, setTabExists] = useState(false)
  const checkTabExist = async () => {
      const currentTab = await getCurrentTab();
      const isTab = await collection?.timelines.some(timeline => timeline.link === currentTab.url);
      setTabExists(isTab);
  }
  checkTabExist()
  //Add bookmark
  const addBookMarkHandler = async () => {
    if (!tabExists) { 
      if (auth.user.isPremium || collection.timelines.length < 100) {
        addBookmarkHook(collectionId)
      } else {
        handleLinkLimitError();
      }
    }
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
      dispatch(removeCollection({collectionId}))
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
  useEffect(() => {
    document.addEventListener("click",e=>{
      if(e.target !== popupref.current && e.target !== menuRef.current){
        setShowMenu(false);
      }
    })
    return () => {
      document.removeEventListener("click", (e) => {console.log("Remove event listener");})
    }
  }, [])
    

  return (
    <motion.div
      initial={{ y: '100vh' }}
      animate={{ y: 0 }}
      exit={{ y: '100vh' }}
      transition={{ duration: 0.2, ease: [0.19, 0.46, 0.74, 0.9] }}
      className='h-full'
    >
    <AnimatePresence mode="wait">
    {linkLimitError && 
        <PopupModal
        title="Cannot Create more Links"
        content="Free Plan allows max of 30 collections and 3000 links. Please upgrade to premium to create more"
        buttonText="Upgrade"
        modalOpen={linkLimitError}
        onCloseHandler={closeLinkLimitError}
        />
        }
        </AnimatePresence>
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
            {sortedData.map((timeline) => (
              <BookmarkItem
                key={timeline._id}
                id={timeline._id}
                name={timeline.title}
                url={timeline.link}
                collectionId={collectionId}
                favicon={timeline.favicon}
                onDelete={deleteBookmarkHandler}
                isPinned={timeline.isPinned}
              />
            ))}
          </div>

          {/* Add bookmark */}
          <div className="flex justify-center border-t-2 border-t-secodaryLight p-3">
            <ToolTip2 name={tabExists ? "Current Tab is already Bookmarked" : "Bookmark the current tab in one click"} top="full" right="-100px">
              <button
                className="bg-primary rounded-full py-2 px-[8px] flex justify-center items-center"
                onClick={addBookMarkHandler}
              >
                {!isAdding ? (
                  <img src={tabExists ? approveIconWhite : AddIcon} className="w-[23px]" />
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
    </motion.div>
  );
};

export default Bookmarks;
