import React from "react";

const classMapper = {
    fileClass : `block w-full text-sm text-slate-500 bg-blackbgOne border border-lightText rounded-md py-2 px-3
    file:mr-4 file:py-0 file:px-4
    file:rounded-full file:border-0
    file:text-[12px] file:font-light
    file:bg-blackbgTwo file:text-lightText
    hover:file:bg-violet-100
    `,
    textClass : "mt-1 px-3 py-2 bg-blackbgOne border border-lightText placeholder-lightText focus:outline-none block w-full rounded-md sm:text-sm"
}


const Input = ({name,type,label,placeholder,onInputHandler,inputClass}) => {
  return (
    <label className="block my-4">
      <span className="after:content-['*'] after:ml-0.5 after:text-white block text-[20px] font-normal mb-1">
        {label}
      </span>
      <input
        type={type}
        name={name}
        className={classMapper[inputClass]}
        placeholder={placeholder}
        onChange={onInputHandler}
        
      />
    </label>
  );
};

export default Input;
