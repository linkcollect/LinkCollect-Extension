import React from "react";

const classMapper = {
  fileClass: `block w-full text-sm text-textPrimary bg-bgSecodary border border-bgGrey rounded-md py-2 px-3
    file:mr-4 file:py-0 file:px-4 file:py-1
    file:rounded-md file:border-0
    file:text-[16px] file:font-light
    file:bg-secodary file:text-primary
    hover:file:bg-violet-100
    file:cursor-pointer
    `,
  textClass:
    "mt-1 px-3 py-2 bg-bgSecodary border border-bgGrey text-textPrimary placeholder-textPrimary focus:outline-none block w-full rounded-md sm:text-sm",
};

const Input = ({
  name,
  type,
  label,
  placeholder,
  onInputHandler,
  inputClass,
  value
}) => {
  return (
    <label className="block my-2">
      <span className="text-textSecondary block text-[20px] font-light mb-1">
        {label}
      </span>
      <input
        type={type}
        name={name}
        className={classMapper[inputClass]}
        placeholder={placeholder}
        onChange={onInputHandler}
        value={value}
      />
    </label>
  );
};

export const Select = ({ name,onInputHandler,options,value }) => {
  return (
    <>
      <label
        for="privacy"
        class="block mb-2 font-light text-textSecondary block text-[20px]"
      >
        Privacy
      </label>
      <select
        id="pravacy"
        class="bg-bgSecodary border border-bgGrey text-textPrimary text-normal rounded-lg focus:ring-textSecondary focus:border-textSecondary block w-full p-3"
        onChange={onInputHandler}
        name={name}
        value={value}
      >
        {options.map((opt)=>(
          <option value={opt.value}>{opt.name}</option>
        ))}
      </select>
    </>
  );
};

export default Input;
