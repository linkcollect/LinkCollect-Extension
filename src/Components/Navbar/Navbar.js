import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/Branding/logo2.svg";
import avatar from "../../assets/avatar.svg";
import SideMenu from "../Menu/SideMenu";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/userSlice";


const Navbar = ({ profilePic }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileRef=useRef();
  const navaref = useRef();
  
  const logoutHandler  = (e) =>{
    e.preventDefault();
    chrome.storage.local.remove(['token'],()=>{
      dispatch(logout());
      navigate("/")
    })
  }

  window.addEventListener('click',e=>{
    if(e.target !== profileRef.current && e.target !== navaref.current) {
      setShow(false);
    }
  })

  return (
    <div className="flex justify-between h-[80px] items-center px-3 border-b border-bgGrey">
      <a href="https://linkcollect.io/" target="_blank" className="cursor-pointer">
        <img src={logo} className={`w-[40%] ${show ? 'translate-x-full' : 'translate-x-0'} ease-in-out duration-500`} />
      </a>

      <div className="">
          <div className="w-[40px] rounded-full overflow-hidden cursor-pointer" onClick={()=>setShow(prevState=>!prevState)}>
            <img src={profilePic ? profilePic : avatar} ref={profileRef}/>
          </div>
      </div>
      <SideMenu ref={navaref} onLogout={logoutHandler} isOpen={show}/>
    </div>
  );
};

export default Navbar;
