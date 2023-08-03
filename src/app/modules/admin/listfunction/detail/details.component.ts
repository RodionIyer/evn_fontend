import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'app/shared/message.services';
import { SnotifyToast } from 'ng-alt-snotify';
import { State } from 'app/shared/commons/conmon.types';
import { BaseDetailInterface } from 'app/shared/commons/basedetail.interface';
import { UserService } from 'app/core/user/user.service';
import { BaseComponent } from 'app/shared/commons/base.component';
import { FunctionService } from 'app/core/function/function.service';
import { ListFunctionService } from '../listfunction.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

interface ObjectNode {
    object: any;
    children?: ObjectNode[];
}
interface ObjectFlatNode {
    expandable: boolean;
    object: string;
    level: number;
}

@Component({
    selector: 'component-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class ListFunctionDetailsComponent extends BaseComponent implements OnInit, OnDestroy, BaseDetailInterface {
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild("MatTableDetail", { static: false }) matTableDetail: MatTable<any>;
    @ViewChild('trigger') trigger: MatAutocompleteTrigger;
    public StateEnum = State;
    object: any;
    dialogForm: UntypedFormGroup;
    lstListFunction: any[];
    lstListService: any[];
    lstServiceFilter: any[];
    public filteredlstService: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    lstTreeListFunctionControl = new FlatTreeControl<ObjectFlatNode>(
        node => node.level,
        node => node.expandable,
    );
    ;
    private _transformer = (node: ObjectNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            object: node.object,
            level: level,
        };
    };
    lstTreeListFunctionFlattener = new MatTreeFlattener(
        this._transformer,
        node => node.level,
        node => node.expandable,
        node => node.children,
    );
    lstTreeListFunction = new MatTreeFlatDataSource(this.lstTreeListFunctionControl, this.lstTreeListFunctionFlattener);

    lstTreeListFunctionHasChild = (_: number, node: ObjectFlatNode) => node.expandable;

    displayedColumns(lstAuthority: any[]): String[] {
        let arrayString: String[] = ['API_SERVICEID', 'API_SERVICE_DESC'];
        if (lstAuthority && lstAuthority.length > 0) {
            lstAuthority.forEach((obj) => {
                arrayString.push(obj.AUTHORITYID);
            })
        }
        return arrayString;
    };
    displayedColumnsInput(lstAuthority: any[]): String[] {
        let arrayString: String[] = ['API_SERVICEID', 'API_SERVICE_DESC'];
        if (lstAuthority && lstAuthority.length > 0) {
            lstAuthority.forEach((obj) => {
                arrayString.push(obj.AUTHORITYID);
            })
        }
        arrayString.push('ACTION');
        return arrayString;
    };

    /**
     * Constructor
     */
    constructor(
        private _ListFunctionService: ListFunctionService,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        public _functionService: FunctionService,
        public _userService: UserService,
        public _messageService: MessageService
    ) {
        super(_activatedRoute, _router, _functionService, _userService, _messageService);
    }
    onOpenFunctionParentSelect() {
        setTimeout(_ => this.trigger.openPanel());
    }
    onTreeNodeFunctionParent(node: any): void {
        // alert('node selected');
        if (node.object.FUNCTION_TYPE == 'group'
            && (!node.object.SYS_ACTION || node.object.SYS_ACTION != State.create)
            && this.checkChangeParent(this.dialogForm.controls['FUNCTIONID'].value, node.object.FUNCTIONID)) {
            this.dialogForm.controls['FUNCTION_PARENT_ID'].setValue(node.object.FUNCTIONID);
        } else {
            this._messageService.showWarningMessage("Thông báo", "Không thể chuyển vào vị trí này");
        }
    }
    searchNodeObject(id, tree: ObjectNode[]): ObjectNode {
        let objResult: ObjectNode = null;
        if (tree) {
            for (let obj of tree) {
                if (obj.object.FUNCTIONID == id) {
                    objResult = obj;
                    break;
                } else {
                    objResult = this.searchNodeObject(id, obj.children);
                    if (objResult) {
                        break;
                    }
                }
            }
            return objResult;
        } else {
            return null;
        }
    }
    checkChangeParent(parentId, parentIdChange): boolean {
        if (parentId == parentIdChange) {
            return false;
        }
        let node = this.searchNodeObject(parentId, this.lstTreeListFunction.data);
        if (node) {
            if (!node.children) {
                return true;
            } else {
                if (this.searchNodeObject(parentIdChange, node.children)) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return false;
        }
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
    get actionCheckConnect(): Boolean {
        return this.object;
    }
    get actionEdit(): Boolean {
        return this.authEdit && (!this.object?.SYS_ACTION);
    }
    get actionSave(): Boolean {

        return (this.object?.SYS_ACTION == State.create || this.object?.SYS_ACTION == State.edit)
    }
    get actionEditDetail(): Boolean {
        return (this.object?.SYS_ACTION == State.create || this.object?.SYS_ACTION == State.edit) && this.object?.FUNCTION_TYPE == 'basic';
    }
    get actionDeleteDetail(): Boolean {
        return (this.object?.SYS_ACTION == State.create || this.object?.SYS_ACTION == State.edit);
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {
        super.ngOnInit()
        this._ListFunctionService.lstListFunction$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((lstListFunction: any[]) => {
                let lstTreeDataListFunction: ObjectNode[] = []
                if (lstListFunction && lstListFunction.length > 0) {

                    lstListFunction.forEach((obj) => {
                        if (obj?.FUNCTION_PARENT_ID == null && obj?.FUNCTION_TYPE == 'group' && obj?.SYS_ACTION != State.create) {
                            lstTreeDataListFunction.push({ object: obj, children: this.getChildObjectByParent(obj.FUNCTIONID_KEY, lstListFunction) })
                        }
                    })
                    this.lstTreeListFunction.data = lstTreeDataListFunction;
                    //this.lstTreeListFunctionControl.dataNodes = lstTreeDataListFunction;
                    this.lstTreeListFunctionControl.expandAll()
                } else {
                    this.lstTreeListFunction.data = lstTreeDataListFunction;
                    //this.lstTreeListFunctionControl.dataNodes = lstTreeDataListFunction;
                }
            });

        this._ListFunctionService.lstListFunction$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((lstListFunction: any[]) => {
                this.lstListFunction = lstListFunction;
            });

        this._ListFunctionService.LstService$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((lstService: any[]) => {
                this.lstListService = lstService;
                this.filteredlstService.next(this.lstListService.slice());
            });
        // Chi tiet
        this._ListFunctionService.Object$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((object: any) => {
                this.object = object;
                if (this.inputMode) {
                    this.dialogForm = this._formBuilder.group({
                        FUNCTION_PARENT_ID: [{ value: object?.FUNCTION_PARENT_ID, disabled: true }],
                        FUNCTIONID: [{ value: object?.FUNCTIONID, disabled: object?.SYS_ACTION == State.edit ? true : false }, [Validators.required, Validators.maxLength(50), Validators.pattern("[a-zA-Z0-9.]*")]],
                        FUNCTIONNAME: [{ value: object?.FUNCTIONNAME, disabled: true }, [Validators.required, Validators.maxLength(100)]],
                        FUNCTIONNAME_SUB: [{ value: object?.FUNCTIONNAME_SUB, disabled: true }, [Validators.required, Validators.maxLength(250)]],
                        FUNCTION_TYPE: [{ value: object?.FUNCTION_TYPE, disabled: true }, [Validators.required]],
                        LINK: [{ value: object?.FUNCTION_TYPE == 'group' ? '' : object?.LINK, disabled: true }, [Validators.required, Validators.maxLength(255)]],
                        ICON: [{ value: object?.ICON, disabled: true }, [Validators.required, Validators.maxLength(50)]],
                        FUNCTION_EXTERNAL: [{ value: object?.FUNCTION_EXTERNAL, disabled: true }],
                        FUNCTION_EXTERNAL_TARGET: [{
                            value: object?.FUNCTION_TYPE == 'group'
                                || !object?.FUNCTION_EXTERNAL ? '' : object?.FUNCTION_EXTERNAL_TARGET, disabled: true
                        },
                        [Validators.required, Validators.maxLength(250)]],
                        ENABLE: [{ value: object?.ENABLE, disabled: true }],
                        ISPUPLIC: [{ value: object?.ISPUPLIC, disabled: true }],
                        FUNCTIONORD: [{ value: object?.FUNCTIONORD, disabled: true }, [Validators.required]],
                        AUTH_LOCAL: [{ value: object?.AUTH_LOCAL, disabled: true }],
                        AUTH_INTERNET: [{ value: object?.AUTH_INTERNET, disabled: true }],
                        APPID: [{ value: object?.APPID, disabled: true }, [Validators.required, Validators.maxLength(50)]],
                        LST_SERVICE: this._formBuilder.array([]),
                        LST_SERVICE_TEMP: [{ value: [], disabled: object?.FUNCTION_TYPE == 'group' ? true : false }],
                        LST_SERVICE_TEMPFilter: [],
                    });
                    this.setLstServiceForm(object?.LST_SERVICE, object?.LST_AUTHORITY);
                    this.dialogForm.get("FUNCTION_PARENT_ID").valueChanges.subscribe(value => {
                        if (value == '') {
                            value = null;
                        }
                        object.FUNCTION_PARENT_ID = value;
                        this._ListFunctionService.updateObjectById(this.object?.FUNCTIONID_KEY, this.object).subscribe();
                    })
                    this.dialogForm.get("FUNCTIONID").valueChanges.subscribe(value => {
                        object.FUNCTIONID = value;
                    })
                    this.dialogForm.get("FUNCTIONNAME").valueChanges.subscribe(value => {
                        object.FUNCTIONNAME = value;
                    })
                    this.dialogForm.get("FUNCTIONNAME_SUB").valueChanges.subscribe(value => {
                        object.FUNCTIONNAME_SUB = value;
                    })
                    this.dialogForm.get("FUNCTION_TYPE").valueChanges.subscribe(value => {
                        if (value == 'basic') {
                            if (this.getChildFunctionBasicObjectByParent(this.dialogForm.get("FUNCTIONID").value, this.lstListFunction).length > 0) {
                                this._messageService.showWarningMessage("Thông báo", "Bạn không thể chuyển phân loại do có chức năng con");
                                this.dialogForm.get("FUNCTION_TYPE").setValue('group');
                                return;
                            }
                        }
                        object.FUNCTION_TYPE = value;
                        if (value == 'group') {
                            this.dialogForm.controls['LINK']['disable']();
                            this.dialogForm.controls['LINK'].setValue('');
                            this.dialogForm.controls['FUNCTION_EXTERNAL']['disable']();
                            this.dialogForm.controls['FUNCTION_EXTERNAL'].setValue(false);
                            this.dialogForm.controls['FUNCTION_EXTERNAL_TARGET']['disable']();
                            this.dialogForm.controls['FUNCTION_EXTERNAL_TARGET'].setValue('');
                            this.dialogForm.controls['LST_SERVICE_TEMP'].setValue(null);
                            this.dialogForm.controls['LST_SERVICE_TEMP']['disable']();
                            this.onDeleteAllDetail();
                        } else {
                            this.dialogForm.controls['LINK']['enable']();
                            this.dialogForm.controls['FUNCTION_EXTERNAL']['enable']();
                            if (this.dialogForm.controls['FUNCTION_EXTERNAL'].value) {
                                this.dialogForm.controls['FUNCTION_EXTERNAL_TARGET']['enable']();
                            } else {
                                this.dialogForm.controls['FUNCTION_EXTERNAL_TARGET']['disable']();
                            }
                            this.dialogForm.controls['LST_SERVICE_TEMP']['enable']();
                        }
                    })
                    this.dialogForm.get("LINK").valueChanges.subscribe(value => {
                        object.LINK = value;
                    })
                    this.dialogForm.get("ICON").valueChanges.subscribe(value => {
                        object.ICON = value;
                    })
                    this.dialogForm.get("FUNCTION_EXTERNAL").valueChanges.subscribe(value => {
                        object.FUNCTION_EXTERNAL = value;
                        if (value) {
                            this.dialogForm.controls['FUNCTION_EXTERNAL_TARGET']['enable']();
                            this.dialogForm.controls['LINK']['disable']();
                            this.dialogForm.controls['LINK'].setValue('');
                        } else {
                            this.dialogForm.controls['FUNCTION_EXTERNAL_TARGET']['disable']();
                            this.dialogForm.controls['FUNCTION_EXTERNAL_TARGET'].setValue('');
                            if (this.dialogForm.controls['FUNCTION_TYPE'].value == 'basic') {
                                this.dialogForm.controls['LINK']['enable']();
                            }
                        }
                    })
                    this.dialogForm.get("FUNCTION_EXTERNAL_TARGET").valueChanges.subscribe(value => {
                        object.FUNCTION_EXTERNAL_TARGET = value;
                    })
                    this.dialogForm.get("ENABLE").valueChanges.subscribe(value => {
                        object.ENABLE = value;
                    })
                    this.dialogForm.get("ISPUPLIC").valueChanges.subscribe(value => {
                        object.ISPUPLIC = value;
                    })
                    this.dialogForm.get("FUNCTIONORD").valueChanges.subscribe(value => {
                        object.FUNCTIONORD = value;
                    })
                    this.dialogForm.get("AUTH_LOCAL").valueChanges.subscribe(value => {
                        object.AUTH_LOCAL = value;
                    })
                    this.dialogForm.get("AUTH_INTERNET").valueChanges.subscribe(value => {
                        object.AUTH_INTERNET = value;
                    })
                    this.dialogForm.get("APPID").valueChanges.subscribe(value => {
                        object.APPID = value;
                    })
                    this.dialogForm.get("LST_SERVICE").valueChanges.subscribe(value => {
                        object.LST_SERVICE = value;
                    })
                    this.dialogForm.get("LST_SERVICE_TEMP").valueChanges.subscribe(value => {
                        object.LST_SERVICE_TEMP = value;
                    })
                    this.dialogForm.controls.LST_SERVICE_TEMPFilter.valueChanges
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(() => {
                            this.filterServices();
                        });
                }
            });

    }
    getChildObjectByParent(parentId, lstItem): ObjectNode[] {
        let items: ObjectNode[] = [];
        let item: ObjectNode;
        lstItem.forEach((obj) => {
            if (obj.FUNCTION_PARENT_ID != null && obj.FUNCTION_PARENT_ID == parentId
                && obj?.FUNCTION_TYPE == 'group' && obj?.SYS_ACTION != State.create) {
                items.push({
                    object: obj,
                    children: this.getChildObjectByParent(obj.FUNCTIONID_KEY, lstItem)
                })
            }
        });
        return items;
    }
    protected filterServices() {
        if (!this.lstListService) {
            return;
        }
        // get the search keyword
        let search = this.dialogForm.controls.LST_SERVICE_TEMPFilter.value;
        if (!search) {
            this.filteredlstService.next(this.lstListService.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredlstService.next(
            this.lstListService.filter(obj => {
                return (obj.API_SERVICE_DESC.toLowerCase().indexOf(search) > -1 || obj.API_SERVICEID.toLowerCase().indexOf(search) > -1)
            })
        );
    }
    private setLstServiceForm(lstService: any[], lstAuthority: any[]) {
        const lstServiceCtrl = this.dialogForm.get('LST_SERVICE') as FormArray;
        lstServiceCtrl.clear();
        lstService.forEach((obj) => {
            lstServiceCtrl.push(this.setlstServiceFormArray(obj, lstAuthority))
        })
    };
    private setlstServiceFormArray(obj, lstAuthority: any[]) {
        let objResult: any = {
            API_SERVICEID: [obj?.API_SERVICEID],
            API_SERVICE_DESC: [obj?.API_SERVICE_DESC],
            USER_CR_ID: [obj?.USER_CR_ID],
            SYS_ACTION: [obj.SYS_ACTION ? obj.SYS_ACTION : State.edit]
        };
        if (lstAuthority && lstAuthority.length > 0) {
            lstAuthority.forEach((objAuth) => {
                objResult[objAuth.AUTHORITYID] = [obj[objAuth.AUTHORITYID], [Validators.required]];
            })
        }
        return this._formBuilder.group(objResult);
    }
    get lstSerivce(): FormArray {
        return this.dialogForm.get('LST_SERVICE') as FormArray;
    }
    onDeleteObjectDetail(index) {
        this.lstSerivce.removeAt(index);
        this.matTableDetail.renderRows();
    }
    onDeleteAllDetail() {
        this.lstSerivce.clear();
        this.matTableDetail.renderRows();
    }
    onAddObjectDetail() {
        let lstServiceAdd: any[] = this.dialogForm.get('LST_SERVICE_TEMP').value;
        let lstServiceAddExists: any[] = this.dialogForm.get('LST_SERVICE').value;
        if (lstServiceAdd && lstServiceAdd.length > 0) {
            let bCheckExists = false;

            lstServiceAdd.forEach((obj) => {
                bCheckExists = true
                if (lstServiceAddExists && lstServiceAddExists.length > 0) {
                    lstServiceAddExists.forEach((objExits) => {
                        if (objExits.API_SERVICEID == obj.API_SERVICEID) {
                            bCheckExists = false;
                            return;
                        }
                    })
                } else {
                    bCheckExists = true;
                }
                if (bCheckExists) {
                    this.lstSerivce.push(this.initObjectDetail(obj));
                }
            })
            this.dialogForm.get('LST_SERVICE_TEMP').setValue(null);
            this.matTableDetail.renderRows();
        } else {
            this._messageService.showWarningMessage("Thông báo", "Bạn chưa chọn dịch vụ")
        }

    }
    initObjectDetail(service: any) {
        return this._formBuilder.group({
            API_SERVICEID: [service.API_SERVICEID],
            API_SERVICE_DESC: [service.API_SERVICE_DESC],
            R_INSERT: [false, [Validators.required]],
            R_EDIT: [false, [Validators.required]],
            R_DELETE: [false, [Validators.required]],
            USER_CR_ID: [this.user.userId],
            SYS_ACTION: [State.create]
        });
    }
    lstColumns(lst): any {
        let columns = new MatTableDataSource<any>();
        columns = lst;
        columns.sort = this.sort;
        return columns;
    };
    getChildFunctionBasicObjectByParent(parentId, lstItem): any[] {
        let items: any[] = [];
        let item: any;
        lstItem.forEach((obj) => {
            if (obj.FUNCTION_PARENT_ID != null && obj.FUNCTION_PARENT_ID == parentId
                && obj.FUNCTION_TYPE == 'basic') {
                items.push({
                    object: obj,
                })
            }
        });
        return items;
    }
    onCreateObject(): void {
        throw new Error('Method not implemented.');
    }
    onSaveObject() {

        if (!this.dialogForm.valid) {
            this.dialogForm.markAllAsTouched();
            this._messageService.showWarningMessage("Thông báo", "Thông tin bạn nhập chưa đủ hoặc không hợp lệ");
        } else {
            if (this.object?.SYS_ACTION == State.create) {
                this.authInsertFromServer.subscribe((auth) => {
                    if (auth) {
                        this._ListFunctionService.createObjectToServer(this.object?.FUNCTIONID_KEY).pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((result: any) => {
                                switch (result) {
                                    case 0:
                                        this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện");
                                        break;
                                    case -1:
                                        this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện");
                                        break;
                                    case -2:
                                        this._messageService.showErrorMessage("Thông báo", "Dữ liệu nhập không đúng");
                                        break;
                                    case -3:
                                        this._messageService.showErrorMessage("Thông báo", "Chức năng cha chưa ghi dữ liệu hoặc không tồn tại");
                                        break;
                                    case -4:
                                        this._messageService.showErrorMessage("Thông báo", "Mã chức năng đã tồn tại trong hệ thống");
                                        break;
                                    default:
                                        if (result != null && result.length > 0) {
                                            this._ListFunctionService.getObjectfromServer(result).pipe(takeUntil(this._unsubscribeAll)).subscribe((resultApi: any) => {
                                                this._ListFunctionService.updateObjectById(this.object?.FUNCTIONID_KEY, resultApi.data).subscribe(() => {
                                                    this._messageService.showSuccessMessage("Thông báo", "Ghi dữ liệu thành công");
                                                    this._router.navigated = false;
                                                    this._router.navigate([result], { relativeTo: this._activatedRoute.parent });
                                                })

                                            })

                                        } else {
                                            this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện");
                                        }
                                        break;
                                }
                            })
                    } else {
                        this._messageService.showErrorMessage("Thông báo", "Bạn không có quyền thực hiện");
                    }
                })

            }
            if (this.object?.SYS_ACTION == State.edit) {
                this.authEditFromServer.subscribe((auth) => {
                    if (auth) {
                        this._ListFunctionService.editObjectToServer(this.object?.FUNCTIONID_KEY).pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((result: any) => {
                                switch (result) {
                                    case 0:
                                        this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện");
                                        break;
                                    case -1:
                                        this._messageService.showErrorMessage("Thông báo", "Không tìm thấy chức năng hoặc không được phép thực hiện");
                                        break;
                                    case -2:
                                        this._messageService.showErrorMessage("Thông báo", "Dữ liệu nhập không đúng");
                                        break;
                                    case 1:
                                        this._ListFunctionService.viewObject(this.object?.FUNCTIONID_KEY).subscribe(() => {
                                            this._messageService.showSuccessMessage("Thông báo", "Ghi dữ liệu thành công");
                                            this._router.navigated = false;
                                            this._router.navigate([this.object?.FUNCTIONID_KEY], { relativeTo: this._activatedRoute.parent });
                                        })
                                        break;
                                    default:
                                        this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện");
                                        break;
                                }
                            })
                    } else {
                        this._messageService.showErrorMessage("Thông báo", "Bạn không có quyền thực hiện");
                    }
                })
            }

        }
    }
    onEditObject() {
        this.authEditFromServer.subscribe((auth) => {
            if (auth) {
                this._ListFunctionService.editObject({ "FUNCTIONID_KEY": this.object?.FUNCTIONID_KEY, "USER_MDF_ID": this.user.userId })
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((result: any) => {
                        switch (result) {
                            case 0:
                                this._messageService.showErrorMessage("Thông báo", "Không tìm thấy Chức năng cần sửa");
                                break;
                        }

                    })
            } else {
                this._messageService.showErrorMessage("Thông báo", "Bạn không có quyền thực hiện");
            }
        });
    }

    onCancelObject(): void {
        this._ListFunctionService.cancelObject(this.object?.FUNCTIONID_KEY)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result == 1) {
                    this._ListFunctionService.viewObject(this.object?.FUNCTIONID_KEY).subscribe(() => {
                        this._router.navigated = false;
                        this._router.navigate([this.object?.FUNCTIONID_KEY], { relativeTo: this._activatedRoute.parent });
                    })
                }
            });
    }
    onDeleteObject() {
        this.authDeleteFromServer.subscribe((auth) => {
            if (auth) {
                this._messageService.showConfirm("Thông báo", "Bạn chắc chắn muốn xóa chức năng \"" + this.object.FUNCTIONNAME + "\"", (toast: SnotifyToast) => {
                    this._messageService.notify().remove(toast.id);
                    if (this.object?.SYS_ACTION == State.create) {
                        this._ListFunctionService.deleteObject(this.object?.FUNCTIONID_KEY)
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((result: any) => {
                                switch (result) {
                                    case 1:
                                        this._messageService.showSuccessMessage("Thông báo", "Xóa Chức năng thành công");
                                        break;
                                    case 0:
                                        this._messageService.showErrorMessage("Thông báo", "Không tìm thấy Chức năng cần xóa");
                                        break;
                                    case -1:
                                        this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện xóa Chức năng");
                                        break;
                                    case -2:
                                        this._messageService.showErrorMessage("Thông báo", "Chức năng đã sử dụng nên ko thể xóa");
                                        break;
                                }

                            });
                    } else {
                        this._ListFunctionService.deleteObjectToServer(this.object?.FUNCTIONID_KEY)
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((result: any) => {
                                switch (result) {
                                    case 1:
                                        this._ListFunctionService.deleteObject(this.object?.FUNCTIONID_KEY)
                                            .pipe(takeUntil(this._unsubscribeAll))
                                            .subscribe((result: any) => {
                                                switch (result) {
                                                    case 1:
                                                        this._messageService.showSuccessMessage("Thông báo", "Xóa Chức năng thành công");
                                                        break;
                                                    case 0:
                                                        this._messageService.showErrorMessage("Thông báo", "Không tìm thấy Chức năng cần xóa");
                                                        break;
                                                    case -1:
                                                        this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện xóa Chức năng");
                                                        break;
                                                }

                                            });
                                        break;
                                    case 0:
                                        this._messageService.showErrorMessage("Thông báo", "Không tìm thấy Chức năng cần xóa");
                                        break;
                                    case -1:
                                        this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện xóa Chức năng");
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

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
}
