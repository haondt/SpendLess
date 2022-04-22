import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./AuthInterceptor";
import { ConnectionRefusedInterceptor } from "./ConnectionRefusedInterceptor";

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ConnectionRefusedInterceptor, multi: true }
];