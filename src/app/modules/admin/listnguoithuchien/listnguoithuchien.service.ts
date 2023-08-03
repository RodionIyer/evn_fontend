import { user } from './../../../mock-api/common/user/data';
import { Injectable } from '@angular/core';
import { BaseDetailInterface } from 'app/shared/commons/basedetail.interface';
import { BaseService } from 'app/shared/commons/base.service';
import { State } from 'app/shared/commons/conmon.types';
import { ServiceService } from 'app/shared/service/service.service';
import {
    BehaviorSubject,
    Observable,
    forkJoin,
    map,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import ShortUniqueId from 'short-unique-id';

@Injectable({
    providedIn: 'root',
})
export class ListNguoiThucHienService
    extends BaseService
    implements BaseDetailInterface {
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
    // TO DO
    createObject(_groupid: any): Observable<any> {
        let groupid: string = _groupid;
        const uid = new ShortUniqueId();
        return this._objects.pipe(
            take(1),
            map((objects) => {
                // Find the Obj
                let objItem = {
                    MA_NGUOI_THUC_HIEN: uid.stamp(10),
                    NS_ID: '',
                    ORGID: groupid,
                    TEN_NGUOI_THUC_HIEN: '',
                    MA_HOC_HAM: '',
                    NAM_HOC_HAM: '',
                    MA_HOC_VI: '',
                    NAM_HOC_VI: '',
                    EMAL: '',
                    SDT: '',
                    NOI_LAM_VIEC: '',
                    DIA_CHI_NOI_LAM_VIEC: '',
                    TRANG_THAI_XAC_MINH: false,
                    NGAY_XAC_MINH: '',
                    CHUYEN_GIA: false,
                    NGOAI_EVN: false,
                    NAM_SINH: '',
                    GIO_TINH: 2,
                    CCCD: '',
                    IS_CHUYEN_GIA_TNUOC: false,
                    IS_CHUYEN_GIA_NNUOC: false,
                    THANH_TUU: '',
                    NGUOI_TAO: '',
                    NGAY_TAO: '',
                    NGUOI_SUA: '',
                    NGAY_SUA: '',
                    DA_XOA: false,
                    TEN_HOC_VI: '',
                    MA_TICH_HOP: '',
                    TEN_HOC_HAM: '',
                    MA_LVUC_NCUU: '',
                    TEN_LVUC_NCUU: '',
                    USER_MDF_ID: '',
                    listCongTrinh: [{}],
                    listCongTrinhApDung: [{}],
                    listDeTai: [{}],
                    listGiaiThuong: [{}],
                    listQuaTrinhCongTac: [{}],
                    listQuaTrinhDaoTao: [{}],
                    listVanBang: [{}],
                    SYS_ACTION: State.create,
                };
                objects.push(objItem);
                this._objects.next(objects);
                this._object.next(objItem);
                return objItem.MA_NGUOI_THUC_HIEN;
            }),
            switchMap((objects) => {
                return of(objects);
            })
        );
    }
    //TO DO
    editObject(param: any): Observable<any> {
        let MA_NGUOI_THUC_HIEN: any = param.MA_NGUOI_THUC_HIEN;
        let USER_MDF_ID: any = param.USER_MDF_ID;

        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let itemIndex = Objs.findIndex(
                    (item) => item.MA_NGUOI_THUC_HIEN === MA_NGUOI_THUC_HIEN
                );
                if (itemIndex >= 0) {
                    let data = Objs[itemIndex];
                    data.SYS_ACTION = State.edit;
                    data.USER_MDF_ID = USER_MDF_ID;
                    Objs[itemIndex] = data;
                    // Update the Obj
                    // this._object.next(Objs[itemIndex]);
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
    // TO DO
    editObjectToServer(param: any, listData: any, selectedDel: any): Observable<any> {
        let MA_NGUOI_THUC_HIEN: string = param;
        let _listData = listData;

        return this._objects.pipe(
            take(1),
            map((objects) => {
                let lstobjects = objects.filter(
                    (item) => item.MA_NGUOI_THUC_HIEN == MA_NGUOI_THUC_HIEN
                );
                return lstobjects;
            }),
            switchMap((lstobjects: any) => {
                if (lstobjects.length > 0) {
                    let itemIndex = lstobjects.findIndex(
                        (item) => item.MA_NGUOI_THUC_HIEN === param
                    );
                    if (itemIndex >= 0) {
                        let data = lstobjects[itemIndex];
                        data.SYS_ACTION = null;
                        lstobjects[itemIndex] = data;
                        let listApi = [];
                        listApi.push(
                            this._serviceService.execServiceLogin(
                                '389786E3-3009-47BB-958C-8DC0555426AE',
                                [
                                    {
                                        name: 'MA_NGUOI_THUC_HIEN',
                                        value: data.MA_NGUOI_THUC_HIEN,
                                    },
                                    {
                                        name: 'TEN_NGUOI_THUC_HIEN',
                                        value: data.TEN_NGUOI_THUC_HIEN,
                                    },
                                    {
                                        name: 'MA_HOC_HAM',
                                        value: data.MA_HOC_HAM,
                                    },
                                    {
                                        name: 'NAM_HOC_HAM',
                                        value: data.NAM_HOC_HAM,
                                    },
                                    {
                                        name: 'MA_HOC_VI',
                                        value: data.MA_HOC_VI,
                                    },
                                    {
                                        name: 'NAM_HOC_VI',
                                        value: data.NAM_HOC_VI,
                                    },
                                    { name: 'EMAIL', value: data.EMAL },
                                    { name: 'SDT', value: data.SDT },
                                    {
                                        name: 'NOI_LAM_VIEC',
                                        value: data.NOI_LAM_VIEC,
                                    },
                                    {
                                        name: 'DIA_CHI_NOI_LAM_VIEC',
                                        value: data.DIA_CHI_NOI_LAM_VIEC,
                                    },
                                    {
                                        name: 'CHUYEN_GIA',
                                        value: data.CHUYEN_GIA,
                                    },
                                    {
                                        name: 'NGOAI_EVN',
                                        value: data.NGOAI_EVN,
                                    },
                                    { name: 'NAM_SINH', value: data.NAM_SINH },
                                    { name: 'GIO_TINH', value: data.GIO_TINH },
                                    { name: 'CCCD', value: data.CCCD },
                                    {
                                        name: 'IS_CHUYEN_GIA_TNUOC',
                                        value: data.IS_CHUYEN_GIA_TNUOC,
                                    },
                                    {
                                        name: 'IS_CHUYEN_GIA_NNUOC',
                                        value: data.IS_CHUYEN_GIA_NNUOC,
                                    },
                                    {
                                        name: 'NS_ID',
                                        value: data.NS_ID,
                                    },
                                    {
                                        name: 'THANH_TUU',
                                        value: data.THANH_TUU,
                                    },
                                ]
                            )
                        );

                        const updateListAPI = {
                            listDeTai: 'F8003413-E1D9-491F-84E7-58C34096CD1F',
                            listGiaiThuong:
                                'B22C6D69-F206-430A-95F8-30F95A7276D3',
                            listCongTrinh:
                                '0BD5B9EA-67C4-4070-99C8-B0206B02877F',
                            listVanBang: '035E4EE5-B54A-429E-8A27-80BAD125467E',
                            listQuaTrinhDaoTao:
                                'EDB1FFFF-9F5D-46CF-BD57-5CBCC441B001',
                            listCongTrinhApDung:
                                'D7A6E386-4F5B-4EF1-A284-F7FEAC69AE8A',
                            listQuaTrinhCongTac:
                                'B48A830A-E795-4CCF-B899-2BAF76077727',
                        };

                        const insertListAPI = {
                            listDeTai: 'FA49EF6E-0D66-41C1-B76F-A3ED906D01E7',
                            listGiaiThuong:
                                '5C04E97C-7458-4B7E-99F9-D2BBF591D9F3',
                            listCongTrinh:
                                'DB5876D1-64D3-40D9-86D3-2E6209EAD8CD',
                            listVanBang: '534290B3-38FB-4AF9-91D9-BC4534702C96',
                            listQuaTrinhDaoTao:
                                '137FA75E-352B-42F9-9629-30D5FDA6D31E',
                            listCongTrinhApDung:
                                'CB5680CA-8503-4966-A2E6-FCFC28AB5150',
                            listQuaTrinhCongTac:
                                '233BD939-8A0A-4791-AF86-5F80F09D2AF7',
                        };

                        for (let type in _listData) {
                            if (updateListAPI[type]) {
                                // console.log(updateListAPI[type]);
                                for (let _x in _listData[type]) {
                                    // console.log(_listData[type][_x]);
                                    let parameters = [];
                                    for (let __x in _listData[type][_x]) {
                                        if (_listData[type][_x][__x] !== null) {
                                            let res = {
                                                name: __x,
                                                value: _listData[type][_x][__x],
                                            };
                                            parameters.push(res);
                                            // console.log(res)
                                        }
                                    }
                                    // console.log(parameters);
                                    if (_listData[type][_x].isEdit)
                                        listApi.push(
                                            this._serviceService.execServiceLogin(
                                                updateListAPI[type],
                                                parameters
                                            )
                                        )

                                    if (_listData[type][_x].isNew)
                                        listApi.push(
                                            this._serviceService.execServiceLogin(
                                                insertListAPI[type],
                                                parameters
                                            )
                                        );
                                }
                            }
                        }
                        selectedDel?.forEach((value) => {
                            // console.log(value)
                            listApi.push(
                                this._serviceService.execServiceLogin(
                                    'D986A3B3-020C-4A25-9CC0-A998AC2C526E',
                                    [
                                        { "name": "MA_DONG", "value": value.MA_DONG },
                                        { "name": "MA_BANG", "value": value.MA_BANG }
                                    ]
                                )
                            )
                        })

                        // console.log(listApi);
                        return forkJoin(listApi).pipe(
                            map((response: any) => {
                                // console.log(response);
                                if (response[0].status == 1)
                                    return response[0].data;
                            })
                        );
                    } else {
                        return null;
                    }
                } else {
                    return of(0);
                }
            })
        );
    }
    //TO DO
    createObjectToServer(param: any): Observable<any> {
        let MA_NGUOI_THUC_HIEN: any = param.MA_NGUOI_THUC_HIEN;
        let USER_MDF_ID: any = param.USER_MDF_ID;

        return this._objects.pipe(
            take(1),
            map((objects) => {
                let lstObjectAddNew = objects.filter(
                    (item) => item.MA_NGUOI_THUC_HIEN == MA_NGUOI_THUC_HIEN
                );
                return lstObjectAddNew;
            }),
            switchMap((lstObjectAddNew: any) => {
                if (lstObjectAddNew.length > 0) {
                    let itemIndex = lstObjectAddNew.findIndex(
                        (item) =>
                            item.MA_NGUOI_THUC_HIEN === param.MA_NGUOI_THUC_HIEN
                    );
                    let data = lstObjectAddNew[itemIndex];

                    return this._serviceService
                        .execServiceLogin(
                            '2E19ECF6-5700-474D-AA19-A18B281CCB13',
                            [
                                {
                                    name: 'MA_NGUOI_THUC_HIEN',
                                    value: data.MA_NGUOI_THUC_HIEN,
                                },
                                {
                                    name: 'TEN_NGUOI_THUC_HIEN',
                                    value: data.TEN_NGUOI_THUC_HIEN,
                                },
                                { name: 'MA_HOC_HAM', value: data.MA_HOC_HAM },
                                {
                                    name: 'NAM_HOC_HAM',
                                    value: data.NAM_HOC_HAM,
                                },
                                { name: 'MA_HOC_VI', value: data.MA_HOC_VI },
                                { name: 'NAM_HOC_VI', value: data.NAM_HOC_VI },
                                { name: 'EMAIL', value: data.EMAIL },
                                { name: 'SDT', value: data.SDT },
                                {
                                    name: 'NOI_LAM_VIEC',
                                    value: data.NOI_LAM_VIEC,
                                },
                                {
                                    name: 'DIA_CHI_NOI_LAM_VIEC',
                                    value: data.DIA_CHI_NOI_LAM_VIEC,
                                },
                                { name: 'CHUYEN_GIA', value: data.CHUYEN_GIA },
                                { name: 'NGOAI_EVN', value: data.NGOAI_EVN },
                                { name: 'NAM_SINH', value: data.NAM_SINH },
                                { name: 'GIO_TINH', value: data.GIO_TINH },
                                { name: 'CCCD', value: data.CCCD },
                                {
                                    name: 'IS_CHUYEN_GIA_TNUOC',
                                    value: data.IS_CHUYEN_GIA_TNUOC,
                                },
                                {
                                    name: 'IS_CHUYEN_GIA_NNUOC',
                                    value: data.IS_CHUYEN_GIA_NNUOC,
                                },
                                { name: 'USERID', value: null },
                                { name: 'ORGID', value: data.ORGID },
                                { name: 'NS_ID', value: data.NS_ID },
                                {
                                    name: 'THANH_TUU',
                                    value: data.THANH_TUU,
                                },
                            ]
                        )
                        .pipe(
                            map((response: any) => {
                                if (response.status == 1) {
                                    data.USER_MDF_ID = USER_MDF_ID;
                                    data.NGUOI_TAO = USER_MDF_ID;
                                    switch (response.data) {
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
                                    return response.data;
                                }
                            })
                        );
                } else {
                    return 0;
                }
            })
        );
    }

    getObjectfromServer(param: any): Observable<any> {
        return this._serviceService.execServiceLogin(
            '0DBC822B-5012-4FD3-A735-4EDC38DBD23C',
            [{ name: 'MA_NGUOI_THUC_HIEN', value: param }]
        );
    }

    xacMinhNguoiThucHien(param: any): Observable<any> {
        let MA_NGUOI_THUC_HIEN: string = param;
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let listNTH = Objs.filter(
                    (item) =>
                        item.MA_NGUOI_THUC_HIEN == MA_NGUOI_THUC_HIEN &&
                        item.DA_XOA === false
                );
                return listNTH;
            }),
            switchMap((listNTH: any) => {
                if (listNTH.length > 0) {
                    return this._serviceService
                        .execServiceLogin(
                            '6745500E-0BF0-4867-B74C-827966792D9F',
                            [
                                {
                                    name: 'MA_NGUOI_THUC_HIEN',
                                    value: listNTH[0].MA_NGUOI_THUC_HIEN,
                                },
                                {
                                    name: 'USERID',
                                    value: null,
                                },
                            ]
                        )
                        .pipe(
                            map((response: any) => {
                                // console.log(response);
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

    updateUserAfterXacMinh(param: any): Observable<any> {
        let MA_NGUOI_THUC_HIEN: string = param;
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let itemIndex = Objs.findIndex(
                    (item) =>
                        item.MA_NGUOI_THUC_HIEN === MA_NGUOI_THUC_HIEN &&
                        item.DA_XOA === false
                );
                if (itemIndex > 0) {
                    try {
                        let data = Objs[itemIndex];
                        data.TRANG_THAI_XAC_MINH = 1;
                        Objs[itemIndex] = data;
                        this._object.next(Objs[itemIndex]);
                        this._objects.next(Objs);
                        return 1;
                    } catch {
                        return 0;
                    }
                } else {
                    return -1;
                }
            }),
            switchMap((Obj) => {
                if (!Obj) {
                    return throwError(
                        'Could not found Object with id of ' +
                        MA_NGUOI_THUC_HIEN +
                        '!'
                    );
                }
                return of(Obj);
            })
        );
    }

    huyXacMinhNguoiThucHien(param: any): Observable<any> {
        let MA_NGUOI_THUC_HIEN: string = param;
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let listNTH = Objs.filter(
                    (item) =>
                        item.MA_NGUOI_THUC_HIEN == MA_NGUOI_THUC_HIEN &&
                        item.DA_XOA === false
                );
                return listNTH;
            }),
            switchMap((listNTH: any) => {
                if (listNTH.length > 0) {
                    return this._serviceService
                        .execServiceLogin(
                            'AFEF1986-4848-4C82-8224-8E06271E9D82',
                            [
                                {
                                    name: 'MA_NGUOI_THUC_HIEN',
                                    value: listNTH[0].MA_NGUOI_THUC_HIEN,
                                },
                                {
                                    name: 'USERID',
                                    value: null,
                                },
                            ]
                        )
                        .pipe(
                            map((response: any) => {
                                // console.log(response);
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

    updateUserAfterHuyXacMinh(param: any): Observable<any> {
        let MA_NGUOI_THUC_HIEN: string = param;
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let itemIndex = Objs.findIndex(
                    (item) =>
                        item.MA_NGUOI_THUC_HIEN === MA_NGUOI_THUC_HIEN &&
                        item.DA_XOA === false
                );
                if (itemIndex > 0) {
                    try {
                        let data = Objs[itemIndex];
                        data.TRANG_THAI_XAC_MINH = 0;
                        Objs[itemIndex] = data;
                        this._object.next(Objs[itemIndex]);
                        this._objects.next(Objs);
                        return 1;
                    } catch {
                        return 0;
                    }
                } else {
                    return -1;
                }
            }),
            switchMap((Obj) => {
                if (!Obj) {
                    return throwError(
                        'Could not found Object with id of ' +
                        MA_NGUOI_THUC_HIEN +
                        '!'
                    );
                }
                return of(Obj);
            })
        );
    }

    deleteObjectToServer(param: any): Observable<any> {
        let MA_NGUOI_THUC_HIEN: string = param;
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let listNTH = Objs.filter(
                    (item) =>
                        item.MA_NGUOI_THUC_HIEN == MA_NGUOI_THUC_HIEN &&
                        item.DA_XOA === false
                );
                return listNTH;
            }),
            switchMap((listNTH: any) => {
                if (listNTH.length > 0) {
                    return this._serviceService
                        .execServiceLogin(
                            'F6DCF922-BC96-47F1-904C-3F810985244D',
                            [
                                {
                                    name: 'MA_NGUOI_THUC_HIEN',
                                    value: listNTH[0].MA_NGUOI_THUC_HIEN,
                                },
                                {
                                    name: 'USERID',
                                    value: null,
                                },
                            ]
                        )
                        .pipe(
                            map((response: any) => {
                                if (response.status == 1) {
                                    this.deleteObject(
                                        listNTH[0].MA_NGUOI_THUC_HIEN
                                    );
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
    deleteObject(param: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            map((Objs) => {
                let listNTHDel = Objs.filter(
                    (item) =>
                        item.MA_NGUOI_THUC_HIEN == param &&
                        item.DA_XOA === false
                );
                if (listNTHDel.length > 0) {
                    try {
                        Objs = Objs.filter(
                            (item) => item.MA_NGUOI_THUC_HIEN != param
                        );
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
                    (item) => item.MA_NGUOI_THUC_HIEN === param
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
                    (item) => item.MA_NGUOI_THUC_HIEN === param
                );
                if (itemIndex >= 0) {
                    let data = Objs[itemIndex];
                    if (data.SYS_ACTION == State.create) {
                        Objs = Objs.filter(
                            (item) => item.MA_NGUOI_THUC_HIEN != param
                        );
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

    /**
     * Get Objs by filter
     */

    /**
     * Get Objs by folder
     */
    getObjectsByFolder(groupid: string): Observable<any> {
        // Execute the Objs loading with true

        if (groupid == 'all') {
            return this._serviceService
                .execServiceLogin('BAFFCFAE-6451-4515-82FB-B3AC35934F61', null)
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
        } else {
            return this._serviceService
                .execServiceLogin('5C7BAE9B-62E3-4F3B-A4FF-49AA926010D6', [
                    { name: 'ORGID', value: groupid },
                ])
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
    }

    /**
     * Get Obj by id
     */
    updateObjById(id: string, data: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            map((objects) => {
                // Find the Obj
                let itemIndex = objects.findIndex(
                    (item) => item.USERID_KEY === id
                );
                objects[itemIndex] = data;
                // Update the Obj
                this._object.next(objects[itemIndex]);
                this._objects.next(objects);
                // Return the Obj
                return objects[itemIndex];
            }),
            switchMap((object) => {
                if (!object) {
                    return throwError(
                        'Could not found Object with id of ' + id + '!'
                    );
                }

                return of(object);
            })
        );
    }
    getObjectById(id: string): Observable<any> {
        return this._objects.pipe(
            take(1),
            switchMap((objs: any) => {
                // Find the Obj
                const obj =
                    objs.find((item) => item.MA_NGUOI_THUC_HIEN === id) || null;
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
                            // console.log(objResult);
                            let itemIndex = objs.findIndex(
                                (item) => item.MA_NGUOI_THUC_HIEN === id
                            );
                            if (itemIndex >= 0) {
                                objs[itemIndex] = objResult.data;
                                this._object.next(objResult.data);
                                this._objects.next(objs);
                                return objResult.data;
                            }
                        })
                    );
                }

                this._object.next(obj);
                return of(obj);
            })
        );
    }
    getObjectTitleById(objectId: string): Observable<any> {
        // Execute the Objs loading with true

        return this._serviceService
            .execServiceLogin('API-43', [{ name: 'xUSERID', value: objectId }])
            .pipe(
                tap((response: any) => {
                    this._objectColumns.next(response.data);
                })
            );
    }
    getGroupById(groupid: string): Observable<any> {
        return this._groups.pipe(
            take(1),
            map((groups) => {
                // Find the Group
                const group =
                    groups.find((item) => item.ORGID === groupid) || null;

                // Update the Group
                this._group.next(group);

                // Return the Group
                return group;
            }),
            switchMap((group) => {
                return of(group);
            })
        );
    }

    private _listHocHam: BehaviorSubject<any[]> = new BehaviorSubject(null);

    getListHocHam(): Observable<any> {
        return this._serviceService
            .execServiceLogin('2AD410DB-EC15-4F96-A058-F017F08CDFB1', null)
            .pipe(
                tap((response: any) => {
                    this._listHocHam.next(response.data);
                })
            );
    }

    get ObjectListHocHam$(): Observable<any> {
        return this._listHocHam.asObservable();
    }

    private _listHocVi: BehaviorSubject<any[]> = new BehaviorSubject(null);

    getListHocVi(): Observable<any> {
        return this._serviceService
            .execServiceLogin('E35400BD-7338-4F60-BC07-DCBE5B3BD060', null)
            .pipe(
                tap((response: any) => {
                    this._listHocVi.next(response.data);
                })
            );
    }

    get ObjectListHocVi$(): Observable<any> {
        return this._listHocVi.asObservable();
    }

    private _listLvucNCuu: BehaviorSubject<any[]> = new BehaviorSubject(null);

    getListLvucNCuu(): Observable<any> {
        return this._serviceService
            .execServiceLogin('3AB80124-41D7-4E3D-B16D-DCACD670D3AF', null)
            .pipe(
                tap((response: any) => {
                    this._listLvucNCuu.next(response.data);
                })
            );
    }

    get ObjectListLvucNCuu$(): Observable<any> {
        return this._listLvucNCuu.asObservable();
    }

    private _listTrinhDo: BehaviorSubject<any[]> = new BehaviorSubject(null);

    getListTrinhDo(): Observable<any> {
        return this._serviceService
            .execServiceLogin('5EE0ACDF-2AD4-4F79-B28F-1DB5A6ABB0C8', null)
            .pipe(
                tap((response: any) => {
                    this._listTrinhDo.next(response.data);
                })
            );
    }

    get ObjectListTrinhDo$(): Observable<any> {
        return this._listTrinhDo.asObservable();
    }

    resetObject(): Observable<boolean> {
        return of(true).pipe(
            take(1),
            tap(() => {
                this._object.next(null);
            })
        );
    }

    private _listNhanSu: BehaviorSubject<any[]> = new BehaviorSubject(null);

    getListNhanSu(): Observable<any> {
        return this._serviceService
            .execServiceLogin('6174FEF6-1FCF-4426-BCA9-DE3A0A4007C1', null)
            .pipe(
                tap((response: any) => {
                    this._listNhanSu.next(response.data);
                })
            );
    }

    get ObjectListNhanSu$(): Observable<any> {
        return this._listNhanSu.asObservable();
    }

    getListDeTaiFromServer(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._serviceService
            .execServiceLogin('5AD31EA4-55B6-456D-B6B5-6EFFE5300FF6', [
                { name: 'MA_NGUOI_THUC_HIEN', value: MA_NGUOI_THUC_HIEN },
            ])
            .pipe(
                tap((response: any) => {
                    return response.data;
                })
            );
    }

    getListDetai(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            switchMap((objs: any) => {
                // Find the Obj
                const obj =
                    objs.find(
                        (item) => item.MA_NGUOI_THUC_HIEN === MA_NGUOI_THUC_HIEN
                    ) || null;
                if (!obj) {
                    return throwError(
                        'Could not found with id of ' + MA_NGUOI_THUC_HIEN + '!'
                    );
                }
                // Trường hợp đang trong quá trình thêm mới và chỉnh sửa thì lấy dữ liệu local, những trường hợp khác lấy từ server
                if (
                    obj.SYS_ACTION != State.create &&
                    obj.SYS_ACTION != State.edit
                ) {
                    return this.getListDeTaiFromServer(MA_NGUOI_THUC_HIEN).pipe(
                        map((objResult) => {
                            let itemIndex = objs.findIndex(
                                (item) =>
                                    item.MA_NGUOI_THUC_HIEN ===
                                    MA_NGUOI_THUC_HIEN
                            );
                            if (itemIndex >= 0) {
                                objs[itemIndex].listDeTai = objResult.data;
                                this._object.next(objs[itemIndex]);
                                this._objects.next(objs);

                                return objResult;
                            }
                            return objResult.data;
                        })
                    );
                }
                this._object.next(obj);
                return of(obj);
            })
        );
    }

    getListQuaTrinhDaoTaoFromServer(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._serviceService
            .execServiceLogin('7CF967C6-619E-40E9-9926-0E138BC8809C', [
                { name: 'MA_NGUOI_THUC_HIEN', value: MA_NGUOI_THUC_HIEN },
            ])
            .pipe(
                tap((response: any) => {
                    return response.data;
                })
            );
    }

    getListQuaTrinhDaoTao(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            switchMap((objs: any) => {
                // Find the Obj
                const obj =
                    objs.find(
                        (item) => item.MA_NGUOI_THUC_HIEN === MA_NGUOI_THUC_HIEN
                    ) || null;
                if (!obj) {
                    return throwError(
                        'Could not found with id of ' + MA_NGUOI_THUC_HIEN + '!'
                    );
                }
                // Trường hợp đang trong quá trình thêm mới và chỉnh sửa thì lấy dữ liệu local, những trường hợp khác lấy từ server
                if (
                    obj.SYS_ACTION != State.create &&
                    obj.SYS_ACTION != State.edit
                ) {
                    return this.getListQuaTrinhDaoTaoFromServer(
                        MA_NGUOI_THUC_HIEN
                    ).pipe(
                        map((objResult) => {
                            let itemIndex = objs.findIndex(
                                (item) =>
                                    item.MA_NGUOI_THUC_HIEN ===
                                    MA_NGUOI_THUC_HIEN
                            );
                            if (itemIndex >= 0) {
                                objs[itemIndex].listQuaTrinhDaoTao =
                                    objResult.data;
                                this._object.next(objs[itemIndex]);
                                this._objects.next(objs);

                                return objResult;
                            }
                            return objResult.data;
                        })
                    );
                }
                this._object.next(obj);
                return of(obj);
            })
        );
    }

    getListCongTrinhApDungFromServer(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._serviceService
            .execServiceLogin('953A8685-FFEC-4809-A633-8FD5FA85EBC1', [
                { name: 'MA_NGUOI_THUC_HIEN', value: MA_NGUOI_THUC_HIEN },
            ])
            .pipe(
                tap((response: any) => {
                    return response.data;
                })
            );
    }

    getListCongTrinhApDung(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            switchMap((objs: any) => {
                // Find the Obj
                const obj =
                    objs.find(
                        (item) => item.MA_NGUOI_THUC_HIEN === MA_NGUOI_THUC_HIEN
                    ) || null;
                if (!obj) {
                    return throwError(
                        'Could not found with id of ' + MA_NGUOI_THUC_HIEN + '!'
                    );
                }
                // Trường hợp đang trong quá trình thêm mới và chỉnh sửa thì lấy dữ liệu local, những trường hợp khác lấy từ server
                if (
                    obj.SYS_ACTION != State.create &&
                    obj.SYS_ACTION != State.edit
                ) {
                    return this.getListCongTrinhApDungFromServer(
                        MA_NGUOI_THUC_HIEN
                    ).pipe(
                        map((objResult) => {
                            let itemIndex = objs.findIndex(
                                (item) =>
                                    item.MA_NGUOI_THUC_HIEN ===
                                    MA_NGUOI_THUC_HIEN
                            );
                            if (itemIndex >= 0) {
                                objs[itemIndex].listCongTrinhApDung =
                                    objResult.data;
                                this._object.next(objs[itemIndex]);
                                this._objects.next(objs);

                                return objResult;
                            }
                            return objResult.data;
                        })
                    );
                }
                this._object.next(obj);
                return of(obj);
            })
        );
    }

    getListCongTrinhFromServer(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._serviceService
            .execServiceLogin('F5F82C17-DCA7-4B96-9E30-B396B89D14BF', [
                { name: 'MA_NGUOI_THUC_HIEN', value: MA_NGUOI_THUC_HIEN },
            ])
            .pipe(
                tap((response: any) => {
                    return response.data;
                })
            );
    }

    getListCongTrinh(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            switchMap((objs: any) => {
                // Find the Obj
                const obj =
                    objs.find(
                        (item) => item.MA_NGUOI_THUC_HIEN === MA_NGUOI_THUC_HIEN
                    ) || null;
                if (!obj) {
                    return throwError(
                        'Could not found with id of ' + MA_NGUOI_THUC_HIEN + '!'
                    );
                }
                // Trường hợp đang trong quá trình thêm mới và chỉnh sửa thì lấy dữ liệu local, những trường hợp khác lấy từ server
                if (
                    obj.SYS_ACTION != State.create &&
                    obj.SYS_ACTION != State.edit
                ) {
                    return this.getListCongTrinhFromServer(
                        MA_NGUOI_THUC_HIEN
                    ).pipe(
                        map((objResult) => {
                            let itemIndex = objs.findIndex(
                                (item) =>
                                    item.MA_NGUOI_THUC_HIEN ===
                                    MA_NGUOI_THUC_HIEN
                            );
                            if (itemIndex >= 0) {
                                objs[itemIndex].listCongTrinh = objResult.data;
                                this._object.next(objs[itemIndex]);
                                this._objects.next(objs);

                                return objResult;
                            }
                            return objResult.data;
                        })
                    );
                }
                this._object.next(obj);
                return of(obj);
            })
        );
    }

    getListVanBangFromServer(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._serviceService
            .execServiceLogin('C1BBF556-30AE-45C4-9CC6-5696A7FC61CC', [
                { name: 'MA_NGUOI_THUC_HIEN', value: MA_NGUOI_THUC_HIEN },
            ])
            .pipe(
                tap((response: any) => {
                    return response.data;
                })
            );
    }

    getListVanBang(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            switchMap((objs: any) => {
                // Find the Obj
                const obj =
                    objs.find(
                        (item) => item.MA_NGUOI_THUC_HIEN === MA_NGUOI_THUC_HIEN
                    ) || null;
                if (!obj) {
                    return throwError(
                        'Could not found with id of ' + MA_NGUOI_THUC_HIEN + '!'
                    );
                }
                // Trường hợp đang trong quá trình thêm mới và chỉnh sửa thì lấy dữ liệu local, những trường hợp khác lấy từ server
                if (
                    obj.SYS_ACTION != State.create &&
                    obj.SYS_ACTION != State.edit
                ) {
                    return this.getListVanBangFromServer(
                        MA_NGUOI_THUC_HIEN
                    ).pipe(
                        map((objResult) => {
                            let itemIndex = objs.findIndex(
                                (item) =>
                                    item.MA_NGUOI_THUC_HIEN ===
                                    MA_NGUOI_THUC_HIEN
                            );
                            if (itemIndex >= 0) {
                                objs[itemIndex].listVanBang = objResult.data;
                                this._object.next(objs[itemIndex]);
                                this._objects.next(objs);

                                return objResult;
                            }
                            return objResult.data;
                        })
                    );
                }
                this._object.next(obj);
                return of(obj);
            })
        );
    }

    getListGiaiThuongFromServer(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._serviceService
            .execServiceLogin('CF09126C-E3E2-474D-9685-2415CDED3E33', [
                { name: 'MA_NGUOI_THUC_HIEN', value: MA_NGUOI_THUC_HIEN },
            ])
            .pipe(
                tap((response: any) => {
                    return response.data;
                })
            );
    }

    getListGiaiThuong(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            switchMap((objs: any) => {
                // Find the Obj
                const obj =
                    objs.find(
                        (item) => item.MA_NGUOI_THUC_HIEN === MA_NGUOI_THUC_HIEN
                    ) || null;
                if (!obj) {
                    return throwError(
                        'Could not found with id of ' + MA_NGUOI_THUC_HIEN + '!'
                    );
                }
                // Trường hợp đang trong quá trình thêm mới và chỉnh sửa thì lấy dữ liệu local, những trường hợp khác lấy từ server
                if (
                    obj.SYS_ACTION != State.create &&
                    obj.SYS_ACTION != State.edit
                ) {
                    return this.getListGiaiThuongFromServer(
                        MA_NGUOI_THUC_HIEN
                    ).pipe(
                        map((objResult) => {
                            let itemIndex = objs.findIndex(
                                (item) =>
                                    item.MA_NGUOI_THUC_HIEN ===
                                    MA_NGUOI_THUC_HIEN
                            );
                            if (itemIndex >= 0) {
                                objs[itemIndex].listGiaiThuong = objResult.data;
                                this._object.next(objs[itemIndex]);
                                this._objects.next(objs);

                                return objResult;
                            }
                            return objResult.data;
                        })
                    );
                }
                this._object.next(obj);
                return of(obj);
            })
        );
    }

    getListQuaTrinhCongTacFromServer(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._serviceService
            .execServiceLogin('D5F365CF-8627-4C66-806A-3477048F5089', [
                { name: 'MA_NGUOI_THUC_HIEN', value: MA_NGUOI_THUC_HIEN },
            ])
            .pipe(
                tap((response: any) => {
                    return response.data;
                })
            );
    }

    getListQuaTrinhCongTac(MA_NGUOI_THUC_HIEN: any): Observable<any> {
        return this._objects.pipe(
            take(1),
            switchMap((objs: any) => {
                // Find the Obj
                const obj =
                    objs.find(
                        (item) => item.MA_NGUOI_THUC_HIEN === MA_NGUOI_THUC_HIEN
                    ) || null;
                if (!obj) {
                    return throwError(
                        'Could not found with id of ' + MA_NGUOI_THUC_HIEN + '!'
                    );
                }
                // Trường hợp đang trong quá trình thêm mới và chỉnh sửa thì lấy dữ liệu local, những trường hợp khác lấy từ server
                if (
                    obj.SYS_ACTION != State.create &&
                    obj.SYS_ACTION != State.edit
                ) {
                    return this.getListQuaTrinhCongTacFromServer(
                        MA_NGUOI_THUC_HIEN
                    ).pipe(
                        map((objResult) => {
                            let itemIndex = objs.findIndex(
                                (item) =>
                                    item.MA_NGUOI_THUC_HIEN ===
                                    MA_NGUOI_THUC_HIEN
                            );
                            if (itemIndex >= 0) {
                                objs[itemIndex].listQuaTrinhCongTac =
                                    objResult.data;
                                this._object.next(objs[itemIndex]);
                                this._objects.next(objs);

                                return objResult;
                            }
                            return objResult.data;
                        })
                    );
                }
                this._object.next(obj);
                return of(obj);
            })
        );
    }
}
