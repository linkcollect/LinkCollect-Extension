import React, {  useRef } from "react";

const Tooltip = ({ name , children}) => {
  return (
    <div  className="group relative inline-block">
      {children}
      <span
        className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-bgPrimary text-textPrimary border border-primary p-1 right-[-10px] rounded absolute z-[999999] top-full mt-1 whitespace-nowrap"
      >
        {name}
      </span>
    </div>
  );
};

export const ToolTip2 = ({name,children}) =>{
  return(
    <div  className="group relative inline-block">
      {children}
      <span
        className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-secodaryLight text-textPrimary py-1 px-2 left-[42px] rounded absolute z-[999999] top-[-9px] mt-1 w-[150px]"
      >
        {name}
      </span>
    </div>
  )
}

export default Tooltip;
