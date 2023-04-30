import React, {useState} from "react";
import Input, {Select} from "../Components/Input/Input";
import BackArrow from "../assets/Icons/arrow.svg";
import { useNavigate } from "react-router-dom";
import { createCollection } from "../api/collectionService";
import Loader from "../Components/Loader/Loader";


const NewCollection = () => {
  const navigate = useNavigate();
  const [data,setData] = useState({
    title:"",
    privacy:"public",
    description:""
  })
  const [image,setImage] = useState();
  const [loading,setLoading] = useState(false);
  const onInput = (e) => {
    e.preventDefault();
    setData(state=>({...state,[e.target.name]:e.target.value}));
  };
  const onInputFile = (e) => {
    e.preventDefault();
    setImage(e.target.files[0])
  };



  const backButtonHnadler = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  const handleSubmit =  async (e) => {
    e.preventDefault();
    if(data.title==="" || data.title.length>40 || data.description.length>240) return
    setLoading(true);
    try{
      const form = new FormData();
      form.append("title",data.title);
      form.append("description",data.description);
      form.append("privacy","isPublic",data.privacy==="public" ? true : false);
      if(image!=="")
        form.append("image",image);
      const {collectionData} = await createCollection(form);
      navigate(-1)
    }catch(error){
    }
    setLoading(false);
  }
  

  return (
    <>
    {/* Need to create a shadow warppr later */}
      <div className="pt-4 pl-6 bg-bgPrimary border-b border-bgGrey px-4 pb-4 drop-shadow-md">
        <button onClick={backButtonHnadler} className="cursor-pointer flex items-center gap-3 [&>img]:rotate-[90deg] [&>img]:w-[22px]">
          <img src={BackArrow} /> <p className="text-textPrimary font-bold text-xl">Create Collection</p>
        </button>
      </div>
      <div className="bg-bgPrimary bg-bgSecondary p-3 px-5 flex flex-col justify-between items-center h-[73%]">
        <div className="w-full">
          <Input
            label="Collection Name"
            placeholder="Name your collection"
            type="text"
            onInputHandler={onInput}
            inputClass="textClass"
            name="title"
            value={data.title}
            required={40}
          />
          {data.title.length > 40 && <small className="text-xs text-danger ml-[11px] mt-[2px]">Name length should be less than 40</small>}
          <Input
            label="Description"
            placeholder="A resource for learning.."
            type="text"
            onInputHandler={onInput}
            inputClass="textClass"
            name="description"
            value={data.description}
            required={240}
          />
          {data.description.length > 240 && <small className="text-xs text-danger ml-[11px]">Name length should be less than 240</small>}
          <Select name="privacy" value={data.privacy} onInputHandler={onInput} options={[{name:"Private",value:"private"}, {name:"Public",value:"public"}]}/>
          <Input
            label="Collection Thumnail"
            placeholder="Upload image"
            type="file"
            onInputHandler={onInputFile}
            inputClass="fileClass"
          />
        </div>
          <button type="button" className="py-[10px] px-[36px] bg-primary text-[17px] w-full font-normal mt-3 rounded-md disabled:bg-lightPrimary disabled:cursor-not-allowed flex justify-center" disabled={loading} onClick={handleSubmit} >
            {!loading ? "Create Collection" : 
            // Need to add the svg in seprate file
            <Loader/>
            }
          </button>
      </div>
    </>
  );
};

export default NewCollection;
