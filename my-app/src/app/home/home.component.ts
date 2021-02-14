import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FirebaseDBService } from '../firebase-db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  threads: {
    [key: string]: {
      firstName: string;
      lastName: string;
      messages: {
        [key: string]: {
          text: string;
          time: string;
          sender: string;
        }
      }
    }
  };

  events: any[] = [];

  suggestedFriendsList: string[];
  userList: any;

  constructor(public dbService: FirebaseDBService, public authService: AuthService) {
    this.dbService.getThreads();
    this.dbService.getFriendsList();
    this.dbService.threads.subscribe(threads => {
      this.threads = threads;
    });
    this.dbService.suggestedFriendsList.subscribe(resData => {
      console.log(resData);
      this.suggestedFriendsList = resData;
    });
    this.dbService.userList.subscribe(resData => {
      console.log(resData);
      this.userList = resData;
    });
  }

  addFriend(name: string) {
    this.dbService.addFriend(name, this.userList[name].firstName, this.userList[name].lastName, this.userList[this.authService.user.value].firstName, this.userList[this.authService.user.value].lastName).subscribe(resData => {
      console.log(resData);
    });
  }

  ngOnInit(): void {
    this.dbService.getCalendar().subscribe((resData:any) => {
      for(let key of Object.keys(resData)) {
        let date = new Date(resData[key].end);
        let today = new Date();
        if(date.getDate() == today.getDate() && date.getMonth == today.getMonth && date.getFullYear == today.getFullYear) {
          this.events.push(resData[key]);
        }
      }
    });
  }

}
