import React from 'react'
import logo from "../../assets/Logo.svg"
import CopyIcon from "../../assets/Icons/copy.svg"
import AddIcon from "../../assets/Icons/add.svg"
import ShareIcon from "../../assets/Icons/arrow-share.svg"
const CollectionItem = ({thumbnail,name,count,copyLinkHandler,shareLinkHandler,addHandler}) => {
  return (
    <div className='bg-bgPrimary rounded-md border border-secodary  p-2 flex justify-between mb-2'>
      <div className='flex'>
        <img src={thumbnail || logo}/>
        <div className='flex flex-col ml-4 '>
          <p className='text-[17px] text-textPrimary font-bold'>{name}</p>
          <p className='text-textPrimary text-xs'>{count}{" "}Bookmarks</p>
        </div>
      </div>
      <div className='flex gap-2'>
        <button className='bg-textLight rounded-full py-2 px-[8px] flex justify-center items-center' onClick={copyLinkHandler}><img className='w-[23px]' src={CopyIcon}/></button>
        <button className='bg-textLight rounded-full py-2 px-[8px] flex justify-center items-center' onClick={shareLinkHandler}><img src={ShareIcon} className='w-[23px]'  /></button>
        <button className='bg-primary rounded-full py-2 px-[8px] flex justify-center items-center' ocClick={addHandler}><img src={AddIcon} className='w-[23px]'/></button>
      </div>
    </div>
  )
}

export default CollectionItem