import React, { useState } from "react";
import logo from "../../assets/Branding/logo2.svg";
import avatar from "../../assets/avatar.svg";
import SideMenu from "../Menu/SideMenu";


const Navbar = () => {
  const [show, setShow] = useState(false);
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
          <SideMenu/>
        )}
    </div>
  );
};

export default Navbar;
