import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'app/shared/message.services';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ActivatedRoute, Router } from '@angular/router';
import { State } from 'app/shared/commons/conmon.types';
import { FunctionService } from 'app/core/function/function.service';
import { ListNguoiThucHienService } from '../listnguoithuchien.service';
import { ListNguoiThucHienComponent } from '../listnguoithuchien.component';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { state } from '@angular/animations';
import { values } from 'lodash';

@Component({
    selector: 'list-nguoi-thuc-hien',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ListNguoiThucHienListComponent implements OnInit, OnDestroy {
    @ViewChild('list') list: ElementRef;
    public State = State;

    group: any;
    apisAddNew: any[];
    loading: boolean = false;
    pagination: any;
    selectedObj: any;
    user: User;

    dataSource = new MatTableDataSource<any>();
    isSelect: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    displayedColumns: string[] = [
        'STT',
        'TEN_NGUOI_THUC_HIEN',
        'TEN_HOC_HAM',
        'TEN_HOC_VI',
        'EMAL',
        'SDT',
        'TEN_LVUC_NCUU'
    ];

    _displayedColumns: string[] = [
        'STT',
        'TEN_NGUOI_THUC_HIEN',
        'TEN_HOC_VI',
        'TEN_LVUC_NCUU',
        'TRANG_THAI'
    ];

    /**
     * Constructor
     */
    constructor(
        public listNguoiThucHienComponent: ListNguoiThucHienComponent,
        private _listUserService: ListNguoiThucHienService,
        private _messageService: MessageService,
        private _userService: UserService,
        public _router: Router,
        public location: Location,
        private _activatedRoute: ActivatedRoute,
        private _functionService: FunctionService,
        private el: ElementRef
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
            });

        this._listUserService.group$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((group: any) => {
                this.group = group;
            });

        this._listUserService.objects$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((objects: any[]) => {
                let tmp_objs = [];
                objects.filter((value) => {
                    if (value.DA_XOA == false) {
                        tmp_objs.push(value);
                    }
                });
                this.dataSource = new MatTableDataSource<any>(tmp_objs);
            });

        this._listUserService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination) => {
                this.pagination = pagination;
            });

        this._listUserService.Object$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((obj: any) => {
            if (obj != null) {
                this.isSelect = true;
                this.selectedObj = obj;
            } else {
                this.isSelect = false;
            }
        });
    }
    ngAfterViewInit() {
        this.selectObjectMarker();
    }
    selectObjectMarker() {
        this.el.nativeElement
            .querySelector('.selectObject')
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    addNewNguoiThucHien() {
        this._functionService.isInsert().subscribe((auth: boolean) => {
            if (auth) {
                if (this.group == null) {
                    this._messageService.showErrorMessage(
                        'Thông báo',
                        'Chưa chọn nhóm dữ liệu'
                    );
                }
                this._listUserService
                    .createObject(this.group.ORGID)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((data) => {
                        //this._router.navigate([data]);
                        this._router
                            .navigate(['./' + data], {
                                relativeTo: this._activatedRoute,
                            })
                            .then(() => {
                                this.selectObjectMarker();
                            });
                    });
            } else {
                this._messageService.showErrorMessage(
                    'Thông báo',
                    'Bạn không được phép thêm mới'
                );
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On mail selected
     *
     * @param mail
     */
    onObjectSelected(object: any): void {
        // If the mail is unread...
        // Execute the mailSelected observable
        this._listUserService.selectedObjChanged.next(object);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    doFilter(value: any) {
        this.dataSource.filter = value.value.trim().toLocaleLowerCase();
    }

    onSelectRow(row: any) {
        this.isSelect = true;
        this._router.navigate(row.MA_NGUOI_THUC_HIEN);
    }
}
