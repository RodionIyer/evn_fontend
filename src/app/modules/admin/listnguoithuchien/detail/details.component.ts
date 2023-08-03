import { values } from 'lodash';
import {
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionService } from 'app/core/function/function.service';
import { UserService } from 'app/core/user/user.service';
import { BaseComponent } from 'app/shared/commons/base.component';
import { BaseDetailInterface } from 'app/shared/commons/basedetail.interface';
import { State } from 'app/shared/commons/conmon.types';
import { MessageService } from 'app/shared/message.services';
import { SnotifyToast } from 'ng-alt-snotify';
import { takeUntil, filter, Observable } from 'rxjs';
import { ListNguoiThucHienService } from '../listnguoithuchien.service';
import { ListNhanSuComponent } from './listnhansu-dialog/listnhansu-dialog.component';
import { DateAdapter } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import ShortUniqueId from 'short-unique-id';

@Component({
    selector: 'api-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ListNguoiThucHienDetailsComponent
    extends BaseComponent
    implements OnInit, OnDestroy, BaseDetailInterface {
    @ViewChild('MatTableDetail', { static: false })
    matTableDetail: MatTable<any>;

    public StateEnum = State;
    labelColors: any;
    obj: any;
    listHocHam: any[];
    listHocVi: any[];
    listLvucNcuu: any[];
    listTrinhDo: any[];

    listQuaTrinhDaoTaoForInputMode: MatTableDataSource<any>;
    listQuaTrinhCongTacForInputMode: MatTableDataSource<any>;
    listCongTrinhForInputMode: MatTableDataSource<any>;
    listVanBangForInputMode: MatTableDataSource<any>;
    listCongTrinhApDungForInputMode: MatTableDataSource<any>;
    listDeTaiForInputMode: MatTableDataSource<any>;
    listGiaiThuongForInputMode: MatTableDataSource<any>;
    selection: any;
    selectedDel: any[];

    displayedColumnsInput: string[] = [
        'STT',
        'TEN_COT',
        'MO_TA',
        'MA_KIEU_DLIEU',
        'ACTION',
    ];

    quaTrinhDaoTaoColumns: string[] = [
        'HOC_VI',
        'NOI_DAO_TAO',
        'CHUYEN_MON',
        'NAM_TOT_NGHIEP',
    ];

    quaTrinhCongTacColumns: string[] = [
        'THOI_GIAN',
        'VI_TRI_CONG_TAC',
        'TO_CHUC_CONG_TAC',
        'DIA_CHI_TO_CHUC',
    ];

    congTrinhChuYeuColumns: string[] = [
        'TEN_CONG_TRINH',
        'TGIA_DTGIA',
        'NOI_CONG_BO',
        'NAM_CONG_BO',
    ];

    congTrinhApDungColumns: string[] = [
        'TEN_CONG_TRINH',
        'NOI_DUNG_AP_DUNG',
        'THOI_GIAN',
    ];

    vanBangChuYeuColumns: string[] = ['NOI_DUNG_VAN_BANG', 'NAM_CAP_VAN_BANG'];

    deTaiColumns: string[] = [
        'TEN_DE_TAI',
        'THOI_GIAN',
        'THUOC_CHUONG_TRINH',
        'TINH_TRANG_DE_TAI',
    ];

    giaiThuongColumns: string[] = ['NOI_DUNG_GIAI_THUONG', 'NAM_GIAI_THUONG'];

    dialogForm: UntypedFormGroup;
    _dialogForm: UntypedFormGroup;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    /**
     * Constructor
     */
    constructor(
        private _listUserService: ListNguoiThucHienService,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        public _functionService: FunctionService,
        public _userService: UserService,
        public _messageService: MessageService,
        private _matDialog: MatDialog,
        private dateAdapter: DateAdapter<Date>
    ) {
        super(
            _activatedRoute,
            _router,
            _functionService,
            _userService,
            _messageService
        );
        this.dateAdapter.setLocale('en-GB');
    }

    get actionCancel(): Boolean {
        return (
            this.obj?.SYS_ACTION == State.create ||
            this.obj?.SYS_ACTION == State.edit
        );
    }

    get viewMode(): Boolean {
        return (
            this.obj?.SYS_ACTION != State.create &&
            this.obj?.SYS_ACTION != State.edit
        );
    }
    get inputMode(): Boolean {
        return (
            this.obj?.SYS_ACTION == State.create ||
            this.obj?.SYS_ACTION == State.edit
        );
    }
    get actionCreate(): Boolean {
        return this.authInsert;
    }
    get actionDelete(): Boolean {
        return this.authDelete && this.obj?.SYS_ACTION != State.create;
    }
    get actionEdit(): Boolean {
        return this.authEdit && !this.obj?.SYS_ACTION;
    }
    get actionEditDetail(): Boolean {
        return (
            this.obj?.SYS_ACTION == State.create ||
            this.obj?.SYS_ACTION == State.edit
        );
    }
    get actionDeleteDetail(): Boolean {
        return (
            this.obj?.SYS_ACTION == State.create ||
            this.obj?.SYS_ACTION == State.edit
        );
    }
    get actionSave(): Boolean {
        return (
            this.obj?.SYS_ACTION == State.create ||
            this.obj?.SYS_ACTION == State.edit
        );
    }

    get actionOnlyEdit(): Boolean {
        return this.obj?.SYS_ACTION == State.edit;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        super.ngOnInit();

        this.selection = {
            forDaoTao: new SelectionModel<any>(true, []),
            forCongTac: new SelectionModel<any>(true, []),
            forCongTrinh: new SelectionModel<any>(true, []),
            forVanBang: new SelectionModel<any>(true, []),
            forCongTrinhApDung: new SelectionModel<any>(true, []),
            forDeTai: new SelectionModel<any>(true, []),
            forGiaiThuong: new SelectionModel<any>(true, []),
        }

        this.selectedDel = []

        // Chi tiet API
        this._listUserService.ObjectListHocHam$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((data: any[]) => {
            this.listHocHam = data;
        });

        this._listUserService.ObjectListHocVi$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((data: any[]) => {
            this.listHocVi = data;
        });

        this._listUserService.ObjectListLvucNCuu$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((data: any[]) => {
            this.listLvucNcuu = data;
        });

        this._listUserService.ObjectListTrinhDo$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((data: any[]) => {
            this.listTrinhDo = data;
        });

        this._listUserService.Object$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((obj: any) => {
            if (obj?.DA_XOA === true) {
                const parentUrl = this._router.url
                    .split('/')
                    .slice(0, -1)
                    .join('/');
                this._router.navigateByUrl(parentUrl);
            }
            this.obj = obj;

            this.dialogForm = this._formBuilder.group({
                TEN_NGUOI_THUC_HIEN: [obj?.TEN_NGUOI_THUC_HIEN],
                MA_HOC_HAM: [obj?.MA_HOC_HAM],
                NAM_HOC_HAM: [obj?.NAM_HOC_HAM],
                MA_HOC_VI: [obj?.MA_HOC_VI],
                NAM_HOC_VI: [obj?.NAM_HOC_VI],
                EMAL: [obj?.EMAL],
                SDT: [obj?.SDT],
                NOI_LAM_VIEC: [obj?.NOI_LAM_VIEC],
                DIA_CHI_NOI_LAM_VIEC: [obj?.DIA_CHI_NOI_LAM_VIEC],
                TRANG_THAI_XAC_MINH: [obj?.TRANG_THAI_XAC_MINH],
                NGAY_XAC_MINH: [obj?.NGAY_XAC_MINH],
                CHUYEN_GIA: [obj?.CHUYEN_GIA],
                NGOAI_EVN: [obj?.NGOAI_EVN],
                NAM_SINH: [obj?.NAM_SINH],
                GIO_TINH: [obj?.GIO_TINH],
                CCCD: [obj?.CCCD],
                IS_CHUYEN_GIA_TNUOC: [
                    {
                        value: obj?.IS_CHUYEN_GIA_TNUOC,
                        disabled: !obj?.CHUYEN_GIA,
                    },
                ],
                IS_CHUYEN_GIA_NNUOC: [
                    {
                        value: obj?.IS_CHUYEN_GIA_NNUOC,
                        disabled: !obj?.CHUYEN_GIA,
                    },
                ],
                SAP_XEP: [obj?.SAP_XEP],
                THANH_TUU: [obj?.THANH_TUU],
                TEN_HOC_VI: [obj?.TEN_HOC_VI],
                TEN_HOC_HAM: [obj?.TEN_HOC_HAM],
                MA_LVUC_NCUU: [obj?.MA_LVUC_NCUU],
                TEN_LVUC_NCUU: [obj?.TEN_LVUC_NCUU],
                LIST_QUA_TRINH_DAO_TAO: this._formBuilder.array([]),
                LIST_QUA_TRINH_CONG_TAC: this._formBuilder.array([]),
                LIST_CONG_TRINH: this._formBuilder.array([]),
                LIST_VAN_BANG: this._formBuilder.array([]),
                LIST_CONG_TRINH_AP_DUNG: this._formBuilder.array([]),
                LIST_DE_TAI: this._formBuilder.array([]),
                LIST_GIAI_THUONG: this._formBuilder.array([]),
            });
            this.dialogForm
                .get('TEN_NGUOI_THUC_HIEN')
                .valueChanges.subscribe((value) => {
                    obj.TEN_NGUOI_THUC_HIEN = value;
                });
            this.dialogForm
                .get('MA_HOC_HAM')
                .valueChanges.subscribe((value) => {
                    obj.MA_HOC_HAM = value;

                    this.listHocHam.filter((_value) => {
                        if (obj.MA_HOC_HAM == _value.MA_HOC_HAM) {
                            obj.TEN_HOC_HAM = _value.TEN_HOC_HAM;
                        }
                    });
                });
            this.dialogForm
                .get('NAM_HOC_HAM')
                .valueChanges.subscribe((value) => {
                    obj.NAM_HOC_HAM = value;
                });
            this.dialogForm.get('MA_HOC_VI').valueChanges.subscribe((value) => {
                obj.MA_HOC_VI = value;
                this.listHocVi.filter((_value) => {
                    if (obj.MA_HOC_VI == _value.MA_HOC_VI) {
                        obj.TEN_HOC_VI = _value.TEN_HOC_VI;
                    }
                });
            });
            this.dialogForm
                .get('NAM_HOC_VI')
                .valueChanges.subscribe((value) => {
                    obj.NAM_HOC_VI = value;
                });
            this.dialogForm.get('EMAL').valueChanges.subscribe((value) => {
                obj.EMAL = value;
            });
            this.dialogForm.get('SAP_XEP').valueChanges.subscribe((value) => {
                obj.SAP_XEP = value;
            });
            this.dialogForm.get('SDT').valueChanges.subscribe((value) => {
                obj.SDT = value;
            });
            this.dialogForm
                .get('NOI_LAM_VIEC')
                .valueChanges.subscribe((value) => {
                    obj.NOI_LAM_VIEC = value;
                });
            this.dialogForm
                .get('DIA_CHI_NOI_LAM_VIEC')
                .valueChanges.subscribe((value) => {
                    obj.DIA_CHI_NOI_LAM_VIEC = value;
                });
            this.dialogForm
                .get('TRANG_THAI_XAC_MINH')
                .valueChanges.subscribe((value) => {
                    obj.TRANG_THAI_XAC_MINH = value;
                });
            this.dialogForm
                .get('NGAY_XAC_MINH')
                .valueChanges.subscribe((value) => {
                    obj.NGAY_XAC_MINH = value;
                });
            this.dialogForm
                .get('CHUYEN_GIA')
                .valueChanges.subscribe((value) => {
                    obj.CHUYEN_GIA = value;
                    if (value == true) {
                        this.dialogForm.get('IS_CHUYEN_GIA_NNUOC').enable();
                        this.dialogForm.get('IS_CHUYEN_GIA_TNUOC').enable();
                    } else {
                        this.dialogForm.get('IS_CHUYEN_GIA_NNUOC').disable();
                        this.dialogForm.get('IS_CHUYEN_GIA_TNUOC').disable();
                    }
                });
            this.dialogForm.get('NGOAI_EVN').valueChanges.subscribe((value) => {
                obj.NGOAI_EVN = value;
            });
            this.dialogForm.get('NAM_SINH').valueChanges.subscribe((value) => {
                obj.NAM_SINH = value;
            });
            this.dialogForm.get('GIO_TINH').valueChanges.subscribe((value) => {
                obj.GIO_TINH = value;
            });
            this.dialogForm.get('CCCD').valueChanges.subscribe((value) => {
                obj.CCCD = value;
            });
            this.dialogForm
                .get('IS_CHUYEN_GIA_TNUOC')
                .valueChanges.subscribe((value) => {
                    obj.IS_CHUYEN_GIA_TNUOC = value;
                });
            this.dialogForm
                .get('IS_CHUYEN_GIA_NNUOC')
                .valueChanges.subscribe((value) => {
                    obj.IS_CHUYEN_GIA_NNUOC = value;
                });
            this.dialogForm.get('THANH_TUU').valueChanges.subscribe((value) => {
                obj.THANH_TUU = value;
            });

            this.dialogForm
                .get('MA_LVUC_NCUU')
                .valueChanges.subscribe((value) => {
                    obj.MA_LVUC_NCUU = value;
                    this.listLvucNcuu.filter((_value) => {
                        if (value == _value.MA_LVUC_NCUU) {
                            obj.TEN_LVUC_NCUU = _value.TEN_LVUC_NCUU;
                        }
                    });
                });

            let control = this._formBuilder.array([]);
            if (obj != null) {
                obj.listQuaTrinhDaoTao?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_DAO_TAO: [x['MA_DAO_TAO']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            MA_HOC_VI: [x['MA_HOC_VI']],
                            NOI_DAO_TAO: [x['NOI_DAO_TAO']],
                            CHUYEN_MON: [x['CHUYEN_MON']],
                            NAM_TOT_NGHIEP: [x['NAM_TOT_NGHIEP']],
                            TEN_HOC_VI: [x['TEN_HOC_VI']],
                        })
                    );
                });
                this.dialogForm.setControl('LIST_QUA_TRINH_DAO_TAO', control);

                this.dialogForm
                    .get('LIST_QUA_TRINH_DAO_TAO')
                    .valueChanges.subscribe((value) => {
                        // console.log(value);
                        for (let i = 0; i < value.length; i++) {
                            if (!value[i].isNew)
                                for (let x in value[i]) {
                                    if (value[i][x] != obj.listQuaTrinhDaoTao[i][x]) {
                                        obj.listQuaTrinhDaoTao[i] = value[i]
                                        obj.listQuaTrinhDaoTao[i].isEdit = 1;
                                    }
                                } else {
                                obj.listQuaTrinhDaoTao[i] = value[i];
                            }

                        }
                    });

                this.listQuaTrinhDaoTaoForInputMode = new MatTableDataSource(
                    (
                        this.dialogForm.get(
                            'LIST_QUA_TRINH_DAO_TAO'
                        ) as FormArray
                    ).controls
                );

                control = this._formBuilder.array([]);

                obj.listQuaTrinhCongTac?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_CONG_TAC: [x['MA_CONG_TAC']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            THOI_GIAN: [x['THOI_GIAN']],
                            VI_TRI_CONG_TAC: [x['VI_TRI_CONG_TAC']],
                            TO_CHUC_CONG_TAC: [x['TO_CHUC_CONG_TAC']],
                            DIA_CHI_TO_CHUC: [x['DIA_CHI_TO_CHUC']],
                        })
                    );
                });
                this.dialogForm.setControl('LIST_QUA_TRINH_CONG_TAC', control);

                this.dialogForm
                    .get('LIST_QUA_TRINH_CONG_TAC')
                    .valueChanges.subscribe((value) => {
                        for (let i = 0; i < value.length; i++) {
                            if (!value[i].isNew)
                                for (let x in value[i]) {
                                    if (value[i][x] != obj.listQuaTrinhCongTac[i][x]) {
                                        obj.listQuaTrinhCongTac[i] = value[i]
                                        obj.listQuaTrinhCongTac[i].isEdit = 1;
                                    }
                                }
                            else {
                                obj.listQuaTrinhCongTac[i] = value[i];
                            }
                        }
                    });

                this.listQuaTrinhCongTacForInputMode = new MatTableDataSource(
                    (
                        this.dialogForm.get(
                            'LIST_QUA_TRINH_CONG_TAC'
                        ) as FormArray
                    ).controls
                );

                control = this._formBuilder.array([]);

                obj.listCongTrinh?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_CONG_TRINH: [x['MA_CONG_TRINH']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            TEN_CONG_TRINH: [x['TEN_CONG_TRINH']],
                            TGIA_DTGIA: [x['TGIA_DTGIA']],
                            NOI_CONG_BO: [x['NOI_CONG_BO']],
                            NAM_CONG_BO: [x['NAM_CONG_BO']],
                        })
                    );
                });
                this.dialogForm.setControl('LIST_CONG_TRINH', control);

                this.dialogForm
                    .get('LIST_CONG_TRINH')
                    .valueChanges.subscribe((value) => {
                        for (let i = 0; i < value.length; i++) {
                            if (!value[i].isNew)
                                for (let x in value[i]) {
                                    if (value[i][x] != obj.listCongTrinh[i][x]) {
                                        obj.listCongTrinh[i] = value[i]
                                        obj.listCongTrinh[i].isEdit = 1;
                                    }
                                }
                            else {
                                obj.listCongTrinh[i] = value[i];
                            }
                        }
                    });

                this.listCongTrinhForInputMode = new MatTableDataSource(
                    (
                        this.dialogForm.get('LIST_CONG_TRINH') as FormArray
                    ).controls
                );

                control = this._formBuilder.array([]);

                obj.listVanBang?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_VAN_BANG: [x['MA_VAN_BANG']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            NOI_DUNG_VAN_BANG: [x['NOI_DUNG_VAN_BANG']],
                            NAM_CAP_VAN_BANG: [x['NAM_CAP_VAN_BANG']],
                        })
                    );
                });
                this.dialogForm.setControl('LIST_VAN_BANG', control);

                this.dialogForm
                    .get('LIST_VAN_BANG')
                    .valueChanges.subscribe((value) => {
                        for (let i = 0; i < value.length; i++) {
                            if (!value[i].isNew)
                                for (let x in value[i]) {
                                    if (value[i][x] != obj.listVanBang[i][x]) {
                                        obj.listVanBang[i] = value[i]
                                        obj.listVanBang[i].isEdit = 1;
                                    }
                                }
                            else {
                                obj.listVanBang[i] = value[i];
                            }
                        }
                    });

                this.listVanBangForInputMode = new MatTableDataSource(
                    (this.dialogForm.get('LIST_VAN_BANG') as FormArray).controls
                );
                control = this._formBuilder.array([]);

                obj.listCongTrinhApDung?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_CONG_TRINH_AP_DUNG: [x['MA_CONG_TRINH_AP_DUNG']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            TEN_CONG_TRINH: [x['TEN_CONG_TRINH']],
                            NOI_DUNG_AP_DUNG: [x['NOI_DUNG_AP_DUNG']],
                            THOI_GIAN_BAT_DAU: [
                                x['THOI_GIAN_BAT_DAU']
                                    ? new Date(x['THOI_GIAN_BAT_DAU'])
                                    : null,
                            ],
                            THOI_GIAN_KET_THUC: [
                                x['THOI_GIAN_KET_THUC']
                                    ? new Date(x['THOI_GIAN_KET_THUC'])
                                    : null,
                            ],
                        })
                    );
                });
                this.dialogForm.setControl('LIST_CONG_TRINH_AP_DUNG', control);

                this.dialogForm
                    .get('LIST_CONG_TRINH_AP_DUNG')
                    .valueChanges.subscribe((value) => {
                        value.forEach((v: any) => {
                            if (
                                v.THOI_GIAN_BAT_DAU instanceof Date &&
                                !isNaN(v.THOI_GIAN_BAT_DAU)
                            )
                                v.THOI_GIAN_BAT_DAU =
                                    v.THOI_GIAN_BAT_DAU.getTime();
                            if (
                                v.THOI_GIAN_KET_THUC instanceof Date &&
                                !isNaN(v.THOI_GIAN_KET_THUC)
                            )
                                v.THOI_GIAN_KET_THUC =
                                    v.THOI_GIAN_KET_THUC.getTime();
                        });
                        for (let i = 0; i < value.length; i++) {
                            if (!value[i].isNew)
                                for (let x in value[i]) {
                                    if (value[i][x] != obj.listCongTrinhApDung[i][x]) {
                                        obj.listCongTrinhApDung[i] = value[i]
                                        obj.listCongTrinhApDung[i].isEdit = 1;
                                    }
                                }
                            else {
                                obj.listCongTrinhApDung[i] = value[i];
                            }
                        }
                    });

                this.listCongTrinhApDungForInputMode = new MatTableDataSource(
                    (
                        this.dialogForm.get(
                            'LIST_CONG_TRINH_AP_DUNG'
                        ) as FormArray
                    ).controls
                );

                control = this._formBuilder.array([]);

                obj.listDeTai?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_DE_TAI: [x['MA_DE_TAI']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            TEN_DE_TAI: [x['TEN_DE_TAI']],
                            THOI_GIAN_BAT_DAU: [
                                x['THOI_GIAN_BAT_DAU']
                                    ? new Date(x['THOI_GIAN_BAT_DAU'])
                                    : null,
                            ],
                            THOI_GIAN_KET_THUC: [
                                x['THOI_GIAN_KET_THUC']
                                    ? new Date(x['THOI_GIAN_KET_THUC'])
                                    : null,
                            ],
                            THUOC_CHUONG_TRINH: [x['THUOC_CHUONG_TRINH']],
                            TINH_TRANG_DE_TAI: [x['TINH_TRANG_DE_TAI']] ? 1 : 0,
                        })
                    );
                });
                this.dialogForm.setControl('LIST_DE_TAI', control);

                this.dialogForm
                    .get('LIST_DE_TAI')
                    .valueChanges.subscribe((value) => {
                        value.forEach((v: any) => {
                            if (
                                v.THOI_GIAN_BAT_DAU instanceof Date &&
                                !isNaN(v.THOI_GIAN_BAT_DAU)
                            )
                                v.THOI_GIAN_BAT_DAU =
                                    v.THOI_GIAN_BAT_DAU.getTime();
                            if (
                                v.THOI_GIAN_KET_THUC instanceof Date &&
                                !isNaN(v.THOI_GIAN_KET_THUC)
                            )
                                v.THOI_GIAN_KET_THUC =
                                    v.THOI_GIAN_KET_THUC.getTime();
                        });
                        for (let i = 0; i < value.length; i++) {
                            if (!value[i].isNew)
                                for (let x in value[i]) {
                                    if (value[i][x] != obj.listDeTai[i][x]) {
                                        obj.listDeTai[i] = value[i]
                                        obj.listDeTai[i].isEdit = 1;
                                    }
                                }
                            else {
                                obj.listDeTai[i] = value[i];
                            }
                        }
                    });

                this.listDeTaiForInputMode = new MatTableDataSource(
                    (this.dialogForm.get('LIST_DE_TAI') as FormArray).controls
                );

                control = this._formBuilder.array([]);

                obj.listGiaiThuong?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_GIAI_THUONG: [x['MA_GIAI_THUONG']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            NOI_DUNG_GIAI_THUONG: [x['NOI_DUNG_GIAI_THUONG']],
                            NAM_GIAI_THUONG: [x['NAM_GIAI_THUONG']],
                        })
                    );
                });
                this.dialogForm.setControl('LIST_GIAI_THUONG', control);

                this.dialogForm
                    .get('LIST_GIAI_THUONG')
                    .valueChanges.subscribe((value) => {
                        for (let i = 0; i < value.length; i++) {
                            if (!value[i].isNew)
                                for (let x in value[i]) {
                                    if (value[i][x] != obj.listGiaiThuong[i][x]) {
                                        obj.listGiaiThuong[i] = value[i]
                                        obj.listGiaiThuong[i].isEdit = 1;
                                    }
                                }
                            else {
                                obj.listGiaiThuong[i] = value[i];
                            }
                        }
                    });

                this.listGiaiThuongForInputMode = new MatTableDataSource(
                    (
                        this.dialogForm.get('LIST_GIAI_THUONG') as FormArray
                    ).controls
                );
            }
        });
    }
    //TO DO
    onCreateObject(): void {
        throw new Error('Method not implemented.');
    }

    onCancelViewOrEdit() {
        const parentUrl = this._router.url.split('/').slice(0, -1).join('/');
        this._router.navigateByUrl(parentUrl);
    }
    //TO DO
    create() {
        this._listUserService
            .createObjectToServer({
                MA_NGUOI_THUC_HIEN: this.obj?.MA_NGUOI_THUC_HIEN,
                USER_MDF_ID: this.user.userId,
            })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                switch (result) {
                    case 0:
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Xảy ra lỗi khi thực hiện'
                        );
                        break;
                    case -1:
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Xảy ra lỗi khi thực hiện'
                        );
                        break;
                    case -2:
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Dữ liệu nhập không đúng'
                        );
                        break;
                    case -3:
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Tên đăng nhập đã tồn tại trong hệ thống'
                        );
                        break;
                    default:
                        if (result != null && result.length > 0) {
                            this._messageService.showSuccessMessage(
                                'Thông báo',
                                'Ghi dữ liệu thành công'
                            );
                        } else {
                            this._messageService.showErrorMessage(
                                'Thông báo',
                                'Xảy ra lỗi khi thực hiện'
                            );
                        }
                        break;
                }
            });
    }

    edit() {
        let listData: any = {};
        for (let x in this.obj) {
            if (Array.isArray(this.obj[x])) {
                listData[x] = this.obj[x];
            }
        }
        this._listUserService
            .editObjectToServer(this.obj?.MA_NGUOI_THUC_HIEN, listData, this.selectedDel)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result: any) => {
                switch (result) {
                    case 0:
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Xảy ra lỗi khi thực hiện'
                        );
                        break;
                    case 100:
                        this._messageService.showWarningMessage(
                            'Thông báo',
                            'Đã ghi dữ liệu thành công, tuy nhiên một số cột không thể xóa do đã được sử dụng'
                        );
                        break;
                    case -1:
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Không tìm thấy người dùng hoặc không được phép thực hiện'
                        );
                        break;
                    case -2:
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Dữ liệu nhập không đúng'
                        );
                        break;
                    case 1:
                        this._listUserService
                            .viewObject(this.obj?.MA_NGUOI_THUC_HIEN)
                            .subscribe(() => {
                                this._messageService.showSuccessMessage(
                                    'Thông báo',
                                    'Ghi dữ liệu thành công'
                                );
                                this._router.navigated = false;
                                this._router.navigate(
                                    [this.obj?.MA_NGUOI_THUC_HIEN],
                                    {
                                        relativeTo: this._activatedRoute.parent,
                                    }
                                );
                            });
                        break;
                    default:
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Xảy ra lỗi khi thực hiện'
                        );
                        break;
                }
            });
    }

    onSaveObject() {
        if (!this.dialogForm.valid) {
            this.dialogForm.markAllAsTouched();
            this._messageService.showWarningMessage(
                'Thông báo',
                'Thông tin bạn nhập chưa đủ hoặc không hợp lệ'
            );
        } else {
            if (this.obj?.SYS_ACTION == State.create) {
                this.authInsertFromServer.subscribe((auth) => {
                    if (auth) {
                        this.create();
                    } else {
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Bạn không có quyền thực hiện'
                        );
                    }
                });
            }
            if (this.obj?.SYS_ACTION == State.edit) {
                this.authEditFromServer.subscribe((auth) => {
                    if (auth) {
                        this.edit();
                    } else {
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Bạn không có quyền thực hiện'
                        );
                    }
                });
            }
        }
    }
    //TO DO
    onEditObject() {
        this.authEditFromServer.subscribe((auth) => {
            if (auth) {
                this._listUserService
                    .editObject({
                        MA_NGUOI_THUC_HIEN: this.obj?.MA_NGUOI_THUC_HIEN,
                        USER_MDF_ID: this.user.userId,
                    })
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((result: any) => {
                        switch (result) {
                            case 0:
                                this._messageService.showErrorMessage(
                                    'Thông báo',
                                    'Không tìm thấy người tham gia cần sửa'
                                );
                                break;
                        }
                    });
            } else {
                this._messageService.showErrorMessage(
                    'Thông báo',
                    'Bạn không có quyền thực hiện'
                );
            }
        });
    }
    onCancelObject(): void {
        this._listUserService
            .cancelObject(this.obj?.MA_NGUOI_THUC_HIEN)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result == 1) {
                    this._listUserService
                        .viewObject(this.obj?.MA_NGUOI_THUC_HIEN)
                        .subscribe(() => {
                            this._router.navigated = false;
                            this._router.navigate(
                                [this.obj?.MA_NGUOI_THUC_HIEN],
                                {
                                    relativeTo: this._activatedRoute.parent,
                                }
                            );
                        });
                }
            });
    }
    onDeleteObject() {
        this.authDeleteFromServer.subscribe((auth) => {
            if (auth) {
                this._messageService.showConfirm(
                    'Thông báo',
                    'Bạn chắc chắn muốn xóa người dùng "' +
                    this.obj.TEN_NGUOI_THUC_HIEN +
                    '"',
                    (toast: SnotifyToast) => {
                        this._messageService.notify().remove(toast.id);
                        if (this.obj?.SYS_ACTION == State.create) {
                            this._listUserService
                                .deleteObject(this.obj?.MA_NGUOI_THUC_HIEN)
                                .pipe(takeUntil(this._unsubscribeAll))
                                .subscribe((result: any) => {
                                    switch (result) {
                                        case 1:
                                            this._messageService.showSuccessMessage(
                                                'Thông báo',
                                                'Xóa thành công'
                                            );
                                            break;
                                        case 0:
                                            this._messageService.showErrorMessage(
                                                'Thông báo',
                                                'Không tìm thấy người dùng cần xóa'
                                            );
                                            break;
                                        case -1:
                                            this._messageService.showErrorMessage(
                                                'Thông báo',
                                                'Xảy ra lỗi khi thực hiện xóa người dùng'
                                            );
                                            break;
                                    }
                                });
                        } else {
                            this._listUserService
                                .deleteObjectToServer(
                                    this.obj?.MA_NGUOI_THUC_HIEN
                                )
                                .pipe(takeUntil(this._unsubscribeAll))
                                .subscribe((result: any) => {
                                    switch (result) {
                                        case 1:
                                            this._listUserService
                                                .deleteObject(
                                                    this.obj?.MA_NGUOI_THUC_HIEN
                                                )
                                                .pipe(
                                                    takeUntil(
                                                        this._unsubscribeAll
                                                    )
                                                )
                                                .subscribe((result: any) => {
                                                    switch (result) {
                                                        case 1:
                                                            this._messageService.showSuccessMessage(
                                                                'Thông báo',
                                                                'Xóa người thực hiện thành công'
                                                            );
                                                            const parentUrl =
                                                                this._router.url
                                                                    .split('/')
                                                                    .slice(
                                                                        0,
                                                                        -1
                                                                    )
                                                                    .join('/');
                                                            this._router.navigateByUrl(
                                                                parentUrl
                                                            );
                                                            break;

                                                        case 0:
                                                            this._messageService.showErrorMessage(
                                                                'Thông báo',
                                                                'Xảy ra lỗi khi thực hiện xóa người thực hiện'
                                                            );
                                                            break;
                                                        case -1:
                                                            this._messageService.showErrorMessage(
                                                                'Thông báo',
                                                                'Không tìm thấy người thực hiện hoặc người Thực hiện đã bị xóa'
                                                            );
                                                            break;
                                                    }
                                                });
                                            break;
                                        case -2:
                                            this._messageService.showErrorMessage(
                                                'Thông báo',
                                                'Người Thực hiện đã bị xóa'
                                            );
                                            break;
                                        case 0:
                                            this._messageService.showErrorMessage(
                                                'Thông báo',
                                                'Xảy ra lỗi khi thực hiện xóa người thực hiện'
                                            );
                                            break;
                                        case -1:
                                            this._messageService.showErrorMessage(
                                                'Thông báo',
                                                'Không tìm thấy người thực hiện'
                                            );
                                            break;
                                    }
                                });
                        }
                    }
                );
            } else {
                this._messageService.showErrorMessage(
                    'Thông báo',
                    'Bạn không có quyền thực hiện'
                );
            }
        });
    }

    xacMinh() {
        {
            this._listUserService
                .xacMinhNguoiThucHien(this.obj?.MA_NGUOI_THUC_HIEN)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    switch (result) {
                        case 1:
                            this._listUserService
                                .updateUserAfterXacMinh(
                                    this.obj?.MA_NGUOI_THUC_HIEN
                                )
                                .pipe(takeUntil(this._unsubscribeAll))
                                .subscribe((result: any) => {
                                    switch (result) {
                                        case 1:
                                            this._messageService.showSuccessMessage(
                                                'Thông báo',
                                                'Xác minh người thực hiện thành công'
                                            );
                                            break;

                                        case 0:
                                            this._messageService.showErrorMessage(
                                                'Thông báo',
                                                'Xảy ra lỗi khi thực hiện xác minh người thực hiện'
                                            );
                                            break;
                                        case -1:
                                            this._messageService.showErrorMessage(
                                                'Thông báo',
                                                'Không tìm thấy người thực hiện hoặc người Thực hiện đã bị xóa'
                                            );
                                            break;
                                    }
                                });
                            break;

                        case 0:
                            this._messageService.showErrorMessage(
                                'Thông báo',
                                'Xảy ra lỗi khi thực hiện xác minh người thực hiện'
                            );
                            break;
                        case -1:
                            this._messageService.showErrorMessage(
                                'Thông báo',
                                'Không tìm thấy người thực hiện hoặc người Thực hiện đã xác minh'
                            );
                            break;
                    }
                });
        }
    }

    onXacMinh() {
        this.authDeleteFromServer.subscribe((auth) => {
            if (auth) {
                this._messageService.showConfirm(
                    'Thông báo',
                    'Bạn chắc chắn muốn xác minh thông tin người dùng "' +
                    this.obj.TEN_NGUOI_THUC_HIEN +
                    '"',
                    (toast: SnotifyToast) => {
                        this._messageService.notify().remove(toast.id);
                        this.xacMinh();
                    }
                );
            } else {
                this._messageService.showErrorMessage(
                    'Thông báo',
                    'Bạn không có quyền thực hiện'
                );
            }
        });
    }

    huyXacMinh() {
        {
            this._listUserService
                .huyXacMinhNguoiThucHien(this.obj?.MA_NGUOI_THUC_HIEN)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    switch (result) {
                        case 1:
                            this._listUserService
                                .updateUserAfterHuyXacMinh(
                                    this.obj?.MA_NGUOI_THUC_HIEN
                                )
                                .pipe(takeUntil(this._unsubscribeAll))
                                .subscribe((result: any) => {
                                    switch (result) {
                                        case 1:
                                            this._messageService.showSuccessMessage(
                                                'Thông báo',
                                                'Hủy xác minh người thực hiện thành công'
                                            );
                                            break;

                                        case 0:
                                            this._messageService.showErrorMessage(
                                                'Thông báo',
                                                'Xảy ra lỗi khi thực hiện hủy xác minh người thực hiện'
                                            );
                                            break;
                                        case -1:
                                            this._messageService.showErrorMessage(
                                                'Thông báo',
                                                'Không tìm thấy người thực hiện hoặc người Thực hiện đã bị xóa'
                                            );
                                            break;
                                    }
                                });
                            break;

                        case 0:
                            this._messageService.showErrorMessage(
                                'Thông báo',
                                'Xảy ra lỗi khi thực hiện hủy xác minh người thực hiện'
                            );
                            break;
                        case -1:
                            this._messageService.showErrorMessage(
                                'Thông báo',
                                'Không tìm thấy người thực hiện hoặc người Thực hiện đã bị hủy xác minh'
                            );
                            break;
                    }
                });
        }
    }

    onHuyXacMinh() {
        this.authDeleteFromServer.subscribe((auth) => {
            if (auth) {
                this._messageService.showConfirm(
                    'Thông báo',
                    'Bạn chắc chắn muốn hủy xác minh thông tin người dùng "' +
                    this.obj.TEN_NGUOI_THUC_HIEN +
                    '"',
                    (toast: SnotifyToast) => {
                        this._messageService.notify().remove(toast.id);
                        this.huyXacMinh();
                    }
                );
            } else {
                this._messageService.showErrorMessage(
                    'Thông báo',
                    'Bạn không có quyền thực hiện'
                );
            }
        });
    }

    saveAndXacMinh() {
        this._messageService.showConfirm(
            'Thông báo',
            'Bạn chắc chắn muốn lưu và xác minh thông tin người dùng "' +
            this.obj.TEN_NGUOI_THUC_HIEN +
            '"',
            (toast: SnotifyToast) => {
                this._messageService.notify().remove(toast.id);
                this.xacMinh();
                this.edit();
            }
        );
    }

    saveAndHuyXacMinh() {
        this._messageService.showConfirm(
            'Thông báo',
            'Bạn chắc chắn muốn lưu và hủy xác minh thông tin người dùng "' +
            this.obj.TEN_NGUOI_THUC_HIEN +
            '"',
            (toast: SnotifyToast) => {
                this._messageService.notify().remove(toast.id);
                this.huyXacMinh();
                this.edit();
            }
        );
    }
    // ngAfterViewChecked(){
    //     console.log(this.obj)
    // }
    selectUser() {
        this._listUserService
            .getListNhanSu()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res: any[]) => {
                const dialogRef = this._matDialog.open(ListNhanSuComponent, {
                    width: '75%',
                    height: '100vh',
                    data: res['data'],
                });
                dialogRef.afterClosed().subscribe((result) => {
                    if (result) {
                        this.obj.NS_ID = result.Ns_id;
                        this.dialogForm
                            .get('TEN_NGUOI_THUC_HIEN')
                            .setValue(
                                (this.obj.TEN_NGUOI_THUC_HIEN =
                                    result.Tenkhaisinh)
                            );
                        this.dialogForm
                            .get('MA_HOC_HAM')
                            .setValue(
                                (this.obj.MA_HOC_HAM = result.Hocham_cnhat_id
                                    ? result.Hocham_cnhat_id
                                    : '0')
                            );
                        this.dialogForm
                            .get('NAM_HOC_HAM')
                            .setValue(
                                (this.obj.NAM_HOC_HAM = result.Nam_hocham)
                            );
                        this.dialogForm
                            .get('MA_HOC_VI')
                            .setValue(
                                (this.obj.MA_HOC_VI = result.Hocvi_cnhat_id
                                    ? result.Hocvi_cnhat_id
                                    : '11')
                            );
                        this.dialogForm
                            .get('NAM_HOC_VI')
                            .setValue((this.obj.NAM_HOC_VI = result.Nam_hocvi));
                        this.dialogForm
                            .get('SDT')
                            .setValue((this.obj.SDT = result.Dienthoai));
                        this.dialogForm
                            .get('EMAL')
                            .setValue((this.obj.EMAL = result.Email));
                        this.dialogForm
                            .get('NOI_LAM_VIEC')
                            .setValue(
                                (this.obj.NOI_LAM_VIEC =
                                    result.Departmentc1_name)
                            );
                        this.obj.NOI_LAM_VIEC = result.Departmentc1_name;
                    }
                });
            });
    }

    /**
     * Get the current folder
     */
    getCurrentFolder(): any {
        return this._activatedRoute.snapshot.paramMap.get('group');
    }

    /**
     * Move to folder
     *
     * @param folderSlug
     */

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    getTenHocVi(MA_HOC_VI): any {
        this.listHocVi?.forEach((_value) => {
            if (_value.MA_HOC_VI == MA_HOC_VI) {
                return _value.TEN_HOC_VI;
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    addRowDaoTao() {
        let control = this.dialogForm.get(
            'LIST_QUA_TRINH_DAO_TAO'
        ) as FormArray;
        const uid = new ShortUniqueId();

        control.push(
            this._formBuilder.group({
                MA_DAO_TAO: uid.stamp(10),
                MA_NGUOI_THUC_HIEN: this.obj.MA_NGUOI_THUC_HIEN,
                isNew: 1,
                MA_HOC_VI: null,
                NOI_DAO_TAO: '',
                CHUYEN_MON: '',
                NAM_TOT_NGHIEP: '',
                TEN_HOC_VI: '',
            })
        );

        this.listQuaTrinhDaoTaoForInputMode = new MatTableDataSource(
            (
                this.dialogForm.get('LIST_QUA_TRINH_DAO_TAO') as FormArray
            ).controls
        );
    }

    addRowCongTac() {
        let control = this.dialogForm.get(
            'LIST_QUA_TRINH_CONG_TAC'
        ) as FormArray;
        const uid = new ShortUniqueId();

        control.push(
            this._formBuilder.group({
                MA_CONG_TAC: uid.stamp(10),
                MA_NGUOI_THUC_HIEN: this.obj.MA_NGUOI_THUC_HIEN,
                isNew: 1,
                THOI_GIAN: '',
                VI_TRI_CONG_TAC: '',
                TO_CHUC_CONG_TAC: '',
                DIA_CHI_TO_CHUC: '',
            })
        );

        this.listQuaTrinhCongTacForInputMode = new MatTableDataSource(
            (
                this.dialogForm.get('LIST_QUA_TRINH_CONG_TAC') as FormArray
            ).controls
        );
    }

    addRowCongTrinh() {
        let control = this.dialogForm.get('LIST_CONG_TRINH') as FormArray;
        const uid = new ShortUniqueId();

        control.push(
            this._formBuilder.group({
                MA_CONG_TRINH: uid.stamp(10),
                MA_NGUOI_THUC_HIEN: this.obj.MA_NGUOI_THUC_HIEN,
                isNew: 1,
                TEN_CONG_TRINH: '',
                TGIA_DTGIA: '',
                NOI_CONG_BO: '',
                NAM_CONG_BO: '',
            })
        );

        this.listCongTrinhForInputMode = new MatTableDataSource(
            (this.dialogForm.get('LIST_CONG_TRINH') as FormArray).controls
        );
    }

    addRowVanBang() {
        let control = this.dialogForm.get('LIST_VAN_BANG') as FormArray;
        const uid = new ShortUniqueId();

        control.push(
            this._formBuilder.group({
                MA_VAN_BANG: uid.stamp(10),
                MA_NGUOI_THUC_HIEN: this.obj.MA_NGUOI_THUC_HIEN,
                isNew: 1,
                NOI_DUNG_VAN_BANG: '',
                NAM_CAP_VAN_BANG: '',
            })
        );

        this.listVanBangForInputMode = new MatTableDataSource(
            (this.dialogForm.get('LIST_VAN_BANG') as FormArray).controls
        );
    }

    addRowCongTrinhApDung() {
        let control = this.dialogForm.get(
            'LIST_CONG_TRINH_AP_DUNG'
        ) as FormArray;
        const uid = new ShortUniqueId();

        control.push(
            this._formBuilder.group({
                MA_CONG_TRINH_AP_DUNG: uid.stamp(10),
                MA_NGUOI_THUC_HIEN: this.obj.MA_NGUOI_THUC_HIEN,
                isNew: 1,
                TEN_CONG_TRINH: '',
                NOI_DUNG_AP_DUNG: '',
                THOI_GIAN_BAT_DAU: null,
                THOI_GIAN_KET_THUC: null,
            })
        );

        this.listCongTrinhApDungForInputMode = new MatTableDataSource(
            (
                this.dialogForm.get('LIST_CONG_TRINH_AP_DUNG') as FormArray
            ).controls
        );
    }

    addRowDeTai() {
        let control = this.dialogForm.get('LIST_DE_TAI') as FormArray;
        const uid = new ShortUniqueId();

        control.push(
            this._formBuilder.group({
                MA_DE_TAI: uid.stamp(10),
                MA_NGUOI_THUC_HIEN: this.obj.MA_NGUOI_THUC_HIEN,
                isNew: 1,
                TEN_DE_TAI: '',
                THOI_GIAN_BAT_DAU: null,
                THOI_GIAN_KET_THUC: null,
                THUOC_CHUONG_TRINH: '',
                TINH_TRANG_DE_TAI: null,
            })
        );

        this.listDeTaiForInputMode = new MatTableDataSource(
            (this.dialogForm.get('LIST_DE_TAI') as FormArray).controls
        );
    }

    addRowGiaiThuong() {
        let control = this.dialogForm.get('LIST_GIAI_THUONG') as FormArray;
        const uid = new ShortUniqueId();

        control.push(
            this._formBuilder.group({
                MA_GIAI_THUONG: uid.stamp(10),
                MA_NGUOI_THUC_HIEN: this.obj.MA_NGUOI_THUC_HIEN,
                isNew: 1,
                NOI_DUNG_GIAI_THUONG: '',
                NAM_GIAI_THUONG: '',
            })
        );

        this.listGiaiThuongForInputMode = new MatTableDataSource(
            (this.dialogForm.get('LIST_GIAI_THUONG') as FormArray).controls
        );
    }

    isAllSelectedforDaoTao() {
        const numSelected = this.selection.forDaoTao.selected.length;
        const numRows = this.listQuaTrinhDaoTaoForInputMode.data.length;
        return numSelected === numRows;
    }

    toggleAllRowsforDaoTao() {
        if (this.isAllSelectedforDaoTao()) {
            this.selection.forDaoTao.clear();
            return;
        }

        this.selection.forDaoTao.select(
            ...this.listQuaTrinhDaoTaoForInputMode.data
        );
    }

    checkboxLabelforDaoTao(row?: any): string {
        if (!row) {
            return `${this.isAllSelectedforDaoTao() ? 'deselect' : 'select'
                } all`;
        }
        return `${this.selection.forDaoTao.isSelected(row) ? 'deselect' : 'select'
            } row ${row.position + 1}`;
    }

    isAllSelectedforCongTac() {
        const numSelected = this.selection.forCongTac.selected.length;
        const numRows = this.listQuaTrinhCongTacForInputMode.data.length;
        return numSelected === numRows;
    }

    toggleAllRowsforCongTac() {
        if (this.isAllSelectedforCongTac()) {
            this.selection.forCongTac.clear();
            return;
        }

        this.selection.forCongTac.select(
            ...this.listQuaTrinhCongTacForInputMode.data
        );
    }

    checkboxLabelforCongTac(row?: any): string {
        if (!row) {
            return `${this.isAllSelectedforCongTac() ? 'deselect' : 'select'
                } all`;
        }
        return `${this.selection.forCongTac.isSelected(row) ? 'deselect' : 'select'
            } row ${row.position + 1}`;
    }

    isAllSelectedforCongTrinh() {
        const numSelected = this.selection.forCongTrinh.selected.length;
        const numRows = this.listCongTrinhForInputMode.data.length;
        return numSelected === numRows;
    }

    toggleAllRowsforCongTrinh() {
        if (this.isAllSelectedforCongTrinh()) {
            this.selection.forCongTrinh.clear();
            return;
        }

        this.selection.forCongTrinh.select(
            ...this.listCongTrinhForInputMode.data
        );
    }

    checkboxLabelforCongTrinh(row?: any): string {
        if (!row) {
            return `${this.isAllSelectedforCongTrinh() ? 'deselect' : 'select'
                } all`;
        }
        return `${this.selection.forCongTrinh.isSelected(row) ? 'deselect' : 'select'
            } row ${row.position + 1}`;
    }

    isAllSelectedforVanBang() {
        const numSelected = this.selection.forVanBang.selected.length;
        const numRows = this.listVanBangForInputMode.data.length;
        return numSelected === numRows;
    }

    toggleAllRowsforVanBang() {
        if (this.isAllSelectedforVanBang()) {
            this.selection.forVanBang.clear();
            return;
        }

        this.selection.forVanBang.select(...this.listVanBangForInputMode.data);
    }

    checkboxLabelforVanBang(row?: any): string {
        if (!row) {
            return `${this.isAllSelectedforVanBang() ? 'deselect' : 'select'
                } all`;
        }
        return `${this.selection.forVanBang.isSelected(row) ? 'deselect' : 'select'
            } row ${row.position + 1}`;
    }

    isAllSelectedforCongTrinhApDung() {
        const numSelected = this.selection.forCongTrinhApDung.selected.length;
        const numRows = this.listCongTrinhApDungForInputMode.data.length;
        return numSelected === numRows;
    }

    toggleAllRowsforCongTrinhApDung() {
        if (this.isAllSelectedforCongTrinhApDung()) {
            this.selection.forCongTrinhApDung.clear();
            return;
        }

        this.selection.forCongTrinhApDung.select(
            ...this.listCongTrinhApDungForInputMode.data
        );
    }

    checkboxLabelforCongTrinhApDung(row?: any): string {
        if (!row) {
            return `${this.isAllSelectedforCongTrinhApDung() ? 'deselect' : 'select'
                } all`;
        }
        return `${this.selection.forCongTrinhApDung.isSelected(row)
            ? 'deselect'
            : 'select'
            } row ${row.position + 1}`;
    }

    isAllSelectedforDeTai() {
        const numSelected = this.selection.forDeTai.selected.length;
        const numRows = this.listDeTaiForInputMode.data.length;
        return numSelected === numRows;
    }

    toggleAllRowsforDeTai() {
        if (this.isAllSelectedforDeTai()) {
            this.selection.forDeTai.clear();
            return;
        }

        this.selection.forDeTai.select(...this.listDeTaiForInputMode.data);
    }

    checkboxLabelforDeTai(row?: any): string {
        if (!row) {
            return `${this.isAllSelectedforDeTai() ? 'deselect' : 'select'
                } all`;
        }
        return `${this.selection.forDeTai.isSelected(row) ? 'deselect' : 'select'
            } row ${row.position + 1}`;
    }

    isAllSelectedforGiaiThuong() {
        const numSelected = this.selection.forGiaiThuong.selected.length;
        const numRows = this.listGiaiThuongForInputMode.data.length;
        return numSelected === numRows;
    }

    toggleAllRowsforGiaiThuong() {
        if (this.isAllSelectedforGiaiThuong()) {
            this.selection.forGiaiThuong.clear();
            return;
        }

        this.selection.forGiaiThuong.select(
            ...this.listGiaiThuongForInputMode.data
        );
    }

    checkboxLabelforGiaiThuong(row?: any): string {
        if (!row) {
            return `${this.isAllSelectedforGiaiThuong() ? 'deselect' : 'select'
                } all`;
        }
        return `${this.selection.forGiaiThuong.isSelected(row) ? 'deselect' : 'select'
            } row ${row.position + 1}`;
    }

    deleteRowDaoTao() {
        let control = this.dialogForm.get(
            'LIST_QUA_TRINH_DAO_TAO'
        ) as FormArray;

        this.selection.forDaoTao.selected.forEach((value) => {
            control.removeAt(control.controls.indexOf(value));
            this.selectedDel.push(
                {
                    MA_BANG: 1,
                    MA_DONG: value.value.MA_DAO_TAO
                }
            )
        });

        this.selection.forDaoTao.clear();

        this.listQuaTrinhDaoTaoForInputMode = new MatTableDataSource(
            (
                this.dialogForm.get('LIST_QUA_TRINH_DAO_TAO') as FormArray
            ).controls
        );
    }

    deleteRowCongTac() {
        let control = this.dialogForm.get(
            'LIST_QUA_TRINH_CONG_TAC'
        ) as FormArray;

        this.selection.forCongTac.selected.forEach((value) => {
            control.removeAt(control.controls.indexOf(value));
            this.selectedDel.push(
                {
                    MA_BANG: 2,
                    MA_DONG: value.value.MA_CONG_TAC
                }
            )
        });

        this.selection.forCongTac.clear();

        this.listQuaTrinhCongTacForInputMode = new MatTableDataSource(
            (
                this.dialogForm.get('LIST_QUA_TRINH_CONG_TAC') as FormArray
            ).controls
        );
    }

    deleteRowCongTrinh() {
        let control = this.dialogForm.get('LIST_CONG_TRINH') as FormArray;

        this.selection.forCongTrinh.selected.forEach((value) => {
            control.removeAt(control.controls.indexOf(value));
            this.selectedDel.push(
                {
                    MA_BANG: 3,
                    MA_DONG: value.value.MA_CONG_TRINH
                }
            )
        });

        this.selection.forCongTrinh.clear();

        this.listCongTrinhForInputMode = new MatTableDataSource(
            (this.dialogForm.get('LIST_CONG_TRINH') as FormArray).controls
        );
    }

    deleteRowVanBang() {
        let control = this.dialogForm.get('LIST_VAN_BANG') as FormArray;

        this.selection.forVanBang.selected.forEach((value) => {
            control.removeAt(control.controls.indexOf(value));
            this.selectedDel.push(
                {
                    MA_BANG: 4,
                    MA_DONG: value.value.MA_VAN_BANG
                }
            )
        });

        this.selection.forVanBang.clear();

        this.listVanBangForInputMode = new MatTableDataSource(
            (this.dialogForm.get('LIST_VAN_BANG') as FormArray).controls
        );
    }

    deleteRowCongTrinhApDung() {
        let control = this.dialogForm.get(
            'LIST_CONG_TRINH_AP_DUNG'
        ) as FormArray;

        this.selection.forCongTrinhApDung.selected.forEach((value) => {
            control.removeAt(control.controls.indexOf(value));
            this.selectedDel.push(
                {
                    MA_BANG: 5,
                    MA_DONG: value.value.MA_CONG_TRINH_AP_DUNG
                }
            )
        });

        this.selection.forCongTrinhApDung.clear();

        this.listCongTrinhApDungForInputMode = new MatTableDataSource(
            (
                this.dialogForm.get('LIST_CONG_TRINH_AP_DUNG') as FormArray
            ).controls
        );
    }

    deleteRowDeTai() {
        let control = this.dialogForm.get('LIST_DE_TAI') as FormArray;

        this.selection.forDeTai.selected.forEach((value) => {
            control.removeAt(control.controls.indexOf(value));
            this.selectedDel.push(
                {
                    MA_BANG: 6,
                    MA_DONG: value.value.MA_DE_TAI
                }
            )
        });

        this.selection.forDeTai.clear();

        this.listDeTaiForInputMode = new MatTableDataSource(
            (this.dialogForm.get('LIST_DE_TAI') as FormArray).controls
        );
    }

    deleteRowGiaiThuong() {
        let control = this.dialogForm.get('LIST_GIAI_THUONG') as FormArray;

        this.selection.forGiaiThuong.selected.forEach((value) => {
            control.removeAt(control.controls.indexOf(value));
            this.selectedDel.push(
                {
                    MA_BANG: 7,
                    MA_DONG: value.value.MA_GIAI_THUONG
                }
            )
        });

        this.selection.forGiaiThuong.clear();

        this.listGiaiThuongForInputMode = new MatTableDataSource(
            (this.dialogForm.get('LIST_GIAI_THUONG') as FormArray).controls
        );
    }

    testObj() {
        let listData: any = {};
        for (let x in this.obj) {
            if (Array.isArray(this.obj[x])) {
                listData[x] = this.obj[x];
            }
        }
        console.log(listData);
        console.log(this.selectedDel);
    }

    formatDate(ts): any {
        if (!ts) return '';
        let dd = new Date(ts).getDate();
        let mm = new Date(ts).getMonth();
        let yyyy = new Date(ts).getFullYear();

        return dd + '/' + (mm + 1) + '/' + yyyy;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
}
