// get current tab info
export const nameShortner = (name) => {
    return name.slice(0,11)+"..."
}
//Getting original from any website links
export const getOrigin = (weblink) =>{
    console.log(weblink)
    const url = new URL(weblink);
      return url.host
}