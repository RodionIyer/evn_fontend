import { Component, Inject, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'app/shared/message.services';
import { ServiceService } from 'app/shared/service/service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DOfficeService } from 'app/shared/service/doffice.service'




@Component({
    selector: 'component-popup-cbkh',
    templateUrl: './popup-cbkh.component.html',
    styleUrls: ['./popup-cbkh.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class PopupCbkhComponent implements OnInit {


    message: string = "Are you sure?"
    confirmButtonText = "Yes"
    cancelButtonText = "Cancel"
    public tenKeHoach="";
    public checkType=""
    public listDOffice = [];
    public listChuNhiem = [];
    public listDongChuNhiem = [];
    public listThuKy = [];
    public listThanhVien = [];
    public q="";
    public getDinhHuongSubcription: Subscription;
    public listYears = [];
    public listLoaiTK=[];
    public selectedYear;
    public loaiTK;
    public soKyHieu="";
    public linkOffice;
    public maDv;
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _messageService: MessageService,
        public _router: Router,
        private _serviceApi: ServiceService,
        private _dOfficeApi: DOfficeService,
        public dialog: MatDialog,
        
        private dialogRef: MatDialogRef<PopupCbkhComponent>
    ) {
        if (data) {
            this.checkType=data.type;
            this.linkOffice=data.linkApi;
            this.maDv = data.maDv;
            this.message = data.message || this.message;
            if (data.buttonText) {
                this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
                this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
            }
        }
    }


    ngOnInit(): void {
        this.getListYear();
        this.getListLoaiTimKiem();
    }

    getListYear(){
        var obj = { "NAME": 0, "ID": 0 };
       // var year = (new Date()).getFullYear();
        var yearStart = (new Date()).getFullYear() -5;
        var yearEnd = (new Date()).getFullYear() + 1;
        for (let i = yearStart; i <= yearEnd; i++) {
            obj = { "NAME": i, "ID": i }
            this.listYears.push(obj);
        }
        this.selectedYear = (new Date()).getFullYear();

    }

    getListLoaiTimKiem(){
        var obj = { "NAME": 'Tất cả', "ID": 'all' };
            this.listLoaiTK.push(obj);
            obj = { "NAME": 'Văn bản đi', "ID": 'vbdi' };
            this.listLoaiTK.push(obj);
            obj = { "NAME": 'Văn bản đến', "ID": 'vbde' };
            this.listLoaiTK.push(obj);
            obj = { "NAME": 'Văn bản nội bộ', "ID": 'vbnb' };
            this.listLoaiTK.push(obj);
        this.loaiTK ="all";

    }
    onCloseClick(): void {
        this.dialogRef.close(true);
    }

    submit(item){

        this.dialogRef.close({
           data:item
          });
    }

    timkiemDoffice(){
       this._dOfficeApi.execTimKiem(this.linkOffice,this.q,this.soKyHieu,this.loaiTK,this.selectedYear,this.maDv).subscribe((data) => {
            this.listDOffice = data.data || [];
              
           })
    }

    // timkiemNguoi(type){
    //     this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("395A68D9-587F-4603-9E1D-DCF1987517B4", [{"name":"TEN_NGUOI_THUC_HIEN","value":this.q}]).subscribe((data) => {
    //         if(type=="CHUNHIEM"){
    //             this.listChuNhiem = data.data || [];
    //         }else if(type=="DONGCHUNHIEM"){
    //             this.listDongChuNhiem = data.data || [];
    //         }else if(type=="THUKY"){
    //             this.listThuKy = data.data || [];
    //         }else if(type=="THANHVIEN"){
    //             this.listThanhVien = data.data || [];
    //         }
              
    //        })
    // }
    // ngOnDestroy() {
    //     this.getDinhHuongSubcription.unsubscribe()
    // }



}
