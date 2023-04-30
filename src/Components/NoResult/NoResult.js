import React from "react";
import noCollectionItem from "../../assets/Icons/no-collection.svg";
import addIcon from "../../assets/Icons/add-tab.svg";
import Loader from "../Loader/Loader";
const NoResult = ({onClickHandler, title, noResultName,bookMark,loading}) => {
  return (
    <div className="flex gap-[50px] flex-col justify-around h-[60%] items-center">
      <button
        onClick={onClickHandler}
        className={`py-[10px] px-[9px] w-[200px] flex justify-center bg-primary text-[17px] font-lg font-bold rounded-md flex items-center ${bookMark ? 'order-2' : null}`}
      >
        {" "}
        {bookMark && loading ? <Loader/> :
        <>
        <img src={addIcon} className="mr-2" />{title}{" "}
        </>
        }
      </button>
      <div className={`flex flex-col items-center gap-5 ${bookMark ? 'order-1' : null}`}>
        <img src={noCollectionItem} />
        <p className="font-light text-textPrimary text-xl">
          No {noResultName} Found!
        </p>
      </div>
    </div>
  );
};

export default NoResult;
