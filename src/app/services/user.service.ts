import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

   retrieveAllUsers(): Promise<any> {

    return this.http.get("http://localhost:8082/users/all")
    .toPromise()
    .then(res => res);   
  }

  fetchUser(userId: number): Promise<any> {    
    
    return this.http.get("http://localhost:8082/users/fetch/" + userId)
     .toPromise()
     .then(res => res);
  }

  fetchUserByEmployeeId(employeeId: string): Promise<any> {    
    
    return this.http.get("http://localhost:8082/users/employee/" + employeeId)
     .toPromise()
     .then(res => res);
  }

  addUser(userToAdd: User): Promise<any> {
    
   return this.http.post("http://localhost:8082/users/adduser", userToAdd)
      .toPromise()
      .then(res => "User "+userToAdd.firstName+" "
        +userToAdd.lastName+" added successfully");
  }

  updateUser(userToEdit: User): Promise<any> {

    return this.http.put("http://localhost:8082/users", userToEdit)
      .toPromise()
      .then(res => "User "+userToEdit.firstName+" "
      +userToEdit.lastName+" updated successfully")

  }

  deleteUser(userId: number): Promise<any> {    
    
    return this.http.delete("http://localhost:8082/users/" + userId)
     .toPromise()
     .then(res => res);

  }

}


