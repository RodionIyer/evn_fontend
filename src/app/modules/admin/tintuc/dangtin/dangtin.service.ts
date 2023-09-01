import { Injectable } from '@angular/core';
import { BaseDetailInterface } from 'app/shared/commons/basedetail.interface';
import { BaseService } from 'app/shared/commons/base.service';
import { State } from 'app/shared/commons/conmon.types';
import { ServiceService } from 'app/shared/service/service.service';
import {
    BehaviorSubject,
    Observable,
    map,
    of,
    switchMap,
    take,
    tap,
    throwError,
    combineLatest,
} from 'rxjs';
import ShortUniqueId from 'short-unique-id';

@Injectable({
    providedIn: 'root',
})
export class DangTinService extends BaseService implements BaseDetailInterface {
    selectedObjChanged: BehaviorSubject<any> = new BehaviorSubject(null);
    //private _category: BehaviorSubject<ObjCategory> = new BehaviorSubject(null);
    private _objects: BehaviorSubject<any[]> = new BehaviorSubject(null);
    private _objectColumns: BehaviorSubject<any[]> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<any> = new BehaviorSubject(null);
    private _groups: BehaviorSubject<any[]> = new BehaviorSubject(null);
    private _group: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(public _serviceService: ServiceService) {
        super(_serviceService);
    }

    get actionCreate(): Boolean {
        throw new Error('Method not implemented.');
    }

    get actionDelete(): Boolean {
        throw new Error('Method not implemented.');
    }

    get actionEdit(): Boolean {
        throw new Error('Method not implemented.');
    }

    get actionSave(): Boolean {
        throw new Error('Method not implemented.');
    }

    get actionCancel(): Boolean {
        throw new Error('Method not implemented.');
    }

    onEditObject(): void {
        throw new Error('Method not implemented.');
    }

    onSaveObject(): void {
        throw new Error('Method not implemented.');
    }

    onDeleteObject(): void {
        throw new Error('Method not implemented.');
    }

    onCreateObject(): void {
        throw new Error('Method not implemented.');
    }

    onCancelObject(): void {
        throw new Error('Method not implemented.');
    }

    get viewMode(): Boolean {
        throw new Error('Method not implemented.');
    }

    get inputMode(): Boolean {
        throw new Error('Method not implemented.');
    }

    _object: BehaviorSubject<any> = new BehaviorSubject(null);

    getTenPhongBanVaCTy() {
        return;
    }
    getObjectfromServer(param: any): Observable<any> {
        return this._serviceService.execServiceLogin(
            '5F22815A-3C37-4D32-8A62-5C47F203896A',
            [{ name: 'MA_TIN_TUC', value: param }]
        );
    }

