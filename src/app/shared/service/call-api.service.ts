import { Injectable } from '@angular/core';
import { ServiceService } from './service.service';
import { BehaviorSubject, forkJoin, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CallApiService {

  constructor(private _ServiceService:ServiceService) { }


  callApi(id,param): Observable<any>{
    return this._ServiceService.execServiceLogin(id,param);
  }
}
