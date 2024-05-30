import qrcode from "qrcode"
import fs from "fs"
import path from "path"
import { MediaMessageType } from "../../../types"
import { QR_FOLDER } from "../../../constants"
import { ContactType, MessageType } from "../../schemas"

const BLANK_QR_BASE_64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
export abstract class Socket {
    static MEDIA_MESSAGE =  {
        text:'text',
        audioMessage:'audioMessage',
        imageMessage:'imageMessage',
        videoMessage:'videoMessage',
        documentMessage:'documentMessage'
    } as const
    folder: string

    get qr_folder() {
        return path.join(QR_FOLDER, this.qr)
    }
    get qr() {
        return `qr-${this.folder}.png`
    }
    getQRBase64() {
        return this.isQRBased ? fs.readFileSync(this.qr_folder, { encoding: 'base64' }) : BLANK_QR_BASE_64;
    }
    verifyQRFolder() {
        try {
            if(!this.isQRBased){
                return false
            }
            if (!fs.existsSync(QR_FOLDER)) {
                fs.mkdirSync(QR_FOLDER);
            }
            if (!fs.existsSync(this.qr_folder)) {
                fs.writeFileSync(this.qr_folder, BLANK_QR_BASE_64, 'base64');
            }
            return true;
        } catch (e) {
            return false
        }
    }

    async saveQRCode(qrData: string) {
        try {
            const qrCodeDataUrl = await qrcode.toDataURL(qrData, { errorCorrectionLevel: 'H' });
            const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
            if (!fs.existsSync(QR_FOLDER)) {
                fs.mkdirSync(QR_FOLDER);
            }
            fs.writeFileSync(this.qr_folder, base64Data, 'base64');
        } catch (error) {
            console.error('Error al guardar el código QR:', error);
        }
    }

    constructor(folder: string) {
        this.folder = folder
    }
    abstract get isQRBased():boolean;
    abstract user():Promise<any>;
    abstract sentCreds():void;
    abstract getContactId(contact:ContactType):Promise<any>

    abstract sendMessage(id: string, message: Omit<MessageType, "id">): Promise<Omit<MessageType, "id">>
    abstract sendMediaMessage( id: string, message: Omit<MessageType, "id">, media: MediaMessageType): Promise<Omit<MessageType, "id">>
}