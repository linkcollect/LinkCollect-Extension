import React, { useRef, useState } from "react";
import logo from "../../assets/Icons/folder.png";
import CopyIcon from "../../assets/Icons/copy.svg";
import AddIcon from "../../assets/Icons/add.svg";
import ShareIcon from "../../assets/Icons/arrow-share.svg";
import { Link } from "react-router-dom";
import Tooltip from "../Tooltip/Tooltip";
import Loader from "../Loader/Loader";
import approve from "../../assets/Icons/approve.svg"
import approveWhite from "../../assets/approve-white.svg"
import { useSelector } from "react-redux";
import { nameShortner } from "../../utils/utilty";
const CollectionItem = ({
  image,
  name,
  count,
  copyLinkHandler,
  addHandler,
  id:collectionId,

}) => {
  const [copyText,setCopyText] = useState("Copy Link");
  const [isAdding,setIsAdding] = useState(false);
  const copyImageRef = useRef();
  const bookMarkImage = useRef();
  const auth = useSelector(state=>state.auth);
  const onCopy = () => {
    setCopyText("Copied")
    if(copyImageRef) copyImageRef.current.src=approve;
    copyLinkHandler(collectionId);
    setTimeout(()=>{
      copyImageRef.current.src=CopyIcon
      setCopyText("Copy Link");

    },1500);
  };


  const addBookMarkHandler = async (e) =>{
    setIsAdding(true);
    await addHandler(collectionId);
    setIsAdding(false);
    if(bookmark)  bookmark.current.src=approveWhite;
    setTimeout(()=>{
      bookmark.current.src=AddIcon
    },2500)
  }


  return (
    <div className="relative">
    <Link to={"/"+collectionId}>
    <div className="bg-bgPrimary rounded-md border border-secodary  p-2 flex justify-between w-full" >
      <div className="flex">
        <img className="w-[40px]" src={image!="undefined" && image!== undefined ?  image : logo} />
        <div className="flex flex-col ml-4 ">
          <p className="text-[14px] text-textPrimary font-bold">{nameShortner(name,20)}</p>
          <p className="text-textPrimary text-[12px]">{count} Bookmarks</p>
        </div>
      </div>
    </div>
    </Link>
    <div className="flex gap-2 absolute right-[8px] top-[10px]">
        <Tooltip name={copyText}>
          <button
            className="bg-textLight rounded-full py-2 px-[8px] flex justify-center items-center"
            onClick={onCopy}
          >
            <img src={CopyIcon} ref={copyImageRef} className="w-[23px]" />
          </button>
        </Tooltip>
        <Tooltip name="Open Collection">
          <Link
            className="bg-textLight rounded-full py-2 px-[8px] flex justify-center items-center"
            to={`http://linkcollect.io/${auth.user.username}/c/${collectionId}`}
            target="_blank"
          >
            <img src={ShareIcon} className="w-[23px]" />
          </Link>
        </Tooltip>
        <Tooltip name="Bookmark Current Tab">
          <button
            className="bg-primary rounded-full py-2 px-[8px] flex justify-center items-center"
            onClick={addBookMarkHandler}

          >
            {!isAdding ? <img src={AddIcon} ref={bookMarkImage} className="w-[23px]" /> : <Loader/>}
          </button>
        </Tooltip>
    </div>
    </div>
  );
};

export default CollectionItem;
