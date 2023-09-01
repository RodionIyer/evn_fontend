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
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionService } from 'app/core/function/function.service';
import { UserService } from 'app/core/user/user.service';
import { BaseComponent } from 'app/shared/commons/base.component';
import { State } from 'app/shared/commons/conmon.types';
import { MessageService } from 'app/shared/message.services';
import { SnotifyToast } from 'ng-alt-snotify';
import { takeUntil, take } from 'rxjs';
import { DateAdapter } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import ShortUniqueId from 'short-unique-id';
import { ServiceService } from 'app/shared/service/service.service';
import { QuanTriTinService } from '../../quantritin.service';

@Component({
    selector: 'details-input',
    templateUrl: './details-input.component.html',
    styleUrls: ['./details-input.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class QuanTriTinDetailsInputComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    obj: any;
    listDanhMuc: any;
    selectedImg: any;
    selectedFiles: any[] = [];
    _tmpnewselectedFiles: any[] = [];
    _tmpdeleteselectedFiles: any[] = [];

    public StateEnum = State;

    dialogForm: UntypedFormGroup;
    _dialogForm: UntypedFormGroup;

    constructor(
        private _quanTriTinService: QuanTriTinService,
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

        this._quanTriTinService.ObjectListDanhMucTinTuc$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((danhMuc: any) => {
            this.listDanhMuc = danhMuc;
        });

        this._quanTriTinService.Object$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((obj: any) => {
            this.obj = obj;

            this.selectedFiles = obj.listFile;
            this.selectedImg = this.obj.ANH_DAI_DIEN;
            this.dialogForm = this._formBuilder.group({
                TIEU_DE_BAI_VIET: [
                    this.obj?.TIEU_DE_BAI_VIET,
                    [Validators.required],
                ],
                MA_DANH_MUC_TIN_TUC: [
                    this.obj?.MA_DANH_MUC_TIN_TUC,
                    [Validators.required],
                ],
                TU_KHOA: [this.obj?.TU_KHOA, [Validators.required]],
                DA_DUYET: [this.obj?.DA_DUYET],
                TIN_NOI_BAT: [this.obj?.TIN_NOI_BAT],
                TOM_TAT: [this.obj?.TOM_TAT, [Validators.required]],
                NOI_DUNG_SOAN_THAO: [
                    this.obj?.NOI_DUNG_SOAN_THAO,
                    [Validators.required],
                ],
            });

            this.dialogForm
                .get('TIEU_DE_BAI_VIET')
                .valueChanges.subscribe((value) => {
                    this.obj.TIEU_DE_BAI_VIET = value;
                });

            this.dialogForm
                .get('MA_DANH_MUC_TIN_TUC')
                .valueChanges.subscribe((value) => {
                    this.obj.MA_DANH_MUC_TIN_TUC = value;
                    this.listDanhMuc.filter((_value) => {
                        if (
                            this.obj.MA_DANH_MUC_TIN_TUC ==
                            _value.MA_DANH_MUC_TIN_TUC
                        ) {
                            this.obj.TEN_DANH_MUC = _value.TEN_DANH_MUC;
                        }
                    });
                });
            this.dialogForm.get('TU_KHOA').valueChanges.subscribe((value) => {
                this.obj.TU_KHOA = value;
            });
            this.dialogForm.get('DA_DUYET').valueChanges.subscribe((value) => {
                this.obj.DA_DUYET = value;
            });
            this.dialogForm
                .get('TIN_NOI_BAT')
                .valueChanges.subscribe((value) => {
                    this.obj.TIN_NOI_BAT = value;
                });
            this.dialogForm.get('TOM_TAT').valueChanges.subscribe((value) => {
                this.obj.TOM_TAT = value;
            });
            this.dialogForm
                .get('NOI_DUNG_SOAN_THAO')
                .valueChanges.subscribe((value) => {
                    this.obj.NOI_DUNG_SOAN_THAO = value;
                });
        });
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        const reader: FileReader = new FileReader();

        reader.onload = (e: any) => {
            this.selectedImg = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    onFileSelected2(event: any): void {
        for (var i = 0; i < event.target.files.length; i++) {
            const reader = new FileReader();
            let itemVal = event.target.files[i];
            reader.readAsDataURL(event.target.files[i]);
            reader.onload = () => {
                if (itemVal.size <= 10485760) {
                    this.selectedFiles.push({
                        TEN_FILE: itemVal.name,
                        FILE_BASE64: reader.result,
                        KICH_THUOC: itemVal.size,
                        MA_FILE: '',
                        KIEU_FILE: null,
                        LOAI_FILE: null,
                        DUONG_DAN: null,
                    });
                    this._tmpnewselectedFiles.push({
                        TEN_FILE: itemVal.name,
                        FILE_BASE64: reader.result,
                        KICH_THUOC: itemVal.size,
                        MA_FILE: '',
                        KIEU_FILE: null,
                        LOAI_FILE: null,
                        DUONG_DAN: null,
                    });
                } else {
                    this._messageService.showErrorMessage(
                        'Thông báo',
                        `File ${itemVal.name} có kích thước lớn hơn 10MiB`
                    );
                }
            };
        }
    }

    deleteItemFile(item, index) {
        if (item.MA_FILE != '') {
            this.selectedFiles.splice(index, 1);
            this._tmpdeleteselectedFiles.push(item.MA_FILE);
        } else {
            this.selectedFiles.splice(index, 1);
            this._tmpnewselectedFiles = this._tmpnewselectedFiles.filter(
                (res) => res.TEN_FILE !== item.TEN_FILE
            );
        }
    }
    ngOnChanges() {}

    create() {}

    onSaveObject() {
        if (!this.dialogForm.valid) {
            this.dialogForm.markAllAsTouched();
            this._messageService.showWarningMessage(
                'Thông báo',
                'Thông tin bạn nhập chưa đủ hoặc không hợp lệ'
            );
            return {
                check: false,
                ANH_DAI_DIEN: '',
            };
        } else {
            return {
                check: true,
                ANH_DAI_DIEN: this.selectedImg,
                listFileNew: this._tmpnewselectedFiles,
                listFileDel: this._tmpdeleteselectedFiles,
            };
        }
    }

    edit() {}

    testObj() {
        let listData: any = {};
        for (let x in this.obj) {
            if (Array.isArray(this.obj[x])) {
                listData[x] = this.obj[x];
            }
        }
        console.log(listData);
    }

    get _actionCreate(): Boolean {
        return this.obj?.SYS_ACTION == State.create;
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
