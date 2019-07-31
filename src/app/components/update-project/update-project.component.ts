import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as moment from 'moment';

import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';

import { Project } from '../../model/project.model';
import { User } from '../../model/user.model';

import { DateValidator } from '../../shared/date.validator';

@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.css']
})
export class UpdateProjectComponent implements OnInit {

  projectIdToUpdate: number;
  projectToUpdate: Project;

  projectsList: any = [];
  managersList: any = [];
  managerSearchList: any = [];
  priorityList: Array<any> = [];

  filteredManagerOptions: Observable<string[]>;
  updateProjectForm: FormGroup;

  submitted = false;
  areProjectInputsValid = true;
  selectedManager = new FormControl('',[Validators.required]);

  constructor( private projectFormBuilder: FormBuilder, 
    private projectService: ProjectService, 
    private userService: UserService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    // Getting the project id from the request Parameter
    this.route.params.subscribe((parameters) => {
      this.projectIdToUpdate = parameters["id"];
    });

    this.retrieveAllUsers(); 
    this.retrieveAllProjects();

    // Pushing priority values 1 to 30
    for (var i = 1; i <= 30; i++) {
      this.priorityList.push(i);
    }

    this.updateProjectForm = this.projectFormBuilder.group({
        project: ['', Validators.required],
        priority: ['', Validators.required],
        startDate: ['', DateValidator.dateValidator],
        endDate: ['', DateValidator.dateValidator]   
    });

    this.fetchProjectToUpdate();

    this.filteredManagerOptions = this.selectedManager.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterManager(value))
    );    
  
  }

  get projectform() {return this.updateProjectForm.controls;}

  retrieveAllUsers() {
    this.userService.retrieveAllUsers()
    .then(data => {
      this.managersList = data;  
      this.createManagerSearchList();      
     });   
  }

  retrieveAllProjects() {
    
     this.projectService.retrieveAllProjects()
     .then(data => {
       this.projectsList = data;
    });
  }

  createManagerSearchList() {

    if(this.managersList != null) {
      this.managersList.forEach( user => {
          this.managerSearchList.push(user.employeeId + ' - ' +
            user.firstName + ' '+ user.lastName);
      });
    }
  }

  private _filterManager(value: string): string[] {
    
    if(value != null) {

      const filterValue = value.toLowerCase();
 
      return this.managerSearchList.filter(
        option => option.toLowerCase().includes(filterValue));
    }
  }

  fetchProjectToUpdate() {
 
    this.projectService.fetchProject(this.projectIdToUpdate)
      .then(data => {
        this.projectToUpdate = data;
        this.setValuesInUpdateProjectForm();
      });    
  }

  setValuesInUpdateProjectForm() {
    this.updateProjectForm.controls["project"].setValue(this.projectToUpdate.project);
    this.updateProjectForm.controls["priority"].setValue(this.projectToUpdate.priority);
    this.updateProjectForm.controls["startDate"].setValue(this.projectToUpdate.startDateStr);
    this.updateProjectForm.controls["endDate"].setValue(this.projectToUpdate.endDateStr);
    this.selectedManager.setValue(this.projectToUpdate.managerStr);
  }

  onSubmit() {
    
    alert('Form Submitted');

    this.submitted = true;
    this.areProjectInputsValid = true;  

    this.validateProjectInput();

    if(this.areProjectInputsValid) {
      
      this.updateValuesInProject();

      this.projectService.updateProject(this.projectToUpdate).then(data => {
        this.router.navigate(['addproject']);
      });
    }


  }

  validateProjectInput() {

    if(this.updateProjectForm.controls['priority'].value == 0) {
      this.updateProjectForm.controls['priority'].setErrors({'incorrect': true});
    }
    
    alert('Selected Manager'+this.selectedManager.value);

    if(this.updateProjectForm.invalid || this.selectedManager.value == ''
          || this.selectedManager.value == null) {
        this.areProjectInputsValid = false;
    }               

    let strtDte: Date;
    let endDte: Date;

     if(this.areProjectInputsValid) {
        
          let strtDteStr = this.updateProjectForm.controls['startDate'].value;
          let endDteStr = this.updateProjectForm.controls['endDate'].value;

          if(endDteStr != '' && strtDteStr == '') {            
            this.updateProjectForm.controls['startDate']
                .setErrors({'startDateRequired': true});
            
            this.areProjectInputsValid = false;

          } else if(endDteStr != '') {

            //strtDte = moment(strtDteStr, 'YYYY-MM-DD', true);
            //endDte = moment(endDteStr, 'YYYY-MM-DD', true);

            if(!(moment(endDteStr, 'YYYY/MM/DD', true).isAfter(moment(strtDteStr, 'YYYY/MM/DD', true)))) {
              this.updateProjectForm.controls['endDate']
                .setErrors({'invalidEndDate': true});
                
              this.areProjectInputsValid = false;
            }

          }

          let existingProject: Project = null;
          let isManagerAlreadyAssigned: boolean = false;
          
          let projectName: string = this.updateProjectForm
              .controls["project"].value;
        
          this.projectsList.forEach(proj => {
            if(proj.project != this.projectToUpdate.project) { 
              
              if(proj.project == projectName) {
                existingProject = proj;
              }

              if(proj.managerStr == this.selectedManager.value) {
                isManagerAlreadyAssigned = true;
              }
            }
          });     

          if(existingProject != null) {            
            this.updateProjectForm.controls["project"].setErrors({
              "alreadyExists": true});
            this.areProjectInputsValid = false;
          }

          if(isManagerAlreadyAssigned) {
            this.selectedManager.setErrors({
              "alreadyAssigned": true});
            this.areProjectInputsValid = false;
          }
      }
  }

  cancel() {
    this.router.navigate(['addproject']);
  }

  updateValuesInProject() {
    this.projectToUpdate.project=this.updateProjectForm.controls["project"].value;
    this.projectToUpdate.priority=this.updateProjectForm.controls["priority"].value;
    this.projectToUpdate.startDateStr=this.updateProjectForm.controls["startDate"].value;
    this.projectToUpdate.endDateStr=this.updateProjectForm.controls["endDate"].value;
    this.projectToUpdate.managerStr=this.selectedManager.value;
  }

}
