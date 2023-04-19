export const getCurrentTab = async () =>{
    let tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    return tabs[0];
}
export const getLocalData = async (key1,...rest) =>{
    const values = await chrome.storage.local.get([key1])
    return values;
}
export const upadteLatestCollection =async (id,collectionName) =>{
   await chrome.storage.local.set({collection:{id:id,collectionName:collectionName}})
}