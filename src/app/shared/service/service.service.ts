import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, finalize } from 'rxjs';
import { environment } from 'environments/environment';
import { MessageService } from '../message.services';
import { Router } from '@angular/router';
import { LoadingService } from 'app/core/loader/loadingservice';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {

    constructor(private _httpClient: HttpClient,
        private _messageService: MessageService,
        private loader: LoadingService,
        private _router: Router) {
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    execServiceNoLogin(serviceId, userParameter): any {
        let exeParameter = { "serviceId": serviceId, "parameters": userParameter };
        return this._httpClient.post<any>(environment.appAPI + environment.appPath + '/' + 'service/execServiceNoLogin', exeParameter);
    }

    execServiceLogin(serviceId, userParameter): any {
        let exeParameter = { "serviceId": serviceId, "parameters": userParameter };

        return this._httpClient.post<any>(environment.appAPI + environment.appPath + '/' + 'service/execServiceLogin', exeParameter);
    }
    execServiceLogin_withLoading(serviceId, userParameter): any {
        let exeParameter = { "serviceId": serviceId, "parameters": userParameter };
        this.loader.show()
        var kq = this._httpClient.post<any>(environment.appAPI + environment.appPath + '/' + 'service/execServiceLogin', exeParameter).pipe(finalize(() => {
            this.loader.hide()
        }));
        this.loader.hide()
        return kq;
    }

    public dataImport = new BehaviorSubject<any>(null);
    public dataGrid = new BehaviorSubject<any>(null);
    public dataKeHoach = new BehaviorSubject<any>(null);
}
