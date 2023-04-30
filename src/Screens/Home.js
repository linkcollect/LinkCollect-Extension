import React, { useEffect, useRef, useState } from "react";
import addIcon from "../assets/Icons/add-tab.svg";
import CollectionItem from "../Components/CollectiionItem/CollectionItem";
import SearchBox from "../Components/SearchBox/SearchBox";
import { useSelector } from "react-redux";
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
import { dataSortByType } from "../utils/utilty";
import BookmarkItem from "../Components/BookmarkItem/BookmarkItem";
import filterName from "../assets/Icons/filter--menu.svg";

const Home = () => {
  // gloabl collections
  const [collections, SetCollections] = useState([]);

  // Filterd/search collection that will be shown
  const [filteredCollection, setFiltererdCollection] = useState([]);

  //Bookmarks search state
  const [bookmarks, setBookmarks] = useState([]);

  const [loading, setLoadeing] = useState(false);

  //filtermenu ref to open and close it
  const filterMenu = useRef()

  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const createCollectionRedicector = () => {
    navigate("/new-collection");
  };

  useEffect(() => {
    if (!auth.token) {
      return navigate("/");
    }
    setLoadeing(true);
    const getCollections = async () => {
      try {
        const res = await getAllCollections();
        const sortingType = await chrome.storage.local.get(["linkcollect_sorting_type"])
        console.log(sortingType)
        const sorteData = dataSortByType(res.data.data,sortingType.linkcollect_sorting_type);
        SetCollections(sorteData);
        setFiltererdCollection(sorteData);
        setLoadeing(false);
        await upadteLatestCollection(sorteData[0]._id, sorteData[0].title);
      } catch (error) {
        setLoadeing(false);
      }
    };
    getCollections(auth.token);
  }, []);

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
      console.log(res.data.data);
      const collectionIndex = collections.findIndex(
        (collection) => collection._id === collectionId
      );
      const updatedCollections = [...collections];
      updatedCollections[collectionIndex].timelines.push(res.data.data);
      SetCollections(updatedCollections);
      setFiltererdCollection(updatedCollections);
      await upadteLatestCollection(
        updatedCollections[collectionIndex]._id,
        updatedCollections[collectionIndex].title
      );
    } catch (error) {
      // Need to provide a error message
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
    // As we need to search in global collections
    const tempCollections = [...collections];
    let newfilteredCollection = tempCollections;
    let filteredBookmarks = [];
    if (e.target.value !== "") {
      newfilteredCollection = tempCollections.filter((collection) =>
        collection.title.toLowerCase().includes(e.target.value.toLowerCase())
      );
      filteredBookmarks = tempCollections.map((collection) => ({
        collectionTitle: collection.title,
        collctionId: collection._id,
        timelines: [
          ...collection.timelines.filter(
            (timeline) =>
              timeline.title
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
              timeline.link.toLowerCase().includes(e.target.value.toLowerCase())
          ),
        ],
      }));
    }
    setBookmarks(filteredBookmarks);
    setFiltererdCollection(newfilteredCollection);
  };

  // Filter menu opener
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
    const copyData = [...collections];
    const sortedData = dataSortByType(copyData,sortingType);

    console.log(sortedData);
    SetCollections(p=>sortedData)
    setFiltererdCollection(p=>sortedData);
    
    clickhandler();
  }

  if (!loading && collections.length === 0) {
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
      {!loading ? (
        <div className=" bg-bgSecodary h-[680px]">
          <div className="flex justify-between items-center pt-4 px-3">
            <p className="text-[18px] text-textPrimary">
              Collections
              <span className="ml-2 rounded-full py-[2px] bg-success p-2">
                {filteredCollection.length}
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
            {filteredCollection.map((collection) => (
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
            {bookmarks.map((bookmark) => (
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
