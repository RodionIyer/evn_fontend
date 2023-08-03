import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, forkJoin, map, mergeMap, Observable, ReplaySubject, tap } from 'rxjs';
import { User, UserFunctionGrant } from 'app/core/user/user.types';
import { environment } from 'environments/environment';
import { ServiceService } from 'app/shared/service/service.service';
import { ServiceDataResult } from 'app/shared/service/service.types';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,
        private _serviceService: ServiceService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        return combineLatest({
            user: this._serviceService.execServiceLogin("API-1", null),
            grant: this._serviceService.execServiceLogin("API-5", null),
            grantAuthority: this._serviceService.execServiceLogin("API-5-1", null),
            grantRole: this._serviceService.execServiceLogin("API-5-2", null),
        })
            .pipe(
                map(response => {
                    const user = <ServiceDataResult>response.user;
                    const grant = <ServiceDataResult>response.grant;
                    const grantAuthority = <ServiceDataResult>response.grantAuthority;
                    const grantRole = <ServiceDataResult>response.grantRole;
                    let userResult: User;
                    let lstGrant: UserFunctionGrant[] = [];
                    if (user.status == 1) {
                        if (grant.status == 1) {
                            let LST_AUTHORITY: any[] = [];
                            grant.data.forEach((obj: any) => {

                                LST_AUTHORITY = [];
                                if (grantAuthority.data && grantAuthority.data.length > 0) {
                                    grantAuthority.data.forEach((objAuthority) => {
                                        if (obj["FUNCTIONID"] == objAuthority["FUNCTIONID"]) {
                                            LST_AUTHORITY.push(objAuthority);
                                        }
                                    });
                                }
                                obj["AUTHORITY"] = LST_AUTHORITY;
                                if (obj.FUNCTION_PARENT_ID == null) {
                                    lstGrant.push({
                                        functionId: obj.FUNCTIONID,
                                        functionName: obj.FUNCTIONNAME,
                                        grantPublic:obj.ISPUPLIC,
                                        grantDel: obj.R_DELETE,
                                        grantInsert: obj.R_INSERT,
                                        grantUpdate: obj.R_EDIT,
                                        grantAuthority: obj.AUTHORITY
                                    });

                                }
                            });
                        }
                        userResult = {
                            userId: user.data.USERID, userName: user.data.USERNAME, userIdhrms: user.data.USERID, avatar: environment.appAPI + environment.hrmsIMGPath + '/' + user.data.ORGID + '/' + user.data.MA_NHAN_VIEN + '.png',
                            descript: user.data.DESCRIPT, ORGID: user.data.ORGID, ORGDESC: user.data.ORGDESC, fgrant: lstGrant, roles: grantRole.data
                        };
                    }

                    this._user.next(userResult);
                    return userResult;
                }));
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }
}
