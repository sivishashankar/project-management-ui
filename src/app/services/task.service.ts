import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  // Fetch all the tasks from Static JSON
  getTaskList() {

    return this.http.get("/assets/tasks.json",
      { headers: { "accept": "application/json" } });
  }

  // Fetch all the tasks from service
  fetchAllTasks(): Promise<any> {

    return this.http.get("http://localhost:8082/tasks/all")
      .toPromise()
      .then (res => res); 
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>("http://localhost:8082/tasks/all");
  }

  // Fetch specific task by task id
  fetchTask(id: number): Promise<any> {

    return this.http.get("http://localhost:8082/tasks/fetch/" + id)
      .toPromise()
      .then(res => res);
  }

  // Add a new task
  addTask(task: Task): Promise<any> {

    return this.http.post("http://localhost:8082/tasks", task)
      .toPromise()
      .then(res => "Task " + task.taskName + " added successfully")
  }

  // Update a task
  updateTask(task: Task): Promise<any> {

    return this.http.put("http://localhost:8082/tasks", task)
      .toPromise()
      .then(res => "Task " + task.taskName + " updated successfully")
  }

  // End a task
  endTask(id: number): Promise<any> {

    return this.http.put("http://localhost:8082/tasks/endtask/" + id, "")
      .toPromise()
      .then(res => "Task ended successfully")
  }
}
