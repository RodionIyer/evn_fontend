import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, ReplaySubject, switchMap, take, throwError } from 'rxjs';
import { ServiceService } from 'app/shared/service/service.service';

@Injectable({
    providedIn: 'root'
})
export class FunctionService {
    private _function: any = {};
    private _isView: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _Authority: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    /**
     * Constructor
     */
    constructor(
        private _serviceService: ServiceService
    ) {
    }
    get isView$(): Observable<any> {
        return this._isView.asObservable();
    }
    get Authority$(): Observable<any> {
        return this._Authority.asObservable();
    }

    get(url: string): Observable<any> {
        return this._serviceService.execServiceLogin("API-17", [{ "name": "URL_FUNCTION", "value": url }])
            .pipe(take(1),
                map((response: any) => {
                    if (response.status == 1) {
                        this._function = (response.data);
                        return response.data;
                    } else {
                        this._function = {};
                        return null;
                    }
                }), switchMap((_function: any) => {
                    if (_function && _function?.FUNCTIONID) {
                        return this._serviceService.execServiceLogin("API-18-1", [{ "name": "FUNCTIONID", "value": _function.FUNCTIONID }])
                            .pipe(take(1),
                                map((response: any) => {
                                    if (response.status == 1) {
                                        this._isView.next(true);
                                        this._Authority.next(response.data);
                                        return _function;
                                    } else {
                                        this._isView.next(false);
                                        this._Authority.next([]);
                                        return _function;
                                    }
                                }));
                    } else {
                        this._function = {};
                        this._isView.next(false);
                        this._Authority.next([]);
                    }
                }));
    }
    isView(): Observable<boolean> {
        if (this._function) {
            return this._serviceService.execServiceLogin("API-18", [{ "name": "FUNCTIONID", "value": this._function.FUNCTIONID }])
                .pipe(take(1),
                    map((response: any) => {
                        if (response.status == 1) {
                            this._isView.next(true);
                            return true;
                        } else {
                            return false;
                        }
                    }));
        } else {
            return of(false)
        }
    }
    isInsert(): Observable<boolean> {
        return of(true)
    }
    isEdit(): Observable<boolean> {
        return of(true)
    }
    isDelete(): Observable<boolean> {
        return of(true)
    }
    authority(): Observable<any[]> {
        if (this._function) {
            return this._serviceService.execServiceLogin("API-18-1", [{ "name": "FUNCTIONID", "value": this._function.FUNCTIONID }])
                .pipe(take(1),
                    map((response: any) => {
                        if (response.status == 1) {
                            this._Authority.next(response.data);
                            return true;
                        } else {
                            return false;
                        }
                    }));
        } else {
            return of([])
        }
    }
    authEditFromServer(): Observable<any> {
        return of(true);
    }
    authInsertFromServer(): Observable<any> {
        return of(true);
    }
    authDeleteFromServer(): Observable<any> {
        return of(true);
    }
}
