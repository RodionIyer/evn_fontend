import { LinkYeuCauCapNhapComponent } from './linkyeucaucapnhap-dialog/linkyeucaucapnhap-dialog.component';
import { tap, values } from 'lodash';
import {
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
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
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionService } from 'app/core/function/function.service';
import { UserService } from 'app/core/user/user.service';
import { BaseComponent } from 'app/shared/commons/base.component';
import { BaseDetailInterface } from 'app/shared/commons/basedetail.interface';
import { State } from 'app/shared/commons/conmon.types';
import { MessageService } from 'app/shared/message.services';
import { SnotifyPosition, SnotifyService, SnotifyToast } from 'ng-alt-snotify';
import { takeUntil, filter, Observable, takeLast, take, map } from 'rxjs';
import { ListNguoiThucHienService } from '../listnguoithuchien.service';
import { ListNhanSuComponent } from './listnhansu-dialog/listnhansu-dialog.component';
import { DateAdapter } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import ShortUniqueId from 'short-unique-id';
import { valid } from 'chroma-js';
import { ServiceService } from 'app/shared/service/service.service';
import { ListNguoiThucHienDetailsInputComponent } from './details-input/details-input.component';
import { ListNguoiThucHienDetailsViewComponent } from './details-view/details-view.component';

@Component({
    selector: 'api-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ListNguoiThucHienDetailsComponent
    extends BaseComponent
    implements OnInit, OnDestroy, BaseDetailInterface
{
    public StateEnum = State;
    obj: any;
    listHocHam: any[];
    listHocVi: any[];
    listLvucNcuu: any[];
    listTrinhDo: any[];

    @ViewChild(ListNguoiThucHienDetailsInputComponent)
    input: ListNguoiThucHienDetailsInputComponent;
    @ViewChild(ListNguoiThucHienDetailsViewComponent)
    view: ListNguoiThucHienDetailsViewComponent;

    constructor(
        private _listUserService: ListNguoiThucHienService,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        public _functionService: FunctionService,
        public _userService: UserService,
        public _messageService: MessageService,
        private dateAdapter: DateAdapter<Date>,
        public _serviceService: ServiceService,
        private _matDialog: MatDialog
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

    get _actionCreate(): Boolean {
        return this.obj?.SYS_ACTION == State.create;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
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
            if (obj?.DA_XOA === true) {
                const parentUrl = this._router.url
                    .split('/')
                    .slice(0, -1)
                    .join('/');
                this._router.navigateByUrl(parentUrl);
            }
            this.obj = obj;
        });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    onCancelViewOrEdit() {
        const parentUrl = this._router.url.split('/').slice(0, -1).join('/');
        this._router.navigateByUrl(parentUrl);
    }
    onCreateObject() {}
    onSaveObject() {
        let value = this.input.onSaveObject();
        if (value) {
            if (this.obj?.SYS_ACTION == State.create) {
                this.authInsertFromServer.subscribe((auth) => {
                    if (auth) {
                        this._listUserService
                            .createObjectToServer({
                                MA_NGUOI_THUC_HIEN:
                                    this.obj?.MA_NGUOI_THUC_HIEN,
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
                                        if (
                                            result != null &&
                                            result.length > 0
                                        ) {
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
                        let listData: any = {};
                        for (let x in this.obj) {
                            if (Array.isArray(this.obj[x])) {
                                listData[x] = this.obj[x];
                            }
                        }
                        this._listUserService
                            .editObjectToServer(
                                this.obj?.MA_NGUOI_THUC_HIEN,
                                listData,
                                value
                            )
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
                                            .viewObject(
                                                this.obj?.MA_NGUOI_THUC_HIEN
                                            )
                                            .subscribe(() => {
                                                this._messageService.showSuccessMessage(
                                                    'Thông báo',
                                                    'Ghi dữ liệu thành công'
                                                );
                                                this._router.navigated = false;
                                                this._router.navigate(
                                                    [
                                                        this.obj
                                                            ?.MA_NGUOI_THUC_HIEN,
                                                    ],
                                                    {
                                                        relativeTo:
                                                            this._activatedRoute
                                                                .parent,
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

    makeLink() {
        this._listUserService
            .getLinkYCCapNhapHoSoFromServer(this.obj.MA_NGUOI_THUC_HIEN)
            .pipe(take(1))
            .subscribe((res) => {
                let link =
                    window.location.origin + '/capnhatnguoilamkhoahoc/' + res;
                this._matDialog.open(LinkYeuCauCapNhapComponent, {
                    data: {
                        link: link,
                        user: this.obj.TEN_NGUOI_THUC_HIEN,
                        email: this.obj.EMAL ? this.obj.EMAL : '',
                    },
                    height: '50vh',
                    autoFocus: false,
                });
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
