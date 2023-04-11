import React, { useRef, useState } from "react";
import logo from "../../assets/Logo.svg";
import CopyIcon from "../../assets/Icons/copy.svg";
import AddIcon from "../../assets/Icons/add.svg";
import ShareIcon from "../../assets/Icons/arrow-share.svg";
import { Link } from "react-router-dom";
import Tooltip from "../Tooltip/Tooltip";
import Loader from "../Loader/Loader";
import approve from "../../assets/Icons/approve.svg"

const CollectionItem = ({
  image,
  name,
  count,
  copyLinkHandler,
  addHandler,
  id,
}) => {
  const [copyText,setCopyText] = useState("Copy Link");
  const copyImageRef = useRef();
  const onCopy = () => {
    console.log(id);
    setCopyText("Copied")
    if(copyImageRef) copyImageRef.current.src=approve;
    copyLinkHandler(id);
    setTimeout(()=>{
      copyImageRef.current.src=CopyIcon
      setCopyText("Copy Link");

    },2500);
  };



  return (
    <div className="bg-bgPrimary rounded-md border border-secodary  p-2 flex justify-between mb-2">
      <div className="flex">
        <img src={image || logo} />
        <div className="flex flex-col ml-4 ">
          <p className="text-[17px] text-textPrimary font-bold">{name}</p>
          <p className="text-textPrimary text-xs">{count} Bookmarks</p>
        </div>
      </div>
      <div className="flex gap-2">
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
            to={`http://localhost:3000/collections/${id}`}
            target="_blank"
          >
            <img src={ShareIcon} className="w-[23px]" />
          </Link>
        </Tooltip>
        <Tooltip name="Add bookmark">
          <button
            className="bg-primary rounded-full py-2 px-[8px] flex justify-center items-center"
            ocClick={addHandler}
          >
            <img src={AddIcon} className="w-[23px]" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default CollectionItem;
