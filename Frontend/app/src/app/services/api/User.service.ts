import { HttpClient, JsonpClientBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of, tap, throwError } from "rxjs";
import { UserInfoDataModel } from "src/app/models/data/UserInfoData";
import { ApiService } from "./api.service";
import { AuthenticationService } from "./authentication.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private httpClient: HttpClient, private apiService: ApiService, private authService: AuthenticationService) { }

    public getUserInfo(): Observable<UserInfoDataModel> {
        if (sessionStorage['userInfo']) {
            return of(sessionStorage['userInfo']).pipe(map(s => JSON.parse(s)));
        }
        return this.httpClient.get<UserInfoDataModel>(this.apiService.SERVER_URL + "user-info")
            .pipe(tap(ui => sessionStorage['userInfo'] = JSON.stringify(ui)));
    }
}