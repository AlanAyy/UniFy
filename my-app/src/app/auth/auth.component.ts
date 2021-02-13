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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      'emailLogin': this.fb.control(null, [Validators.required, Validators.email]),
      'passwordLogin': this.fb.control(null, [Validators.required])
    });
   }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (this.route.snapshot.params['mode'] == 'true') {
        this.isLoginMode = true;
      }
      else if (this.route.snapshot.params['mode'] == 'false') {
          this.isLoginMode = false;
      }
    })
  }

  onSwitchMode() {
    this.router.navigate(['/auth/' + !this.isLoginMode]);
    this.error = "";
  }

  onLogin(formValue: any) {
    this.authService.login(formValue.emailLogin, formValue.passwordLogin);
  }

}
