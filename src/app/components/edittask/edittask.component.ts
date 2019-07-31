import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as moment from 'moment';

import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';

import { Project } from '../../model/project.model';
import { User } from '../../model/user.model';
import { Task } from '../../model/task.model';

import { DateValidator } from '../../shared/date.validator';

@Component({
  selector: 'app-edittask',
  templateUrl: './edittask.component.html',
  styleUrls: ['./edittask.component.css']
})
export class EdittaskComponent implements OnInit {

  submitted = false;
  areTaskInputsValid = true;
  taskList: Array<Task> = [];
  priorityList: Array<any> = []; 
  
  taskIdToUpdate: number;
  taskToUpdate: Task = new Task();
  
  updateTaskForm: FormGroup;
  selectedUser = new FormControl('',[Validators.required]);
  selectedProject = new FormControl('', [Validators.required]);

  filteredUserOptions: Observable<string[]>;
  filteredProjectOptions: Observable<string[]>;

  usersList: any = [];  
  userSearchList: any = [];
  projectsList: any = [];
  projectsSearchList: any = [];

  constructor(fb: FormBuilder, private taskService: TaskService, private router: Router,
    private route: ActivatedRoute, private projectService: ProjectService, 
    private userService: UserService) {

    // Getting the task id from the request Parameter
    this.route.params.subscribe((parameters) => {
      this.taskIdToUpdate = parameters["id"];
    });

    // Initializing the form group and Form Controls
    this.updateTaskForm = fb.group({
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

    // Fetch specific task
    this.taskService.fetchTask(this.taskIdToUpdate)
      .then(data => {    
        this.taskToUpdate = data;
        this.setValuesInUpdateTaskForm();
    });

    // Pushing priority values 1 to 30
    for (var i = 1; i <= 30; i++) {
      this.priorityList.push(i);
    }         
  }

  setValuesInUpdateTaskForm() {
    
    this.updateTaskForm.controls["task_name"].setValue(this.taskToUpdate.taskName);
    this.updateTaskForm.controls["task_priority"].setValue(this.taskToUpdate.priority);
    this.updateTaskForm.controls["task_start_date"].setValue(this.taskToUpdate.startDateStr);
    this.updateTaskForm.controls["task_end_date"].setValue(this.taskToUpdate.endDateStr);
    
    if(this.taskToUpdate.parentTaskName != 'No Parent Task') {
      this.updateTaskForm.controls["task_parent"].setValue(this.taskToUpdate.parentTaskName);
    } else {
      this.updateTaskForm.controls["task_parent"].setValue('0');
    }
    
    if(this.taskToUpdate.userString != null) {
      this.selectedUser.setValue(this.taskToUpdate.userString);
    } else {
      this.selectedUser.setValue('');
    }

    this.selectedProject.setValue(this.taskToUpdate.projectName);
    
  }

  get taskform() {return this.updateTaskForm.controls;}
  
  private _filterUser(user: string): string[] {
    if(user != null) {
      const filterValue = user.toLowerCase(); 
      return this.userSearchList.filter(option => option.toLowerCase().includes(filterValue));
    }
  }

  private _filterProject(project: string): string[] {
    const filterValue = project.toLowerCase();
    return this.projectsSearchList.filter(option => option.toLowerCase().includes(filterValue));
  }

  // Fetch all the tasks
  fetchAllTasks() {
    this.taskService.fetchAllTasks()
      .then(data => {
        this.taskList = data;        
      });          
  }

  // Update the task
  updateTask(): void {
    
    this.submitted = true;
    this.areTaskInputsValid = true;

    this.validateTaskInput();
    
    if(this.areTaskInputsValid) {
      
      this.updateTaskDetails();

      this.taskService.updateTask(this.taskToUpdate).then(data => {
        this.router.navigate(['viewtask']);
      });

    }   
  }

  validateTaskInput() {
    
    if(this.updateTaskForm.controls['task_priority'].value == 0) {
      this.updateTaskForm.controls['task_priority'].setErrors({'incorrect': true});
    }

    if(this.updateTaskForm.invalid || this.selectedUser.value == ''
        || this.selectedProject.value == '') {
        this.areTaskInputsValid = false;
    }               

    if(this.areTaskInputsValid) {
      
      //Start Date and End Date validation
      let strtDteStr = this.updateTaskForm.controls['task_start_date'].value;
      let endDteStr = this.updateTaskForm.controls['task_end_date'].value;

      if(endDteStr != '' && strtDteStr == '') {            
        this.updateTaskForm.controls['task_start_date']
            .setErrors({'startDateRequired': true});
        
        this.areTaskInputsValid = false;

      } else if(endDteStr != '') {       

        if(!(moment(endDteStr, 'YYYY/MM/DD', true).isAfter(moment(strtDteStr, 'YYYY/MM/DD', true)))) {
          this.updateTaskForm.controls['task_end_date']
            .setErrors({'invalidEndDate': true});
            
          this.areTaskInputsValid = false;
        }

      }

      if(this.updateTaskForm.controls["task_parent"].value.toLowerCase() == 
          this.updateTaskForm.controls["task_name"].value.toLowerCase()) {
            
            this.updateTaskForm.controls["task_parent"]
              .setErrors({'sameTask': true});

            this.areTaskInputsValid = false;
      }

      let existingTask: Task = null;
      let isUserAlreadyAssigned: boolean = false;

      let taskNme: string = this.updateTaskForm
          .controls["task_name"].value;

        this.taskList.forEach(task => {            
          
          if(task.taskName.toLowerCase() 
              != this.taskToUpdate.taskName.toLowerCase()) {

            if(task.taskName.toLowerCase() == taskNme.toLowerCase()) {
              existingTask = task;
            }

            if(task.userString == this.selectedUser.value) {
                isUserAlreadyAssigned = true;
            }

          }
        
        });       

      if(existingTask != null) {        
        
        this.updateTaskForm.controls["task_name"].setErrors({
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
  updateTaskDetails() {
    
    //this.taskToUpdate.taskId = null;
    this.taskToUpdate.taskName = this.updateTaskForm.controls["task_name"].value;
    this.taskToUpdate.priority = parseInt(this.updateTaskForm.controls["task_priority"].value);
    this.taskToUpdate.startDateStr = this.updateTaskForm.controls["task_start_date"].value;
    this.taskToUpdate.endDateStr = this.updateTaskForm.controls["task_end_date"].value;
    this.taskToUpdate.deleteFlag = 'N';

    let parentStr: string = this.updateTaskForm.controls["task_parent"].value;

    // Check if Parent task is selected or not
    if ('' == parentStr) {
      this.taskToUpdate.parentTaskName = null;
    } else {
      this.taskToUpdate.parentTaskName = parentStr;
    }

    this.taskToUpdate.userString = this.selectedUser.value;
    this.taskToUpdate.projectName = this.selectedProject.value;

    alert('Updated Task:::: '+JSON.stringify(this.taskToUpdate));  
    
  }

  // Redirecting to the homescreen on clicking Cancel
  cancel() {
    this.router.navigate(['viewtask']);
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

}
