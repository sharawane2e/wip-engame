export const crypt = (salt:any, text:any) => {
    const textToChars = (text:any) => text.split("").map((c:any) => c.charCodeAt(0));
    const byteHex = (n:any) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code:any) => textToChars(salt).reduce((a:any, b:any) => a ^ b, code);
  
    return text
      .split("")
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join("");
};
  
export const decrypt = (salt:any, encoded:any) => {
    const textToChars = (text:any) => text.split("").map((c:any) => c.charCodeAt(0));
    const applySaltToChar = (code:any) => textToChars(salt).reduce((a:any, b:any) => a ^ b, code);
    return encoded
      .match(/.{1,2}/g)
      .map((hex:any) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode:any) => String.fromCharCode(charCode))
      .join("");
};

function genSubscriptionKey(userObj:any, widObj:any){
    let key = ""
    key = userObj?.accessToken + "*" + widObj.id + "*" + "hits" + "*" + "true";
    console.log("Subscription Key",key);
    let encrypt = crypt("saltise2eresearch", key)
    return encrypt;
}