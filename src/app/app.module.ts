import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TaskService } from './services//task.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OrderModule } from 'ngx-order-pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { TaskComponent } from './components/task/task.component';
import { SearchPipe } from './pipes/search.pipe';
import { UserSearchPipe } from './pipes/usersearch.pipe';
import { ProjectSearchPipe } from './pipes/projectsearch.pipe';
import { AddtaskComponent } from './components/addtask/addtask.component';
import { EdittaskComponent } from './components/edittask/edittask.component';
import { TestAppComponent } from './components/test-app/test-app.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { UpdateProjectComponent } from './components/update-project/update-project.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TaskComponent,
    SearchPipe,
    UserSearchPipe,
    ProjectSearchPipe,
    AddtaskComponent,
    EdittaskComponent,
    TestAppComponent,
    AddUserComponent,
    AddProjectComponent,
    UpdateProjectComponent,
    EditUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    OrderModule
  ],
  providers: [TaskService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
