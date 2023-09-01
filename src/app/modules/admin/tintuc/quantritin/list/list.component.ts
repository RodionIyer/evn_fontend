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
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    Router,
} from '@angular/router';
import { State } from 'app/shared/commons/conmon.types';
import { FunctionService } from 'app/core/function/function.service';
import { QuanTriTinService } from '../quantritin.service';
import { QuanTriTinComponent } from '../quantritin.component';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'list-tintuc',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class QuanTriTinListComponent implements OnInit, OnDestroy {
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

    displayedColumns: string[] = ['STT', 'TIEU_DE_BAI_VIET', 'TOM_TAT'];

    filterForm = new FormGroup({
        DA_DUYET: new FormControl(),
        name: new FormControl(),
        DMTinTuc: new FormControl('all'),
    });

    filterValues = {
        DA_DUYET: false,
        name: '',
        DMTinTuc: 'all',
    };

    listDanhMucTinTuc: any[];

    get DA_DUYET() {
        return this.filterForm.get('DA_DUYET');
    }

    get name() {
        return this.filterForm.get('name');
    }

    get DMTinTuc() {
        return this.filterForm.get('DMTinTuc');
    }

    // get isNgoaiEVN() {
    //     return this.filterForm.get('isNgoaiEVN');
    // }

    /**
     * Constructor
     */
    constructor(
        public quanTriTinComponent: QuanTriTinComponent,
        private _quanTriTinService: QuanTriTinService,
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

        this._quanTriTinService.objects$
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

        this._quanTriTinService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination) => {
                this.pagination = pagination;
            });

        this._quanTriTinService.ObjectListDanhMucTinTuc$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((data: any[]) => {
            this.listDanhMucTinTuc = data;
        });

        // this._quanTriTinService.Object$.pipe(
        //     takeUntil(this._unsubscribeAll)
        // ).subscribe((obj: any) => {
        //     if (obj != null) {
        //         this.isSelect = true;
        //         this.selectedObj = obj;
        //     } else {
        //         this.isSelect = false;
        //     }
        // });
    }

    formSubscribe() {
        this.DA_DUYET.valueChanges.subscribe((value) => {
            this.filterValues['DA_DUYET'] = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.name.valueChanges.subscribe((value) => {
            this.filterValues['name'] = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.DMTinTuc.valueChanges.subscribe((value) => {
            this.filterValues['DMTinTuc'] = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
    }

    getFormsValue() {
        this.dataSource.filterPredicate = (
            data: any,
            filter: string
        ): boolean => {
            let searchString = JSON.parse(filter);
            const resultValue =
                (searchString.DA_DUYET == false
                    ? true
                    : data.DA_DUYET !== true) &&
                (data.TIEU_DE_BAI_VIET.toString()
                    .trim()
                    .toLowerCase()
                    .indexOf(searchString.name.toLowerCase()) != -1 ||
                    (data.TOM_TAT ?? '')
                        .toString()
                        .trim()
                        .toLowerCase()
                        .indexOf(searchString.name.toLowerCase()) != -1 ||
                    (data.TU_KHOA ?? '')
                        .toString()
                        .trim()
                        .toLowerCase()
                        .indexOf(searchString.name.toLowerCase()) != -1) &&
                (searchString.DMTinTuc == 'all'
                    ? true
                    : data.MA_DANH_MUC_TIN_TUC == searchString.DMTinTuc);

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
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    addNewNguoiThucHien() {
        this._functionService.isInsert().subscribe((auth: boolean) => {
            if (auth) {
                this._quanTriTinService
                    .createObject()
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((data) => {
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
        this._quanTriTinService.selectedObjChanged.next(object);
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
