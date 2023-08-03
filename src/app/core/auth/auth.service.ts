import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { AuthConfig, environment } from 'environments/environment';
import { DeviceDetectorService } from 'ngx-device-detector';

import { User } from '../user/user.types';



@Injectable()
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private deviceService: DeviceDetectorService,
        private _userService: UserService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(userId: string, password: string): Observable<any> {
        // Throw error, if the user is already logged in
        const credentials = { 'userId': userId, 'password': password };
        if (this._authenticated) {
            return throwError('Bạn đã đăng nhập.');
        }

        return this._httpClient.post(environment.appAPI + environment.appPath + '/' + 'auth/sign-in', credentials).pipe(
            switchMap((response: any) => {
                if (response.status) {
                    this.accessToken = response.token;
                    // Set the authenticated flag to true
                    this._authenticated = true;
                    // Store the user on the user service
                    this._userService.user = response.userInfo;
                    // Return a new observable with the response

                } else {
                    const deviceInfo = this.deviceService.getDeviceInfo();
                    const deviceID =
                        localStorage.getItem(AuthConfig.DEVICE_ID) || AuthUtils.guid();
                    let dataSign = {
                        username: `${credentials.userId}`,
                        password: `${credentials.password}`,
                        expiration: environment.expiration,
                        deviceInfo: {
                            deviceId: deviceID,
                            deviceType: `${deviceInfo.os}/${deviceInfo.os_version}/${deviceInfo.deviceType}/${deviceInfo.browser}`,
                            appId: environment.appId,
                            appVersion: environment.appVersion,
                        },
                    };

                    return this._httpClient.post(environment.appAPI + environment.evnidPath + '/api/auth/login', dataSign).pipe(
                        switchMap(async (response: any) => {
                            const data = response.data;
                            let userInfo: User;
                            this.accessToken = response.data.accessToken;
                            this._authenticated = true;
                            data.username = credentials.userId;
                            userInfo = { userId: credentials.userId, userName: data.hoten, userIdhrms: data.idnv, ORGID: data.iddonvi, ORGDESC: data.tendonvi, roles: [], fgrant: [], descript: data.chucdanh, avatar: null };
                            this._userService.user = userInfo;
                            return of({ "status": 1, "token": data.accessToken, "userInfo": userInfo });
                        })
                    );
                }
                return of(response);

            })

        );
    }
    /**
     * Sign in using the access token
     */
    signInUsingToken(token: string): Observable<any> {
        return this._httpClient.post(environment.appAPI + environment.appPath + '/' + 'auth/sign-in-token', {
            accessToken: token,
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {
                if (response.status) {
                    this.accessToken = response.token;
                    this._authenticated = true;
                    this._userService.user = response.userInfo;
                    return of(true);
                } else {
                    localStorage.removeItem('accessToken');
                    this._authenticated = false;
                    return of(false);
                }
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        if (this._authenticated) {
            return this._httpClient.post(environment.appAPI + environment.appPath + '/' + 'auth/signout', null).pipe(
                catchError(() =>

                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    if (response.status) {
                        localStorage.removeItem('accessToken');

                        // Set the authenticated flag to false
                        this._authenticated = false;

                        // Return the observable
                        return of(true);

                    } else {
                        return of(false);
                    }

                })

            );
        } else {
            return of(true);
        }
        // Remove the access token from the local storage

    }
    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken(this.accessToken);
    }
}


