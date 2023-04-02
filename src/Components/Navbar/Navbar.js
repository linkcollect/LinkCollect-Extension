import React, { useState } from "react";
import logo from "../../assets/Logo.svg";
import linkArrow from "../../assets/linkArrow.svg";
import avatar from "../../assets/avatar.svg";
import angalerArrow from "../../assets/angleArrow.svg";
import command from "../../assets/command.svg";
import openLink from "../../assets/openLink.svg"
import help from "../../assets/help.svg"
import logoout from "../../assets/logout.svg"

const Navbar = () => {
  const [isLoggedIn, setIsloggedIn] = useState(true);
  const [show,setShow]=useState(false);
  return (
    <div className="flex justify-between h-[50px] px-5 items-center pt-3">
      <div>
        <img src={logo} className="w-[30px]" />
      </div>
      {!isLoggedIn && (
        <div className="flex text-lightText items-center text-[15px]">
          <a href="" className="mr-[5px]">
            vist linkcollect.io
          </a>
          <img className="w-[10px]" src={linkArrow} />
        </div>
      )}
      {isLoggedIn && (
        <>
          <p className="text-xl font-medium">Home</p>
          <div className="relative">
            <div className="bg-darkgrey flex items-center justify-between px-1 rounded-full w-[60px] h-[30px] relative" >
              <div className="w-[25px] rounded-full overflow-hidden">
                <img src={avatar} />
              </div>
              <div className="rotate-[-90deg] pb-2 cursor-pointer" onClick={()=>setShow(preState=>!preState)}>
                <img src={angalerArrow} />
              </div>
            </div>
            {show&& <div className="absolute z-[99] top-[35px] right-[4px]">
              <div className="w-[12rem] rounded-md bg-darkgrey px-3 pt-2">
                <ul className="text-[16px]">
                  <li className="flex justify-between pb-2">
                    <p>Open in Web</p>
                    <button><img src={openLink}/></button>
                  </li>
                  <li className="flex justify-between pb-2">
                    <p>View Commands</p>
                    <button><img src={command}/></button>
                  </li>
                  <li className="flex justify-between pb-2">
                    <p>Help</p>
                    <button><img src={help}/></button>
                  </li>
                  <li className="flex justify-between pb-2">
                    <p>Logout</p>
                    <button><img src={logoout}/></button>
                  </li>
                </ul>
              </div>
            </div>}
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
