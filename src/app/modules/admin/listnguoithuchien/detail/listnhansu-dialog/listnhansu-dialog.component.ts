import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-donvi',
    templateUrl: './listnhansu-dialog.component.html',
    styleUrls: ['./listnhansu-dialog.component.scss'],
})
export class ListNhanSuComponent implements OnInit {
    dataSource: any;
    selected: any;
    displayedColumns: string[] = [
        'STT',
        'Ns_id',
        'Tenkhaisinh',
        // 'Hocham_cnhat_id',
        // 'Hocvi_cnhat_id',
        // 'Nam_hocham',
        // 'Nam_hocvi',
        'Dienthoai',
        'Email',
        // 'Chuyenmon',
        'Departmentc1_name',
    ];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialogRef: MatDialogRef<ListNhanSuComponent>
    ) {}

    ngOnInit(): void {
        if (this.data) {
            this.dataSource = new MatTableDataSource<any>(this.data);
        }
    }

    onRowSelect(row) {
        this.matDialogRef.close(row);
    }

    close(): void {
        this.matDialogRef.close();
    }

    doFilter(value: any) {
        this.dataSource.filter = value.value.trim().toLocaleLowerCase();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
