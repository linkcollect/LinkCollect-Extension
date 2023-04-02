import React from "react";
import Navbar from "../Components/Navbar/Navbar";
const Layout = ({ children }) => {
  return (
    <div className="bg-blackbg w-[400px] h-[600px] rounded-md">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
