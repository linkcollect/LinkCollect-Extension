import React, { useEffect } from 'react'
import logo from "../assets/Branding/logo_name.svg"
import splashLogo from "../assets/Branding/splash-branding.svg"


const Splash = () => {

  const startLoginHanlder = () =>{

      chrome.tabs.create({
        url:"https://linkcollect.io/login"
      })
    
  }


  return (
    <div className='p-[2rem] flex flex-col space-between items-center h-[80%]'>
      <img src={logo}/>
      <div className='relative flex flex-col justify-center items-center'>
        <img className='w-[85%]' src={splashLogo}/>
        <div className='conatiner text-center absolute top-[200px]'>
            <p className='text-[22px] text-textPrimary font-bold mb-2 mt-2'>Stay organized, save your web links</p>
            <p className='text-textPrimary font-light text-[14px] flex flex-col w-full'>
            linkcollect is the simplest way to save & share
            web links from anywhere to anyone
            </p>
            {/* <p className='text-textPrimary font-light text-[14px] flex flex-col w-full'> */}
            {/* </p> */}
         <div className='absolute top-[100px] left-[0px] flex justify-center w-full'> 
         <button onClick={startLoginHanlder} target='_blank' className='py-[10px] px-[36px] mt-[50px] bg-primary text-[14px] font-medium rounded-md'>Get Started</button>
         </div>
        </div>
      </div>
    </div>
  )
}

export default Splash