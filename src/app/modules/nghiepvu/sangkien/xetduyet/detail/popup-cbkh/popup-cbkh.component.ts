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
    public listHoiDong = [];
    public listDonVi= [];
    public maDonVi="";
    public q="";
    public getDinhHuongSubcription: Subscription;
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
        if(this.checkType=="HOIDONG"){
            this.timkiemHoiDong();
            this.donViChuTri();
        }else 
        if(this.checkType=="HOIDONGSK"){
            this.timkiemHoiDongSk();
            this.donViChuTri();
        }else 
        if(this.checkType=="KEHOACH"){
            this.timkiemKehoach();
        }else{
            this.timkiemNguoi(this.checkType);
        }
       
       
    }

    timkiemHoiDongSk(){
        let obj={
            q:this.q
        }
        this._serviceApi.execServiceLogin("8AC97350-516A-4757-BCD1-741FB86FFD8D", [{"name":"TIM_KIEM","value":JSON.stringify(obj)}]).subscribe((data) => {
                this.listHoiDong = data.data || [];
           })
    }
    
    timkiemHoiDong(){
    //    this._serviceApi.execServiceLogin("D5738375-3591-4986-94FC-E523F645A858", [{"name":"TEN_NGUOI_THUC_HIEN","value":this.q},{"name":"MA_DON_VI","value":this.maDonVi}]).subscribe((data) => {
    //         this.listHoiDong = data.data || [];
    //        })
    let obj ={
        donVi:this.maDonVi
    }
           this._serviceApi.execServiceLogin("395A68D9-587F-4603-9E1D-DCF1987517B4", [{"name":"TEN_NGUOI_THUC_HIEN","value":this.q},,{"name":"TIM_KIEM","value":JSON.stringify(obj)}]).subscribe((data) => {
       
         this.listHoiDong = data.data || [];
        })
    }

    donViChuTri(){
        
        this._serviceApi.execServiceLogin("D3F0F915-DCA5-49D2-9A5B-A36EBF8CA5D1", null).subscribe((data) => {
            console.log(data.data);
            this.listDonVi = data.data || [];
           })
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



}
