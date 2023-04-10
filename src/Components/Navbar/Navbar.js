import React, { useState } from "react";
import logo from "../../assets/Branding/logo2.svg";
import avatar from "../../assets/avatar.svg";
import SideMenu from "../Menu/SideMenu";
import { useDispatch } from "react-redux";
import { authLogout } from "../../actions/authActions";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler  = (e) =>{
    e.preventDefault();
    console.log("log")
    chrome.storage.local.remove(['token'],()=>{
      dispatch(authLogout());
      navigate("/")
    })
  }
  return (
    <div className="flex justify-between h-[80px] items-center px-3 border-b border-bgGrey">
      <div>
        <img src={logo} className="w-[40%]" />
      </div>

      <div className="">
          <div className="w-[40px] rounded-full overflow-hidden cursor-pointer" onClick={()=>setShow(prevState=>!prevState)}>
            <img src={avatar} />
          </div>
      </div>
      {show && (
          <SideMenu onLogout={logoutHandler}/>
        )}
    </div>
  );
};

export default Navbar;
