import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MessageService } from 'app/shared/message.services';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ActivatedRoute, Router } from '@angular/router';
import { State } from 'app/shared/commons/conmon.types';
import { FunctionService } from 'app/core/function/function.service';
import { ApiPheDuyetDinhHuongService } from '../pheduyetdinhhuong.service';
import { ApiPheDuyetDinhHuongComponent } from '../pheduyetdinhhuong.component';
import { ServiceService } from 'app/shared/service/service.service';
import { PageEvent } from '@angular/material/paginator';
import { ListdinhhuongService } from '../../dinhhuong/listdinhhuong.service';

@Component({
    selector: 'component-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ApiPheduyetdinhhuongListComponent implements OnInit {

    public selectedYear: [string];
    public selectedStatus: string;
    public actionClick: string = null;
    public getYearSubscription: Subscription;
    public getStatusSubscription: Subscription;
    public getPheDuyetSubcription: Subscription;
    public listYears = [];
    public listStatus = [];
    public listPheDuyet = [];
    public checked;
    public getDinhHuongSubcription: Subscription;
    public listDinhHuong = [];
    public selectedGrid:[{}];
    public userLogin={EMAIL:'',ORGID:'124'};
    sizes: any[] = [
        { 'size': '0', 'diameter': '16000 km' },
        { 'size': '1', 'diameter': '32000 km' }
      ];
    /**
     * Constructor
     */
    constructor(
        public _nguonDuLieuComponent: ApiPheDuyetDinhHuongComponent,
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
        }

      );

    }

    ngOnInit() {
        this.getUserLogin();
        this.actionClick = null;
        // this._listdinhhuongService.getValueYear().subscribe((values: any) => {
        //     if (values){
        //         this.listYears = values;
        //         // this.listYears.push({"NAME":2024,"ID":2024});
        //         // this.listYears.push({"NAME":2025,"ID":2025})
        //     }

        // })
        // this.getStatusSubscription = this._listdinhhuongService.getValueStatus().subscribe((values: any) => {
        //     if (values)
        //         this.listStatus = values;
        // })
        this.geListYears();
        this.listStatus =[{"MA_TRANG_THAI":"","TEN_TRANG_THAI":"Tất cả"},
            {"MA_TRANG_THAI":"Y_CAU_HIEU_CHINH","TEN_TRANG_THAI":"Yêu cầu hiệu chỉnh"},
        {"MA_TRANG_THAI":"CHO_PHE_DUYET","TEN_TRANG_THAI":"Chờ phê duyệt"},
        {"MA_TRANG_THAI":"DA_PHE_DUYET","TEN_TRANG_THAI":"Đã duyệt"}]
       // this.selectedYear =;//[((new Date()).getFullYear())];
        this.selectedStatus='';
        this.timKiem();
    }

    geListYears() {
      this._serviceApi.execServiceLogin("3E0F3D82-66AE-4ABC-9FA7-B5C4B0355836", [{"name":"LOAI_TIM_KIEM","value":"PHEDUYET"}]).subscribe((data) => {
     
        let obj = {"id":'',"name":"Tất cả"}
        this.listYears.push(obj);
        if(data.data !=undefined && data.data.length >0){
           for(let i=0;i<data.data.length;i++){
               obj = {"id":''+data.data[i].id,"name":''+data.data[i].name}
               this.listYears.push(obj);
             }
        }
        // this.listYears = data.data || [];
        // let obj = {"id":"","name":"Tất cả"}
        // this.listYears.unshift(obj);
       
      })
    }


    onApiSelected(object: any): void {

    }

    addNew(): void {
        this.actionClick = 'THEMMOI';
    }
    lichsu(item){
      this._router.navigate(
          ['/nghiepvu/kehoach/dinhhuong'],
          { queryParams: { type: 'LICHSU',makehoach:item.maKeHoach } }
        );
     }
  
    listTongHop = [];
    checkTongHop(item){
       console.log(item);
       if(item.state != true){
        this.listTongHop.push(item)
       }else{
        this.listTongHop  = this.listTongHop.filter((c) => c.maKeHoach != item.maKeHoach);
       }
       
    }
     async tonghop(status) {
      let arr =this.listTongHop; // this.listDinhHuong.filter((c) => c.state == true);
      if(arr != undefined && arr.length != 0){
          this.addNew();
          // let listKeHoach = [];
          // let listFile = [];
          // if (arr != undefined && arr.length > 0) {
          //     for (let i = 0; i < arr.length; i++) {
          //         if (
          //             arr[i] != undefined &&
          //             arr[i].listKeHoach != undefined &&
          //             arr[i].listKeHoach.length > 0
          //         ) {
          //             for (let j = 0; j < arr[i].listKeHoach.length; j++) {
          //                 let chitiet = arr[i].listKeHoach[j];
          //                 chitiet.maDonVi = arr[i].maDonVi;
          //                 listKeHoach.push(arr[i].listKeHoach[j]);
          //             }
          //         }
          //         if( arr[i] != undefined &&
          //           arr[i].listFile != undefined &&
          //           arr[i].listFile.length > 0){
          //             for (let j = 0; j < arr[i].listFile.length; j++) {
          //               listFile.push(arr[i].listFile[j]);
          //           }
          //         }
          //     }
          // }
          // await this.delays(2000);

          // let kehoach = { listKeHoach: listKeHoach, capTao: 'TCT',listFile :listFile };
          this._serviceApi.dataTongHop.next(arr);
          //  setTimeout(function(){
          this._router.navigateByUrl(
              'nghiepvu/kehoach/pheduyetdinhhuong?type=' + status
          );
          // },100);
      } else {
          this._messageService.showErrorMessage("Thông báo", "Cần chọn bản đăng ký định hướng mới thực hiện được chức năng này!");
      }
  }

  delays(times) {
      return new Promise((resolve) => setTimeout(resolve, times));
  }

    checkAll(ev) {
      debugger;
        this.listDinhHuong.forEach(x => x.state = ev.target.checked);
        if(ev.target.checked){
          this.listTongHop = this.listDinhHuong;
          
        }else{
          this.listTongHop =[];
        }
       
      }

      isAllChecked() {
        return this.listDinhHuong.every(_ => _.state);
      }

    // getListDinhHuong() {
    //     this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("F217F0FD-B9AA-4ADC-9EDE-75717D8484FD", [{"name":"MA_TRANG_THAI","value":""},{"name":"NAM","value":(new Date()).getFullYear()},{"name":"ORGID","value":"115"}]).subscribe((data) => {
    //        console.log(data);
    //         this.listDinhHuong = data.data || [];
    //     })
    // }

    timKiem(){
        let nam ="";
         if(this.selectedYear != null && this.selectedYear.length >0 ){
            nam = this.selectedYear.join(',');
         }
        this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("038D4EB5-55D0-49C4-8FDB-C242E6759955", [{"name":"MA_TRANG_THAI","value":this.selectedStatus},{"name":"NAM_LIST","value":nam},{"name":"PAGE_NUM","value":this.pageIndex},{"name":"PAGE_ROW_NUM","value":this.pageSize}]).subscribe((data) => {
          this.listDinhHuong = data.data || [];
             if(data.data != null && data.data.length >0){
                this.length = data.data[0].totalPage;
             }

             if(this.listTongHop.length > 0){
              for( let i = 0; i < this.listDinhHuong.length; i++){
                   for(let j = 0; j < this.listTongHop.length;j++){
                          if( this.listTongHop[j].maKeHoach == this.listDinhHuong[i].maKeHoach){
                            this.listDinhHuong[i].state = true
                          }
                   }
              }
             }

         })
    }
    getUserLogin() {

            this._serviceApi.execServiceLogin("EEE8942F-F458-4B58-9B5C-4A0CEE3A75E8", [{"name":"USERID","value":"STR"}]).subscribe((data) => {
                this.userLogin = data.data || {};
            })

    }

    ngOnDestroy() {
        this.getDinhHuongSubcription.unsubscribe()
        //this.getYearSubscription.unsubscribe()
        //this.getStatusSubscription.unsubscribe()
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

}
