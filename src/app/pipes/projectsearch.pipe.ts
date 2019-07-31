import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Project } from '../model/project.model';

@Pipe({
    name: 'projectsearch'
})
export class ProjectSearchPipe implements PipeTransform {

    transform(projects: Array<Project>,  
        searchValue: string) {

        projects = projects.filter(project => project.project.toLowerCase()
                    .includes(searchValue.toLowerCase()));
            
        return projects;
    }
}