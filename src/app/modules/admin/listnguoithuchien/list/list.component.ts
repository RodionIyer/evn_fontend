import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {MessageService} from 'app/shared/message.services';
import {UserService} from 'app/core/user/user.service';
import {User} from 'app/core/user/user.types';
import {ActivatedRoute, Router} from '@angular/router';
import {State} from 'app/shared/commons/conmon.types';
import {FunctionService} from 'app/core/function/function.service';
import {ListNguoiThucHienService} from '../listnguoithuchien.service';
import {ListNguoiThucHienComponent} from '../listnguoithuchien.component';
import {MatTableDataSource} from '@angular/material/table';
import {Location} from '@angular/common';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
    selector: 'list-nguoi-thuc-hien',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ListNguoiThucHienListComponent implements OnInit, OnDestroy {
    @ViewChild('list') list: ElementRef;
    public State = State;

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
        'TEN_LVUC_NCUU',
        'EMAL',
        'SDT',
        'NOI_LAM_VIEC',
    ];

    _displayedColumns: string[] = [
        'STT',
        'TEN_NGUOI_THUC_HIEN',
        'TEN_HOC_VI',
        'TEN_LVUC_NCUU',
        // 'TRANG_THAI',
    ];

    filterForm = new FormGroup({
        chuyen_gia: new FormControl(),
        name: new FormControl(),
        LVucNcuu: new FormControl(['all']),
        isNgoaiEVN: new FormControl('all'),
    });

    filterValues = {
        chuyen_gia: false,
        name: '',
        LVucNcuu: [],
        isNgoaiEVN: 'all',
    };

    listLvucNcuu: any[];

    get chuyen_gia() {
        return this.filterForm.get('chuyen_gia');
    }

    get name() {
        return this.filterForm.get('name');
    }

    get LVucNcuu() {
        return this.filterForm.get('LVucNcuu');
    }

    get isNgoaiEVN() {
        return this.filterForm.get('isNgoaiEVN');
    }

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
    ) {
    }

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

                this.formSubscribe();
                this.getFormsValue();
            });

        this._listUserService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination) => {
                this.pagination = pagination;
            });

        this._listUserService.ObjectListLvucNCuu$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((data: any[]) => {
            this.listLvucNcuu = data;
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

    formSubscribe() {
        this.chuyen_gia.valueChanges.subscribe((value) => {
            this.filterValues['chuyen_gia'] = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.name.valueChanges.subscribe((value) => {
            this.filterValues['name'] = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.LVucNcuu.valueChanges.subscribe((value) => {
            let LVucNcuuTemp = value;
            if (LVucNcuuTemp[0] == 'all' && LVucNcuuTemp.length > 1) {
                LVucNcuuTemp.shift();
                this.filterForm.controls['LVucNcuu'].setValue(LVucNcuuTemp);
            }
            if (LVucNcuuTemp[0] != 'all') {
                this.filterValues['LVucNcuu'] = LVucNcuuTemp;
                this.dataSource.filter = JSON.stringify(this.filterValues);
            }
        });
        this.isNgoaiEVN.valueChanges.subscribe((value) => {
            this.filterValues['isNgoaiEVN'] = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
    }

    clearLVucNcuu() {
        this.filterValues.LVucNcuu = [];
        this.filterForm.controls['LVucNcuu'].setValue(['all']);
        this.dataSource.filter = JSON.stringify(this.filterValues);
    }

    getFormsValue() {
        this.dataSource.filterPredicate = (
            data: any,
            filter: string
        ): boolean => {
            let searchString = JSON.parse(filter);
            const resultValue =
                (data.TEN_NGUOI_THUC_HIEN.toString()
                    .trim()
                    .toLowerCase()
                    .indexOf(searchString.name.toLowerCase()) != -1 || (data.SDT ?? "").toString()
                    .trim()
                    .toLowerCase()
                    .indexOf(searchString.name.toLowerCase()) != -1 || (data.EMAL ?? "").toString()
                    .trim()
                    .toLowerCase()
                    .indexOf(searchString.name.toLowerCase()) != -1) &&
                (searchString.chuyen_gia == false
                    ? true
                    : data.CHUYEN_GIA == true) &&
                (searchString.isNgoaiEVN == 'all'
                    ? true
                    : data.NGOAI_EVN == searchString.isNgoaiEVN);
            if (searchString.LVucNcuu.length > 0) {
                let resultValue_diff = false;
                searchString.LVucNcuu.forEach((value) => {
                    if (data.LVUC_NCUU_LST != null && data.LVUC_NCUU_LST.length > 0) {
                        data.LVUC_NCUU_LST.forEach((objLVNC) => {
                            if (objLVNC.MA_LVUC_NCUU == value) {
                                resultValue_diff = true;
                            }
                        });
                    }
                });
                return resultValue && resultValue_diff;
            }
            return resultValue;
        };
        this.dataSource.filter = JSON.stringify(this.filterValues);
    }

    ngAfterViewInit() {
        this.selectObjectMarker();
    }

    selectObjectMarker() {
        this.el.nativeElement
            .querySelector('.selectObject')
            ?.scrollIntoView({behavior: 'smooth', block: 'center'});
    }

    addNewNguoiThucHien() {
        this._functionService.isInsert().subscribe((auth: boolean) => {
            if (auth) {
                this._listUserService
                    .createObject(this.user.ORGID)
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


}
