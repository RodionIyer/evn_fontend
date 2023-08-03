import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MessageService } from 'app/shared/message.services';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ActivatedRoute, Router } from '@angular/router';
import { State } from 'app/shared/commons/conmon.types';
import { FunctionService } from 'app/core/function/function.service';
import { ApiGiaoService } from '../giao.service';
import { ApiGiaoComponent } from '../giao.component';
import { ServiceService } from 'app/shared/service/service.service';
import { PageEvent } from '@angular/material/paginator';
import { ListdinhhuongService } from '../../dinhhuong/listdinhhuong.service';

@Component({
    selector: 'component-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ApiGiaoListComponent implements OnInit, OnDestroy {

    public selectedYear: number;
    public actionClick: string = null;
    public getYearSubscription: Subscription;
    public getGiaoSubcription: Subscription;
    public listYears = [];
    public listGiao = [];
    public selectedStatus: string;
    public getStatusSubscription: Subscription;
    public getPheDuyetSubcription: Subscription;
    public listStatus = [];
    public listPheDuyet = [];
    public checked;
    public getDinhHuongSubcription: Subscription;
    public listDinhHuong = [];
    public selectedGrid:String;


    /**
     * Constructor
     */
    constructor(
        public _nguonDuLieuComponent: ApiGiaoComponent,
        private _messageService: MessageService,
        private _userService: UserService,
        public _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _functionService: FunctionService,
        private el: ElementRef,
        private _serviceApi: ServiceService,
        private _listdinhhuongService: ListdinhhuongService,
    ) {
       
        this._activatedRoute.queryParams
        .subscribe(params => {
          
          if(params?.type){
            this.actionClick = params?.type
          }else{
            this.actionClick = null
            this.timKiem();
          }
        }
      
      );
     
    }

    ngOnInit() {

        this.actionClick = null;
        this._listdinhhuongService.getValueYear().subscribe((values: any) => {
            if (values){
                this.listYears = values;
                // this.listYears.push({"NAME":2024,"ID":2024});
                // this.listYears.push({"NAME":2025,"ID":2025})
            }
               
        })
        // this.getStatusSubscription = this._listdinhhuongService.getValueStatus().subscribe((values: any) => {
        //     if (values)
        //         this.listStatus = values;
        // })
        this.listStatus =[{"MA_TRANG_THAI":"","TEN_TRANG_THAI":"Tất cả"},
            {"MA_TRANG_THAI":"Y_CAU_HIEU_CHINH","TEN_TRANG_THAI":"Yêu cầu hiệu chỉnh"},
        {"MA_TRANG_THAI":"CHO_PHE_DUYET","TEN_TRANG_THAI":"Chờ phê duyệt"},
        {"MA_TRANG_THAI":"DA_PHE_DUYET","TEN_TRANG_THAI":"Đã duyệt"}]
        this.selectedYear =((new Date()).getFullYear());
        this.selectedStatus='';
        this.timKiem();
    }


    onApiSelected(object: any): void {

    }

    addNew(): void {
        this.actionClick = 'THEMMOI';
    }

    tonghop(status){
        this.addNew();
        this.selectedGrid="355B4604-D23D-4A64-8E24-B96085F0B0E4";
        this._router.navigateByUrl('nghiepvu/kehoach/pheduyetdinhhuong/'+this.selectedGrid+"?type="+status);
    }
    lichsu(item){
      this._router.navigate(
          ['/nghiepvu/kehoach/dinhhuong'],
          { queryParams: { type: 'LICHSU',makehoach:item.maKeHoach } }
        );
     }

    // getListDinhHuong() {
    //     this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("F217F0FD-B9AA-4ADC-9EDE-75717D8484FD", [{"name":"MA_TRANG_THAI","value":""},{"name":"NAM","value":(new Date()).getFullYear()},{"name":"ORGID","value":"115"}]).subscribe((data) => {
    //        console.log(data);
    //         this.listDinhHuong = data.data || [];
    //     })
    // }

    timKiem(){
        let nam =this.selectedYear;     
         this.selectedYear 
        this.getDinhHuongSubcription = this._serviceApi.execServiceLogin("CA665A17-3450-4C70-8CCE-6F1FD44E0999", [{"name":"NAM","value":""},{"name":"PAGE_NUM","value":this.pageIndex},{"name":"PAGE_ROW_NUM","value":this.pageSize}]).subscribe((data) => {
            this.listDinhHuong = data.data || [];
             if(data.data != null && data.data.length >0){
                this.length = data.data[0].totalPage;
             }
             
         })
    }


    ngOnDestroy() {
        this.getDinhHuongSubcription.unsubscribe()
      //  this.getYearSubscription.unsubscribe()
       // this.getStatusSubscription.unsubscribe()
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
