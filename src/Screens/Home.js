import React, { useState } from 'react'
import addIcon from '../assets/Icons/add-tab.svg'
import CollectionItem from '../Components/CollectiionItem/CollectionItem'
import noCollectionItem from "../assets/Icons/no-collection.svg"
import SearchBox from '../Components/SearchBox/SearchBox'

const EmptyCollections  = ()  =>{
  return ( 
  <div className='flex h-[70%] flex-col justify-around items-center'>
    
    <button className='py-[10px] px-[9px] w-[200px] flex justify-center bg-primary text-[17px] font-lg font-bold rounded-md flex items-center'> <img src={addIcon} className="mr-2"/> Create Collection </button>
    <div className='flex flex-col items-center gap-5'>
      <img src={noCollectionItem}/>
      <p className='font-light text-textPrimary text-xl'>No collection Found!</p>
    </div>
  </div>
  )
}


const Home = () => {
  const [empty,setEmpty] = useState(false);


  if(empty){
    return <EmptyCollections/>
  }



  return (
    <div>
        <div className='py-3 bg-bgPrimary border-b border-bgGrey px-4'>
          <SearchBox/>
        </div>
    <div className='px-4 py-4 bg-bgSecondary'>
        <div className='flex justify-between items-center'>
            <p className='text-[18px] text-textPrimary'>Collections<span className='ml-2 rounded-full py-[2px] bg-success p-2'>8</span></p>
            <button className='py-[10px] px-[9px] bg-primary text-[13px] font-lg font-bold rounded-md flex items-center'> <img src={addIcon} className="mr-2"/> Create Collection </button>
        </div>
        <div className='mt-4'>
            <CollectionItem name="Python Automation" count="8"/>
            <CollectionItem name="Python Automation" count="8"/>
            <CollectionItem name="Python Automation" count="8"/>
            <CollectionItem name="Python Automation" count="8"/>
        </div>
    </div>
    </div>
  )
}

export default Home