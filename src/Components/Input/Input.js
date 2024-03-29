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
    "mt-1 px-3 py-2 bg-bgSecodary border border-bgGrey text-textSecondary placeholder-textSecondary focus:outline-none block w-full rounded-md sm:text-sm",
};

const Input = ({
  name,
  type,
  label,
  placeholder,
  onInputHandler,
  inputClass,
  value,
  required
}) => {
  return (
    <label className="block">
      <span className="text-textPrimary flex justify-between items-end text-[16px] font-light mb[3px]">
        <p>{label}</p>
        {type!=="file" && <small className="text-xs"><span className={`${value?.length>required ? "text-danger":""}`}>{value?.length}</span>/{required}</small>}
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

export const Select = ({ name, onInputHandler,options,value }) => {
  return (
    <div>
      <label
        htmlFor="privacy"
        className={`block font-light text-textPrimary text-[16px]`}
      >
        Privacy
      </label>
      <select
        id="pravacy"
        className={`bg-bgSecodary border border-bgGrey text-textSecondary placeholder-textSecondary text-normal rounded-lg focus:ring-textSecondary focus:border-textSecondary block w-full p-3`}
        onChange={onInputHandler}
        name={name}
        value={value}
      >
        {options.map((opt, index)=>(
          <option key={index} value={opt.value}>{opt.name}</option>
        ))}
      </select>
    </div>
  );
};

export default Input;
