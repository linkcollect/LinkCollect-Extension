import React from "react";
import Navbar from "../Components/Navbar/Navbar";
import { useSelector } from "react-redux";
import { useLiveMessage } from "../hooks/useLiveMessage";
const Layout = ({ token, children }) => {
  const counter = useLiveMessage()
  const user = useSelector(state => state.user);
  return (
    <div className="bg-bgPrimary w-[400px] h-[600px] rounded-md overflow-hidden">
      {user.token && <Navbar profilePic={user.user.profilePic}/>}
      {children}
      {/* <div className="fixed bottom-[5px] left-0 text-primary text-light w-full text-center ">Powered by Linkcollect.io</div> */}
    </div>
  );
};

export default Layout;
