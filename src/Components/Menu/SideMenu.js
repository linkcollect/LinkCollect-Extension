import React from "react";
import command from "../../assets/Icons/command.svg";
import openLink from "../../assets/Icons/openLink.svg";
import help from "../../assets/Icons/help.svg";
import logoout from "../../assets/Icons/logout.svg";

const MenuItem = ({ name, icon, onCLickHandler, link }) => {
  console.log(onCLickHandler);
  return (
    <a href={link} target="_blank">
      <li className="flex items-center pb-2 h-[50px] pl-3 border-b border-secodary">
        <button onClick={onCLickHandler} className="flex items-center w-full">
          <img src={icon} className="w-[17px]" />
          <p className="text-textPrimary pl-2 text-xl font-light">{name}</p>
        </button>
      </li>
    </a>
  );
};

const SideMenu = React.forwardRef(({ onLogout, isOpen, navref }) => {
  console.log(isOpen);

  const menuList = [
    {
      name: "Open in Web",
      icon: openLink,
      link: "https://www.linkcollect.io/",
    },
    {
      name: "View Commands",
      icon: command,
      link: "https://www.linkcollect.io/commands",
    },
    {
      name: "Help",
      icon: help,
      link: "https://www.linkcollect.io/help",
    },
    {
      name: "Logout",
      icon: logoout,
      onCLickHandler: onLogout,
    },
  ];

  return (
    <div
      className={`fixed fixed z-[99] overflow-hidden top-[81px] right-0 h-full w-full flex justify-end bg-bgSecodary/[0.3] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } ease-in-out duration-500`}
    >
      <div
        className="drop-shadow-md h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[15rem] h-full bg-bgPrimary pt-2">
          <ul className="text-[16px]">
            {menuList.map((menu) => (
              <MenuItem
                key={menu.name}
                name={menu.name}
                icon={menu.icon}
                onCLickHandler={menu.onCLickHandler}
                link={menu.link}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

export default SideMenu;
