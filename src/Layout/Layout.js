import React from "react";
import Navbar from "../Components/Navbar/Navbar";
const Layout = ({ token, children }) => {
  return (
    <div className="bg-bgPrimary w-[400px] h-[600px] rounded-md overflow-hidden">
      {token && <Navbar />}
      {children}
      {/* <div className="fixed bottom-[5px] left-0 text-primary text-light w-full text-center ">Powered by Linkcollect.io</div> */}
    </div>
  );
};

export default Layout;
