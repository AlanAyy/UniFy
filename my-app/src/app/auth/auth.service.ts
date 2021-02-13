import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFireAuth } from  "@angular/fire/auth";

interface AuthReponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null as any);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router, private auth: AngularFireAuth) { }

    signup(email: string, password: string) {
        return this.http.post<AuthReponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA98ZPBqN1TB6Z5c7sqql6lKBPaGfz26hE',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(error => {
                return error;
            }))
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        let currentUser = new User(email, userId, token, expirationDate);
        this.user.next(currentUser);
        localStorage.setItem('userData', JSON.stringify(currentUser));
        console.log(expiresIn);
        this.autoLogout(100000000000 * 1000);
    }

    login(email: string, password: string) {
      console.log("here");
      this.auth.signInWithEmailAndPassword(email, password).then((resData: any) => {
        console.log(resData);
        this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        this.router.navigateByUrl('/calendar');
      })
    }

    logout() {
        this.user.next(null as any);
        this.router.navigate(['/auth/true']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData') as string);
        if (!userData) {
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    private autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
          console.log("heree");
            this.logout();
        }, expirationDuration);
    }

}
