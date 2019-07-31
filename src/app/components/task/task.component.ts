import { Component, OnInit } from '@angular/core';
import { Task } from '../../model/task.model';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  taskList: any = [];  

  constructor(private taskService: TaskService, 
    private projectService: ProjectService,
    private router: Router) { }

  ngOnInit() {    
    this.getTaskData(); 
  }

  getTaskData() {
  
    /* For fetching static JSON */
    this.taskService.fetchAllTasks()
      .then(data => {
        this.taskList = data;
    });

    /** this.taskService.getAllTasks().subscribe (
      (res: any) => {
      //  setTimeout(()=>{ this.taskList = res},2000);
       this.taskList = res
        console.log(res);
      }); **/
  }  

  sortresults(event) {
    console.log(event);
  }

  // Redirect the page to Edit screen
  editTask(id: number) {
    this.router.navigate(['edittask/' + id]);
  }

  // Marking the Task as Ended
  endTask(id: number) {
    this.taskService.endTask(id).then(data => {
      this.getTaskData();
    })
  }

  

}
