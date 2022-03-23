import { Component, OnInit } from '@angular/core';
import { UserAuthenticationModel } from '../models/authentication/UserAuthenticationModel';
import { AuthenticationService } from '../services/authentication.service';

import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;

  authModel: UserAuthenticationModel = new UserAuthenticationModel();
  loginFailed: boolean = true;
  errorControl = new FormControl('');
  inputFormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    message: this.errorControl
  });


  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  login(){
    this.authModel.username = this.inputFormGroup.controls['username'].value;
    this.authModel.password = this.inputFormGroup.controls['password'].value;
    this.errorControl.setErrors({});
    if (this.authModel.username && this.authModel.password){
      this.authService.login(this.authModel)
        .subscribe({
          next: s => alert(s),
          error: () => {
            this.inputFormGroup.controls['username'].setErrors({failed:true});
            this.inputFormGroup.controls['password'].setErrors({failed:true});
            this.inputFormGroup.controls['message'].setErrors({failed:true});
          }
        });
    }
  }



}
