import { HttpClient, JsonpClientBackend } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of, Subject, tap, throwError } from "rxjs";
import { CategoryModel } from "src/app/models/data/Category";
import { UserInfoDataModel } from "src/app/models/data/UserInfoData";
import { VendorModel } from "src/app/models/data/Vendor";
import { ApiService } from "./api.service";

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

    public getCategories(): Observable<CategoryModel[]> {
        return this.httpClient.get<CategoryModel[]>(this.apiService.SERVER_URL + "categories");
    }

    public setCategories(categories: CategoryModel[]): Observable<CategoryModel[]> {
        return this.httpClient.post<CategoryModel[]>(this.apiService.SERVER_URL + "categories", categories);
    }

    public getVendors(): Observable<VendorModel[]> {
        return this.httpClient.get<VendorModel[]>(this.apiService.SERVER_URL + "vendors");
    }

    public setVendors(vendors: VendorModel[]): Observable<VendorModel[]> {
        return this.httpClient.post<VendorModel[]>(this.apiService.SERVER_URL + "vendors", vendors);
    }

}