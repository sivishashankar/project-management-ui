import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service';

import { User } from '../../model/user.model';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  userIdToEdit: number;
  userToEdit: User;

  submitted = false;
  editUserForm: FormGroup;

  constructor(private userFormBuilder: FormBuilder,
    private userService: UserService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

     // Getting the user id from the request Parameter
    this.route.params.subscribe((parameters) => {
      this.userIdToEdit = parameters["id"];
    });

    this.fetchUserToEdit();

    this.editUserForm = this.userFormBuilder.group({
        employeeId: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required]       
    }); 

  }

  fetchUserToEdit() {
    
    this.userService.fetchUser(this.userIdToEdit)
    .then(data => {
      this.userToEdit = data;
      this.setValuesInEditUserForm();
    });    
  }

  setValuesInEditUserForm() {
    this.editUserForm.controls["employeeId"].setValue(this.userToEdit.employeeId);
    this.editUserForm.controls["firstName"].setValue(this.userToEdit.firstName);
    this.editUserForm.controls["lastName"].setValue(this.userToEdit.lastName);
  }

  get userform() {return this.editUserForm.controls;}

  onSubmit() {    
   
     this.submitted = true;

     if(!this.editUserForm.invalid) {
        
        this.updateValuesInUser();
       
        this.userService.updateUser(this.userToEdit).then(data => {
          this.router.navigate(['adduser']);
        });

     }
  }

  updateValuesInUser() {
    this.userToEdit.employeeId=this.editUserForm.controls["employeeId"].value;
    this.userToEdit.firstName=this.editUserForm.controls["firstName"].value;
    this.userToEdit.lastName=this.editUserForm.controls["lastName"].value;
  }

  cancel() {
    this.router.navigate(['adduser']);
  }

}
