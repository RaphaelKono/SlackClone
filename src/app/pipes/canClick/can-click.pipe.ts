import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/models/user.class';
import { CurrentDataService } from 'src/app/service/current-data/current-data.service';

@Pipe({
  name: 'canClick'
})
export class CanClickPipe implements PipeTransform {

  constructor(private currentData: CurrentDataService) { }


  transform(userId: string): boolean {
    return this.isUserExistent(userId);
  }

  isUserExistent(userId: string){
    return this.currentData.users.some((user: User) => (user.id === userId));;
  }

}
