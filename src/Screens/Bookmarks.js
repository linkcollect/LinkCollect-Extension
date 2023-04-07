import React, { useState } from "react";
import BackArrow from "../assets/Icons/arrow.svg";
import logo from "../assets/Logo.svg";
import BookmarkItem from "../Components/BookmarkItem/BookmarkItem";
import dots from "../assets/Icons/3dot-menu.svg";
import PopupMenu from "../Components/Menu/PopupMenu";

const Bookmarks = () => {
  const [showMenu,setShowMenu]=useState(false);
  return (
    <>
      <div className="pt-4 pl-6 bg-bgPrimary border-b border-bgGrey px-4 pb-4 drop-shadow-md">
        <a className="cursor-pointer flex gap-3 [&>img]:rotate-[90deg] [&>img]:w-[22px]">
          <img src={BackArrow} /> <p className="text-textPrimary font-bold text-xl">Create Collection</p>
        </a>
      </div>
      <div className="p-5 h-[75%]">
        {/* Collection Heading */}
        <div className="bg-primary p-2 flex justify-between items-center py-2 pr-4 mb-2 rounded-md">
          <div className="flex">
            <div className="w-[50px] h-[50px] bg-bgPrimary rounded-md flex items-center justify-center [&>img]:rounded-full [&>img]:w-[40px] ">
            <img src={logo} />
            </div>
            <div className="flex flex-col ml-2 ">
              <p className="text-[19px] font-medium text-bgPrimary">Python Automation</p>
              <p className="text-bgPrimary text-xs">8 Bookmarks</p>
            </div>
          </div>
          <div className="relative">
            <div className="cursor-pointer" onClick={()=>setShowMenu(preState=>!preState)}>
              <img src={dots} />
            </div>
            <div className="absolute text-[#ffff] top-[30px] left-[-170px]">
              {showMenu && <PopupMenu/>}
            </div>
          </div>
        </div>

        {/* Collection list */}
        <div className="h-[68%] overflow-y-auto">
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
