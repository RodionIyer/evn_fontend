import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {
    FormControl,
    FormGroup,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ReplaySubject, Subject, take, takeUntil} from 'rxjs';
import {ListNguoiThucHienService} from '../../listnguoithuchien.service';

@Component({
    selector: 'listnhansu-dialog',
    templateUrl: './listnhansu-dialog.component.html',
    styleUrls: ['./listnhansu-dialog.component.scss'],
})
export class ListNhanSuComponent implements OnInit {
    dataSource: any;
    selected: any;
    listNhanSu: any[];
    displayedColumns: string[] = [
        'STT',
        'Tenkhaisinh',
        'Dienthoai',
        'Email',
        'Departmentc1_name',
    ];

    filterForm = new FormGroup({
        hoten: new FormControl(),
        sdt: new FormControl(),
        email: new FormControl(),
        noilamviec: new FormControl(),
        donvi_id: new FormControl(),
    });

    changeOrgIdForm: UntypedFormGroup;

    filterValues = {
        hoten: '',
        sdt: '',
        email: '',
        noilamviec: '',
        donvi_id: '',
    };

    listORG = [];
    public filteredlistORGInputs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialogRef: MatDialogRef<ListNhanSuComponent>,
        private _listNguoiThucHienService: ListNguoiThucHienService,
        private _formBuilder: UntypedFormBuilder
    ) {
    }

    async ngOnInit() {
        console.log(this.data.orgId);
        this.changeOrgIdForm = this._formBuilder.group({
            ORGID: [this.data.orgId],
            ORG_LST_INPUTIDFilter: [],
        });
        this.changeOrgIdForm.get('ORG_LST_INPUTIDFilter').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.filterOrgInputs();
            });
        this.changeOrgIdForm.get('ORGID').valueChanges.subscribe((value) => {
            // this.data.orgId = value;
            this._listNguoiThucHienService
                .getListNhanSuByOrgId(value)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(async (res: any[]) => {
                    this.setData(res);
                });
        });

        this._listNguoiThucHienService
            .getListNhanSuByOrgId(this.data.orgId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(async (res: any[]) => {
                this.setData(res);
            });

        this._listNguoiThucHienService
            .getListORGID()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(async (res: any[]) => {
                this.listORG = res['data'];

                this.filteredlistORGInputs.next(this.listORG.slice());
            });
    }

    protected filterOrgInputs() {
        if (!this.listORG) {
            return;
        }
        // get the search keyword
        try {
            let search = this.changeOrgIdForm.controls.ORG_LST_INPUTIDFilter.value;
            if (search == null || search == '') {
                this.filteredlistORGInputs.next(this.listORG.slice());
                return;
            } else {
                search = search?.toLowerCase();
            }
            // filter the banks
            this.filteredlistORGInputs.next(
                this.listORG.filter(obj => obj.name.toLowerCase().indexOf(search) > -1)
            );
        } catch (error) {
            return;
        }

    }

    setData(data) {
        this.listNhanSu = data['data'];
        this.dataSource = new MatTableDataSource<any>(this.listNhanSu);
        this.formSubscribe();
        this.getFormsValue();
        this.dataSource.paginator = this.paginator;
    }

    ngAfterViewInit() {

    }

    onRowSelect(row) {
        // console.log(row);
        this.matDialogRef.close(row);
    }

    close(): void {
        this.matDialogRef.close();
    }

    formSubscribe() {
        this.filterForm.get('hoten').valueChanges.subscribe((value) => {
            this.filterValues['hoten'] = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.filterForm.get('sdt').valueChanges.subscribe((value) => {
            this.filterValues['sdt'] = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.filterForm.get('email').valueChanges.subscribe((value) => {
            this.filterValues['email'] = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.filterForm.get('noilamviec').valueChanges.subscribe((value) => {
            this.filterValues['noilamviec'] = value;
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
                (searchString.hoten == ''
                    ? true
                    : data.Tenkhaisinh
                        ? data.Tenkhaisinh.toString()
                        .trim()
                        .toLowerCase()
                        .indexOf(
                            searchString.hoten.toString().trim().toLowerCase()
                        ) != -1
                        : false) &&
                (searchString.sdt == ''
                    ? true
                    : data.Dienthoai
                        ? data.Dienthoai?.toString()
                        .trim()
                        .toLowerCase()
                        .indexOf(
                            searchString.sdt.toString().trim().toLowerCase()
                        ) != -1
                        : false) &&
                (searchString.email == ''
                    ? true
                    : data.Email
                        ? data.Email?.toString()
                        .trim()
                        .toLowerCase()
                        .indexOf(
                            searchString.email.toString().trim().toLowerCase()
                        ) != -1
                        : false) &&
                (searchString.noilamviec == ''
                    ? true
                    : data.Departmentc1_name
                        ? data.Departmentc1_name?.toString()
                        .trim()
                        .toLowerCase()
                        .indexOf(
                            searchString.noilamviec
                                .toString()
                                .trim()
                                .toLowerCase()
                        ) != -1
                        : false);
            return resultValue;
        };
        this.dataSource.filter = JSON.stringify(this.filterValues);
    }

    changeOrgID($event) {
        console.log($event);
        // this._listNguoiThucHienService
        //     .getListNhanSuByOrgId(orgId)
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(async (res: any[]) => {
        //         this.listNhanSu = res['data'];
        //         console.log(this.listNhanSu);
        //         this.dataSource = new MatTableDataSource<any>(this.listNhanSu);
        //         this.formSubscribe();
        //         this.getFormsValue();
        //         this.dataSource.paginator = this.paginator;
        //     });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
