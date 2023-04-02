import React, { useState } from "react";
import BackArrow from "../assets/angleArrow.svg";
import logo from "../assets/Logo.svg";
import BookmarkItem from "../Components/BookmarkItem/BookmarkItem";
import dots from "../assets/3dots.svg";
import copy from "../assets/copySquare.svg"
import ToggleButton from "../Components/ToogleButton/ToggleButton";
import OpenLink from "../assets/openLink.svg"

const Bookmarks = () => {
  const [showMenu,setShowMenu]=useState(false);
  return (
    <>
      <div className="pt-4 pl-6">
        <a className="border border-lightText rounded bg-blackbgTwo flex w-[24px] h-[24px] p-1 pl-[0.35rem] cursor-pointer">
          <img src={BackArrow} />
        </a>
      </div>
      <div className="p-5 h-[80%]">
        <div className="bg-blackbgOne p-2 flex justify-between items-center pb-4 pr-4">
          <div className="flex">
            <img src={logo} />
            <div className="flex flex-col ml-2 ">
              <p className="text-[19px] font-medium">Python Automation</p>
              <p className="text-lightText text-xs">8 Bookmarks</p>
            </div>
          </div>
          <div className="relative">
            <div className="cursor-pointer" onClick={()=>setShowMenu(preState=>!preState)}>
              <img src={dots} />
            </div>
            <div className="absolute text-[#ffff] top-[20px] left-[-170px]">
              {showMenu && <div className="w-[12rem] rounded-md bg-darkgrey px-3 pt-2">
                <ul className="text-[16px]">
                  <li className="flex justify-between pb-2"><p>Copy Link</p><button><img src={copy}/></button></li>
                  <li className="flex justify-between pb-2"><p>Public</p><ToggleButton/></li>
                  <li className="flex justify-between pb-2"><p>Open in web</p><button><img src={OpenLink}/></button></li>
                </ul>
              </div>}
            </div>
          </div>
        </div>
        <div className="h-[70%] overflow-y-auto">
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
          <BookmarkItem name="Youtube" url="youtube.com" />
        </div>
      </div>
    </>
  );
};

export default Bookmarks;
