// get current tab info
export const nameShortner = (name,length) => {
    return name.length > length ? name.slice(0,length)+"..." : name
}
//Getting original from any website links
export const getOrigin = (weblink) =>{
    const url = new URL(weblink);
      return url.host
}

export const dataSortByType = (data,sortingType)=>{
    
    switch(sortingType){
        case "MOST_BOOKMARKED":
            const sorteDataByNumberOfBookmarks = data.sort((data1,data2)=>data2.timelines.length-data1.timelines.length);
            return sorteDataByNumberOfBookmarks;
        default:
            const sorteDataByUpdated = data.sort((data1,data2)=>new Date(data2.updatedAt)-new Date(data1.updatedAt));
            return sorteDataByUpdated;
    }

}
