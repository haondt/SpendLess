import { Component, OnInit } from '@angular/core';
import { UserAuthenticationModel } from '../models/authentication/UserAuthenticationModel';
import { AuthenticationService } from '../services/api/authentication.service';

import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRegistrationModel } from '../models/authentication/UserRegistrationModel';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SiteData } from '../models/data/SiteData';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  registerMode = false;
  waiting = false;

  loginHidePassword = true;
  loginErrorControl = new FormControl('');
  loginFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    message: this.loginErrorControl
  });

  registerHidePassword = true;
  registerErrorControl = new FormControl('');
  registerPasswordControl = new FormControl('', [Validators.required]);
  registerUsernameControl = new FormControl('', [Validators.required]);
  registerNameControl = new FormControl('', [Validators.required]);
  registerFormGroup = new FormGroup({
    name: this.registerNameControl,
    username: this.registerUsernameControl,
    password: this.registerPasswordControl,
    message: this.registerErrorControl
  });


  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()){
      this.router.navigate(['home']);
    }
  }

  login(){
    this.waiting = true;
    var authModel = new UserAuthenticationModel();
    authModel.username = this.loginFormGroup.controls['username'].value;
    authModel.password = this.loginFormGroup.controls['password'].value;
    this.loginErrorControl.reset();
    this.loginFormGroup.markAllAsTouched();
    this.loginFormGroup.markAsDirty();
    if (this.loginFormGroup.valid){
      this.authService.login(authModel)
        .subscribe({
          next: s => this.router.navigate(['home']),
          error: (e: HttpErrorResponse) => {
            if (e.status == 401){
              this.loginFormGroup.controls['password'].reset();
              this.loginErrorControl.setErrors({failed:true});
            }
            else{
              this.loginErrorControl.setErrors({server:true});
            }
            this.waiting = false;
          }
        });
    }
    else{
      this.loginFormGroup.controls['message'].setErrors({missing:true});
      this.waiting = false;
    }
  }

  register(){
    this.waiting = true;
    var regModel = new UserRegistrationModel();
    regModel.name = this.registerNameControl.value;
    regModel.username = this.registerUsernameControl.value;
    regModel.password = this.registerPasswordControl.value;
    regModel.siteData.isDeveloper = !environment.production;
    this.registerFormGroup.markAllAsTouched();
    this.registerErrorControl.reset();
    if (this.registerFormGroup.valid){
      this.authService.register(regModel)
        .subscribe({
          next: s => this.router.navigate(['home']),
          error: (e: HttpErrorResponse) => {
            if (e.status == 409){
              this.registerUsernameControl.setErrors({unavailable:true});
            }
            else{
              this.registerErrorControl.setErrors({server:true});
            }
            this.registerPasswordControl.reset();
            this.waiting = false;
          }
        });
    }
    else{
      if (!this.registerPasswordControl.valid || !this.registerNameControl.valid){
        this.registerErrorControl.setErrors({missing:true});
      }
      this.waiting = false;
    }
  }

  toggleRegisterMode(){
    if (!this.waiting){
      this.registerFormGroup.reset();
      this.loginFormGroup.reset();
      this.registerMode = !this.registerMode;
    }
    return false;
  }
}
