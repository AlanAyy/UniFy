import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FirebaseDBService } from '../firebase-db.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  public items: any[] = []; 
  public newTask: string;

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

  public addToList() { 
    if (this.newTask == '') { 

    } else { 
      this.items.push(this.newTask); 
      this.newTask = ''; 
    } 
  } 
     
  public deleteTask(index: number) { 
    this.items.splice(index, 1); 
  } 
}
