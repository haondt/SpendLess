import { SiteData } from "../data/SiteData";

export class UserRegistrationModel {
    name: string;
    username: string;
    password: string;
    siteData: SiteData = new  SiteData();
    constructor(){ }
}