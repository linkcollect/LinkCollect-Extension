import React from 'react'
import serverDown from "../../assets/server down.svg"

const Offline = () => {
  return (
    <div className="flex gap-[50px] flex-col justify-center h-[70%] items-center">
      <img src={serverDown} className="mr-2" />
    <div className="flex flex-col items-center">
      <h4 className='text-textPrimary font-bold text-[20px] mb-5'>Looks like Something went wrong!</h4>
       <p className='text-textPrimary text-[16px] w-[80%] mb-3 text-center'>You may check your network once, if network is fine the our server might be offline... 🤕 </p>
       <p className='text-textPrimary text-[16px] w-[80%] text-center'>But hey, your bookmarks are safe with us 👍</p>
    </div>
  </div>
  )
}

export default Offline