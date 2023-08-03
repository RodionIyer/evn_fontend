import { Component, Inject, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'app/shared/message.services';
import { ServiceService } from 'app/shared/service/service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';




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
    public listKehoach = [];
    public listChuNhiem = [];
    public listDongChuNhiem = [];
    public listThuKy = [];
    public listThanhVien = [];
    public listDonViChuDauTu =[];
    public getDinhHuongSubcription: Subscription;
    public searchname:String=null;
    public listDonViChuDauTuAll=[];
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _messageService: MessageService,
        public _router: Router,
        private _serviceApi: ServiceService,
        public dialog: MatDialog,
        
        private dialogRef: MatDialogRef<PopupCbkhComponent>
    ) {
        if (data) {
            this.checkType=data.type;
            this.message = data.message || this.message;
            if (data.buttonText) {
                this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
                this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
            }
        }
    }


    ngOnInit(): void {
        // this._messageService.showSuccessMessage("Thông báo", "Thành công")
        if(this.checkType=="DKAPDUNGSK"){
            this.timkiemDonViChuDauTu(this.checkType);
        }else
        if(this.checkType=="KEHOACH"){
            this.timkiemKehoach();
        }else{
            this.timkiemNguoi(this.checkType);
        }
       
        
       
    }

    timKiemNgay(){
        if(this.searchname)
             this.listDonViChuDauTu = this.listDonViChuDauTuAll.filter(c => c.name.toLowerCase().includes(this.searchname.toLowerCase()) );
        else
            this.listDonViChuDauTu = this.listDonViChuDauTuAll;
    }


    onCloseClick(): void {
        this.dialogRef.close(true);
    }

    submit(item){

        this.dialogRef.close({
           data:item
          });
    }

    timkiemKehoach(){
        this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("34A59664-4613-482F-95CA-CCF346E2140A", [{"name":"TEN_KE_HOACH","value":""}]).subscribe((data) => {
            console.log(data.data);
            this.listKehoach = data.data || [];
              
           })
    }
    timkiemNguoi(type){
        this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("395A68D9-587F-4603-9E1D-DCF1987517B4", [{"name":"TEN_NGUOI_THUC_HIEN","value":""}]).subscribe((data) => {
            if(type=="CHUNHIEM"){
                this.listChuNhiem = data.data || [];
            }else if(type=="DONGCHUNHIEM"){
                this.listDongChuNhiem = data.data || [];
            }else if(type=="THUKY"){
                this.listThuKy = data.data || [];
            }else if(type=="THANHVIEN"){
                this.listThanhVien = data.data || [];
            }else if(type=="DKAPDUNGSK"){
                this.listThanhVien = data.data || [];
            }
              
           })
    }

    timkiemDonViChuDauTu(type) {
        this._serviceApi
            .execServiceLogin('176BC0B0-7431-47F0-A802-BEDF83E85261', null)
            .subscribe((data) => {
                console.log(data.data);
                if(type=="DKAPDUNGSK"){
                this.listDonViChuDauTu = data.data || [];
                this.listDonViChuDauTuAll= data.data || [];
                }
            });
    }
    // ngOnDestroy() {
    //     this.getDinhHuongSubcription.unsubscribe()
    // }



}
