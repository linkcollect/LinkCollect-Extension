import React from 'react'
import logo from "../../assets/Logo.svg"
import linkArrow from "../../assets/linkArrow.svg"
const Navbar = () => {
  return (
    <div className='flex justify-between h-[50px] px-5 items-center'>
        <div>
        <img src={logo} className='w-[30px]'/>
        </div>
        <div className='flex text-lightText items-center text-[15px]'>
            <a href='' className='mr-[5px]'>
                vist linkcollect.io 
            </a>
            <img className='w-[10px]' src={linkArrow}/>
        </div>
    </div>
  )
}

export default Navbar