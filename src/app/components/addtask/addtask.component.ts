import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as moment from 'moment';

import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';

import { Task } from '../../model/task.model';
import { Project } from '../../model/project.model';
import { User } from '../../model/user.model';

import { DateValidator } from '../../shared/date.validator';

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.css']
})
export class AddtaskComponent implements OnInit {

  submitted = false;
  areTaskInputsValid = true;
  taskList: Array<Task> = []
  priorityList: Array<any> = [];

  taskToAdd: Task = new Task();

  addTaskForm: FormGroup;
  selectedUser = new FormControl('',[Validators.required]);
  selectedProject = new FormControl('', [Validators.required]);

  filteredUserOptions: Observable<string[]>;
  filteredProjectOptions: Observable<string[]>;

  usersList: any = [];  
  userSearchList: any = [];
  projectsList: any = [];
  projectsSearchList: any = [];
  

  constructor(fb: FormBuilder, private taskService: TaskService, 
      private router: Router,private projectService: ProjectService, 
      private userService: UserService) {
    // Initializing the form group and Form Controls
    this.addTaskForm = fb.group({
      task_name: ['', Validators.required],
      task_priority: ['', Validators.required],
      task_parent: [''],
      task_start_date: ['', DateValidator.dateValidator],
      task_end_date: ['', DateValidator.dateValidator]
    });

  }

  ngOnInit() {

    //Fetching all projects
    this.retrieveAllProjects();

    //Fetcing all users
    this.retrieveAllUsers();   

    // Fetching all the tasks during init
    this.fetchAllTasks();

    this.filteredProjectOptions = this.selectedProject.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterProject(value))
    );

    this.filteredUserOptions = this.selectedUser.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUser(value))
    );

    // Pushing priority values 1 to 30
    for (var i = 1; i <= 30; i++) {
      this.priorityList.push(i);
    }
  }

  get taskform() {return this.addTaskForm.controls;}

  private _filterUser(user: string): string[] {
    const filterValue = user.toLowerCase(); 
    return this.userSearchList.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterProject(project: string): string[] {
    const filterValue = project.toLowerCase();
    return this.projectsSearchList.filter(option => option.toLowerCase().includes(filterValue));
  }


  // Fetching all the tasks from the Service
  fetchAllTasks() {
    this.taskService.fetchAllTasks()
      .then(data => {
        this.taskList = data
        console.log(this.taskList);
      })
  }

  saveTask(): void {

    this.submitted = true;
    this.areTaskInputsValid = true;

    alert('Inside Save task');

    this.validateAddTaskInput();
    
    if(this.areTaskInputsValid) {
      this.addTask();
    }
  }

  validateAddTaskInput() {
    
    if(this.addTaskForm.controls['task_priority'].value == 0) {
      this.addTaskForm.controls['task_priority'].setErrors({'incorrect': true});
    }

    if(this.addTaskForm.invalid || this.selectedUser.value == ''
        || this.selectedProject.value == '') {
        this.areTaskInputsValid = false;
    }               

    if(this.areTaskInputsValid) {
      
      //Start Date and End Date validation
      let strtDteStr = this.addTaskForm.controls['task_start_date'].value;
      let endDteStr = this.addTaskForm.controls['task_end_date'].value;

      if(endDteStr != '' && strtDteStr == '') {            
        this.addTaskForm.controls['task_start_date']
            .setErrors({'startDateRequired': true});
        
        this.areTaskInputsValid = false;

      } else if(endDteStr != '') {       

        if(!(moment(endDteStr, 'YYYY/MM/DD', true).isAfter(moment(strtDteStr, 'YYYY/MM/DD', true)))) {
          this.addTaskForm.controls['task_end_date']
            .setErrors({'invalidEndDate': true});
            
          this.areTaskInputsValid = false;
        }

      }

      let existingTask: Task = null;
      let isUserAlreadyAssigned: boolean = false;

      let taskNme: string = this.addTaskForm
          .controls["task_name"].value;

        this.taskList.forEach(task => {            
          
          if(task.taskName.toLowerCase() == taskNme.toLowerCase()) {
            existingTask = task;
          }

           if(task.userString == this.selectedUser.value) {
              isUserAlreadyAssigned = true;
          } 
        
        });       

      if(existingTask != null) {        
        
        this.addTaskForm.controls["task_name"].setErrors({
          "alreadyExists": true            
        });

        this.areTaskInputsValid = false;
      }

      if(isUserAlreadyAssigned) {
        this.selectedUser.setErrors({
          "alreadyAssigned": true});
        this.areTaskInputsValid = false;
      } 
    }
  }

  // Save the task by Service
  addTask() {

    this.taskToAdd.taskId = null;
    this.taskToAdd.taskName = this.addTaskForm.controls["task_name"].value;
    this.taskToAdd.priority = parseInt(this.addTaskForm.controls["task_priority"].value);
    this.taskToAdd.startDateStr = this.addTaskForm.controls["task_start_date"].value;
    this.taskToAdd.endDateStr = this.addTaskForm.controls["task_end_date"].value;
    this.taskToAdd.deleteFlag = 'N';

    let parentStr: string = this.addTaskForm.controls["task_parent"].value;

    // Check if Parent task is selected or not
    if ('' == parentStr) {
     this.taskToAdd.parentTaskName = null;
    } else {
      this.taskToAdd.parentTaskName = parentStr;
    }

    this.taskToAdd.userString = this.selectedUser.value;
    this.taskToAdd.projectName = this.selectedProject.value;

    alert('Submitted Task:::: '+JSON.stringify(this.taskToAdd));

    // Redirecting to Homepage after adding the task
    this.taskService.addTask(this.taskToAdd).then(data => {
      this.router.navigate(['viewtask']);
    }); 

  }

  retrieveAllProjects() {
    
     this.projectService.retrieveAllProjects()
     .then(data => {
       this.projectsList = data;
       this.createProjectSearchList();
    });
  }

  createProjectSearchList() {    
    if(this.projectsList != null) {
      this.projectsList.forEach( proj => {
          if(proj.suspendFlag != 'Y' && proj.completed != 'Y')
            this.projectsSearchList.push(proj.project);          
      });
    }
  }

  retrieveAllUsers() {   

      this.userService.retrieveAllUsers()
      .then(data => {
        this.usersList = data;  
        this.createManagerSearchList();      
       });      
  }

  createManagerSearchList() {    
    if(this.usersList != null) {
      this.usersList.forEach( user => {
          this.userSearchList.push(user.employeeId + ' - ' +
            user.firstName + ' '+ user.lastName);
      });
    }
  }

  reset() {
    //empty the form elements
    this.addTaskForm.controls["task_name"].setValue('');
    this.addTaskForm.controls["task_priority"].setValue(0);
    this.addTaskForm.controls["task_parent"].setValue(0);
    this.addTaskForm.controls["task_start_date"].setValue('');
    this.addTaskForm.controls["task_end_date"].setValue('');
    this.selectedUser.setValue('');
    this.selectedProject.setValue('');
  }

}