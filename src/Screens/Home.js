import React, { Fragment, useMemo, useRef, useState } from "react";
import addIcon from "../assets/Icons/add-tab.svg";
import CollectionItem from "../Components/CollectiionItem/CollectionItem";
import SearchBox from "../Components/SearchBox/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NoResult from "../Components/NoResult/NoResult";
import PageLoader from "../Components/Loader/PageLoader";
// import { getAllByUsername } from "../api/collectionService";
// import { getUser } from "../api/userService";
import {  togglePin } from "../api/collectionService";
import { useEffect } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { useAddBookmarks } from "../hooks/useAddBookmark";
// import {
//   getCurrentTab,
//   sendMessage,
//   upadteLatestCollection,
// } from "../utils/chromeAPI";
import { createTimeline, deleteTimeline } from "../api/timelineService";
import BookmarkItem from "../Components/BookmarkItem/BookmarkItem";
import filterName from "../assets/Icons/filter--menu.svg";
import {
  addBookmark,
  sortCollection,
  deleteBookmark,
  pinCollectionToggle,
} from "../store/collectionsSlice";
import PopupModal from "../Components/PopupModal/PopupModal";
import { calculateWeight } from "../utils/utilty";

const Home = () => {
  // gloabl collections
  const collection = useSelector((state) => state.collection);

  //Query Params state
  const [query, setQuery] = useState("");

  //filtermenu ref to open and close it
  const filterMenu = useRef();
  const menuRef = useRef();
  const [isMenu, setIsMenu] = useState(false);

  // error message state
  const [collectionLimitError, setCollectionLimitError] = useState(false);
  function showCollectionLimitError() {setCollectionLimitError(true)}
  function closeCollectionLimitError() {setCollectionLimitError(false)}

  const auth = useSelector((state) => state.user);

  //Distapcher
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { isAdding, addBookmarkHook } = useAddBookmarks()
  //Filtered Collections
  const filteredData = useMemo(() => {
    return collection.data?.filter((collection) => 
      collection.title.toLowerCase().includes(query.toLowerCase()) || collection.description?.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, collection.data]);
  
  // filteredbookmarks
  const filteredBookmarks = useMemo(() => {
    console.log(collection.data);
    if (query.length === 0) return collection.data || [];
  
    const sortedCollections = collection.data?.map((collection) => {
      const bookmarks = collection.timelines
        .filter((timeline) =>
          timeline.title.toLowerCase().includes(query.toLowerCase()) ||
          timeline.link.toLowerCase().includes(query.toLowerCase()) ||
          timeline.note?.toLowerCase().includes(query.toLowerCase())
        )
        .map((timeline) => ({
          ...timeline,
          weight: calculateWeight(timeline, query),
        })).sort((a, b) => b.weight - a.weight);
  
      return bookmarks.length > 0
        ? {
            collectionTitle: collection.title,
            collectionId: collection._id,
            timelines: bookmarks,
          }
        : null;
    });
  
    console.log(sortedCollections);
    return sortedCollections.filter(Boolean).sort((a, b) => b.timelines[0].weight - a.timelines[0].weight);
  }, [query, collection.data]);

  // this is to REDIRECT TO create new collection
  const createCollectionRedicector = () => {
    if (auth.user.isPremium || collection.data.length < 30) navigate("/new-collection");
    // WARNING: Max collection length for non-premium user is hardcoded
    else (handleCollectionLimitError())
  };

  const handleCollectionLimitError = () => {
    // TODO: Create a popup to show a specific error message on call which returns a React Modal Component based on the value of isPremium state
    collectionLimitError ? closeCollectionLimitError() : showCollectionLimitError();
  }

  const handleCopy = (collectionId) => {
    navigator.clipboard.writeText(
      `http://linkcollect.io/${auth.user.username}/c/${collectionId}`
    );
  };


    // error message state
    const [linkLimitError, setLinkLimitError] = useState(false);
    function showLinkLimitError() {setLinkLimitError(true)}
    function closeLinkLimitError() {setLinkLimitError(false)}
  
    const handleLinkLimitError = () => {
      linkLimitError ? closeLinkLimitError() : showLinkLimitError();
    }
    
    // // Bookmark add handler
    const addHandler = async (collectionId) => {
      const currentCollection = collection.data.find(e => {
          return e._id === collectionId;
      })
    if (auth.user.isPremium || currentCollection.timelines.length < 100) {
        addBookmarkHook(collectionId)
    } else {
        handleLinkLimitError();
        console.log("error popup");
    } }


  // Pin Collection handler
  const handlePin = async (collectionId) => {
    dispatch(pinCollectionToggle({ collectionId }))
    try {
      const res = await togglePin(collectionId);
      const sortingType = await chrome.storage.local.get("linkcollect_sorting_type")
      console.log(sortingType);
      dispatch(sortCollection(sortingType.linkcollect_sorting_type))
    } catch (error) {
        console.error(error)
    }
  }
  // Bookmark delete handler
  const deleteBookmarkHandler = async (timeLineId, collectionId) => {
    // collection data update
    dispatch(deleteBookmark({ collectionId, timeLineId }));

    // DB Update
    await deleteTimeline(collectionId, timeLineId);
  };

  // Search handler for search box
  const onSearchHandler = (e) => {
    setQuery(e.target.value);
  };

  // Filter menu opener/closer
  const clickhandler = (e) => {
    e.stopPropagation();
    // if (!filterMenu.current) return;
    // const filterMenuEle = filterMenu.current;
    // if (filterMenuEle?.classList?.contains("hidden")) {
    //   filterMenuEle.classList.remove("hidden");
    //   filterMenuEle.classList.add("block");
    // } else {
    //   filterMenuEle.classList.remove("block");
    //   filterMenuEle.classList.add("hidden");
    // }
    if (isMenu) {}
  };

  // Sorting the data base on filter
  const sortData = async (sortingType) => {
    await chrome.storage.local.set({ linkcollect_sorting_type: sortingType });

    dispatch(sortCollection(sortingType));

    clickhandler();
  };

  useEffect(() => {
  // This is to close the filter menu when clicked outside of it, if it is open
  document.addEventListener("click", (e) => {
    if (e.target !== menuRef.current && e.target !== filterMenu.current) {
      // this is to close the filter menu when clicked outside of it, if it is open
      setIsMenu(false);
    }
  });
  return () => {
    document.removeEventListener("click", (e) => {console.log("remove event listener")})
  }
  }, [])

  // Code for Live Message Display
  const [count, setCount] = useState(0);
  const [displayMessageBool, setDisplayMessageBool] = useState(false);
  const [message, setMessage] = useState({ data: "", cta: "" });

  useEffect(() => {
    const checkMessageExist = async () => {
      const { readCount } = await chrome.storage.local.get(["readCount"]);
      const { messageLive } = await chrome.storage.local.get(["messageLive"]);
      if (messageLive) {
        setMessage(messageLive);
        setCount(readCount);
      }
      if (count > 0) {
        setDisplayMessageBool(true);
      } else {
        setDisplayMessageBool(false);
      }
    }
    checkMessageExist();
  }, [count])
//   console.log(displayMessageBool);
//   console.log(chrome.management.getAll());

  // If no collection found then show the no result component
  if (!collection.loading && collection?.data?.length === 0) {
    return (
      <NoResult
        title="Add Collection"
        noResultName="collections"
        onClickHandler={createCollectionRedicector}
      />
    );
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 0}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0,y: 0}}
	  transition={{ duration: 0.1, ease: easeOut }}
    >
    <AnimatePresence mode="wait">
    {collectionLimitError && 
        <PopupModal
        title="Can't Create More Collections"
        content="Free Plan allows 30 collections. Please upgrade to premium to create more"
        buttonText="Upgrade"
        modalOpen={collectionLimitError}
        onCloseHandler={closeCollectionLimitError}
        />
        }
        </AnimatePresence>
        <AnimatePresence mode="wait">
    {linkLimitError && 
        <PopupModal
        title="Can't Create More Links"
        content="Free Plan allows 100 links per collection. Please upgrade to premium to create more"
        buttonText="Upgrade"
        modalOpen={linkLimitError}
        onCloseHandler={closeLinkLimitError}
        />
        }
        </AnimatePresence>
      <div className="py-3 bg-bgPrimary border-b border-bgGrey px-4 drop-shadow-md flex items-center gap-2">
        <SearchBox onSearch={onSearchHandler} />
        <div className="relative">
          <button
            ref={menuRef}
            onClick={() => setIsMenu(prev => !prev)}
            className="flex justify-center items-center border border-secodary rounded-xl p-2"
          >
            <img src={filterName} ref={filterMenu} className="w-[23px]"/>
          </button>
          {isMenu && <div className="z-[9999] block absolute right-7">
            <div className="w-[10rem] text-[16px] bg-bgPrimary cursor-pointer p-2 mt-2 rounded-xl border-bgGrey border-2">
              <p
                className="cursor-pointer text-textPrimary py-1"
                onClick={() => sortData("RECENTLY_UPDATE")}
              >
                Recently Updated
              </p>
              <p
                className="cursor-pointer text-textPrimary "
                onClick={() => sortData("MOST_BOOKMARKED")}
              >
                Most Bookmarkd
              </p>
            </div>
          </div>}
        </div>
      </div>
      {!collection.loading ? (
        <div className="bg-bgSecodary h-[680px]">
          <div className="flex justify-between items-center mb-2 pt-4 px-3">
            <p className="text-[18px] text-textPrimary">
              Collections
              <span className="ml-2 rounded-full py-[2px] bg-success p-2">
                {filteredData?.length}
              </span>
            </p>
            <button
              onClick={createCollectionRedicector}
              className="py-[9px] px-[9px] bg-primary text-[13px] font-lg font-bold rounded-md flex items-center"
            >
              {" "}
              <img src={addIcon} className="mr-2" /> Create Collection{" "}
            </button>
          </div>
          <div className="pt-[0.3rem] flex flex-col gap-2 h-[53%] overflow-y-auto overflow-x-visible px-3 w-full">
            {filteredData?.map((collection) => (
              <CollectionItem
                name={collection.title}
                timelines={collection.timelines}
                img={collection.image}
                key={collection._id}
                id={collection._id}
                copyLinkHandler={handleCopy}
                addHandler={addHandler}
                pinToggleHandler={handlePin}
                image={collection.image}
                isPinned={collection.isPinned}
              />
            ))}
            {filteredBookmarks?.map((bookmark) => (
              <Fragment key={bookmark.collctionId}>
                {bookmark?.timelines.length > 0 && (
                  <div key={bookmark.collctionId} className="mt-5">
                    <h1
                      key={bookmark.collctionId}
                      className="text-textPrimary font-bold text-[15px]"
                    >
                      From - {bookmark.collectionTitle} (
                      {bookmark.timelines.length})
                    </h1>
                    {bookmark.timelines.map((timeline) => (
                      <BookmarkItem
                        key={timeline._id}
                        id={timeline._id}
                        name={timeline.title}
                        url={timeline.link}
                        collectionId={bookmark.collctionId}
                        favicon={timeline.favicon}
                        onDelete={deleteBookmarkHandler}
                        isPinned={timeline.isPinned}
                      />
                    ))}
                  </div>
                )}
              </Fragment>
            ))}
          </div>
          <div className="py-1 cursor-pointer text-textPrimary flex justify-center items-center">
            <p
              className={`py-0 text-textSecondary ${
                displayMessageBool ? "animate-scrollingText" : "hidden"
              }`}

              // onAnimationEnd={handleAnimationEnd}
            >
              <a
                href={message?.cta}
                target="_blank"
                rel="noopener noreferrer"
              >
                {message?.message}
              </a>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-[70vh] justify-center items-center">
          <PageLoader />
        </div>
      )}
    </motion.div>
  );
};

export default Home;
