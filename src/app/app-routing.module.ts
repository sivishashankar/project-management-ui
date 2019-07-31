import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskComponent } from './components/task/task.component';
import { AddtaskComponent } from './components/addtask/addtask.component';
import { EdittaskComponent } from './components/edittask/edittask.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { TestAppComponent } from './components/test-app/test-app.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { UpdateProjectComponent } from './components/update-project/update-project.component';

// Routes configuration
const routes: Routes = [
  { path: "", redirectTo: "adduser", pathMatch: "full" },
  { path: 'addproject', component: AddProjectComponent },
  { path: 'updateproject/:id', component: UpdateProjectComponent },
  { path: 'viewtask', component: TaskComponent },
  { path: 'addtask', component: AddtaskComponent },
  { path: 'edittask/:id', component: EdittaskComponent },
  { path: 'adduser', component: AddUserComponent },
  { path: 'edituser/:id', component: EditUserComponent },
  { path: 'testapp', component: TestAppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
