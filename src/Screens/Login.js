import React from 'react'
import logo from "../assets/Logo.svg"
const Login = () => {
  return (
    <div className='p-[2rem] flex flex-col justify-center items-center h-[80%]'>
        <img className='w-[150px]' src={logo}/>
        <div className='conatiner text-center flex flex-col'>
            <button className='py-[10px] px-[36px] bg-primary text-[14px] font-medium mt-3 rounded-md'>Create Account</button>
            <button className='py-[10px] px-[36px] border-2 border-primary text-[14px] font-medium mt-3 rounded-md'>Login</button>
        </div>
    </div>
  )
}

export default Login