import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-test-app',
  templateUrl: './test-app.component.html',
  styleUrls: ['./test-app.component.css']
})
export class TestAppComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

      this.registerForm = this.formBuilder.group({
        firstName: ['',Validators.required],
        lastName: ['',Validators.required],
        email: ['',[Validators.required,Validators.email]]
      });
  }

  get f() {return this.registerForm.controls;}

  onSubmit() {
    this.submitted = true;

    if(this.registerForm.invalid) {
      return;
    }

    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value));
  }

}