    xacMinhTinTuc(param: any): Observable<any> {
        let MA_TIN_TUC: string = param;
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let listNTH = Objs.filter(
                    (item) => item.MA_TIN_TUC == MA_TIN_TUC
                );
                return listNTH;
            }),
            switchMap((listNTH: any) => {
                if (listNTH.length > 0) {
                    return this._serviceService
                        .execServiceLogin(
                            '1E8D9F50-F535-4183-84B1-222CDE66B919',
                            [
                                {
                                    name: 'MA_TIN_TUC',
                                    value: listNTH[0].MA_TIN_TUC,
                                },
                            ]
                        )
                        .pipe(
                            map((response: any) => {
                                if (response.status == 1) {
                                    return response.data;
                                } else {
                                    return 0;
                                }
                            })
                        );
                } else {
                    return -1;
                }
            })
        );
    }
    viewObject(param: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let itemIndex = Objs.findIndex(
                    (item) => item.MA_TIN_TUC === param
                );
                if (itemIndex >= 0) {
                    let data = Objs[itemIndex];
                    data.SYS_ACTION = null;
                    Objs[itemIndex] = data;
                    // Update the Obj
                    this._object.next(Objs[itemIndex]);
                    this._objects.next(Objs);
                    return data;
                } else {
                    return null;
                }
            }),
            switchMap((obj) => {
                return of(obj);
            })
        );
    }

    cancelObject(param: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let itemIndex = Objs.findIndex(
                    (item) => item.MA_TIN_TUC === param
                );
                if (itemIndex >= 0) {
                    let data = Objs[itemIndex];
                    if (data.SYS_ACTION == State.create) {
                        Objs = Objs.filter((item) => item.MA_TIN_TUC != param);
                        this._objects.next(Objs);
                        this._object.next(null);
                        return 0;
                    }
                    if (data.SYS_ACTION == State.edit) {
                        let data = Objs[itemIndex];
                        data.SYS_ACTION = null;
                        Objs[itemIndex] = data;

                        // Update the Obj
                        this._object.next(Objs[itemIndex]);
                        this._objects.next(Objs);
                        return 1;
                    }
                } else {
                    return null;
                }
            }),
            switchMap((result) => {
                return of(result);
            })
        );
    }

    get groups$(): Observable<any[]> {
        return this._groups.asObservable();
    }

    get group$(): Observable<any> {
        return this._group.asObservable();
    }

    get objects$(): Observable<any[]> {
        return this._objects.asObservable();
    }

    get Object$(): Observable<any> {
        return this._object.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<any> {
        return this._pagination.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get folders
     */
    getGroups(): Observable<any> {
        return this._serviceService
            .execServiceLogin('API-40', [{ name: 'USERID', value: null }])
            .pipe(
                tap((response: any) => {
                    this._groups.next(response.data);
                })
            );
    }

    getObjects(): Observable<any> {
        return this._serviceService
            .execServiceLogin('F27EF59D-7BD2-4D33-8774-FAC4633BE11C', null)
            .pipe(
                tap((response: any) => {
                    this._objects.next(response.data);
                }),
                switchMap((response: any) => {
                    if (!response.status) {
                        return throwError({
                            message: 'Requested page is not available!',
                            pagination: response.pagination,
                        });
                    }

                    return of(response);
                })
            );
    }

    getObjectById(id: string): Observable<any> {
        return this._objects.pipe(
            take(1),
            switchMap((objs: any) => {
                // Find the Obj

                const obj = objs.find((item) => item.MA_TIN_TUC === id) || null;
                if (!obj) {
                    return throwError('Could not found with id of ' + id + '!');
                }
                // Trường hợp đang trong quá trình thêm mới và chỉnh sửa thì lấy dữ liệu local, những trường hợp khác lấy từ server
                if (
                    obj.SYS_ACTION != State.create &&
                    obj.SYS_ACTION != State.edit
                ) {
                    return this.getObjectfromServer(id).pipe(
                        map((objResult) => {
                            return objResult.data;
                        }),
                        switchMap((objResult) => {
                            return combineLatest([this.getListFile(id)]).pipe(
                                map(([listFile]) => {
                                    objResult.listFile = listFile.data;

                                    //Cần cập nhật lại list
                                    // Update the Api
                                    let itemIndex = objs.findIndex(
                                        (item) => item.MA_TIN_TUC === id
                                    );
                                    if (itemIndex >= 0) {
                                        objs[itemIndex] = objResult;
                                        this._object.next(objResult);
                                        this._objects.next(objs);
                                        return objResult;
                                    }
                                })
                            );
                        })
                    );
                }
                this._object.next(obj);
                return of(obj);
            })
        );
    }
    
    getListFile(maTinTuc: string): Observable<any> {
        return this._serviceService.execServiceLogin(
            '3EE8FD56-955F-45A2-BE57-7206C8B87BBC',
            [
                {
                    name: 'MA_TIN_TUC',
                    value: maTinTuc,
                },
            ]
        );
    }

    private _listDanMucTinTuc: BehaviorSubject<any[]> = new BehaviorSubject(
        null
    );

    getListDanMucTinTuc(): Observable<any> {
        return this._serviceService
            .execServiceLogin('735807F8-8615-4599-BD7E-CEC9236FB47C', null)
            .pipe(
                tap((response: any) => {
                    this._listDanMucTinTuc.next(response.data);
                })
            );
    }

    get ObjectListDanhMucTinTuc$(): Observable<any> {
        return this._listDanMucTinTuc.asObservable();
    }
    downloadTempExcel(userInp, fileName) {
        const downloadLink = document.createElement('a');

        downloadLink.href = userInp;

        downloadLink.download = fileName;
        downloadLink.click();
    }

    downLoadFile(item): Observable<any> {
        if (item.FILE_BASE64 != undefined && item.FILE_BASE64 != '') {
            let link = item.FILE_BASE64.split(',');

            this.downloadTempExcel(link, item.TEN_FILE);
            return of(1);
        } else {
            var token = localStorage.getItem('accessToken');
            return this._serviceService.execServiceLogin(
                '2269B72D-1A44-4DBB-8699-AF9EE6878F89',
                [
                    { name: 'DUONG_DAN', value: item.DUONG_DAN },
                    { name: 'TOKEN_LINK', value: 'Bearer ' + token },
                ]
            );
        }
    }

    resetObject(): Observable<boolean> {
        return of(true).pipe(
            take(1),
            tap(() => {
                this._object.next(null);
            })
        );
    }
}
