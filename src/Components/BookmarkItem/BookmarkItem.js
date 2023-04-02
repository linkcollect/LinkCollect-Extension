import React from 'react'
import CopyIcon from "../../assets/copy.svg"
import DeleteIcon from "../../assets/delete.svg"
import ShareIcon from "../../assets/linkArrowLight.svg"
import logo from "../../assets/Logo.svg"
const BookmarkItem = ({thumbnail,name,url,copyLinkHandler,shareLinkHandler,deleteHandler}) => {
  return (
    <div className='bg-lightblackbg p-2 flex justify-between border-b border-lightText'>
        <div className='flex'>
        <img src={thumbnail || logo}/>
        <div className='flex flex-col ml-2 '>
          <p className='text-[17px]'>{name}</p>
          <p className='text-lightText text-xs'>{url}</p>
        </div>
      </div>
      <div className='flex gap-2'>
        <button className='bg-blackbgOne rounded-full p-2' ocClick={deleteHandler}><img src={DeleteIcon}/></button>
        <button className='bg-blackbgOne rounded-full p-2' onClick={shareLinkHandler}><img src={ShareIcon}/></button>
        <button className='bg-blackbgOne rounded-full p-2' onClick={copyLinkHandler}><img src={CopyIcon}/></button>
      </div>
    </div>
  )
}

export default BookmarkItem