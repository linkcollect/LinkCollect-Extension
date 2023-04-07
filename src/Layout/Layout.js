import React from "react";
import Navbar from "../Components/Navbar/Navbar";
const Layout = ({ children }) => {
  return (
    <div className="bg-bgPrimary w-[400px] h-[600px] rounded-md">
      <Navbar />
      {children}
      <div className="fixed bottom-[20px] left-0 text-primary text-light w-full text-center ">Powered by Linkcollect.io</div>
    </div>
  );
};

export default Layout;
