import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDBService {

  threads: Observable<any>;
  userList: Observable<any>;
  suggestedFriendsList: Subject<string[]> = new BehaviorSubject([]);
  currentFriendsList: any = {};
  currentUserInfo: any;

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

  userInformationSubmit(formValue: any) {
    let userInformation = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      hobby1: formValue.hobby1,
      hobby2: formValue.hobby2,
      hobby3: formValue.hobby3
    }
    return this.http.put('https://calgaryhacksapp-default-rtdb.firebaseio.com/userInformation/' + this.authService.user.value + '/.json', userInformation);
  }

  getFriendsList() {
    this.userList = this.fireDB.object('userInformation').valueChanges();
    this.userList.subscribe((resData: any) => {
      console.log(resData[this.authService.user.value]);
      if(resData[this.authService.user.value]) {
        console.log("here");
        this.currentFriendsList = resData[this.authService.user.value].friendsList;
      }
      let tempSuggestFriendsList = [];
      for(let key of Object.keys(resData)) {
        if(key != this.authService.user.value) {
          if(this.currentFriendsList) {
            if(!this.currentFriendsList[key]) {
              tempSuggestFriendsList.push(key);
            }
          } else {
            tempSuggestFriendsList.push(key);
          }
        }
      }
      console.log(tempSuggestFriendsList);
      this.suggestedFriendsList.next(tempSuggestFriendsList);

    })
  }

  addFriend(name: string, firstName: string, lastName: string, userFirstName: string, userLastName: string) {
    let obs1 = this.http.patch('https://calgaryhacksapp-default-rtdb.firebaseio.com/userInformation/' + this.authService.user.value + '/friendsList/.json', {[name]: name});
    let obs2 = this.http.patch('https://calgaryhacksapp-default-rtdb.firebaseio.com/userInformation/' + name + '/friendsList/.json', {[this.authService.user.value]: this.authService.user.value});
    let obs3 = this.sendMessage(name, "Hello");
    let obs4 = this.http.patch('https://calgaryhacksapp-default-rtdb.firebaseio.com/chat/' + this.authService.user.value + '/' + name + '/.json', { firstName: firstName, lastName: lastName });
    let obs5 = this.http.patch('https://calgaryhacksapp-default-rtdb.firebaseio.com/chat/' + name + '/' + this.authService.user.value + '/.json', { firstName: userFirstName, lastName: userLastName });
    return forkJoin([obs1, obs2, obs3, obs4, obs5]);
  }
}
