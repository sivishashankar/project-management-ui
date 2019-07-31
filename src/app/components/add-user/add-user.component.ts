import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { User } from '../../model/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  usersList: any = [];
  userSearchList: any = [];
   
  submitted = false;
  
  addUserForm: FormGroup;
  userToAdd: User;  
  existingUser: User;

  constructor(private userFormBuilder: FormBuilder, 
      private router: Router, private userService: UserService) { }

  ngOnInit() {

    this.addUserForm = this.userFormBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        employeeId: ['', Validators.required]
    });

    this.retrieveAllUsers();    
  }
  

  get uf() {return this.addUserForm.controls;}

  onSubmit() {
    
    this.submitted = true; 
    let existingUser: User = null;
    
    if(!this.addUserForm.invalid) {
      
      let employeeId: string = this.addUserForm
                  .controls["employeeId"].value;

      this.usersList.forEach(user => {
        if(user.employeeId == employeeId) {
          existingUser = user;
        }
      });     

      if(existingUser != null) {        
        this.addUserForm.controls["employeeId"].setErrors({
          "alreadyExists": true
        });

        return;
      }
      
      this.setValuesForNewUser();     

      // Refreshing user list after adding the user
      this.userService.addUser(this.userToAdd).then(data => {
        this.retrieveAllUsers();
        this.resetForm();
      });
    }    
  }

  setValuesForNewUser() {
    
    this.userToAdd = new User();

    this.userToAdd.firstName = this.addUserForm.controls["firstName"].value;
    this.userToAdd.lastName = this.addUserForm.controls["lastName"].value;
    this.userToAdd.employeeId = this.addUserForm.controls["employeeId"].value;
  }

  deleteUser(userId: number) {

    // Deleting  user
    this.userService.deleteUser(userId).then(data => {
      this.retrieveAllUsers();      
    });
  }

  retrieveAllUsers() {
    
    this.userService.retrieveAllUsers()
      .then(data => {
        this.usersList = data
    });

  }
  
  resetForm() {

    this.addUserForm.controls['firstName'].setValue('');
    this.addUserForm.controls['lastName'].setValue(''); 
    this.addUserForm.controls['employeeId'].setValue('');

    this.submitted = false;
  }

  sortresults(event) {
    console.log(event);
  }  

  routeToEditUser(userId: number) {
    this.router.navigate(['edituser/' + userId]);
  }


}
