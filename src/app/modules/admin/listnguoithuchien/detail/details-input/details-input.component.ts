import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    AbstractControl,
    FormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {FunctionService} from 'app/core/function/function.service';
import {UserService} from 'app/core/user/user.service';
import {BaseComponent} from 'app/shared/commons/base.component';
import {State} from 'app/shared/commons/conmon.types';
import {MessageService} from 'app/shared/message.services';
import {SnotifyToast} from 'ng-alt-snotify';
import {takeUntil, take} from 'rxjs';
import {DateAdapter} from '@angular/material/core';
import {SelectionModel} from '@angular/cdk/collections';
import ShortUniqueId from 'short-unique-id';
import {ServiceService} from 'app/shared/service/service.service';
import {ListNguoiThucHienService} from '../../listnguoithuchien.service';
import {ListNhanSuComponent} from '../listnhansu-dialog/listnhansu-dialog.component';

@Component({
    selector: 'details-input',
    templateUrl: './details-input.component.html',
    styleUrls: ['./details-input.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ListNguoiThucHienDetailsInputComponent
    extends BaseComponent
    implements OnInit, OnDestroy {
    obj: any;
    listHocHam: any[];
    listHocVi: any[];
    listLvucNcuu: any[];
    listTrinhDo: any[];
    confirmToEditValue: boolean = true;

    listQuaTrinhDaoTaoForInputMode: MatTableDataSource<any>;
    listQuaTrinhCongTacForInputMode: MatTableDataSource<any>;
    listCongTrinhForInputMode: MatTableDataSource<any>;
    listVanBangForInputMode: MatTableDataSource<any>;
    listCongTrinhApDungForInputMode: MatTableDataSource<any>;
    listDeTaiForInputMode: MatTableDataSource<any>;
    listGiaiThuongForInputMode: MatTableDataSource<any>;
    selection: any;
    selectedDel: any[];

    public StateEnum = State;

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

    constructor(
        private _listUserService: ListNguoiThucHienService,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        public _functionService: FunctionService,
        public _userService: UserService,
        public _messageService: MessageService,
        private _matDialog: MatDialog,
        private dateAdapter: DateAdapter<Date>,
        public _serviceService: ServiceService
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

    ngOnInit(): void {
        super.ngOnInit();
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
            this.obj = obj;
            this.selection = {
                forDaoTao: new SelectionModel<any>(true, []),
                forCongTac: new SelectionModel<any>(true, []),
                forCongTrinh: new SelectionModel<any>(true, []),
                forVanBang: new SelectionModel<any>(true, []),
                forCongTrinhApDung: new SelectionModel<any>(true, []),
                forDeTai: new SelectionModel<any>(true, []),
                forGiaiThuong: new SelectionModel<any>(true, []),
            };

            this.selectedDel = [];

            this.dialogForm = this._formBuilder.group({
                TEN_NGUOI_THUC_HIEN: [this.obj?.TEN_NGUOI_THUC_HIEN, [Validators.required]],
                MA_HOC_HAM: [this.obj?.MA_HOC_HAM],
                NAM_HOC_HAM: [this.obj?.NAM_HOC_HAM],
                MA_HOC_VI: [this.obj?.MA_HOC_VI],
                NAM_HOC_VI: [this.obj?.NAM_HOC_VI],
                EMAL: [this.obj?.EMAL, Validators.email],
                SDT: [
                    this.obj?.SDT,
                    [
                        Validators.minLength(10),
                        this.isVietnamesePhoneNumber(),
                    ],
                ],
                NOI_LAM_VIEC: [this.obj?.NOI_LAM_VIEC, [Validators.maxLength(250)]],
                DIA_CHI_NOI_LAM_VIEC: [this.obj?.DIA_CHI_NOI_LAM_VIEC, [Validators.maxLength(250)]],
                TRANG_THAI_XAC_MINH: [this.obj?.TRANG_THAI_XAC_MINH],
                NGAY_XAC_MINH: [this.obj?.NGAY_XAC_MINH],
                CHUYEN_GIA: [this.obj?.CHUYEN_GIA],
                NGOAI_EVN: [this.obj?.NGOAI_EVN],
                NAM_SINH: [this.obj?.NAM_SINH, [this.isNam()]],
                GIO_TINH: [this.obj?.GIO_TINH],
                CCCD: [
                    this.obj?.CCCD,
                    [
                        Validators.required,
                        Validators.minLength(12),
                        Validators.maxLength(12),
                    ],
                ],
                IS_CHUYEN_GIA_TNUOC: [
                    {
                        value: this.obj?.IS_CHUYEN_GIA_TNUOC,
                        disabled: !this.obj?.CHUYEN_GIA,
                    },
                ],
                IS_CHUYEN_GIA_NNUOC: [
                    {
                        value: this.obj?.IS_CHUYEN_GIA_NNUOC,
                        disabled: !this.obj?.CHUYEN_GIA,
                    },
                ],
                SAP_XEP: [this.obj?.SAP_XEP],
                THANH_TUU: [this.obj?.THANH_TUU, [Validators.maxLength(500)]],
                TEN_HOC_VI: [this.obj?.TEN_HOC_VI],
                TEN_HOC_HAM: [this.obj?.TEN_HOC_HAM],
                MA_LVUC_NCUU: [this.obj?.LVUC_NCUU_LST],
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
                this.obj.TEN_NGUOI_THUC_HIEN = value;
            });
            this.dialogForm.get('MA_HOC_HAM').valueChanges.subscribe((value) => {
                this.obj.MA_HOC_HAM = value;

                this.listHocHam.filter((_value) => {
                    if (this.obj.MA_HOC_HAM == _value.MA_HOC_HAM) {
                        this.obj.TEN_HOC_HAM = _value.TEN_HOC_HAM;
                    }
                });
            });
            this.dialogForm.get('NAM_HOC_HAM').valueChanges.subscribe((value) => {
                this.obj.NAM_HOC_HAM = value;
            });
            this.dialogForm.get('MA_HOC_VI').valueChanges.subscribe((value) => {
                this.obj.MA_HOC_VI = value;
                this.listHocVi.filter((_value) => {
                    if (this.obj.MA_HOC_VI == _value.MA_HOC_VI) {
                        this.obj.TEN_HOC_VI = _value.TEN_HOC_VI;
                    }
                });
            });
            this.dialogForm.get('NAM_HOC_VI').valueChanges.subscribe((value) => {
                this.obj.NAM_HOC_VI = value;
            });
            this.dialogForm.get('EMAL').valueChanges.subscribe((value) => {
                this.obj.EMAL = value;
            });
            this.dialogForm.get('SAP_XEP').valueChanges.subscribe((value) => {
                this.obj.SAP_XEP = value;
            });
            this.dialogForm.get('SDT').valueChanges.subscribe((value) => {
                this.obj.SDT = value;
            });
            this.dialogForm.get('NOI_LAM_VIEC').valueChanges.subscribe((value) => {
                this.obj.NOI_LAM_VIEC = value;
            });
            this.dialogForm
                .get('DIA_CHI_NOI_LAM_VIEC')
                .valueChanges.subscribe((value) => {
                this.obj.DIA_CHI_NOI_LAM_VIEC = value;
            });
            this.dialogForm
                .get('TRANG_THAI_XAC_MINH')
                .valueChanges.subscribe((value) => {
                this.obj.TRANG_THAI_XAC_MINH = value;
            });
            this.dialogForm.get('NGAY_XAC_MINH').valueChanges.subscribe((value) => {
                this.obj.NGAY_XAC_MINH = value;
            });
            this.dialogForm.get('CHUYEN_GIA').valueChanges.subscribe((value) => {
                this.obj.CHUYEN_GIA = value;
                if (value == true) {
                    this.dialogForm.get('IS_CHUYEN_GIA_NNUOC').enable();
                    this.dialogForm.get('IS_CHUYEN_GIA_TNUOC').enable();
                } else {
                    this.dialogForm.get('IS_CHUYEN_GIA_NNUOC').disable();
                    this.dialogForm
                        .get('IS_CHUYEN_GIA_NNUOC')
                        .setValue((this.obj.IS_CHUYEN_GIA_NNUOC = false));
                    this.dialogForm.get('IS_CHUYEN_GIA_TNUOC').disable();
                    this.dialogForm
                        .get('IS_CHUYEN_GIA_TNUOC')
                        .setValue((this.obj.IS_CHUYEN_GIA_TNUOC = false));
                }
            });
            this.dialogForm.get('NGOAI_EVN').valueChanges.subscribe((value) => {
                this.obj.NGOAI_EVN = value;
            });
            this.dialogForm.get('NAM_SINH').valueChanges.subscribe((value) => {
                this.obj.NAM_SINH = value;
            });
            this.dialogForm.get('GIO_TINH').valueChanges.subscribe((value) => {
                this.obj.GIO_TINH = value;
            });
            this.dialogForm.get('CCCD').valueChanges.subscribe((value) => {
                this.obj.CCCD = value;
            });
            this.dialogForm
                .get('IS_CHUYEN_GIA_TNUOC')
                .valueChanges.subscribe((value) => {
                this.obj.IS_CHUYEN_GIA_TNUOC = value;
                if (value == true) {
                    if (!this.dialogForm.get('CHUYEN_GIA').value) {
                        this.dialogForm.get('CHUYEN_GIA').setValue(true);
                    }
                    this.dialogForm.get('IS_CHUYEN_GIA_NNUOC').setValue(false);
                }
            });
            this.dialogForm
                .get('IS_CHUYEN_GIA_NNUOC')
                .valueChanges.subscribe((value) => {
                this.obj.IS_CHUYEN_GIA_NNUOC = value;
                if (value == true) {
                    if (!this.dialogForm.get('CHUYEN_GIA').value) {
                        this.dialogForm.get('CHUYEN_GIA').setValue(true);
                    }
                    this.dialogForm.get('IS_CHUYEN_GIA_TNUOC').setValue(false);
                }
            });
            this.dialogForm.get('THANH_TUU').valueChanges.subscribe((value) => {
                this.obj.THANH_TUU = value;
            });

            this.dialogForm.get('MA_LVUC_NCUU').valueChanges.subscribe((value) => {
                this.obj.LVUC_NCUU_LST = value;
            });

            let control = this._formBuilder.array([]);
            if (this.obj != null) {
                this.obj.listQuaTrinhDaoTao?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_DAO_TAO: [x['MA_DAO_TAO']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            MA_HOC_VI: [x['MA_HOC_VI']],
                            NOI_DAO_TAO: [x['NOI_DAO_TAO'], [Validators.required, Validators.maxLength(250)]],
                            CHUYEN_MON: [x['CHUYEN_MON'], [Validators.required, Validators.maxLength(250)]],
                            NAM_TOT_NGHIEP: [x['NAM_TOT_NGHIEP'], [this.isNam()]],
                            TEN_HOC_VI: [x['TEN_HOC_VI']],
                        })
                    );
                });
                this.dialogForm.setControl('LIST_QUA_TRINH_DAO_TAO', control);

                this.dialogForm
                    .get('LIST_QUA_TRINH_DAO_TAO')
                    .valueChanges.subscribe((value) => {
                    for (let i = 0; i < value.length; i++) {
                        if (!value[i].isNew)
                            for (let x in value[i]) {
                                if (
                                    value[i][x] !=
                                    this.obj.listQuaTrinhDaoTao[i][x]
                                ) {
                                    this.obj.listQuaTrinhDaoTao[i] = value[i];
                                    this.obj.listQuaTrinhDaoTao[i].isEdit = 1;
                                }
                            }
                        else {
                            value[i].TEN_HOC_VI = this.getTenHocVi(
                                value[i].MA_HOC_VI
                            );
                            this.obj.listQuaTrinhDaoTao[i] = value[i];
                        }
                    }
                });

                this.listQuaTrinhDaoTaoForInputMode = new MatTableDataSource(
                    (
                        this.dialogForm.get('LIST_QUA_TRINH_DAO_TAO') as FormArray
                    ).controls
                );

                control = this._formBuilder.array([]);

                this.obj.listQuaTrinhCongTac?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_CONG_TAC: [x['MA_CONG_TAC']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            THOI_GIAN: [x['THOI_GIAN'], [Validators.required, Validators.maxLength(250)]],
                            VI_TRI_CONG_TAC: [x['VI_TRI_CONG_TAC'], [Validators.required, Validators.maxLength(250)]],
                            TO_CHUC_CONG_TAC: [x['TO_CHUC_CONG_TAC'], [Validators.maxLength(250)]],
                            DIA_CHI_TO_CHUC: [x['DIA_CHI_TO_CHUC'], [Validators.maxLength(250)]],
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
                                if (
                                    value[i][x] !=
                                    this.obj.listQuaTrinhCongTac[i][x]
                                ) {
                                    this.obj.listQuaTrinhCongTac[i] = value[i];
                                    this.obj.listQuaTrinhCongTac[i].isEdit = 1;
                                }
                            }
                        else {
                            this.obj.listQuaTrinhCongTac[i] = value[i];
                        }
                    }
                });

                this.listQuaTrinhCongTacForInputMode = new MatTableDataSource(
                    (
                        this.dialogForm.get('LIST_QUA_TRINH_CONG_TAC') as FormArray
                    ).controls
                );

                control = this._formBuilder.array([]);

                this.obj.listCongTrinh?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_CONG_TRINH: [x['MA_CONG_TRINH']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            TEN_CONG_TRINH: [x['TEN_CONG_TRINH'], [Validators.required, Validators.maxLength(500)]],
                            TGIA_DTGIA: [x['TGIA_DTGIA'], [Validators.maxLength(250)]],
                            NOI_CONG_BO: [x['NOI_CONG_BO'], [Validators.maxLength(250)]],
                            NAM_CONG_BO: [x['NAM_CONG_BO'], [this.isNam()]],
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
                                if (
                                    value[i][x] != this.obj.listCongTrinh[i][x]
                                ) {
                                    this.obj.listCongTrinh[i] = value[i];
                                    this.obj.listCongTrinh[i].isEdit = 1;
                                }
                            }
                        else {
                            this.obj.listCongTrinh[i] = value[i];
                        }
                    }
                });

                this.listCongTrinhForInputMode = new MatTableDataSource(
                    (this.dialogForm.get('LIST_CONG_TRINH') as FormArray).controls
                );

                control = this._formBuilder.array([]);

                this.obj.listVanBang?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_VAN_BANG: [x['MA_VAN_BANG']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            NOI_DUNG_VAN_BANG: [x['NOI_DUNG_VAN_BANG'], [Validators.required, Validators.maxLength(250)]],
                            NAM_CAP_VAN_BANG: [x['NAM_CAP_VAN_BANG'], [this.isNam()]],
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
                                if (value[i][x] != this.obj.listVanBang[i][x]) {
                                    this.obj.listVanBang[i] = value[i];
                                    this.obj.listVanBang[i].isEdit = 1;
                                }
                            }
                        else {
                            this.obj.listVanBang[i] = value[i];
                        }
                    }
                });

                this.listVanBangForInputMode = new MatTableDataSource(
                    (this.dialogForm.get('LIST_VAN_BANG') as FormArray).controls
                );
                control = this._formBuilder.array([]);

                this.obj.listCongTrinhApDung?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_CONG_TRINH_AP_DUNG: [x['MA_CONG_TRINH_AP_DUNG']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            TEN_CONG_TRINH: [x['TEN_CONG_TRINH'], [Validators.required, Validators.maxLength(500)]],
                            NOI_DUNG_AP_DUNG: [x['NOI_DUNG_AP_DUNG'], [Validators.required, Validators.maxLength(500)]],
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
                            v.THOI_GIAN_BAT_DAU = v.THOI_GIAN_BAT_DAU.getTime();
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
                                if (
                                    value[i][x] !=
                                    this.obj.listCongTrinhApDung[i][x]
                                ) {
                                    this.obj.listCongTrinhApDung[i] = value[i];
                                    this.obj.listCongTrinhApDung[i].isEdit = 1;
                                }
                            }
                        else {
                            this.obj.listCongTrinhApDung[i] = value[i];
                        }
                    }
                });

                this.listCongTrinhApDungForInputMode = new MatTableDataSource(
                    (
                        this.dialogForm.get('LIST_CONG_TRINH_AP_DUNG') as FormArray
                    ).controls
                );

                control = this._formBuilder.array([]);

                this.obj.listDeTai?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_DE_TAI: [x['MA_DE_TAI']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            TEN_DE_TAI: [x['TEN_DE_TAI'], [Validators.required, Validators.maxLength(250)]],
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
                            THUOC_CHUONG_TRINH: [x['THUOC_CHUONG_TRINH'], [Validators.maxLength(250)]],
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
                            v.THOI_GIAN_BAT_DAU = v.THOI_GIAN_BAT_DAU.getTime();
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
                                if (value[i][x] != this.obj.listDeTai[i][x]) {
                                    this.obj.listDeTai[i] = value[i];
                                    this.obj.listDeTai[i].isEdit = 1;
                                }
                            }
                        else {
                            this.obj.listDeTai[i] = value[i];
                        }
                    }
                });

                this.listDeTaiForInputMode = new MatTableDataSource(
                    (this.dialogForm.get('LIST_DE_TAI') as FormArray).controls
                );

                control = this._formBuilder.array([]);

                this.obj.listGiaiThuong?.forEach((x) => {
                    control.push(
                        this._formBuilder.group({
                            MA_GIAI_THUONG: [x['MA_GIAI_THUONG']],
                            MA_NGUOI_THUC_HIEN: [x['MA_NGUOI_THUC_HIEN']],
                            NOI_DUNG_GIAI_THUONG: [x['NOI_DUNG_GIAI_THUONG'], [Validators.required, Validators.maxLength(500)]],
                            NAM_GIAI_THUONG: [x['NAM_GIAI_THUONG'], [this.isNam()]],
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
                                if (
                                    value[i][x] != this.obj.listGiaiThuong[i][x]
                                ) {
                                    this.obj.listGiaiThuong[i] = value[i];
                                    this.obj.listGiaiThuong[i].isEdit = 1;
                                }
                            }
                        else {
                            this.obj.listGiaiThuong[i] = value[i];
                        }
                    }
                });

                this.listGiaiThuongForInputMode = new MatTableDataSource(
                    (this.dialogForm.get('LIST_GIAI_THUONG') as FormArray).controls
                );
            }
            if (this.confirmToEditValue) {
                this.dialogForm?.enable();
            } else {
                this.dialogForm?.disable();
            }
        });

    }

    public objectComparisonLVUC_NCUU = function (option, value): boolean {
        return option.MA_LVUC_NCUU === value.MA_LVUC_NCUU;
    }

    ngOnChanges() {
        if (this.confirmToEditValue) {
            this.dialogForm?.enable();
        } else {
            this.dialogForm?.disable();
        }
    }

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

    onSaveObject() {
        if (!this.dialogForm.valid) {
            this.dialogForm.markAllAsTouched();
            this._messageService.showWarningMessage(
                'Thông báo',
                'Thông tin bạn nhập chưa đủ hoặc không hợp lệ'
            );
            return false;
        } else {
            return this.selectedDel;
        }
    }

    edit() {
    }

    selectUserBindData(result: any) {
        this.dialogForm.get('NGOAI_EVN').setValue((this.obj.NGOAI_EVN = false));
        this.obj.NS_ID = result.Ns_id;
        this.dialogForm
            .get('TEN_NGUOI_THUC_HIEN')
            .setValue((this.obj.TEN_NGUOI_THUC_HIEN = result.Tenkhaisinh));
        this.dialogForm
            .get('MA_HOC_HAM')
            .setValue(
                (this.obj.MA_HOC_HAM = result.Hocham_cnhat_id
                    ? result.Hocham_cnhat_id
                    : '0')
            );
        this.dialogForm
            .get('NAM_HOC_HAM')
            .setValue((this.obj.NAM_HOC_HAM = result.Nam_hocham));
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
        this.dialogForm.get('SDT').setValue((this.obj.SDT = result.Dienthoai));
        this.dialogForm.get('EMAL').setValue((this.obj.EMAL = result.Email));
        this.dialogForm
            .get('NOI_LAM_VIEC')
            .setValue((this.obj.NOI_LAM_VIEC = result.Departmentc1_name));
        this.obj.NOI_LAM_VIEC = result.Departmentc1_name;
        this.dialogForm.get('GIO_TINH').setValue((this.obj.GIO_TINH = result.Gioitinh != null ? result.Gioitinh ? 1 : 0 : null));
        this.dialogForm.get('NAM_SINH').setValue((this.obj.NAM_SINH = result.Ngaysinh != null ? (new Date(result.Ngaysinh)).getFullYear() : null));
        this.dialogForm.get('CCCD').setValue((this.obj.CCCD = result.CCCD));
    }

    selectUser() {
        /*if (this.obj.SYS_ACTION == State.edit) {
            return;
        }*/
        const dialogRef = this._matDialog.open(ListNhanSuComponent, {
            width: '75%',
            height: '95vh',
            data: {
                orgId: this.obj.ORGID
            },
            panelClass: 'listNhanSuComponent',
            autoFocus: false,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                if (
                    result.Donvi_id ==
                    this._router.url.split('/')[
                    this._router.url.split('/').length - 2
                        ]
                ) {
                    let check = false;
                    this._listUserService.objects$
                        .pipe(take(1))
                        .subscribe((_test: any) => {
                            _test.forEach((element) => {
                                if (result.Ns_id == element.NS_ID) {
                                    check = true;
                                }
                            });
                        });
                    if (!check) {
                        this.selectUserBindData(result);
                    } else {
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Người thực hiện đã tồn tại trong danh sách'
                        );
                    }
                } else {
                    this._messageService.showConfirm(
                        'Thông báo',
                        'Người thực hiện đã tồn tại trong đơn vị khác, bạn có chắc chắn tiếp tục',
                        (toast: SnotifyToast) => {
                            this._messageService.notify().remove(toast.id);
                            this.selectUserBindData(result);
                        }
                    );
                }
            }
        });
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
                NOI_DAO_TAO: ['', [Validators.required, Validators.maxLength(250)]],
                CHUYEN_MON: ['', [Validators.required, Validators.maxLength(250)]],
                NAM_TOT_NGHIEP: ['', [this.isNam()]],
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
                THOI_GIAN: ['', [Validators.required, Validators.maxLength(250)]],
                VI_TRI_CONG_TAC: ['', [Validators.required, Validators.maxLength(250)]],
                TO_CHUC_CONG_TAC: ['', [Validators.maxLength(250)]],
                DIA_CHI_TO_CHUC: ['', [Validators.maxLength(250)]],
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
                TEN_CONG_TRINH: ['', [Validators.required, Validators.maxLength(500)]],
                TGIA_DTGIA: ['', [Validators.maxLength(250)]],
                NOI_CONG_BO: ['', [Validators.maxLength(250)]],
                NAM_CONG_BO: ['', [this.isNam()]],
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
                NOI_DUNG_VAN_BANG: ['', [Validators.required, Validators.maxLength(250)]],
                NAM_CAP_VAN_BANG: ['', [this.isNam()]],
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
                TEN_CONG_TRINH: ['', [Validators.required, Validators.maxLength(500)]],
                NOI_DUNG_AP_DUNG: ['', [Validators.required, Validators.maxLength(500)]],
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
                TEN_DE_TAI: ['', [Validators.required, Validators.maxLength(250)]],
                THOI_GIAN_BAT_DAU: null,
                THOI_GIAN_KET_THUC: null,
                THUOC_CHUONG_TRINH: ['', [Validators.maxLength(250)]],
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
                NOI_DUNG_GIAI_THUONG: ['', [Validators.required, Validators.maxLength(500)]],
                NAM_GIAI_THUONG: ['', [this.isNam()]],
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
            return `${
                this.isAllSelectedforDaoTao() ? 'deselect' : 'select'
            } all`;
        }
        return `${
            this.selection.forDaoTao.isSelected(row) ? 'deselect' : 'select'
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
            return `${
                this.isAllSelectedforCongTac() ? 'deselect' : 'select'
            } all`;
        }
        return `${
            this.selection.forCongTac.isSelected(row) ? 'deselect' : 'select'
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
            return `${
                this.isAllSelectedforCongTrinh() ? 'deselect' : 'select'
            } all`;
        }
        return `${
            this.selection.forCongTrinh.isSelected(row) ? 'deselect' : 'select'
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
            return `${
                this.isAllSelectedforVanBang() ? 'deselect' : 'select'
            } all`;
        }
        return `${
            this.selection.forVanBang.isSelected(row) ? 'deselect' : 'select'
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
            return `${
                this.isAllSelectedforCongTrinhApDung() ? 'deselect' : 'select'
            } all`;
        }
        return `${
            this.selection.forCongTrinhApDung.isSelected(row)
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
            return `${
                this.isAllSelectedforDeTai() ? 'deselect' : 'select'
            } all`;
        }
        return `${
            this.selection.forDeTai.isSelected(row) ? 'deselect' : 'select'
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
            return `${
                this.isAllSelectedforGiaiThuong() ? 'deselect' : 'select'
            } all`;
        }
        return `${
            this.selection.forGiaiThuong.isSelected(row) ? 'deselect' : 'select'
        } row ${row.position + 1}`;
    }

    deleteRowDaoTao() {
        let control = this.dialogForm.get(
            'LIST_QUA_TRINH_DAO_TAO'
        ) as FormArray;

        this.selection.forDaoTao.selected.forEach((value) => {
            control.removeAt(control.controls.indexOf(value));
            this.selectedDel.push({
                MA_BANG: 1,
                MA_DONG: value.value.MA_DAO_TAO,
            });
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
            this.selectedDel.push({
                MA_BANG: 2,
                MA_DONG: value.value.MA_CONG_TAC,
            });
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
            this.selectedDel.push({
                MA_BANG: 3,
                MA_DONG: value.value.MA_CONG_TRINH,
            });
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
            this.selectedDel.push({
                MA_BANG: 4,
                MA_DONG: value.value.MA_VAN_BANG,
            });
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
            this.selectedDel.push({
                MA_BANG: 5,
                MA_DONG: value.value.MA_CONG_TRINH_AP_DUNG,
            });
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
            this.selectedDel.push({
                MA_BANG: 6,
                MA_DONG: value.value.MA_DE_TAI,
            });
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
            this.selectedDel.push({
                MA_BANG: 7,
                MA_DONG: value.value.MA_GIAI_THUONG,
            });
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

    getTenHocVi(MA_HOC_VI): any {
        this.listHocVi?.forEach((_value) => {
            if (_value.MA_HOC_VI == MA_HOC_VI) {
                return _value.TEN_HOC_VI;
            }
        });
    }

    formatDate(ts): any {
        if (!ts) return '';
        let dd = new Date(ts).getDate();
        let mm = new Date(ts).getMonth();
        let yyyy = new Date(ts).getFullYear();

        return dd + '/' + (mm + 1) + '/' + yyyy;
    }

    isVietnamesePhoneNumber(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) {
                return null;
            }

            let res = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value);

            return !res ? {isPhoneVN: true} : null;
        };
    }

    isNam(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) {
                return null;
            }
            // let date = new Date().getFullYear()
            let res =
                Number(value) <= Number(new Date().getFullYear()) &&
                Number(value) >= 1900;

            return !res ? {isNam: true} : null;
        };
    }

    get _actionCreate(): Boolean {
        return this.obj?.SYS_ACTION == State.create;
    }

    // isNamCap(): ValidatorFn {
    //     return (control: AbstractControl): ValidationErrors | null => {
    //         const value = control.value;
    //         const namSinh = this.obj.NAM_SINH;
    //         if (!value || !namSinh) {
    //             return null;
    //         }
    //         // let date = new Date().getFullYear()
    //         let res = Number(value) >= Number(namSinh) + 16;

    //         return !res ? { isNam: true } : null;
    //     };
    // }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
