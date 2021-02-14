import { AfterViewChecked,
  ElementRef,
  ViewChild,
  Component,
  OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FirebaseDBService } from '../firebase-db.service';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})

export class SocialComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollOnUpdate') private myScrollContainer: ElementRef;

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

  selectedThreadKey: string;
  sendMessageText: string;

  suggestedFriendsList: string[];
  userList: any;

  constructor(public dbService: FirebaseDBService, public authService: AuthService) {
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

  ngOnInit(): void { }

  ngAfterViewChecked() {
    if (this.selectedThreadKey != null) {
      this.scrollToBottom();
    }
  }

  getKey(thread: any) {
    return Object.keys(thread.value['messages'])[Object.keys(thread.value['messages']).length - 1];
  }

  selectThread(key: string) {
    this.selectedThreadKey = key;
  }

  onMessageSend() {
    console.log(this.selectedThreadKey);
    this.dbService.sendMessage(this.selectedThreadKey, this.sendMessageText).subscribe(resData => {
      console.log(resData);
      this.sendMessageText = "";
    });
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.log(err)
    }
  }

  addFriend(name: string) {
    this.dbService.addFriend(name, this.userList[name].firstName, this.userList[name].lastName, this.userList[this.authService.user.value].firstName, this.userList[this.authService.user.value].lastName).subscribe(resData => {
      console.log(resData);
    });
  }
}
