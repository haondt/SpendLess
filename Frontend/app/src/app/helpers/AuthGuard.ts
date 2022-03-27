import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/api/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthenticationService){ }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (this.authService.isAuthenticated()){
            return true;
        }

        this.authService.clearData();
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}