import React from "react";
import Input, {Select} from "../Components/Input/Input";
import BackArrow from "../assets/Icons/arrow.svg";
import { useNavigate } from "react-router-dom";


const NewCollection = () => {
  const navigate = useNavigate();
  const onInput = (e) => {
    console.log(e.target.value);
  };
  const onInputFile = (e) => {
    console.log(e.target.value);
  };

  const backButtonHnadler = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  return (
    <>
    {/* Need to create a shadow warppr later */}
      <div className="pt-4 pl-6 bg-bgPrimary border-b border-bgGrey px-4 pb-4 drop-shadow-md">
        <button onClick={backButtonHnadler} className="cursor-pointer flex items-center gap-3 [&>img]:rotate-[90deg] [&>img]:w-[22px]">
          <img src={BackArrow} /> <p className="text-textPrimary font-bold text-xl">Create Collection</p>
        </button>
      </div>
      <div className="bg-bgPrimary bg-bgSecondary p-3 px-5 flex flex-col justify-center items-center h-[60%]">
        <div className="w-full">
          <Input
            label="Collection Name"
            placeholder="Name your collection"
            type="text"
            onInputHandler={onInput}
            inputClass="textClass"
          />
          <Select options={[{name:"Private",value:"private"}, {name:"Public",value:"public"}]}/>
          <Input
            label="Collection Thumnail"
            placeholder="Upload image"
            type="file"
            onInputHandler={onInputFile}
            inputClass="fileClass"
          />
          <button className="py-[10px] px-[36px] bg-primary text-[17px] w-full font-normal mt-3 rounded-md">
            Create Collection
          </button>
        </div>
      </div>
    </>
  );
};

export default NewCollection;
