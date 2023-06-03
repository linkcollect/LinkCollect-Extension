import React, { useEffect, useMemo, useRef, useState } from "react";
import addIcon from "../assets/Icons/add-tab.svg";
import CollectionItem from "../Components/CollectiionItem/CollectionItem";
import SearchBox from "../Components/SearchBox/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCollections } from "../api/collectionService";
import NoResult from "../Components/NoResult/NoResult";
import PageLoader from "../Components/Loader/PageLoader";
import {
  getCurrentTab,
  sendMessage,
  upadteLatestCollection,
} from "../utils/chromeAPI";
import { createTimeline, deleteTimeline } from "../api/timelineService";
import BookmarkItem from "../Components/BookmarkItem/BookmarkItem";
import filterName from "../assets/Icons/filter--menu.svg";
import { addBookmark, sortCollection } from "../store/collectionsSlice";

const Home = () => {


  // gloabl collections
  const [collections, SetCollections] = useState([]);
  const collection = useSelector(state => state.collection)


  //Bookmarks search state
  const [bookmarks, setBookmarks] = useState([]);

  //Query Params state
  const [query,setQuery] = useState("");
 
  //filtermenu ref to open and close it
  const filterMenu = useRef()

  const auth = useSelector((state) => state.user);

  //Distapcher
  const dispatch = useDispatch();

  const navigate = useNavigate();

  //Filtered Collections
  const filteredData = useMemo(()=>{
    return collection.data?.filter((collection) =>
        collection.title.toLowerCase().includes(query.toLowerCase())
      );
  },[query,collection.data])

  // filteredbookmarks
  const filteredBookmarks = useMemo(()=>{
    return query.length>0 ? collection.data?.map((collection) => ({
          collectionTitle: collection.title,
          collctionId: collection._id,
          timelines: [
            ...collection.timelines.filter(
              (timeline) =>
                timeline.title
                  .toLowerCase()
                  .includes(query.toLowerCase()) ||
                timeline.link.toLowerCase().includes(query.toLowerCase())
            ),
          ],
        })) :  [] ;
  })

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
      
      dispatch(addBookmark({collectionId,bookmark:res.data.data}))

      await upadteLatestCollection(
        collection.data,collectionId
      );
    } catch (error) {
      // Need to provide a error message
      console.log(error)
      var hasError = true;
    }
    sendMessage(hasError || false, !hasError ? "Link Saved" : "Unable to Save");
  };

  // Bookmark delete handler
  const deleleteBookmark = async (timeLineId, collectionId) => {
    console.log(collectionId, timeLineId);
    // DB Update
    await deleteTimeline(collectionId, timeLineId);

    // collection data update
    const collectionIndex = collections.findIndex(
      (collection) => collection._id === collectionId
    );
    const updatedCollections = [...collections];
    updatedCollections[collectionIndex].timelines = updatedCollections[
      collectionIndex
    ].timelines.filter((timeLine) => timeLineId !== timeLine._id);
    SetCollections(updatedCollections);

    //Need to update filtered bookmarks
    const collectionIdOfTheDeletedTimeline = bookmarks.findIndex(
      (bookmark) => bookmark.collctionId === collectionId
    );
    const updatedBookMarksList = [...bookmarks];
    console.log(collectionIdOfTheDeletedTimeline, updatedBookMarksList);
    updatedBookMarksList[collectionIdOfTheDeletedTimeline].timelines =
      updatedBookMarksList[collectionIdOfTheDeletedTimeline].timelines.filter(
        (timeLine) => timeLine._id !== timeLineId
      );
    setBookmarks(updatedBookMarksList);
  };

  const onSearchHandler = (e) => {
    setQuery(e.target.value);
  };

  // Filter menu opener/closer
  const clickhandler = () => {
    const filterMenuEle = filterMenu.current
    if(filterMenuEle.classList.contains('hidden')){
      filterMenuEle.classList.remove('hidden');
      filterMenuEle.classList.add('block')
    }else{
      filterMenuEle.classList.remove('block');
      filterMenuEle.classList.add('hidden')
    }
  };

  // Sorting the data base on filter
  const sortData = async (sortingType)=>{
    await chrome.storage.local.set({"linkcollect_sorting_type":sortingType})
    
    dispatch(sortCollection(sortingType))
    
    clickhandler();
  }

  if (!collection.loading && collection.data.length === 0) {
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
            <img src={filterName} className="w-[23px]" />
          </button>
          <div className="z-[9999] absolute hidden right-7" ref={filterMenu}>
            <div className="w-[10rem] text-[16px] bg-bgPrimary cursor-pointer p-2 mt-2 rounded-xl border-bgGrey border-2">
              <p className="cursor-pointer text-textPrimary py-1" onClick={()=>sortData("RECENTLY_UPDATE")}>Recently Updated</p>
              <p className="cursor-pointer text-textPrimary " onClick={()=>sortData("MOST_BOOKMARKED")}>Most Bookmarkd</p>
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
                {filteredData.length}
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
            {filteredData.map((collection) => (
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
            {filteredBookmarks.map((bookmark) => (
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
                        onDelete={deleleteBookmark}
                        collctionId={timeline.collectionId}
                      />
                    ))}
                  </div>
                )}
              </>
            ))}
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
