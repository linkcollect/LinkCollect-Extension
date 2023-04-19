import React, { useRef } from "react";
import copy from "../../assets/Icons/copy.svg";
import OpenLink from "../../assets/Icons/openLink.svg";
import approve from "../../assets/Icons/approve.svg";
import edit from  "../../assets/Icons/edit.svg"
import { Link } from "react-router-dom";
import deleteI from "../../assets/Icons/delete.svg"
import openLink from "../../assets/Icons/openLink.svg"
import openTabs from "../../assets/Icons/opentabs.svg"
const PopupMenu =React.forwardRef( ({ title,privacy,collectionId,onCopyCollection, collectionLink , onDelete,onOpenAllLink}) => {
  const copyImageRef = useRef();
  const copyLinkHandler = () => {
    if (copyImageRef) copyImageRef.current.src = approve;
    onCopyCollection();
    setTimeout(() => {
      copyImageRef.current.src = copy;
    }, 1500);
  };

  const deleteHandler = () =>{
    onDelete()
  }

  return (
    <div onClick={(e)=>e.stopPropagation()} className="w-[12rem] rounded-md bg-bgPrimary drop-shadow-md px-3 pt-2">
      <ul className="text-[16px] text-textPrimary">
        <li className="flex justify-between pb-2 cursor-pointer"  onClick={copyLinkHandler} >
            <p>Copy Link</p>
            <img src={copy} ref={copyImageRef} className="w-[20px]" />
        </li>
        <Link to={collectionLink} target="_blank" className="flex justify-between pb-2 items-center cursor-pointer">
          <p>View in web</p>
          <img src={openLink} />
        </Link>
        <Link to={"/edit-collection/"+collectionId} state={{
          title:title,
          privacy:privacy,
        }} className="flex justify-between pb-2 items-center cursor-pointer">
          <p>Edit Collection</p>
          <img src={edit} />
        </Link>
        <li className="flex justify-between pb-2 cursor-pointer"  onClick={onOpenAllLink} >
            <p>Open all tabs</p>
            <img src={openTabs}/>
        </li>
        <li className="flex justify-between pb-2 cursor-pointer"  onClick={deleteHandler} >
            <p>Delete Collection</p>
            <img src={deleteI}  className="w-[20px]" />
        </li>
      </ul>
    </div>
  );
});

export default PopupMenu;
