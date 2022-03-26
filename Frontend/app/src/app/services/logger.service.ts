import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Logger {
    constructor(){ }

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