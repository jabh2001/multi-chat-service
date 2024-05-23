import { flushSync } from "react-dom";

export const toHHMMSS = function (time:string ) {
    let sec_num = parseInt(time, 10); // don't forget the second param
    if(isNaN(sec_num)) return "00:00";
    let hours   = Math.floor(sec_num / 3600);
    let hoursText = String(hours)
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let minutesText = String(minutes)
    let seconds = sec_num - (hours * 3600) - (minutes * 60);
    let secondsText = String(seconds)

    if (hours   < 10) {hoursText   = "0"+hours;}
    if (minutes < 10) {minutesText = "0"+minutes;}
    if (seconds < 10) {secondsText = "0"+seconds;}
    return `${hoursText === "00" ? "" : hoursText + ":"}${minutesText}:${secondsText}`
}
export const characters ='abcdefghijklmnopqrstuvwxyz';

export function generateString(length:number) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

export const transitionViewIfSupported = (updateCb:()=>any) => {
    if (document.startViewTransition) {
      document.startViewTransition(() =>{
        flushSync(() => {
            updateCb()
        })
      });
    } else {
      updateCb();
    }
  };