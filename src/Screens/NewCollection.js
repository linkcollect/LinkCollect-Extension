import React, {useState} from "react";
import Input, {Select} from "../Components/Input/Input";
import BackArrow from "../assets/Icons/arrow.svg";
import { useNavigate } from "react-router-dom";
import { createCollection } from "../api/collectionService";


const NewCollection = () => {
  const navigate = useNavigate();
  const [data,setData] = useState({
    title:"",
    privacy:"",
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
      <div className="bg-bgPrimary bg-bgSecondary p-3 px-5 flex flex-col justify-center items-center h-[60%]">
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
          <Select name="privacy" onInputHandler={onInput} options={[{name:"Private",value:"private"}, {name:"Public",value:"public"}]}/>
          <Input
            label="Collection Thumnail"
            placeholder="Upload image"
            type="file"
            onInputHandler={onInputFile}
            inputClass="fileClass"
          />
          <button type="button" className="py-[10px] px-[36px] bg-primary text-[17px] w-full font-normal mt-3 rounded-md disabled:bg-lightPrimary disabled:cursor-not-allowed" disabled={loading} onClick={handleSubmit} >
            {!loading ? "Create Collection" : 
            // Need to add the svg in seprate file
            <><svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
             "Creating..."
             </>
            }
          </button>
        </div>
      </div>
    </>
  );
};

export default NewCollection;
