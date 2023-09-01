import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subject, Subscription, takeUntil} from 'rxjs';
import {MessageService} from 'app/shared/message.services';
import {UserService} from 'app/core/user/user.service';
import {User} from 'app/core/user/user.types';
import {ActivatedRoute, Router} from '@angular/router';
import {State} from 'app/shared/commons/conmon.types';
import {FunctionService} from 'app/core/function/function.service';
import {lstdetaicuatoiService} from '../tracuu-timkiem.service';
import {TracuuTimKiemComponent} from '../tracuu-timkiem.component';
import {ServiceService} from 'app/shared/service/service.service';
import {PageEvent} from '@angular/material/paginator';
import {MatDialog} from '@angular/material/dialog';
import {PopupFileComponent} from 'app/shared/component/popup-file/popup-filecomponent';

@Component({
    selector: 'component-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListItemComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public selectedYear=new Date().getFullYear();
    public actionClick: string = null;
    public getYearSubscription: Subscription;
    public getGiaoSubcription: Subscription;
    public listYears = [];
    public listGiao = [];
    public listHoatDongKHCN = [];
    public hoatDongKhCN: String =null;
    public listLinhVucNghienCuu = [];
    public linhVucNghienCuu: [];
    public listCapQuanLy = [];
    public capQuanLy: String = null;
    public tenDeTaiSK: String = null;
    public tenChuNhiemTG: String = null;
    public ListFleDemo = [
        {id: 1, name: 'ten_file', kichthuoc: '20mb'},
        {id: 2, name: 'ten_file1', kichthuoc: '20mb'},
        {id: 3, name: 'ten_file2', kichthuoc: '20mb'}
    ];
    public listData = [];

    /**
     * Constructor
     */
    constructor(
        private _messageService: MessageService,
        private _userService: UserService,
        public _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _functionService: FunctionService,
        private el: ElementRef,
        private _serviceApi: ServiceService,
        public dialog: MatDialog
    ) {

        this._activatedRoute.queryParams
            .subscribe(params => {
                    if (params?.type) {
                        this.actionClick = params?.type
                    } else {
                        this.actionClick = null
                    }
                    console.log(this.actionClick);
                    this.timKiem();
                }
            );
    }

    ngOnInit(): void {
        this.geListYears();
        this.getlistHoatDongKHCN();
        this.getListLinhVucNghienCuu();
        this.getListCapQuanLy()
    }

    getListCapQuanLy() {
        this._serviceApi
            .execServiceLogin('2977F0EA-A6C6-4A32-A36B-8617898B710D', null)
            .subscribe((data) => {
                console.log(data.data);
                this.listCapQuanLy = data.data || [];
               let obj ={ NAME:"Tất cả",ID:''}
                this.listCapQuanLy.unshift(obj);
            });
    }

    getlistHoatDongKHCN() {
        this.listHoatDongKHCN = [
            {"id": "", "name": "Tất cả"},
            {"id": "DETAI", "name": "Đề tài NCKH"},
            {"id": "SANGKIEN", "name": "Sáng kiến"}
        ];
    }

    getListLinhVucNghienCuu() {
        this._serviceApi
            .execServiceLogin('FF1D2502-E182-4242-A754-BCCC29B70C61', null)
            .subscribe((data) => {
                console.log(data.data);
                this.listLinhVucNghienCuu = data.data || [];
                let obj ={ NAME:"Tất cả",ID:''}
                this.listLinhVucNghienCuu.unshift(obj);
            });
    }

    geListYears() {
        var obj = {NAME: '', ID: 0};
        var year = new Date().getFullYear();
        var yearStart = 2023;
        var yearEnd = new Date().getFullYear() + 2;
        for (let i = yearStart; i <= yearEnd; i++) {
            obj = {NAME: i+'', ID: i};
            this.listYears.push(obj);
        }
        obj ={ NAME:"Tất cả",ID:null}
        this.listYears.unshift(obj);
    }


    addNew(): void {
        this._router.navigate(
            ['/nghiepvu/sangkien/lstsangkiencuatoi'],
            {queryParams: {type: 'THEMMOI'}}
        );
    }

    ngOnDestroy() {
        // this.getYearSubscription.unsubscribe()
        // this.getGiaoSubcription.unsubscribe();
    }

    getListDinhHuong() {
        this.getGiaoSubcription = this._serviceApi.execServiceLogin("E5050E10-799D-4F5F-B4F2-E13AFEA8543B", null).subscribe((data) => {
            this.listGiao = data.data || [];
     
            if(this.listGiao  != null && this.listGiao.length >0 ){
                this.length = this.listGiao[0].totalPage;
            }
        })
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

    // mo popup file
    openAlertDialog() {
        this.dialog.open(PopupFileComponent, {
            data: {
                listFile: this.ListFleDemo
            },
            width: '800px',
            panelClass: 'custom-PopupCbkh',
            position: {
                top: '100px',
            }
        });
    }

    detail(item?) {
        if (item.loaiDeTaiSK == 'DETAI') {
            this._router.navigate(
                ['/nghiepvu/detainhiemvu/lstdetaicuatoi/' + item.maDeTaiSK],
                {queryParams: {type: 'CHITIET'}}
            );
        } else if (item.loaiDeTaiSK == 'SANGKIEN') {
            this._router.navigate(
                ['/nghiepvu/sangkien/lstsangkiencuatoi/' + item.maDeTaiSK],
                {queryParams: {type: 'CHITIET', screen: "/nghiepvu/sangkien/lstsangkiencuatoi/"}}
            );
        }
        // this._router.navigate(
        //     ['/nghiepvu/tracuu/tracuu-timkiem/' + item.maDeTaiSK],
        //     {queryParams: {type: 'CHITIET', screen: "/nghiepvu/tracuu/tracuu-timkiem/"}}
        // );
    }

    editer(item) {
        this._router.navigate(
            ['/nghiepvu/sangkien/lstsangkiencuatoi'],
            {queryParams: {type: 'CHINHSUA'}}
        );
    }

    timKiem() {
        let obj = {
            hoatDongKhCN: this.hoatDongKhCN,
            linhVucNghienCuu: this.linhVucNghienCuu,
            capQuanLy: this.capQuanLy,
            nam: this.selectedYear,
            tenDeTaiSK: this.tenDeTaiSK,
            tenChuNhiemTG: this.tenChuNhiemTG
        }
        this._serviceApi.execServiceLogin("63912FAF-0865-4E94-BDBB-6048F2D720C9", [{
            "name": "TIM_KIEM",
            "value": JSON.stringify(obj)
        }, {"name": "PAGE_NUM", "value": this.pageIndex}, {
            "name": "PAGE_ROW_NUM",
            "value": this.pageSize
        }]).subscribe((data) => {
            this.listData = data.data || [];
            if (data.data != null && data.data.length > 0) {
                this.length = data.data[0].totalPage;
            }
        })
    }

}
