import { Socket } from "./socket";

export class SocketError extends Error {
    constructor (private _socket:Socket, private _errorType:string){
        super()
    }
    get socket(){
        return this._socket
    }
    get errorType(){
        return this._errorType
    }

    get errorMessage(){
        switch(this.errorType){
            case SocketError.ERRORS.SESSION_ERROR: return "Session Error, verify this connection status"
            default: return "Unknown Error"

        }
    }

    get message(){
        return `this connection "${this.socket.folder}" has have an error: "${this.errorMessage}"`
    }

    static ERRORS = {
        SESSION_ERROR:"SESSION_ERROR"
    }
}

export class SocketSessionError extends SocketError {
    constructor( socket:Socket){
        super(socket, SocketError.ERRORS.SESSION_ERROR)
    }
}