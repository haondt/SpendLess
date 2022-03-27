import { HttpClient, JsonpClientBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of, Subject, tap, throwError } from "rxjs";
import { UserInfoDataModel } from "src/app/models/data/UserInfoData";
import { ApiService } from "./api.service";
import { AuthenticationService } from "./authentication.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userInfoSource = new Subject<UserInfoDataModel>();
    userInfo$ = this.userInfoSource.asObservable();

    constructor(private httpClient: HttpClient, private apiService: ApiService) { }

    public updateUserInfo() : void {
        this.httpClient.get<UserInfoDataModel>(this.apiService.SERVER_URL + "user-info")
            .subscribe({
                next: ui => this.userInfoSource.next(ui)
            });
    }

    public clearUserInfo(): void {
        this.userInfoSource.next(new UserInfoDataModel());
    }

    public getUserInfo() : Observable<UserInfoDataModel> {
        return this.httpClient.get<UserInfoDataModel>(this.apiService.SERVER_URL + "user-info");
    }

}