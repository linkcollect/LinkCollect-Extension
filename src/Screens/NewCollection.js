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
    // setImage()
    console.log(e.target.value[0]);
  };



  const backButtonHnadler = (e) => {
    e.preventDefault();
    navigate(-1);
  }

  const handleSubmit =  async (e) => {
    e.preventDefault();
    console.log(data)
    if(data.title=== "" ) return
    setLoading(true);
    try{
      const form = new FormData();
      console.log(data.title);
      form.append("title",data.title);
      form.append("description",data.description);
      form.append("privacy",data.privacy);
      const {collectionData} = await createCollection(form);
      navigate(-1)
    }catch(e){
      console.log(e);
    }
    setLoading(false);
    console.log(data);
  }
  

  return (
    <>
    {/* Need to create a shadow warppr later */}
      <div className="pt-4 pl-6 bg-bgPrimary border-b border-bgGrey px-4 pb-4 drop-shadow-md">
        <button onClick={backButtonHnadler} className="cursor-pointer flex items-center gap-3 [&>img]:rotate-[90deg] [&>img]:w-[22px]">
          <img src={BackArrow} /> <p className="text-textPrimary font-bold text-xl">Create Collection</p>
        </button>
      </div>
      <div className="bg-bgPrimary bg-bgSecondary p-3 px-5 flex flex-col justify-center items-center h-[70%]">
        <div className="w-full">
          <Input
            label="Collection Name"
            placeholder="Name your collection"
            type="text"
            onInputHandler={onInput}
            inputClass="textClass"
            name="title"
          />
          <Input
            label="Description"
            placeholder="A resource for learning.."
            type="text"
            onInputHandler={onInput}
            inputClass="textClass"
            name="description"
          />
          <Select name="privacy" value={data.privacy} onInputHandler={onInput} options={[{name:"Private",value:"private"}, {name:"Public",value:"public"}]}/>
          <Input
            label="Collection Thumnail"
            placeholder="Upload image"
            type="file"
            onInputHandler={onInputFile}
            inputClass="fileClass"
          />
          <button type="button" className="py-[10px] px-[36px] bg-primary text-[17px] w-full font-normal mt-3 rounded-md disabled:bg-lightPrimary disabled:cursor-not-allowed flex justify-center" disabled={loading} onClick={handleSubmit} >
            {!loading ? "Create Collection" : 
            // Need to add the svg in seprate file
            <Loader/>
            }
          </button>
        </div>
      </div>
    </>
  );
};

export default NewCollection;
