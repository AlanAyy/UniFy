import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  public items: any[] = []; 
  public newTask: string;

  constructor() { }

  ngOnInit(): void { }

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
