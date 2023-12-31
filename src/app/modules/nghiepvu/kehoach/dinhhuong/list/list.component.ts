import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, of, Subscription, switchMap, take, tap, throwError } from 'rxjs';

import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'app/shared/message.services';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ActivatedRoute, Router } from '@angular/router';
import { State } from 'app/shared/commons/conmon.types';
import { FunctionService } from 'app/core/function/function.service';
import { ListdinhhuongService } from '../listdinhhuong.service';
import { ApiDinhHuongComponent } from '../listdinhhuong.component';
import { ServiceService } from 'app/shared/service/service.service';
import { PageEvent } from '@angular/material/paginator';
import { SnotifyToast } from 'ng-alt-snotify';

@Component({
    selector: 'component-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ApiDinhHuongListComponent implements OnInit, OnDestroy {

    public selectedYear: string;
    public selectedStatus: string;
    public actionClick: string = null;
    public getYearSubscription: Subscription;
    public getStatusSubscription: Subscription;
    public getDinhHuongSubcription: Subscription;
    public listYears = [];
    public listStatus = [];
    public listDinhHuong = [];

    /**
     * Constructor
     */
    constructor(
        public _nguonDuLieuComponent: ApiDinhHuongComponent,
        private _nguonDuLieuService: ListdinhhuongService,
        private _messageService: MessageService,
        private _userService: UserService,
        public _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _functionService: FunctionService,
        private _serviceApi: ServiceService,
        private _listdinhhuongService: ListdinhhuongService,
        private el: ElementRef
    ) {

        this._activatedRoute.queryParams
        .subscribe(params => {
          
          if(params?.type){
            this.actionClick = params?.type
          }else{
            this.actionClick = null
            
          }
          this.timKiem();
          this.geListYears();
        }
      );

    }

    ngOnInit() {

      //this.testSql();
       //this.chay();
        // this.getYearSubscription = this._listdinhhuongService.getValueYear().subscribe((values: any) => {
        //     if (values){
        //         this.listYears = values;
        //     }
               
        // })
        this.getStatusSubscription = this._listdinhhuongService.getValueStatus().subscribe((values: any) => {
            if (values)
                this.listStatus = values;
        })
        this.geListYears();
        this.selectedYear='';
        this.selectedStatus='';
        this.timKiem();
    }

    geListYears() {
      this._serviceApi.execServiceLogin("3E0F3D82-66AE-4ABC-9FA7-B5C4B0355836", [{"name":"LOAI_TIM_KIEM","value":"CUATOI"}]).subscribe((data) => {
    
        let obj = {"id":'',"name":"Tất cả"}
        this.listYears.push(obj);
        if(data.data !=undefined && data.data.length >0){
           for(let i=0;i<data.data.length;i++){
               obj = {"id":''+data.data[i].id,"name":''+data.data[i].name}
               this.listYears.push(obj);
             }
        }

        // this.listYears = data.data || [];
        // let obj = {"id":0,"name":"Tất cả"}
        // this.listYears.unshift(obj);
       
      })
    }
    testSql(){
      this._serviceApi.execServiceLogin("AA6ADB30-5937-46F4-B30C-5E4636D066C6",null).subscribe((data) => {
        debugger;
        let data2=data;
           
       });
    }

    chay(){
      this._serviceApi.execServiceLogin("A47859EF-DD9A-4A73-BEAD-D8EC863CD798",
      [{"name":"LOAI_TIM_KIEM","value":"UPDATE SK_DM_LOAI_FILE set THU_LAO =1, XET_DUYET =0 WHERE MA_LOAI_FILE IN('HOSO_GCHUNG_NHAN','HOSO_QD_CHUNG_NHAN','HOSO_QD_TRA_THULAO')"}]).subscribe((data) => {
     
        let data2=data;
           
       });
    }

    onApiSelected(object: any): void {

    }

    addNew(): void {
        this._router.navigate(
            ['/nghiepvu/kehoach/dinhhuong'],
            { queryParams: { type: 'THEMMOI' } }
          );
    }

    detail(item){
        this._router.navigate(
            ['/nghiepvu/kehoach/dinhhuong/'+item.maKeHoach],
            { queryParams: { type: 'CHITIET' } }
          );
    }
    
    editer(item){
        this._router.navigate(
            ['/nghiepvu/kehoach/dinhhuong/'+item.maKeHoach],
            { queryParams: { type: 'CHINHSUA' } }
          );
    }
    


    // getListDinhHuong() {
    //     this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("F217F0FD-B9AA-4ADC-9EDE-75717D8484FD", [{"name":"MA_TRANG_THAI","value":""},{"name":"NAM","value":(new Date()).getFullYear()},{"name":"ORGID","value":"115"}]).subscribe((data) => {
    //        console.log(data);
    //         this.listDinhHuong = data.data || [];
    //     })
    // }

    timKiem(){
      let nam = '';
      if(this.selectedYear !=null){
        nam =this.selectedYear+'';
      }
        this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("DEA672A5-4533-4C16-8D99-7E6D4D277941", [{"name":"MA_TRANG_THAI","value":this.selectedStatus},{"name":"NAM","value":nam},{"name":"PAGE_NUM","value":this.pageIndex},{"name":"PAGE_ROW_NUM","value":this.pageSize}]).subscribe((data) => {
         
          this.listDinhHuong = data.data || [];
          this.length =0;
             if(data.data != null && data.data.length >0){
                this.length = data.data[0].totalPage;
             }
             
         })
    }


    ngOnDestroy() {
        this.getDinhHuongSubcription.unsubscribe()
       // this.getYearSubscription.unsubscribe()
        this.getStatusSubscription.unsubscribe()
    }

     //phân trang
     length = 0;
     pageSize = 20;
     pageIndex = 0;
     pageSizeOptions = [10, 20, 50,100];
     showFirstLastButtons = true;
   
     handlePageEvent(event: PageEvent) {
       this.length = event.length;
       this.pageSize = event.pageSize;
       this.pageIndex = event.pageIndex;
       this.timKiem();

     }

     lichsu(item){
      this._router.navigate(
          ['/nghiepvu/kehoach/dinhhuong'],
          { queryParams: { type: 'LICHSU', makehoach:item.maKeHoach } }
        );
     }
     xoa(item){
      this._messageService.showConfirm("Thông báo", "Bạn chắc chắn muốn xóa \"" + item.name + "\"", (toast: SnotifyToast) => {
        this._messageService.notify().remove(toast.id);
        this._serviceApi.execServiceLogin("CC1C9234-D950-4493-8189-1C65C07BE01C", [{"name":"MA_KE_HOACH","value":item.maKeHoach},{"name":"USERID","value":"STR"}]).subscribe((data) => {
          console.log(data);
          switch (data.data) {
                            case 1:
                                this._messageService.showSuccessMessage("Thông báo", "Xóa bản đăng ký thành công");
                                this.timKiem();
                                this.geListYears();
                                // this._router.navigated = false;
                                // this._router.navigate([data.data], { relativeTo: this._activatedRoute.parent });
                                break;
                            case 0:
                                this._messageService.showErrorMessage("Thông báo", "Không tìm thấy bản đăng ký cần xóa");
                                break;
                            case -1:
                                this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện xóa bản đăng ký");
                                break;
                        }
         })
        // if (State.create==1) {
        //     this._apiService.deleteObject(this.api?.API_SERVICEID)
        //         .pipe(takeUntil(this._unsubscribeAll))
        //         .subscribe((result: any) => {
        //             switch (result) {
        //                 case 1:
        //                     this._messageService.showSuccessMessage("Thông báo", "Xóa dịch vụ thành công");
        //                     break;
        //                 case 0:
        //                     this._messageService.showErrorMessage("Thông báo", "Không tìm thấy dịch vụ cần xóa");
        //                     break;
        //                 case -1:
        //                     this._messageService.showErrorMessage("Thông báo", "Xảy ra lỗi khi thực hiện xóa dịch vụ");
        //                     break;
        //             }
  
        //         });
        // }
      })
     }
    


}
