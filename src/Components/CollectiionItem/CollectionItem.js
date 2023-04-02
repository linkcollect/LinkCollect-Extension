import React from 'react'
import logo from "../../assets/Logo.svg"
import CopyIcon from "../../assets/copy.svg"
import AddIcon from "../../assets/add.svg"
import ShareIcon from "../../assets/linkArrowLight.svg"
const CollectionItem = ({thumbnail,name,count,copyLinkHandler,shareLinkHandler,addHandler}) => {
  return (
    <div className='bg-lightblackbg rounded-md border-2 border-lightText p-2 flex justify-between mb-2'>
      <div className='flex'>
        <img src={thumbnail || logo}/>
        <div className='flex flex-col ml-2 '>
          <p className='text-[17px]'>{name}</p>
          <p className='text-lightText text-xs'>{count}{" "}Bookmarks</p>
        </div>
      </div>
      <div className='flex gap-2'>
        <button className='bg-blackbgOne rounded-full p-2' onClick={copyLinkHandler}><img src={CopyIcon}/></button>
        <button className='bg-blackbgOne rounded-full p-2' onClick={shareLinkHandler}><img src={ShareIcon}/></button>
        <button className='bg-blackbgOne rounded-full p-2' ocClick={addHandler}><img src={AddIcon}/></button>
      </div>
    </div>
  )
}

export default CollectionItem