import React from 'react'
import logo from "../assets/Logo.svg"
const Home = () => {
  return (
    <div className='p-[2rem] flex flex-col justify-center items-center h-[80%]'>
        <img className='w-[150px]' src={logo}/>
        <div className='conatiner text-center'>
            <p className='text-[18px] font-medium mb-2 mt-2'>More than a bookmarking tool</p>
            <p className='text-lightText'>Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. </p>
            <button className='py-[10px] px-[36px] bg-primary text-[14px] font-medium mt-2 rounded-md'>Get Started</button>
        </div>
    </div>
  )
}

export default Home