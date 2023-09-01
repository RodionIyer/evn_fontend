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
import { DateAdapter } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import ShortUniqueId from 'short-unique-id';
import { valid } from 'chroma-js';
import { ServiceService } from 'app/shared/service/service.service';
import { DangTinDetailsViewComponent } from './details-view/details-view.component';
import { DangTinService } from '../dangtin.service';

@Component({
    selector: 'tintuc-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class DangTinDetailsComponent
    extends BaseComponent
    implements OnInit, OnDestroy, BaseDetailInterface
{
    public StateEnum = State;
    obj: any;
    listDMTinTuc: any[];

    @ViewChild(DangTinDetailsViewComponent)
    view: DangTinDetailsViewComponent;

    constructor(
        private _dangTinService: DangTinService,
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
        this._dangTinService.Object$.pipe(
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

    onDeleteObject() {}

    onEditObject() {}

    onSaveObject() {}

    onCancelObject() {
        this._dangTinService
            .cancelObject(this.obj?.MA_TIN_TUC)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result == 1) {
                    this._dangTinService
                        .viewObject(this.obj?.MA_TIN_TUC)
                        .subscribe(() => {
                            this._router.navigated = false;
                            this._router.navigate([this.obj?.MA_TIN_TUC], {
                                relativeTo: this._activatedRoute.parent,
                            });
                        });
                }
            });
    }

    onXacMinhTinTuc() {
        this.authEditFromServer.subscribe((auth) => {
            if (!auth) {
                this._messageService.showErrorMessage(
                    'Thông báo',
                    'Bạn không có quyền duyệt tin tức'
                );
            } else {
                this._dangTinService
                    .xacMinhTinTuc(this.obj.MA_TIN_TUC)
                    .subscribe((res: any) => {
                        switch (res) {
                            case -1:
                                this._messageService.showErrorMessage(
                                    'Thông báo',
                                    'Không tìm thấy tin tức!'
                                );
                                break;
                            case 0:
                                this._messageService.showErrorMessage(
                                    'Thông báo',
                                    'Lỗi khi thực hiện!'
                                );
                                break;

                            default:
                                this._dangTinService
                                    .viewObject(this.obj?.MA_TIN_TUC)
                                    .subscribe(() => {
                                        this._messageService.showSuccessMessage(
                                            'Thông báo',
                                            'Duyệt tin tức thành công'
                                        );
                                        this._router.navigated = false;
                                        this._router.navigate(
                                            [this.obj?.MA_TIN_TUC],
                                            {
                                                relativeTo:
                                                    this._activatedRoute.parent,
                                            }
                                        );
                                    });
                        }
                    });
            }
        });
    }

    ngOnDestroy() {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
