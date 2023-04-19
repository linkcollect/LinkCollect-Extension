// get current tab info
export const nameShortner = (name,length) => {
    return name.length > length ? name.slice(0,length)+"..." : name
}
//Getting original from any website links
export const getOrigin = (weblink) =>{
    console.log(weblink)
    const url = new URL(weblink);
      return url.host
}

export const sortByLatestUpdated = (data)=>{
    const sorteData = data.sort((data1,data2)=>new Date(data2.updatedAt)-new Date(data1.updatedAt));
    console.log(sorteData)
    return sorteData;
}