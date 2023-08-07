import React, { useMemo, useRef, useState } from "react";
import addIcon from "../assets/Icons/add-tab.svg";
import CollectionItem from "../Components/CollectiionItem/CollectionItem";
import SearchBox from "../Components/SearchBox/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NoResult from "../Components/NoResult/NoResult";
import PageLoader from "../Components/Loader/PageLoader";
import { getLiveMessage } from "../api/collectionService";
import { useEffect } from "react";

import {
  getCurrentTab,
  sendMessage,
  upadteLatestCollection,
} from "../utils/chromeAPI";
import { createTimeline, deleteTimeline } from "../api/timelineService";
import BookmarkItem from "../Components/BookmarkItem/BookmarkItem";
import filterName from "../assets/Icons/filter--menu.svg";
import {
  addBookmark,
  sortCollection,
  deleteBookmark,
} from "../store/collectionsSlice";

const Home = () => {
  // gloabl collections
  const collection = useSelector((state) => state.collection);

  //Query Params state
  const [query, setQuery] = useState("");

  //filtermenu ref to open and close it
  const filterMenu = useRef();
  const menuRef = useRef();

  const auth = useSelector((state) => state.user);

  //Distapcher
  const dispatch = useDispatch();

  const navigate = useNavigate();

  //Filtered Collections
  const filteredData = useMemo(() => {
    
    return collection.data?.filter((collection) =>
      collection.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, collection.data]);

  // filteredbookmarks
  const filteredBookmarks = useMemo(() => {
    return query.length > 0
      ? collection.data?.map((collection) => ({
          collectionTitle: collection.title,
          collctionId: collection._id,
          timelines: [
            ...collection.timelines.filter(
              (timeline) =>
                timeline.title.toLowerCase().includes(query.toLowerCase()) ||
                timeline.link.toLowerCase().includes(query.toLowerCase())
            ),
          ],
        }))
      : [];
  });

  // this is to REDIRECT TO create new collection
  const createCollectionRedicector = () => {
    navigate("/new-collection");
  };

  const handleCopy = (collectionId) => {
    navigator.clipboard.writeText(
      `http://linkcollect.io/${auth.user.username}/c/${collectionId}`
    );
  };

  // Bookmark add handler
  const addHandler = async (collectionId) => {
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
      // Instant state update

      dispatch(addBookmark({ collectionId, bookmark: res.data.data }));

      await upadteLatestCollection(collection.data, collectionId);
    } catch (error) {
      var hasError = true;
    }
    sendMessage(hasError || false, !hasError ? "Link Saved" : "Unable to Save");
  };

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
  const clickhandler = () => {
    if (!filterMenu.current) return;
    const filterMenuEle = filterMenu.current;
    if (filterMenuEle?.classList?.contains("hidden")) {
      filterMenuEle.classList.remove("hidden");
      filterMenuEle.classList.add("block");
    } else {
      filterMenuEle.classList.remove("block");
      filterMenuEle.classList.add("hidden");
    }
  };

  // Sorting the data base on filter
  const sortData = async (sortingType) => {
    await chrome.storage.local.set({ linkcollect_sorting_type: sortingType });

    dispatch(sortCollection(sortingType));

    clickhandler();
  };

  // This is to close the filter menu when clicked outside of it, if it is open
  window.addEventListener("click", (e) => {
    if (e.target !== filterMenu.current && e.target !== menuRef.current) {
      // this is to close the filter menu when clicked outside of it, if it is open

      if (!filterMenu.current) return;
      const filterMenuEle = filterMenu.current;
      if (filterMenuEle?.classList?.contains("hidden")) {
        return;
      } else {
        filterMenuEle.classList.remove("block");
        filterMenuEle.classList.add("hidden");
      }
    }
  });

  // Code for Live Message Display

  const [readCount, setReadCount] = useState(0);
  const [displayMessageBool, setDisplayMessageBool] = useState(true);
  const [messageLive, setMessageLive] = useState({ data: "", cta: "" });

  useEffect(() => {
    async function doMessageUpdate() {
      const res = await chrome.storage.local.get(["readCount"]);
      const storedReadCount = await res.readCount;
      console.log("storedReadCount", storedReadCount);

      const res2 = await chrome.storage.local.get(["messageLive"]);
      const storedMessageLive = res2?.messageLive;

      const message = getLiveMessage(); // Assuming you have a function like this
      await handleAnimationEnd(storedReadCount);
      if (storedMessageLive?.data === message?.data && storedReadCount <= 2) {
        setDisplayMessageBool(true);
      } else if (storedMessageLive !== message) {
        await chrome.storage.local.set({ messageLive: message });
        setDisplayMessageBool(true);
        setMessageLive(message);
        setReadCount(0);
        console.log("updating readCount to 0 as messages are diff")
        await chrome.storage.local.set({ readCount: 0 });
        window.dispatchEvent(new Event("storage"));
      }
    }

    doMessageUpdate();
  }, []);

  window.addEventListener("storage", async () => {
    console.log("Change to local storage!");
    let mes = await chrome.storage.local.get(["messageLive"]);
    let resCount = await chrome.storage.local.get(["readCount"]);
    setMessageLive(mes?.messageLive);
    setReadCount(resCount?.readCount);

    console.log("message and cta", mes?.messageLive?.data, mes.messageLive?.cta);

    if (readCount < 3) {
      setDisplayMessageBool(true);
    } else if (readCount >= 3) {
      setDisplayMessageBool(false);
    }
    // const [readCount, setReadCount] = useState(0);
    // const [displayMessageBool, setDisplayMessageBool] = useState(true);
    // const [messageLive, setMessageLive] = useState('');

    // ...
  });

  const handleAnimationEnd = async (readCount) => {
    const newReadCount = readCount + 1;
    setReadCount(newReadCount);

    if (newReadCount < 3) {
      setDisplayMessageBool(true);
    } else if (newReadCount >= 3) {
      setDisplayMessageBool(false);
    }

    await chrome.storage.local.set({ readCount: newReadCount });
    window.dispatchEvent(new Event("storage"));
  };

  // console.log("displayMessageBool", displayMessageBool, readCount, messageLive);

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
    <div>
      <div className="py-3 bg-bgPrimary border-b border-bgGrey px-4 drop-shadow-md flex items-center gap-2">
        <SearchBox onSearch={onSearchHandler} />
        <div className="relative">
          <button
            onClick={clickhandler}
            className="flex justify-center items-center border border-secodary rounded-xl p-2"
          >
            <img src={filterName} className="w-[23px]" ref={menuRef} />
          </button>
          <div className="z-[9999] absolute hidden right-7" ref={filterMenu}>
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
          </div>
        </div>
      </div>
      {!collection.loading ? (
        <div className=" bg-bgSecodary h-[680px]">
          <div className="flex justify-between items-center pt-4 px-3">
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
          <div className="mt-4 flex flex-col gap-2 h-[49%] overflow-y-auto overflow-x-hidden px-3 w-full">
            {filteredData?.map((collection) => (
              <CollectionItem
                name={collection.title}
                count={collection.timelines.length}
                img={collection.image}
                key={collection._id}
                id={collection._id}
                copyLinkHandler={handleCopy}
                addHandler={addHandler}
                image={collection.image}
              />
            ))}
            {filteredBookmarks?.map((bookmark) => (
              <>
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
                        favicon={timeline.favicon}
                        onDelete={deleteBookmarkHandler}
                        collctionId={timeline.collectionId}
                      />
                    ))}
                  </div>
                )}
              </>
            ))}
          </div>
          <div className="py-5 cursor-pointer text-textPrimary py-1 flex justify-center items-center">
            <p
              className={`py-0 text-textSecondary ${
                displayMessageBool ? "hidden" : "hidden"
              }`}

              // onAnimationEnd={handleAnimationEnd}
            >
              <a
                href={messageLive?.cta}
                target="_blank"
                rel="noopener noreferrer"
              >
                {messageLive?.data}
              </a>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-[70vh] justify-center items-center">
          <PageLoader />
        </div>
      )}
    </div>
  );
};

export default Home;
