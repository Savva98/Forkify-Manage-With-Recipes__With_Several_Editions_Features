import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
const doReadyString = function(strn, i, i2){
  if(!i && i !==0){ 
    return strn.slice(i2).replace(/\D/g, '')[0]
  }
  return strn.replace(/\D/g, '').slice(i, i2)
}
export const extractNum = function (str){
  if(!str) return ``;
  if(!str.replace(/\D/g, '')) return``
  if(str.startsWith('/') || str.endsWith('/'))
  {
    return ``;
  }
  if(str.length > 8){
    return ``;
  }
  const strn = str.replaceAll(' ', '');
  let num = 0;
  let num1 = 0;
  let num2 = 0;
  let readyString;
  let firstNum=0;
  if(strn.length >= 4 && strn.includes('/')){
    const slashIndex = strn.indexOf('/');
    const s1  = doReadyString(strn, 0, slashIndex-1);
    const s2 = strn.slice(s1.length, slashIndex).replace(/\D/g, '')[0];
    const s3 = doReadyString(strn,'',slashIndex)[0];

    if(!s2.includes('1') && !s2.includes('3')){
      return ``
    }
    if(!s3.includes('2') && !s3.includes('4')){
      return ``
    }

    readyString = s1 + s2 + s3;
    if(s1.length>=2){
      firstNum = Number(s1);
      readyString = readyString.slice(s1.length);
    }else if(readyString.startsWith('2')||readyString.startsWith('4') || readyString.startsWith('3') ){
    firstNum = Number(s1)
    readyString = readyString.slice(1);
   }else{
    firstNum = Number(s1)
    readyString = readyString.slice(1)
   }
    const index = readyString.includes('2') ? readyString.indexOf('2') : readyString.indexOf('4');
    readyString = readyString.replace(readyString[index], `/${readyString[index]}`);
    const indexSlash = readyString.indexOf('/');
    num1 = Number(readyString[indexSlash-1]);
    num2 = Number(readyString[indexSlash+1]);
    num = firstNum + num1/num2;
  }
  if(strn.length<4 && !strn.includes('/')){
    readyString = strn.replace(/\D/g, '');
    num = Number(readyString);
    
  }
  if(strn.length<4 && strn.includes('/')){
    num1 = Number(strn[0]);
    num2 = Number(strn[2]);
    if(num1!==1 && num1!==3){
      return``
    }
    if(num2!==2 && num2!==4){
      return``
    }
    num = num1 / num2;
  }
  if(strn.length>=4 && !strn.includes('/')){
    num = Number(strn);
  }
  return num.toString();
}
/*
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
