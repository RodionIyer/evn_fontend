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
    forkJoin,
    combineLatest,
} from 'rxjs';
import ShortUniqueId from 'short-unique-id';

@Injectable({
    providedIn: 'root',
})
export class QuanTriTinService
    extends BaseService
    implements BaseDetailInterface
{
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

    createObject(): Observable<any> {
        const uid = new ShortUniqueId();
        return this._objects.pipe(
            take(1),
            map((objects) => {
                // Find the Obj
                let objItem = {
                    MA_TIN_TUC: uid.stamp(16),
                    TIEU_DE_BAI_VIET: '',
                    MA_DANH_MUC_TIN_TUC: '',
                    TOM_TAT: '',
                    NOI_DUNG_SOAN_THAO: '',
                    TU_KHOA: '',
                    TIN_NOI_BAT: false,
                    DA_DUYET: false,
                    ANH_DAI_DIEN: '',
                    NGUOI_SUA: null,
                    NGAY_TAO: null,
                    NGAY_SUA: null,
                    SYS_ACTION: State.create,
                };
                objects.push(objItem);
                this._objects.next(objects);
                this._object.next(objItem);
                return objItem.MA_TIN_TUC;
            }),
            switchMap((objects) => {
                return of(objects);
            })
        );
    }

    editObject(param: any): Observable<any> {
        let MA_TIN_TUC: any = param.MA_TIN_TUC;
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let itemIndex = Objs.findIndex(
                    (item) => item.MA_TIN_TUC === MA_TIN_TUC
                );
                if (itemIndex >= 0) {
                    let data = Objs[itemIndex];
                    data.SYS_ACTION = State.edit;
                    Objs[itemIndex] = data;
                    // Update the Obj
                    this._object.next(Objs[itemIndex]);
                    this._objects.next(Objs);
                    // Return the Obj
                    return 1;
                } else {
                    return 0;
                }
            }),
            switchMap((Objs) => {
                return of(Objs);
            })
        );
    }

    editObjectToServer(param: any): Observable<any> {
        let MA_TIN_TUC: any = param.MA_TIN_TUC;
        let ANH_DAI_DIEN: any = param.ANH_DAI_DIEN;
        let LIST_FILE_NEW: any = param.LIST_FILE_NEW;
        let LIST_FILE_DEL: any = param.LIST_FILE_DEL;
        console.log(LIST_FILE_DEL);

        return this._objects.pipe(
            take(1),
            map((_objects) => {
                let listObj = _objects.filter(
                    (item) => item.MA_TIN_TUC == MA_TIN_TUC
                );
                return listObj;
            }),
            switchMap((listObj: any) => {
                if (listObj.length > 0) {
                    let listApi = [
                        this._serviceService.execServiceLogin(
                            '3A3067A9-E72F-45C0-AC73-BE64C854EB9B',
                            [
                                {
                                    name: 'TIN_NOI_BAT',
                                    value: listObj[0].TIN_NOI_BAT,
                                },
                                {
                                    name: 'MA_DANH_MUC_TIN_TUC',
                                    value: listObj[0].MA_DANH_MUC_TIN_TUC,
                                },
                                {
                                    name: 'TIEU_DE_BAI_VIET',
                                    value: listObj[0].TIEU_DE_BAI_VIET,
                                },
                                {
                                    name: 'TOM_TAT_TIN_TUC',
                                    value: listObj[0].TOM_TAT,
                                },
                                {
                                    name: 'MA_TIN_TUC',
                                    value: listObj[0].MA_TIN_TUC,
                                },
                                { name: 'TIM_KIEM', value: listObj[0].TU_KHOA },
                                {
                                    name: 'ANH_DAI_DIEN_TIN_TUC',
                                    value: ANH_DAI_DIEN,
                                },
                                {
                                    name: 'NOI_DUNG_SOAN_THAO',
                                    value: listObj[0].NOI_DUNG_SOAN_THAO,
                                },
                            ]
                        ),
                    ];

                    LIST_FILE_NEW?.forEach((file) => {
                        let id = this.generateRandomUUID();
                        listApi.push(
                            this._serviceService.execServiceLogin(
                                'DE9F169A-7E9D-4158-B2E2-0ECAE022F2FB',
                                [
                                    {
                                        name: 'KICK_THUOC_NUMBER',
                                        value: file.KICH_THUOC,
                                    },
                                    {
                                        name: 'FILE_UPLOAD',
                                        value: file.FILE_BASE64,
                                    },
                                    {
                                        name: 'MA_FILE',
                                        value: id,
                                    },
                                    { name: 'TEN_FILE', value: file.TEN_FILE },
                                    {
                                        name: 'MA_TIN_TUC',
                                        value: listObj[0].MA_TIN_TUC,
                                    },
                                ]
                            )
                        );
                    });

                    LIST_FILE_DEL?.forEach((file) => {
                        listApi.push(
                            this._serviceService.execServiceLogin(
                                'A73A9F0F-5492-4131-B67E-0A532165DBBF',
                                [
                                    {
                                        name: 'MA_FILE',
                                        value: file,
                                    },
                                ]
                            )
                        );
                    });

                    return forkJoin(listApi).pipe(
                        map((response: any) => {
                            console.log(response);

                            if (response[0].status == 1) {
                                return response[0].data;
                            } else {
                                return of(0);
                            }
                        })
                    );
                } else {
                    return of(0);
                }
            })
        );
    }

    createObjectToServer(param: any): Observable<any> {
        let MA_TIN_TUC: any = param.MA_TIN_TUC;
        let USER_MDF_ID: any = param.USER_MDF_ID;
        let ANH_DAI_DIEN: any = param.ANH_DAI_DIEN;
        let LIST_FILE_NEW: any = param.LIST_FILE_NEW;
        return this._objects.pipe(
            take(1),
            map((objects) => {
                let lstObjectAddNew = objects.filter(
                    (item) => item.MA_TIN_TUC == MA_TIN_TUC
                );
                return lstObjectAddNew;
            }),
            switchMap((lstObjectAddNew: any) => {
                if (lstObjectAddNew.length > 0) {
                    let itemIndex = lstObjectAddNew.findIndex(
                        (item) => item.MA_TIN_TUC === param.MA_TIN_TUC
                    );
                    let data = lstObjectAddNew[itemIndex];
                    let listApi = [
                        this._serviceService.execServiceLogin(
                            '351174E0-733E-458A-A764-D15BE9F24794',
                            [
                                {
                                    name: 'TIN_NOI_BAT',
                                    value: data.TIN_NOI_BAT,
                                },
                                {
                                    name: 'MA_DANH_MUC_TIN_TUC',
                                    value: data.MA_DANH_MUC_TIN_TUC,
                                },
                                {
                                    name: 'TIEU_DE_BAI_VIET',
                                    value: data.TIEU_DE_BAI_VIET,
                                },
                                {
                                    name: 'TOM_TAT_TIN_TUC',
                                    value: data.TOM_TAT,
                                },
                                {
                                    name: 'MA_TIN_TUC',
                                    value: data.MA_TIN_TUC,
                                },
                                { name: 'TIM_KIEM', value: data.TU_KHOA },
                                {
                                    name: 'ANH_DAI_DIEN_TIN_TUC',
                                    value: ANH_DAI_DIEN,
                                },
                                {
                                    name: 'NOI_DUNG_SOAN_THAO',
                                    value: data.NOI_DUNG_SOAN_THAO,
                                },
                            ]
                        ),
                    ];
                    LIST_FILE_NEW?.forEach((file) => {
                        let id = this.generateRandomUUID();
                        listApi.push(
                            this._serviceService.execServiceLogin(
                                'DE9F169A-7E9D-4158-B2E2-0ECAE022F2FB',
                                [
                                    {
                                        name: 'KICK_THUOC_NUMBER',
                                        value: file.KICH_THUOC,
                                    },
                                    {
                                        name: 'FILE_UPLOAD',
                                        value: file.FILE_BASE64,
                                    },
                                    {
                                        name: 'MA_FILE',
                                        value: id,
                                    },
                                    { name: 'TEN_FILE', value: file.TEN_FILE },
                                    {
                                        name: 'MA_TIN_TUC',
                                        value: data.MA_TIN_TUC,
                                    },
                                ]
                            )
                        );
                    });

                    return forkJoin(listApi).pipe(
                        map((response: any) => {
                            if (response[0].status == 1) {
                                data.USER_MDF_ID = USER_MDF_ID;
                                data.NGUOI_TAO = USER_MDF_ID;
                                switch (response[0].data) {
                                    case 0:
                                    case -1:
                                    case -2:
                                    case -3:
                                        lstObjectAddNew[itemIndex] = data;
                                        break;
                                    default:
                                        data.SYS_ACTION = State.edit;
                                        lstObjectAddNew[itemIndex] = data;
                                        break;
                                }
                                return response[0].data;
                            }
                        })
                    );
                } else {
                    return of(0);
                }
            })
        );
    }

    getObjectfromServer(param: any): Observable<any> {
        return this._serviceService.execServiceLogin(
            '5F22815A-3C37-4D32-8A62-5C47F203896A',
            [{ name: 'MA_TIN_TUC', value: param }]
        );
    }

    deleteObjectToServer(param: any): Observable<any> {
        let MA_TIN_TUC: string = param;
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let listNTH = Objs.filter(
                    (item) =>
                        item.MA_TIN_TUC == MA_TIN_TUC && item.DA_XOA === false
                );
                return listNTH;
            }),
            switchMap((listNTH: any) => {
                if (listNTH.length > 0) {
                    return this._serviceService
                        .execServiceLogin(
                            'A1B6E9AE-17D6-4532-8011-B52001B15D7E',
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
                                    return 1;
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

    deleteObject(param: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let listNTHDel = Objs.filter(
                    (item) => item.MA_TIN_TUC == param && item.DA_XOA === false
                );
                if (listNTHDel.length > 0) {
                    try {
                        Objs = Objs.filter((item) => item.MA_TIN_TUC != param);
                        this._objects.next(Objs);
                        this.resetObject();
                        return 1;
                    } catch {
                        return 0;
                    }
                } else {
                    return -1;
                }
            }),
            switchMap((Objs) => {
                return of(Objs);
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

    resetObject(): Observable<boolean> {
        return of(true).pipe(
            take(1),
            tap(() => {
                this._object.next(null);
            })
        );
    }

    downloadTempExcel(userInp, fileName) {
        const downloadLink = document.createElement('a');

        downloadLink.href = userInp;

        downloadLink.download = fileName;
        downloadLink.click();
    }

    downLoadFile(item): Observable<any> {
        return this._serviceService
            .execServiceLogin('A228E0DD-1792-452A-A347-E67BE9054223', [
                { name: 'MA_FILE', value: item.MA_FILE },
            ])
            .pipe(
                map((fileRes: any) => {
                    return fileRes.data;
                }),
                switchMap((file: any) => {
                    if (
                        file.FILE_BASE64 != undefined &&
                        file.FILE_BASE64 != ''
                    ) {
                        let link = file.FILE_BASE64.split(',');

                        this.downloadTempExcel(link, item.TEN_FILE);
                        return of(1);
                    } else {
                        var token = localStorage.getItem('accessToken');
                        return this._serviceService.execServiceLogin(
                            '2269B72D-1A44-4DBB-8699-AF9EE6878F89',
                            [
                                { name: 'DUONG_DAN', value: item.DUONG_DAN },
                                {
                                    name: 'TOKEN_LINK',
                                    value: 'Bearer ' + token,
                                },
                            ]
                        );
                    }
                })
            );
    }

    generateRandomUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                const r = (Math.random() * 16) | 0;
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        );
    }
}
