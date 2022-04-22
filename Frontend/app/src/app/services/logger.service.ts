import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Logger {
    constructor(){ }

    public error(logItem: any){
        console.log(logItem);
    }

    public info(logItem: any){
        console.log(logItem);
    }

    public debug(logItem: any){
        console.log(logItem);
    }

    public trace(logItem: any){
        console.log(logItem);
    }
}