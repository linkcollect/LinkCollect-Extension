import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import Tooltip from "../Tooltip/Tooltip";
import Loader from "../Loader/Loader";

import CopyIcon from "../../assets/Icons/copyLight.svg";
import DeleteIcon from "../../assets/Icons/delete.svg";
import ShareIcon from "../../assets/Icons/arrow-share.svg";
import logo from "../../assets/Logo.svg";
import approveWhite from "../../assets/approve-white.svg"

import { getOrigin, nameShortner } from "../../utils/utilty";

const BookmarkItem = ({ id, thumbnail, name, url, onDelete }) => {
  const [isDelting, setIsDeleting] = useState(false);
  const [copyText,setCopyText] = useState("Copy Link")
  const copyImageRef = useRef()
  
  // Delete bookmark link
  const deletehanlder = async () => {
    setIsDeleting(true);
    await onDelete(id);
    setIsDeleting(false);
  };

  //Copy bookmark link
  const copyLinkHandler = () =>{
    setCopyText("Link Copied!")
    if(copyImageRef) copyImageRef.current.src=approveWhite;
    navigator.clipboard.writeText(url);
    setTimeout(()=>{
      copyImageRef.current.src=CopyIcon
      setCopyText("Copy Link");
    },2500);
  }


  return (
    <div className="bg-bgPrimary p-2 flex justify-between border-b border-bgGrey">
      <div className="flex">
        <img src={thumbnail || logo} />
        <div className="flex flex-col w-[120px] ml-2 ">
          <p className="text-[12px] w-full font-bold text-textPrimary">
            {nameShortner(name)}
          </p>
          <p className="text-lightText text-xs text-textPrimary">
            {getOrigin(url)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Tooltip name={copyText}>
          <button
            className="bg-primary rounded-full py-2 px-[8px] flex justify-center items-center"
            onClick={copyLinkHandler}
          >
            <img ref={copyImageRef} src={CopyIcon} className="w-[20px]" />
          </button>
        </Tooltip>
        <Tooltip name="Open Link">
          <Link
            className="bg-textLight rounded-full py-2 px-[8px] flex justify-center items-center"
            to={url}
            target="_blank"
          >
            <img src={ShareIcon} className="w-[20px]" />
          </Link>
        </Tooltip>
        <Tooltip name="Delete the Bookmark">
          <button
            className="bg-textLight rounded-full py-2 px-[8px] flex justify-center items-center"
            onClick={deletehanlder}
          >
            {!isDelting ? <img src={DeleteIcon} className="w-[20px]" /> : <Loader />}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default BookmarkItem;
