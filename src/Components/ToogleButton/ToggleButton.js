import React from "react";

const ToggleButton = ({isPublic,onPrvaciyUpdate}) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" value="" className="sr-only peer" checked={isPublic} onChange={onPrvaciyUpdate}/>
      <div className="w-8 h-[15.5px] bg-primary rounded-full peer peer-checked:after:translate-x-[132%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[6.3px] after:left-[2px] after:bg-white after:rounded-full after:bg-bgPrimary after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  )
};

export default ToggleButton;
