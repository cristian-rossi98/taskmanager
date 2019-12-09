import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
}) 
export class TaskService {

  private taskCollection: AngularFirestoreCollection<Task>;
  private task: Observable<Task[]>;

  constructor(db:AngularFirestore) { 
    this.taskCollection = db.collection<Task>('task');
    this.task = this.taskCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }) 
    );
  }

  getTasks(){
    return this.task;
  }

  getTask(id: string){
    return this.taskCollection.doc<Task>(id).valueChanges();
  }

  updateTask(task:Task, id: string){
    return this.taskCollection.doc(id).update(task);
  }
  
  addTask(task: Task){
    return this.taskCollection.add(task);
  }
  
  deleteTask(id: string){
    return this.taskCollection.doc(id).delete();
  }

}

