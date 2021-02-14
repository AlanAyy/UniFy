import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDBService {

  threads: Observable<any>;

  constructor(private http: HttpClient, private authService: AuthService, private fireDB: AngularFireDatabase) {

  }

  saveCalendar(events: any) {
    return this.http.put('https://calgaryhacksapp-default-rtdb.firebaseio.com/calendarInfo/' + this.authService.user.value + '/.json', JSON.stringify(events));
  }

  getCalendar() {
    return this.http.get('https://calgaryhacksapp-default-rtdb.firebaseio.com/calendarInfo/' + this.authService.user.value + '/.json');
  }

  getThreads() {
    console.log('chat/' + this.authService.user.value);
    this.threads = this.fireDB.object('chat/' + this.authService.user.value).valueChanges();
    this.threads.subscribe(threads => {
      console.log(threads);
    });
  }

  sendMessage(key: string, text: string) {
    const messageDetails = { text: text, time: new Date(), sender: this.authService.user.value };
    let obs1 = this.http.post('https://calgaryhacksapp-default-rtdb.firebaseio.com/chat/' + this.authService.user.value + '/' + key + '/messages/.json', messageDetails);
    let obs2 = this.http.post('https://calgaryhacksapp-default-rtdb.firebaseio.com/chat/' + key + '/' + this.authService.user.value + '/messages/.json', messageDetails);
    return forkJoin([obs1, obs2]);
  }


}
