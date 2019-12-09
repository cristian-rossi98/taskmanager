import { Component, OnInit } from '@angular/core';
import { Task } from '../interfaces/task';
import { TaskService } from '../services/task.service';
import { ActivatedRoute} from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {

  task: Task = {
    title: '',
    description: '',
    date: ''
  };
  taskId= null;

  public fGroup: FormGroup;

  constructor(
    private route: ActivatedRoute, 
    private nav: NavController, 
    private taskService: TaskService, 
    private loadingController: LoadingController,
    private fBuilder: FormBuilder
    ) { 
      this.fGroup = this.fBuilder.group({
        'title': [this.task.title, Validators.compose([
          Validators.required,
        ])],
        'description': [this.task.description],
        'date': [this.task.date],
      });
    }

  ngOnInit() {
    this.taskId = this.route.snapshot.params['id'];
    if (this.taskId){
      this.loadTask();
    }
  }

  async loadTask(){
    const loading = await this.loadingController.create({
      message: 'Carregando....'
    });
    await loading.present();

    this.taskService.getTask(this.taskId).subscribe(task => {
      loading.dismiss();
      this.task = task;
      this.fGroup.get('title').setValue(this.task.title);
      this.fGroup.get('description').setValue(this.task.description);
      this.fGroup.get('date').setValue(this.task.date);
    });
  }

  async saveTask() {
    this.fGroup.valid;
    const loading = await this.loadingController.create({
      message: 'Salvando....'
    });
    await loading.present();
 
    if (this.taskId) {
      this.taskService.updateTask(this.fGroup.value, this.taskId).then(() => {
        loading.dismiss();
        this.nav.navigateForward('/');
      });
    } else {
      this.taskService.addTask(this.fGroup.value).then(() => {
        loading.dismiss();
        this.nav.navigateForward('/');
      });
    }
  }
  
  async onDeleteTask(idTask: string) {
    this.taskService.deleteTask(idTask);
  }
}