import { Component, Inject, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, takeUntil,Subject } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'app/shared/message.services';
import { ServiceService } from 'app/shared/service/service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {UserService} from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';


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
    public listHoiDong = [];
    public getDinhHuongSubcription: Subscription;
    public q="";
    public maDonVi="";
    public listDonVi;
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _messageService: MessageService,
        public _router: Router,
        private _serviceApi: ServiceService,
        public dialog: MatDialog,
        private _userService: UserService,
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
        this.getCheckQuyenDoffice();
        if(this.checkType=="DETAIHOIDONGNT"){
            this.timkiemDeTaiHoiDong(1);
            this.donViChuTri();
        }else
        if(this.checkType=="DETAIHOIDONG"){
            this.timkiemDeTaiHoiDong(0);
            this.donViChuTri();
        }else
        if(this.checkType=="HOIDONG"){
            this.timkiemHoiDong();
            this.donViChuTri();
        }else
        if(this.checkType=="KEHOACH"){
            this.timkiemKehoach();
        }else{
            this.timkiemNguoi(this.checkType);
        }
       
       
    }

    getCheckQuyenDoffice() {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
                this.maDonVi = this.user.ORGID;
                // this._serviceApi.execServiceLogin("3FADE0E4-B2C2-4D9D-A0C7-06817ADE4FA3", [{ "name": "ORGID", "value": user.ORGID }]).subscribe((data) => {
                //     if (data.data.API_DOFFICE) {
                //         this.checkDOffice = true;
                //         this.linkDoffice = data.data.API_DOFFICE;
                //     }
                // })
            });

    }


    onCloseClick(): void {
        this.dialogRef.close(true);
    }

    submit(item){

        this.dialogRef.close({
           data:item
          });
    }
    donViChuTri(){
        
        this._serviceApi.execServiceLogin("D3F0F915-DCA5-49D2-9A5B-A36EBF8CA5D1", null).subscribe((data) => {
            console.log(data.data);
            this.listDonVi = data.data || [];
            let obj ={"ID":"","NAME":"Tất cả"}
            this.listDonVi.unshift(obj);
           })
    }

    timkiemKehoach(){
        this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("34A59664-4613-482F-95CA-CCF346E2140A", [{"name":"TEN_KE_HOACH","value":this.q}]).subscribe((data) => {
            console.log(data.data);
            this.listKehoach = data.data || [];
              
           })
    }
    timkiemHoiDong(){
        this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("D5738375-3591-4986-94FC-E523F645A858", [{"name":"TEN_NGUOI_THUC_HIEN","value":this.q},{"name":"MA_DON_VI","value":this.maDonVi}]).subscribe((data) => {
                this.listHoiDong = data.data || [];
           })
    }
    timkiemNguoi(type){
        let obj ={
            donVi:this.maDonVi
        }
        this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("395A68D9-587F-4603-9E1D-DCF1987517B4", [{"name":"TEN_NGUOI_THUC_HIEN","value":this.q},{"name":"TIM_KIEM","value":JSON.stringify(obj)}]).subscribe((data) => {
            if(type=="CHUNHIEM"){
                this.listChuNhiem = data.data || [];
            }else if(type=="DONGCHUNHIEM"){
                this.listDongChuNhiem = data.data || [];
            }else if(type=="THUKY"){
                this.listThuKy = data.data || [];
            }else if(type=="THANHVIEN"){
                this.listThanhVien = data.data || [];
            }
              
           })
    }
    // ngOnDestroy() {
    //     this.getDinhHuongSubcription.unsubscribe()
    // }

    timkiemDeTaiHoiDong(loaiHD){
        let obj={q:this.q,
            loaiHD:loaiHD,
            donVi:this.maDonVi
        }
        this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("1A8E4364-AA42-40B4-A188-3BBF97F0A1A1", [{"name":"TIM_KIEM","value":JSON.stringify(obj)},{"name":"PAGE_NUM","value":0},{"name":"PAGE_ROW_NUM","value":20}]).subscribe((data) => {
            console.log(data.data);
            this.listHoiDong = data.data || [];
              
           })
    }

}
