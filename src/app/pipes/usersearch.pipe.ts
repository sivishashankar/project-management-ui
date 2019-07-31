import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs/operators';
import { User } from '../model/user.model';

@Pipe({
    name: 'usersearch'
})
export class UserSearchPipe implements PipeTransform {

    transform(users: Array<User>, searchType: string, 
        searchValue: string) {

        console.log("Search Type:::: "+searchType);
        console.log("Search Value:::::: "+searchValue);
        if(searchType != '0') {

            //Filter by First Name
            if(searchType == 'firstName') {
                console.log('Inside First Name');
                users = users.filter(user => user.firstName.toLowerCase()
                    .includes(searchValue.toLowerCase()));
            }

            //Filter by Last Name
            if(searchType == 'lastName') {
                console.log('Inside Last Name');
                users = users.filter(user => user.lastName.toLowerCase()
                    .includes(searchValue.toLowerCase()));
            }

            //Filter by Employee Id
            if(searchType == 'employeeId') { 
                console.log('Inside Employee Id ');      
                users = users.filter(user => user.employeeId.toLowerCase()
                    .includes(searchValue.toLowerCase()));
            }

        }

        return users;

    }
}