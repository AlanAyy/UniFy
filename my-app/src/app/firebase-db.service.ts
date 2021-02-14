import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDBService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  saveCalendar(events: any) {
    return this.http.put('https://calgaryhacksapp-default-rtdb.firebaseio.com/calendarInfo/' + this.authService.user.value + '/.json', JSON.stringify(events));
  }

  getCalendar() {
    return this.http.get('https://calgaryhacksapp-default-rtdb.firebaseio.com/calendarInfo/' + this.authService.user.value + '/.json');
  }
}
