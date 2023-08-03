
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionService } from 'app/core/function/function.service';
import { UserService } from 'app/core/user/user.service';
import { BaseComponent } from 'app/shared/commons/base.component';
import { State } from 'app/shared/commons/conmon.types';
import { MessageService } from 'app/shared/message.services';
import { takeUntil } from 'rxjs';
import ShortUniqueId from 'short-unique-id';
import { ListFunctionService } from '../listfunction.service';
import { SnotifyToast } from 'ng-alt-snotify';


@Component({
    selector: 'component-details_authority-dialog',
    templateUrl: './detailsauthority.component.html',
    styleUrls: ['./detailsauthority.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ListFunctionDetailsAuthorityDialogComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild("MatTableDetail", { static: false }) matTableDetail: MatTable<any>;
    public StateEnum = State;
    object: any;
    dialogForm: UntypedFormGroup;
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<ListFunctionDetailsAuthorityDialogComponent>,
        private _ListFunctionService: ListFunctionService,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        public _functionService: FunctionService,
        public _userService: UserService,
        public _messageService: MessageService,) {
        super(_activatedRoute, _router, _functionService, _userService, _messageService);

        if (data) {

        }

    }
    onEditObject(): void {
        throw new Error('Method not implemented.');
    }
    onSaveObject(): void {
        throw new Error('Method not implemented.');
    }
    onDeleteObject(): void {
        this.authDeleteFromServer.subscribe((auth) => {
            if (auth) {
                this._messageService.showConfirm("Thông báo", "Bạn chắc chắn muốn xóa quyền \"" + this.object.AUTHORITY_NAME + "\"", (toast: SnotifyToast) => {
                    this._messageService.notify().remove(toast.id);
                    if (this.object?.SYS_ACTION == State.create) {
                        this._ListFunctionService.deleteObjectAuthority()
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((result: any) => {
                                switch (result) {
                                    case 1:
                                        this._messageService.showSuccessMessage("Thông báo", "Xóa quyền thành công");
                                        this.dialogRef.close(true);
                                        break;
                                    case 0:
                                        this._messageService.showErrorMessage("Thông báo", "Không tìm thấy quyền cần xóa");
                                        break;
                                    case -1:
                                        this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện xóa dữ liệu");
                                        break;
                                    case -2:
                                        this._messageService.showErrorMessage("Thông báo", "Nhóm dữ liệu đã sử dụng nên ko thể xóa");
                                        break;
                                }

                            });
                    } else {
                        this._ListFunctionService.deleteObjectAuthorityToServer()
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((result: any) => {
                                switch (result) {
                                    case 1:
                                        this._ListFunctionService.deleteObjectAuthority()
                                            .pipe(takeUntil(this._unsubscribeAll))
                                            .subscribe((result: any) => {
                                                switch (result) {
                                                    case 1:
                                                        this._messageService.showSuccessMessage("Thông báo", "Xóa quyền thành công");
                                                        this.dialogRef.close(true);
                                                        break;
                                                    case -1:
                                                        this._messageService.showErrorMessage("Thông báo", "Không tìm thấy quyền cần xóa");
                                                        break;
                                                    case 0:
                                                        this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện xóa quyền");
                                                        break;
                                                }

                                            });
                                        break;
                                    case 0:
                                        this._messageService.showErrorMessage("Thông báo", "Không tìm thấy quyền cần xóa");
                                        break;
                                    case -1:
                                        this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện xóa dữ liệu");
                                        break;
                                }

                            });
                    }
                });
            } else {
                this._messageService.showErrorMessage("Thông báo", "Bạn không có quyền thực hiện");
            }
        }
        );
    }
    onCreateObject(): void {
        throw new Error('Method not implemented.');
    }
    onCancelObject(): void {
        this.dialogRef.close(true);
    }
    get actionCancel(): Boolean {
        return this.object?.SYS_ACTION == State.create || this.object?.SYS_ACTION == State.edit;
    }

    get viewMode(): Boolean {
        return this.object?.SYS_ACTION != State.create && this.object?.SYS_ACTION != State.edit;
    }
    get inputMode(): Boolean {
        return this.object?.SYS_ACTION == State.create || this.object?.SYS_ACTION == State.edit;
    }
    get actionCreate(): Boolean {
        return this.authInsert;
    }
    get actionDelete(): Boolean {
        return this.authDelete && this.object?.SYS_ACTION != State.create
    }
    get actionEdit(): Boolean {
        return this.authEdit && (!this.object?.SYS_ACTION);
    }
    get actionEditDetail(): Boolean {
        return (this.object?.SYS_ACTION == State.create || this.object?.SYS_ACTION == State.edit);
    }
    get actionDeleteDetail(): Boolean {
        return (this.object?.SYS_ACTION == State.create || this.object?.SYS_ACTION == State.edit);
    }
    get actionSave(): Boolean {

        return (this.object?.SYS_ACTION == State.create || this.object?.SYS_ACTION == State.edit)
    }
    ngOnInit(): void {
        super.ngOnInit()
        this._ListFunctionService.objectAuthority$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((objectAuthority: any) => {
                if (!objectAuthority) {
                    this.dialogRef.close(true);
                }
                this.object = objectAuthority;
                if (this.inputMode) {
                    this.dialogForm = this._formBuilder.group({
                        AUTHORITYID: [objectAuthority?.AUTHORITYID],
                        ENABLE: [objectAuthority?.ENABLE, [Validators.required]],
                        AUTHORITY_ORD: [objectAuthority?.AUTHORITY_ORD, [Validators.required]],
                        AUTHORITY_NAME: [objectAuthority?.AUTHORITY_NAME, [Validators.required, Validators.maxLength(500)]]
                    });

                    this.dialogForm.get("ENABLE").valueChanges.subscribe(value => {
                        objectAuthority.ENABLE = value;
                    })
                    this.dialogForm.get("AUTHORITY_ORD").valueChanges.subscribe(value => {
                        objectAuthority.AUTHORITY_ORD = value;
                    })
                    this.dialogForm.get("AUTHORITY_NAME").valueChanges.subscribe(value => {
                        objectAuthority.AUTHORITY_NAME = value;
                    })
                }

            });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onConfirmClick(): void {
        if (!this.dialogForm.valid) {
            this.dialogForm.markAllAsTouched();
            this._messageService.showWarningMessage("Thông báo", "Thông tin bạn nhập chưa đủ hoặc không hợp lệ");
        } else {
            if (this.object?.SYS_ACTION == State.create) {
                this.authInsertFromServer.subscribe((auth) => {
                    if (auth) {
                        this._ListFunctionService.createObjectAuthority().pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((result: any) => {
                                this.dialogRef.close({ "data": result, "action": true });
                            })
                    } else {
                        this._messageService.showErrorMessage("Thông báo", "Bạn không có quyền thực hiện");
                    }
                })

            }
            if (this.object?.SYS_ACTION == State.edit) {
                this.authEditFromServer.subscribe((auth) => {
                    if (auth) {
                        this._ListFunctionService.createEditAuthority().pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((result: any) => {
                                this.dialogRef.close({ "data": result, "action": "edit" });
                            })
                    } else {
                        this._messageService.showErrorMessage("Thông báo", "Bạn không có quyền thực hiện");
                    }
                })
            }

        }
    }
    onDeleteClick(): void {
        this.authDeleteFromServer.subscribe((auth) => {
            if (auth) {
                this._ListFunctionService.createDeleteAuthority().pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((result: any) => {
                        this.dialogRef.close({ "data": result, "action": "del" });
                    })
            } else {
                this._messageService.showErrorMessage("Thông báo", "Bạn không có quyền thực hiện");
            }
        })
    }
    onCloseClick(): void {
        this.dialogRef.close({ "data": null, "action": false });
    }

}