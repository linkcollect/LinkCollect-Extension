import React, { useRef } from "react";

import ToggleButton from "../ToogleButton/ToggleButton";
import copy from "../../assets/Icons/copy.svg";
import OpenLink from "../../assets/Icons/openLink.svg";
import approve from "../../assets/Icons/approve.svg";
import { Link } from "react-router-dom";

const PopupMenu = ({ onCopyCollection, isPublic, onPrivacyToggle, collectionLink }) => {
  const copyImageRef = useRef();
  console.log(isPublic);
  const copyLinkHandler = () => {
    if (copyImageRef) copyImageRef.current.src = approve;
    onCopyCollection();
    setTimeout(() => {
      copyImageRef.current.src = copy;
    }, 1500);
  };
  return (
    <div className="w-[12rem] rounded-md bg-bgPrimary drop-shadow-md px-3 pt-2">
      <ul className="text-[16px] text-textPrimary">
        <li className="flex justify-between pb-2">
          <p>Copy Link</p>
          <button onClick={copyLinkHandler}>
            <img src={copy} ref={copyImageRef} className="w-[20px]" />
          </button>
        </li>
        <li className="flex justify-between pb-2">
          <p>Public</p>
          <ToggleButton
            isPublic={isPublic}
            onPrvaciyUpdate={onPrivacyToggle}
          />
        </li>
        <li className="flex justify-between pb-2 items-center">
          <p>Open in web</p>
          <Link to={collectionLink} target="_blank">
            <img src={OpenLink} />
          </Link >
        </li>
      </ul>
    </div>
  );
};

export default PopupMenu;
