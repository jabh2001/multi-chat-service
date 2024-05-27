import qrcode from "qrcode"
import fs from "fs"
import path from "path"
import { MediaMessageType } from "../../../types"
import { MessageType } from "../../schemas"
const QR_FOLDER = "./QRs" as const

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
        const base64 = fs.readFileSync(this.qr_folder, { encoding: 'base64' });
        return base64
    }
    verifyQRFolder() {
        try {
            if (!fs.existsSync(QR_FOLDER)) {
                fs.mkdirSync(QR_FOLDER);
            }
            if (!fs.existsSync(this.qr)) {
                fs.writeFileSync(this.qr_folder, 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
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
    abstract sentCreds():void;

    abstract sendMessage(id: string, message: Omit<MessageType, "id">): Promise<Omit<MessageType, "id">>
    abstract sendMediaMessage( id: string, message: Omit<MessageType, "id">, media: MediaMessageType): Promise<Omit<MessageType, "id">>
}