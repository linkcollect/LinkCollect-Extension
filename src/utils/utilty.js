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
    console.log(sortingType);
    const pins = data.filter(collection => collection.isPinned === true).sort((data1, data2) =>new Date(data2.pinnedTime) - new Date(data1.pinnedTime));
    switch(sortingType){
        case "MOST_BOOKMARKED":
            const sorteDataByNumberOfBookmarks = data.filter(collection => collection.isPinned === false).sort((data1,data2)=>data2.timelines.length-data1.timelines.length);
            console.log(sorteDataByNumberOfBookmarks);
            return [...pins, ...sorteDataByNumberOfBookmarks];
        default:
            const sorteDataByUpdated = data.filter(collection => collection.isPinned === false).sort((data1,data2)=>new Date(data2.updatedAt)-new Date(data1.updatedAt));
            console.log(sorteDataByUpdated);
            return [...pins, ...sorteDataByUpdated];
    }

}
