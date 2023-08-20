import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'environments/environment';
import { MessageService } from '../message.services';
import { Router } from '@angular/router';
import { LoadingService } from 'app/core/loader/loadingservice';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DOfficeService {
    public headers = new HttpHeaders();
    constructor(private _httpClient: HttpClient,private _httpClient2: HttpBackend,
        private _messageService: MessageService,
        private loader: LoadingService,
        private _router: Router) {
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * tìm kiem Doffice
     */

    execTimKiem(link,q, soKyHieu,loaiTK,nam,maDv): any {
        let exeParameter = { "MainKeyWord": q,'KY_HIEU':soKyHieu, "LoaiVB": loaiTK,'NAM':nam };
        // let option={
        //     headers:{
        //         "Authorization":"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRERPTlZJIjoiMTE1IiwiSURfTlYiOiIxMzMyIiwiYWxpYXNDQSI6InN5cHZfcG1pc19ldm5pY3RfMDAxIiwibmhhTWFuZyI6IiIsInNpbUNBIjoiIiwic3ViIjoiRVZOSVRcXHN5cHYiLCJlbWFpbCI6InN5cHYuZXZuaXRAZXZuLmNvbS52biIsIm5iZiI6MTY5MDkzODU1OCwiZXhwIjoxNjkwOTU2Njc4fQ.rmTf6XfHPRSJQncXfcmekaSA0d40dIpc_OSEqnlT2AOZd_grXynn6O6WhKk7Lz4gES4YNqsbtLK3pTR3rns4fw"
        //     }
        // }

        let option = this.headers.set(
                "Authorization","Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRERPTlZJIjoiMTE1IiwiSURfTlYiOiIxMzMyIiwiYWxpYXNDQSI6InN5cHZfcG1pc19ldm5pY3RfMDAxIiwibmhhTWFuZyI6IiIsInNpbUNBIjoiIiwic3ViIjoiRVZOSVRcXHN5cHYiLCJlbWFpbCI6InN5cHYuZXZuaXRAZXZuLmNvbS52biIsIm5iZiI6MTY5MDkzODU1OCwiZXhwIjoxNjkwOTU2Njc4fQ.rmTf6XfHPRSJQncXfcmekaSA0d40dIpc_OSEqnlT2AOZd_grXynn6O6WhKk7Lz4gES4YNqsbtLK3pTR3rns4fw222222"
          );

          return this._httpClient2
          .handle(
            new HttpRequest('POST', link+ '/' + 'v1/congviec/Searching/advancedsearch?madv='+maDv, exeParameter, {
              headers: option,
            })
          )
          .subscribe();

       // return this._httpClient2.post<any>(link+ '/' + 'v1/congviec/Searching/advancedsearch?madv='+maDv, exeParameter,option);
    }

    execTimKiemTheoFile(link,idVb): any {
        return this._httpClient.get<any>(link+ '/' + '/v1/vanban/VBDE/ListFileVB?id_VB='+idVb);
    }

    execFileBase64(link,idFile,idDv,idLoaiVB): any {
        return this._httpClient.get<any>(link+ '/' + '/v1/files/FileVb/GetPreviewFileVB?ID_FILE='+idFile+'&ID_DV='+idDv+'&ID_NV=123&ID_LOAI_VB='+idLoaiVB);
    }

    // execTimKiemTheoFile(): Observable<any>
    // {
    //     return this._httpClient.get('api/dashboards/project').pipe(
    //         tap((response: any) => {
              
    //         })
    //     );
    // }

}
