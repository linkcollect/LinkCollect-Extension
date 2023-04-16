import React, { useEffect, useState } from "react";
import addIcon from "../assets/Icons/add-tab.svg";
import CollectionItem from "../Components/CollectiionItem/CollectionItem";
import SearchBox from "../Components/SearchBox/SearchBox";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCollectionsWithoutTimelines } from "../api/collectionService";
import NoResult from "../Components/NoResult/NoResult";
import Loader from "../Components/Loader/Loader";
import { getCurrentTab } from "../utils/chromeAPI";
import { createTimeline } from "../api/timelineService";

const Home = () => {
  const [collections, SetCollections] = useState([]);
  const [loading, setLoadeing] = useState(false);
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
      const res = await getAllCollectionsWithoutTimelines();
      console.log(res.data.data);
      SetCollections(res.data.data);
      setLoadeing(false)
    };
    getCollections(auth.token);
  }, []);

  const handleCopy = (collectionId ) => {
    console.log(collectionId)
    navigator.clipboard.writeText(`http://localhost:3000/collections/${collectionId}`);
  };


  const addHandler = async (collectionId) =>{
    try {
      const time = new Date('14 Jun 2017 00:00:00 PDT').toUTCString();
      const getTab = await getCurrentTab();
      console.log(getTab)
      const timeline = {link: getTab.url, note: getTab.title, time }
      // DB Add
      const {data} = await createTimeline(collectionId, timeline);

      // Instant state update
      const collectionIndex = collections.findIndex(collection=>collection._id === collectionId);
      const updatedCollections = [...collections];
      updatedCollections[collectionIndex].timelines.push(data._id);
      SetCollections(updatedCollections);
      console.log(data)
    } catch (error) {
      // Need to provide a error message
      console.log(error);
    }
  }

  if (!loading && collections.length === 0) {
    return (
      <NoResult
        title="Add Collection"
        noResultName="collections"
        navigator={createCollectionRedicector}
      />
    );
  }



  return (
    <div>
      <div className="py-3 bg-bgPrimary border-b border-bgGrey px-4 drop-shadow-md">
        <SearchBox />
      </div>
      {!loading? 
      <div className=" bg-bgSecodary h-[680px]">
        <div className="flex justify-between items-center pt-4 px-3">
          <p className="text-[18px] text-textPrimary">
            Collections
            <span className="ml-2 rounded-full py-[2px] bg-success p-2">{collections.length}</span>
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
          {collections.map((collection) => (
            <CollectionItem
              name={collection.title}
              count={collection.timelines.length}
              img={collection.image}
              key={collection._id}
              id={collection._id}
              copyLinkHandler={handleCopy}
              addHandler={addHandler}
            />
          ))}
        </div>
      </div> : 
      <div className="flex w-full h-[70vh] justify-center items-center">
        <Loader/>
      </div>
      }
    </div>
  );
};

export default Home;
