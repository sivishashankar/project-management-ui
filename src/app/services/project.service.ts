import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../model/project.model';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

 constructor(private http: HttpClient) { }
  
  retrieveAllProjects(): Promise<any> {
    
    return this.http.get("http://localhost:8082/projects/all")
      .toPromise()
      .then(res => res);  
  }


  // Fetch specific project by project id
  fetchProject(projectId: number): Promise<any> {

    /** let projToUpdate: Project = new Project();
    projToUpdate.project='Some Project';
    projToUpdate.projectId= 1234;
    projToUpdate.priority = 25;
    projToUpdate.startDateStr= '2019-08-01';
    projToUpdate.endDateStr = '2019-12-31';
    projToUpdate.noOfTasks = 2;
    projToUpdate.completed = 'N';
    projToUpdate.managerStr = '127453 - Naveen Mohan';

    return projToUpdate; **/

    return this.http.get("http://localhost:8082/projects/fetch/" +projectId)
    .toPromise()
    .then(res => res);  

  }

  addProject(projectToAdd: Project): Promise<any> {
    
   return this.http.post("http://localhost:8082/projects/addproject", projectToAdd)
      .toPromise()
      .then(res => "Project "+projectToAdd.project+
        " added successfully");
  }

  updateProject(projectToUpdate: Project): Promise<any> {

    return this.http.put("http://localhost:8082/projects", projectToUpdate)
    .toPromise()
    .then(res => "Project "+projectToUpdate.project+
      " updated successfully");
  }

  suspendProject(projectToSuspend: Project): Promise<any> {

    return this.http.put("http://localhost:8082/projects/suspend",projectToSuspend)
      .toPromise().then(res =>
        "Project "+projectToSuspend.project+" has been suspended");
  }
  

}
