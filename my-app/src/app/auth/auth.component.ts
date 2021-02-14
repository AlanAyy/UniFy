import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode: boolean = true;
  isLoading = false;
  error: string = "";
  hide = true;

  loginForm: FormGroup;
  signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      'emailLogin': this.fb.control(null, [Validators.required, Validators.email]),
      'passwordLogin': this.fb.control(null, [Validators.required])
    });
    this.signUpForm = this.fb.group({
      'firstName': this.fb.control(null, [Validators.required]),
      'lastName': this.fb.control(null, [Validators.required]),
      'emailSignUp': this.fb.control(null, [Validators.required, Validators.email]),
      'passwordSignUp': this.fb.control(null, [Validators.required, Validators.minLength(6)]),
      'hobby1': this.fb.control(null),
      'hobby2': this.fb.control(null),
      'hobby3': this.fb.control(null)
  })
   }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
          if (this.route.snapshot.params['mode'] == 'true') {
              this.isLoginMode = true;
          }
          else if (this.route.snapshot.params['mode'] == 'false') {
              this.isLoginMode = false;
          }
      }
  )
  }

  onSwitchMode() {
    console.log(this.isLoginMode);
    this.router.navigate(['/auth/' + !this.isLoginMode]);
    this.error = "";
  }

  onLogin(formValue: any) {
    this.isLoading = true;
    this.authService.login(formValue.emailLogin, formValue.passwordLogin).then((error) => {
      if(error){
        this.error = error.message;
      }
      this.isLoading = false;
    })
  }

  onSignUp(formValue: any) {
    console.log("adsasd");
    this.isLoading = true;
    this.authService.signup(formValue.emailSignUp, formValue.passwordSignUp).then((error) => {
      if(error){
        this.error = error.message;
      }
      this.isLoading = false;
    })
  }
}
