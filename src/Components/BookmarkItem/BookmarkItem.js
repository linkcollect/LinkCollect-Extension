import React from 'react'
import CopyIcon from "../../assets/Icons/copyLight.svg"
import DeleteIcon from "../../assets/Icons/delete.svg"
import ShareIcon from "../../assets/Icons/arrow-share.svg"
import logo from "../../assets/Logo.svg"
const BookmarkItem = ({thumbnail,name,url,copyLinkHandler,shareLinkHandler,deleteHandler}) => {
  return (
    <div className='bg-bgPrimary p-2 flex justify-between border-b border-bgGrey'>
        <div className='flex'>
        <img src={thumbnail || logo}/>
        <div className='flex flex-col ml-2 '>
          <p className='text-[17px] text-textPrimary'>{name}</p>
          <p className='text-lightText text-xs text-textPrimary'>{url}</p>
        </div>
      </div>
      <div className='flex gap-2'>
        <button className='bg-textLight rounded-full py-2 px-[8px] flex justify-center items-center' ocClick={deleteHandler}><img src={DeleteIcon}/></button>
        <button className='bg-primary rounded-full py-2 px-[8px] flex justify-center items-center' onClick={copyLinkHandler}><img src={CopyIcon}/></button>
        <button className='bg-textLight rounded-full py-2 px-[8px] flex justify-center items-center' onClick={shareLinkHandler}><img src={ShareIcon}/></button>
      </div>
    </div>
  )
}

export default BookmarkItem