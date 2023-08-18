import {Injectable} from '@angular/core';
import {BaseDetailInterface} from 'app/shared/commons/basedetail.interface';
import {BaseService} from 'app/shared/commons/base.service';
import {ServiceService} from 'app/shared/service/service.service';
import {
    BehaviorSubject,
    Observable,
    forkJoin,
    map,
    switchMap,
    tap,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CapnhatnguoilamkhoahocService
    extends BaseService
    implements BaseDetailInterface {
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
    id: BehaviorSubject<any> = new BehaviorSubject(null);

    getObjfromServer(token_link: any): Observable<any> {
        return this._serviceService.execServiceNoLogin(
            'D336E9CB-94E7-4490-8B46-75DEC1A587CF',
            [
                {
                    name: 'TOKEN_LINK',
                    value: token_link,
                },
            ]
        );
    }

    editObjectToServer(
        obj: any,
        listData: any,
        selectedDel: any
    ): Observable<any> {
        let _listData = listData;
        let data = obj;
        let LVUC_NCUU_LST: any = "";
        if (data.LVUC_NCUU_LST && data.LVUC_NCUU_LST.length > 0) {
            data.LVUC_NCUU_LST.forEach((obj) => {
                LVUC_NCUU_LST = LVUC_NCUU_LST + obj.MA_LVUC_NCUU + ",";
            })
            LVUC_NCUU_LST = LVUC_NCUU_LST.substring(0, LVUC_NCUU_LST.length - 1);
        }
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
                    {name: 'EMAIL', value: data.EMAL},
                    {name: 'SDT', value: data.SDT},
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
                    {name: 'NAM_SINH', value: data.NAM_SINH},
                    {name: 'GIO_TINH', value: data.GIO_TINH},
                    {name: 'CCCD', value: data.CCCD},
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
                    {
                        name: 'MA_LVUC_NCUU',
                        value: LVUC_NCUU_LST,
                    }
                ]
            )
        );


        listApi.push(
            this._serviceService.execServiceLogin(
                'D6C88019-626C-48E1-A0E6-3CA9B4037088',
                [
                    {
                        name: 'MA_NGUOI_THUC_HIEN',
                        value: data.MA_NGUOI_THUC_HIEN,
                    },
                    {
                        name: 'MA_LVUC_NCUU',
                        value: data.MA_LVUC_NCUU,
                    },
                ]
            )
        );

        const updateListAPI = {
            listDeTai: 'F8003413-E1D9-491F-84E7-58C34096CD1F',
            listGiaiThuong: 'B22C6D69-F206-430A-95F8-30F95A7276D3',
            listCongTrinh: '0BD5B9EA-67C4-4070-99C8-B0206B02877F',
            listVanBang: '035E4EE5-B54A-429E-8A27-80BAD125467E',
            listQuaTrinhDaoTao: 'EDB1FFFF-9F5D-46CF-BD57-5CBCC441B001',
            listCongTrinhApDung: 'D7A6E386-4F5B-4EF1-A284-F7FEAC69AE8A',
            listQuaTrinhCongTac: 'B48A830A-E795-4CCF-B899-2BAF76077727',
        };

        const insertListAPI = {
            listDeTai: 'FA49EF6E-0D66-41C1-B76F-A3ED906D01E7',
            listGiaiThuong: '5C04E97C-7458-4B7E-99F9-D2BBF591D9F3',
            listCongTrinh: 'DB5876D1-64D3-40D9-86D3-2E6209EAD8CD',
            listVanBang: '534290B3-38FB-4AF9-91D9-BC4534702C96',
            listQuaTrinhDaoTao: '137FA75E-352B-42F9-9629-30D5FDA6D31E',
            listCongTrinhApDung: 'CB5680CA-8503-4966-A2E6-FCFC28AB5150',
            listQuaTrinhCongTac: '233BD939-8A0A-4791-AF86-5F80F09D2AF7',
        };

        for (let type in _listData) {
            if (updateListAPI[type]) {
                for (let _x in _listData[type]) {
                    let parameters = [];
                    for (let __x in _listData[type][_x]) {
                        if (_listData[type][_x][__x] !== null) {
                            let res = {
                                name: __x,
                                value: _listData[type][_x][__x],
                            };
                            parameters.push(res);
                        }
                    }
                    if (_listData[type][_x].isEdit)
                        listApi.push(
                            this._serviceService.execServiceLogin(
                                updateListAPI[type],
                                parameters
                            )
                        );

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
            listApi.push(
                this._serviceService.execServiceLogin(
                    'D986A3B3-020C-4A25-9CC0-A998AC2C526E',
                    [
                        {
                            name: 'MA_DONG',
                            value: value.MA_DONG,
                        },
                        {
                            name: 'MA_BANG',
                            value: value.MA_BANG,
                        },
                    ]
                )
            );
        });

        return forkJoin(listApi).pipe(
            map((response: any) => {
                if (response[0].status == 1) return response[0].data;
            })
        );
    }
}
