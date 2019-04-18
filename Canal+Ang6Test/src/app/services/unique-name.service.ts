import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { HttpService } from '../http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessagesService } from './messages-service/messages.service';




@Injectable()
export class UniqueNameService {

  public inDatabase = new BehaviorSubject<boolean>(false);


  constructor(
    private httpService: HttpService,
    private messagesService: MessagesService,
  ) {}

  public validateUsername(userName) {

      return this.httpService.validateUsername(userName)
      .subscribe(res => {
        const extractedName = res.map(x => x.user_name); // Creates an array with name. This works with other setups: = Object.values(res);

        // Convert from array to string.
        const convertedName = extractedName.toString(); 

        return convertedName === userName ? 
            this.inDatabase.next(true) : null;

      },
        (err: HttpErrorResponse) => {
          console.log(err.error);
          console.log(err.message);
          this.messagesService.openDialog('Error', 'Delete did not happen.');
        }
      );
  }

}