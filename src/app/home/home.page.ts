import { Component, OnInit } from '@angular/core';
import { Task } from '../interfaces/task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  tasks: Task[];

  constructor(private todoService: TaskService){}
  
  ngOnInit(){
    this.todoService.getTasks().subscribe((tasks) =>{
      console.log('tasks', tasks);
      this.tasks = tasks;
    })
  }
  onDelete(idTask:string){
    this.todoService.deleteTask(idTask);
  }
}
