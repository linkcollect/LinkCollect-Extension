import React from 'react'
import addIcon from '../assets/add.svg'
import ArrowIcon from "../assets/linkArrowLight.svg"
import CollectionItem from '../Components/CollectiionItem/CollectionItem'
const Home = () => {
  return (
    <div className='px-4 py-4'>
        <div className='flex justify-between items-center'>
            <p className='text-[16px]'>Collection list<span className='ml-2 rounded-full border-[0.6px] border-lightText py-[2px] bg-lightblackbg px-2'>8</span></p>
            <button className='py-[5px] px-[7px] bg-primary text-[14px] font-medium rounded-md flex items-center'>Create Collection <img src={addIcon}/> </button>
        </div>
        <div className='mt-4'>
            <CollectionItem name="Python Automation" count="8"/>
            <CollectionItem name="Python Automation" count="8"/>
            <CollectionItem name="Python Automation" count="8"/>
            <CollectionItem name="Python Automation" count="8"/>
        </div>
        <div className='flex justify-end mt-3'>
          <a className='px-4 py-1 flex bg-blackbgTwo rounded-full cursor-pointer'>View all <img src={ArrowIcon} className='ml-2'/></a>
        </div>
    </div>
  )
}

export default Home