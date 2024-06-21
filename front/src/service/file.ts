

export async function convertFileToBase64(file:File){
    return new Promise((resolve, reject)=>{
        if(file){
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
        } else {
            resolve( undefined );
        }
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

export function isFileWithName(filename:string){
    return isPdf( filename ) || isWord( filename ) || isPowerPoint( filename ) || isExcel( filename )

}
/**
 * Verifica si el archivo es un PDF.
 * @param fileName - Nombre del archivo a verificar.
 * @returns `true` si es un PDF, `false` en caso contrario.
 */
export function isPdf(fileName: string): boolean {
    const regex = /\.pdf$/i;
    return regex.test(fileName);
}

/**
 * Verifica si el archivo es un documento de Word.
 * @param fileName - Nombre del archivo a verificar.
 * @returns `true` si es un documento de Word, `false` en caso contrario.
 */
export function isWord(fileName: string): boolean {
    const regex = /\.docx?$/i;
    return regex.test(fileName);
}

/**
 * Verifica si el archivo es una presentación de PowerPoint.
 * @param fileName - Nombre del archivo a verificar.
 * @returns `true` si es una presentación de PowerPoint, `false` en caso contrario.
 */
export function isPowerPoint(fileName: string): boolean {
    const regex = /\.pptx?$/i;
    return regex.test(fileName);
}

/**
 * Verifica si el archivo es una hoja de cálculo de Excel.
 * @param fileName - Nombre del archivo a verificar.
 * @returns `true` si es una hoja de cálculo de Excel, `false` en caso contrario.
 */
export function isExcel(fileName: string): boolean {
    const regex = /\.xlsx?$/i;
    // const regex2 = /\.csv$/i;
    return regex.test(fileName)

}

export function getDocumentColor(fileName:string){
    for(const key of Object.keys(DOC_COLORS)){
        if(DOC_COLORS[key](fileName)){
            return key
        }
    }
    return "#000000"
}

export function getDocumentName(fileName:string){
    for(const key of Object.keys(DOC_NAME)){
        if(DOC_NAME[key](fileName)){
            return key
        }
    }
    return "UNK"
}
export function getDocumentUrl(fileName:string){
    for(const key of Object.keys(DOC_URL)){
        if(DOC_URL[key](fileName)){
            return key
        }
    }
    return "UNK"
}

const DOC_COLORS:{[key:string]:(name:string) => boolean} = {
    "#00ad54":isExcel,
    "#e01010":isPdf,
    "#3542cc":isWord,
    "#cc7e35":isPowerPoint,
    "#a3a3a3":(_name) => true,
}
const DOC_NAME:{[key:string]:(name:string) => boolean} = {
    "EXCEL":isExcel,
    "PDF":isPdf,
    "DOC":isWord,
    "PPT":isPowerPoint,
    "UNK":(_name) => true,
}
const DOC_URL:{[key:string]:(name:string) => boolean} = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":isExcel,
    "application/pdf":isPdf,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":isWord,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":isPowerPoint,
    "UNK":(_name) => true,
}
// const DOC_COLORS_ = {
//     EXCEL:"#00ad54",
//     PDF:"#e01010",
//     WORD:"#3542cc",
//     POWER_POINT:"#cc7e35",
//     BLANK:"#a3a3a3",
// }