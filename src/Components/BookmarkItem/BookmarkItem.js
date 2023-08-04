import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import Tooltip from "../Tooltip/Tooltip";

import CopyIcon from "../../assets/Icons/copyLight.svg";
import DeleteIcon from "../../assets/Icons/delete.svg";
import ShareIcon from "../../assets/Icons/arrow-share.svg";
import approveWhite from "../../assets/approve-white.svg";
import logo4 from "../../assets/Branding/Logo4.svg";

import { getOrigin, nameShortner } from "../../utils/utilty";

const BookmarkItem = ({
  id,
  favicon,
  name,
  url,
  onDelete,
  collctionId = null,
}) => {
  const [isDelting, setIsDeleting] = useState(false);
  const [copyText, setCopyText] = useState("Copy Link");
  const copyImageRef = useRef();

  // Delete bookmark link
  const deletehanlder = async () => {
    await onDelete(id, collctionId);
  };

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

  return (
    <div className="bg-bgPrimary p-2 flex hover:rounded-md justify-between border-b border-bgGrey hover:bg-lightBlueBG ">
      <div className="flex">
        {/* link wrapper for onclick */}
        <Link
          className="flex justify-center items-center"
          to={url}
          target="_blank"
        >
          <img src={favicon || logo4} className="w-[30px] h-[30px]" />

          <div className="flex flex-col ml-2 ">
            <p className="text-[12px] w-full font-bold text-textPrimary">
              {nameShortner(name, 26)}
            </p>
            <p className="text-lightText text-xs text-textPrimary">
              {nameShortner(getOrigin(url), 22)}
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
        <Tooltip name="Open Link">
          <Link
            className="bg-textLight rounded-full py-2 px-[8px] flex justify-center items-center"
            to={url}
            target="_blank"
          >
            <img src={ShareIcon} className="w-[22px]" />
          </Link>
        </Tooltip>
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
