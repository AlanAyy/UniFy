import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFireAuth } from  "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<String>(null as any);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router, private auth: AngularFireAuth) { }

    signup(email: string, password: string) {
      return this.auth.createUserWithEmailAndPassword(email, password).then((resData: any) => {
        console.log(resData.user.uid);
        this.user.next(resData.user.uid);
        this.router.navigateByUrl('/home');
      })
      .catch((error) => {
        return error;
        console.log(error);
      });
    }

    login(email: string, password: string) {
      console.log("here");
      return this.auth.signInWithEmailAndPassword(email, password).then((resData: any) => {
        console.log(resData);
        this.user.next(resData.user.uid);
        this.router.navigateByUrl('/home');
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    }

    logout() {
        this.user.next(null as any);
        this.router.navigate(['/auth']);
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }
}
