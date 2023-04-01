import React from "react";
import Input from "../Components/Input/Input";



const NewCollection = () => {
  const onInput = (e)=>{
    console.log(e.target.value)
  }  
  const onInputFile = (e)=>{
    console.log(e.target.value)
  }  
  return (
    <div className="p-[2rem] flex flex-col justify-center items-center h-[80%]">
      <div className="w-full">
        <Input
         label="Collection Name"
         placeholder="Name your collection"
         type="text"
         onInputHandler={onInput}
         inputClass = "textClass"
        />
        <Input
         label="Collection Thumnail"
         placeholder="Upload image"
         type="file"
         onInputHandler={onInputFile}
         inputClass = "fileClass"
        />
        <button className="py-[10px] px-[36px] bg-primary text-[17px] w-full font-normal mt-3 rounded-md">Create Collection</button>
      </div>
    </div>
  );
};

export default NewCollection;
