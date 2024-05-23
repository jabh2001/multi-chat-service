

export async function convertFileToBase64(file:File){
    return new Promise((resolve, reject)=>{
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
    })
}

export function convertBase64ToImgString(base64:string){
    return `data:image/png;base64,${base64}`
}

export function convertBase64ToBlob(data:string, type:string){
    let blobBin = atob(data.split(',')[1]);
    let array = [];
    for(let i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], {type});
    return blob
}