import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import Tooltip from "../Tooltip/Tooltip";

import CopyIcon from "../../assets/Icons/copyLight.svg";
import DeleteIcon from "../../assets/Icons/delete.svg";
import ShareIcon from "../../assets/Icons/arrow-share.svg";
import approveWhite from "../../assets/approve-white.svg";
import logo4 from "../../assets/Branding/Logo4.svg";

import pin from "../../assets/Icons/pin.svg"
import pinHover from "../../assets/Icons/pin-hover.svg"

import { getOrigin, nameShortner } from "../../utils/utilty";

import { useDispatch } from "react-redux";
import { pinTimelineToggle } from "../../store/collectionsSlice";
import { togglePin } from "../../api/timelineService";
import { getCurrentTab } from "../../utils/chromeAPI";
import { useEffect } from "react";

const BookmarkItem = ({
  id,
  favicon,
  name,
  url,
  onDelete,
  collectionId,
  isPinned
}) => {
  const [isDelting, setIsDeleting] = useState(false);
  const [copyText, setCopyText] = useState("Copy Link");
  const [isCurrentTab, setIsCurrentTab] = useState(false);
  const copyImageRef = useRef();

  useEffect(() => {
    isCurrentTabFunc();
  }, [url]);


  const dispatch = useDispatch()
  // Delete bookmark link
  const deletehanlder = async () => {
    await onDelete(id, collectionId);
  };

  const isCurrentTabFunc = async () => {
    let currentTab = await getCurrentTab();
    const isTab = currentTab.url === url;
    setIsCurrentTab(isTab);
  }

  //Copy bookmark link
  const copyLinkHandler = () => {
    setCopyText("Link Copied!");
    if (copyImageRef) copyImageRef.current.src = approveWhite;
    navigator.clipboard.writeText(url);
    setTimeout(() => {
      copyImageRef.current.src = CopyIcon;
      setCopyText("Copy Link");
    }, 2500);
  };

  // pin Bookmark
  const [hover, setHover] = useState(false);
  const toggleHandler = async (e) => {
    dispatch(pinTimelineToggle({ collectionId: collectionId, timelineId: id }));
    try {
        const res = await togglePin(collectionId, id);
    } catch (error) {
        console.error(error);
    }
  }

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={`relative p-2 flex hover:rounded-md justify-between border-b border-bgGrey hover:bg-lightBlueBG ${isCurrentTab ? 'bg-lightBlueBG rounded-md' : 'bg-bgPrimary'}`}>
      {(isPinned || hover) &&
      <img key="pin-icon" onMouseEnter={() => setHover(true)} 
        className="absolute z-[9999] top-[3px] left-[-4px] cursor-pointer " 
        src={isPinned ? pin : pinHover} alt="" 
        onClick={toggleHandler}/>}
      <div  className="flex">
        {/* link wrapper for onclick */}
        <Link
          className="flex justify-center items-center"
          to={url}
          target="_blank"
        >
          <img src={favicon || logo4} className="w-[30px] h-[30px]" />

          <div className="flex flex-col ml-2 ">
            <p className="text-[12px] w-full font-medium text-textPrimary">
              {nameShortner(name, 33)}
            </p>
            <p className="text-lightText text-xs text-textSecondary">
              {nameShortner(getOrigin(url), 27)}
            </p>
          </div>
        </Link>
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
        {/* <Tooltip name="Open Link">
          <Link
            className="bg-textLight rounded-full py-2 px-[8px] flex justify-center items-center"
            to={url}
            target="_blank"
          >
            <img src={ShareIcon} className="w-[22px]" />
          </Link>
        </Tooltip> */}
        <Tooltip name="Delete the Bookmark">
          <button
            className="bg-textLight rounded-full py-2 px-[8px] flex justify-center items-center"
            onClick={deletehanlder}
          >
            <img src={DeleteIcon} className="w-[20px]" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default BookmarkItem;
