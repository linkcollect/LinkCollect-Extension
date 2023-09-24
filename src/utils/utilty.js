// get current tab info
export const nameShortner = (name,length) => {
    if(!name) return ""
    return name.length > length ? name.slice(0,length)+"..." : name
}
//Getting original from any website links
export const getOrigin = (weblink) =>{
    const url = new URL(weblink);
      return url.host
}

export const dataSortByType = (data, sortingType)=>{
    const pins = data.filter(collection => collection.isPinned === true).sort((data1, data2) =>new Date(data2.pinnedTime) - new Date(data1.pinnedTime));
    switch(sortingType){
        case "MOST_BOOKMARKED":
            const sorteDataByNumberOfBookmarks = data.filter(collection => collection.isPinned === false || collection.isPinned===undefined).sort((data1,data2)=>data2.timelines.length-data1.timelines.length);
            // console.log(sorteDataByNumberOfBookmarks);
            return [...pins, ...sorteDataByNumberOfBookmarks];
        default:
            const sorteDataByUpdated = data.filter(collection => collection.isPinned === false || collection.isPinned===undefined).sort((data1,data2)=>new Date(data2.updatedAt)-new Date(data1.updatedAt));
            // console.log(sorteDataByUpdated);
            return [...pins, ...sorteDataByUpdated];
    }

}

// weight functionality for searchterm sort
export const calculateWeight = (timeline, query) =>  {
    const titleMatch = timeline.title.toLowerCase().includes(query.toLowerCase());
    const linkMatch = timeline.link.toLowerCase().includes(query.toLowerCase());
    const noteMatch = timeline.note?.toLowerCase().includes(query.toLowerCase());
  
    // Assign weights to match types (higher weight means it comes first)
    return titleMatch ? 3 : linkMatch ? 2 : noteMatch ? 1 : 0;
  }