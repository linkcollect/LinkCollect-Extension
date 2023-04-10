import React, { useEffect, useState } from "react";
import addIcon from "../assets/Icons/add-tab.svg";
import CollectionItem from "../Components/CollectiionItem/CollectionItem";
import SearchBox from "../Components/SearchBox/SearchBox";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCollectionsWithoutTimelines } from "../api/collectionService";
import NoResult from "../Components/NoResult/NoResult";


const Home = () => {
  const [empty, setEmpty] = useState(false);
  const [collections,SetCollections] = useState([]);
  const auth = useSelector(state=>state.auth);
  const navigate = useNavigate();
  const createCollectionRedicector =  () => {
    navigate("/new-collection");
  }

  useEffect(()=>{
    if(!auth.token){
      return navigate("/")
    }
    const getCollections = async () =>{
      const res = await getAllCollectionsWithoutTimelines()
      console.log(res.data.data);
      SetCollections(res.data.data)
    }
    getCollections(auth.token);
  },[])
  if (collections.length===0) {
    return <NoResult title="Add Collection" noResultName="collections" navigator={createCollectionRedicector}/>;
  }

  return (
    <div>
      <div className="py-3 bg-bgPrimary border-b border-bgGrey px-4">
        <SearchBox />
      </div>
      <div className="px-3 py-3 bg-bgSecondary">
        <div className="flex justify-between items-center">
          <p className="text-[18px] text-textPrimary">
            Collections
            <span className="ml-2 rounded-full py-[2px] bg-success p-2">8</span>
          </p>
          <button onClick={createCollectionRedicector} className="py-[9px] px-[9px] bg-primary text-[13px] font-lg font-bold rounded-md flex items-center">
            {" "}
            <img src={addIcon} className="mr-2" /> Create Collection{" "}
          </button>
        </div>
        <div className="mt-4">
          {collections.map(collection => (
            <CollectionItem name={collection.title} count={collection.timelines.length} img={collection.image} key={collection._id}/>
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default Home;
