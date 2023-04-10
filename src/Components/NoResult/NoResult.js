import React from "react";
import noCollectionItem from "../../assets/Icons/no-collection.svg";
import addIcon from "../../assets/Icons/add-tab.svg";
const NoResult = ({navigator, title, noResultName}) => {
  return (
    <div className="flex h-[70%] flex-col justify-around items-center">
      <button
        onClick={navigator}
        className="py-[10px] px-[9px] w-[200px] flex justify-center bg-primary text-[17px] font-lg font-bold rounded-md flex items-center"
      >
        {" "}
        <img src={addIcon} className="mr-2" /> {title}{" "}
      </button>
      <div className="flex flex-col items-center gap-5">
        <img src={noCollectionItem} />
        <p className="font-light text-textPrimary text-xl">
          No {noResultName} Found!
        </p>
      </div>
    </div>
  );
};

export default NoResult;
