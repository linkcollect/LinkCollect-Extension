import React from "react";
import command from "../../assets/Icons/command.svg";
import openLink from "../../assets/Icons/openLink.svg";
import help from "../../assets/Icons/help.svg";
import logoout from "../../assets/Icons/logout.svg";


const MenuItem =  ({name,icon,onCLickHandler}) =>{
  console.log(onCLickHandler)
    return (
        <li className="flex items-center pb-2 h-[50px] pl-3 border-b border-secodary">
            <button onClick={onCLickHandler} className="flex items-center w-full">
              <img src={icon} className="w-[17px]" />
            <p className="text-textPrimary pl-2 text-xl font-light">{name}</p>
            </button>
        </li>
    )
}


const SideMenu = ({onLogout}) => {
  

    const menuList =  [{
        name:"Open in Web",
        icon: openLink,
    },
    {
        name:"View Commands",
        icon: command,
    },
    {
        name:"Help",
        icon:help
    },
    {
        name:"Logout",
        icon:logoout,
        onCLickHandler:onLogout
    }
    
]

  return (
    <div className="fixed z-[99] overflow-hidden drop-shadow-md h-full top-[81px] right-0">
      
      <div className="w-[15rem] h-full bg-bgPrimary pt-2">
        <ul className="text-[16px]">
          {menuList.map(menu=><MenuItem key={menu.name} name={menu.name} icon={menu.icon} onCLickHandler={menu.onCLickHandler}/>)}
        </ul>
      </div>
    </div>
  );
};



export default SideMenu;
