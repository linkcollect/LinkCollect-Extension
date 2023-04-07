import React from 'react'
import logo from "../assets/Branding/logo_name.svg"
import splashLogo from "../assets/Branding/splash-branding.svg"


const Splash = () => {
  return (
    <div className='p-[2rem] flex flex-col space-between items-center h-[80%]'>
      <img src={logo}/>
      <div className='relative flex flex-col justify-center items-center'>
        <img className='w-[85%]' src={splashLogo}/>
        <div className='conatiner text-center absolute top-[200px]'>
            <p className='text-[22px] text-textPrimary font-bold mb-2 mt-2'>Stay organized, save your <br/> web links</p>
            <p className='text-textPrimary font-light text-[14px] flex flex-col'>
            linkcollect is the simplest way to save & share <br/> web links from anywhere to anyone
            </p>
         <button className='py-[10px] px-[36px] mt-[50px] bg-primary text-[14px] font-medium rounded-md'>Get Started</button>
        </div>
      </div>
    </div>
  )
}

export default Splash