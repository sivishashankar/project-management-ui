import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Task } from '../model/task.model';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  
  transform(taskList: Array<Task>,  
      searchValue: string) {

     taskList = taskList.filter(task =>    
        
            task.projectName.toLowerCase()
                  .includes(searchValue.toLowerCase())
        
     );

      return taskList;    
  }

//   transform(projects: Array<Project>,  
//     searchValue: string) {

//     projects = projects.filter(project => project.project.toLowerCase()
//                 .includes(searchValue.toLowerCase()));
        
//     return projects;
// }
  
}
  
