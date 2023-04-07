import React from 'react'
import ToggleButton from '../ToogleButton/ToggleButton'
import copy from "../../assets/Icons/copy.svg"
import OpenLink from "../../assets/Icons/openLink.svg"
const PopupMenu = () => {
  return (
    <div className="w-[12rem] rounded-md bg-bgPrimary drop-shadow-md px-3 pt-2">
    <ul className="text-[16px] text-textPrimary">
      <li className="flex justify-between pb-2"><p>Copy Link</p><button><img src={copy}/></button></li>
      <li className="flex justify-between pb-2"><p>Public</p><ToggleButton/></li>
      <li className="flex justify-between pb-2"><p>Open in web</p><button><img src={OpenLink}/></button></li>
    </ul>
  </div>
  )
}

export default PopupMenu