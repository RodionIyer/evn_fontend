import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MessageService } from 'app/shared/message.services';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ActivatedRoute, Router } from '@angular/router';
import { State } from 'app/shared/commons/conmon.types';
import { FunctionService } from 'app/core/function/function.service';
import { xetduyetService } from '../xetduyet.service';
import { XetDuyetComponent } from '../xetduyet.component';
import { ServiceService } from 'app/shared/service/service.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PopupFileComponent } from 'app/shared/component/popup-file/popup-filecomponent';
import { PopupConfirmComponent } from 'app/shared/component/popup-confirm/popup-confirmcomponent';
import { SnotifyToast } from 'ng-alt-snotify';

@Component({
    selector: 'component-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListItemComponent implements OnInit, OnDestroy {
    public selectedYear: number;
    public actionClick: string = null;
    public searchKeyword: string;
    public getYearSubscription: Subscription;
    public getGiaoSubcription: Subscription;
    public listYears = [];
    public listGiao = [];
    public listCapDo=[];
    public listDonVi = [];
    public donVi:String =null;
    public listTrangThai =[];
    public trangThai:string = null;
    public capDo:string =null;
    public ListFleDemo = [
        { id: 1, name: 'ten_file', kichthuoc: '20mb' },
        { id: 2, name: 'ten_file1', kichthuoc: '20mb' },
        { id: 3, name: 'ten_file2', kichthuoc: '20mb' },
    ];

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
        this._activatedRoute.queryParams.subscribe((params) => {

            if (params?.type) {
                this.actionClick = params?.type;
            } else {
                this.actionClick = null;
            }
            this.timKiem();
        });
    }

    ngOnInit(): void {
        this.geListYears();
        this.getListCapDoSK();
        this.getListTrangThai();
        this.getListDonvi();
       // this.getListDinhHuong();
        this.timKiem();
    }
    getListTrangThai() {
        this._serviceApi
            .execServiceLogin('F78D616F-CB41-46B3-A5A2-429E9F9C07AD', null)
            .subscribe((data) => {
                this.listTrangThai = data.data || [];
            });
    }

    getListDonvi() {
        this._serviceApi
            .execServiceLogin('176BC0B0-7431-47F0-A802-BEDF83E85261', null)
            .subscribe((data) => {
                this.listDonVi = data.data || [];
            });
    }


    getListCapDoSK() {
        this._serviceApi
            .execServiceLogin('825C8F49-51DE-417E-AACD-FBDB437346AB', null)
            .subscribe((data) => {
                this.listCapDo = data.data || [];
            });
    }

    geListYears() {
        this._serviceApi
            .execServiceLogin('E5050E10-799D-4F5F-B4F2-E13AFEA8543B', null)
            .subscribe((data) => {
                console.log(data);
                this.listYears = data.data || [];
            });
        this.selectedYear = null;
    }

    addNew(): void {
        this._router.navigate(['/nghiepvu/sangkien/lstsangkiencuatoi'], {
            queryParams: { type: 'THEMMOI' },
        });
    }
    timKiem() {
        const obj ={
            capDo:this.capDo,
            trangThai:this.trangThai,
            donVi:this.donVi,
            nam:this.selectedYear,
            q: this.searchKeyword,
        };
        this._serviceApi
            .execServiceLogin('45283A19-1068-4FEF-8357-89924E2A5D47', [
                { name: 'LOAI_TIM_KIEM', value: 'XETDUYET' },
                { name: 'TIM_KIEM', value: JSON.stringify(obj) },
                { name: 'PAGE_NUM', value: this.pageIndex },
                { name: 'PAGE_ROW_NUM', value: this.pageSize },
            ])
            .subscribe((data) => {
                this.listGiao = data.data || [];
                if(data.data != null && data.data.length >0){
                    this.length = data.data[0].totalPage;
                }

            });
    }
    lichsu(item) {
        this._router.navigate(
            ['/nghiepvu/sangkien/lstsangkiencuatoi/' + item.maSangKien],
            {
                queryParams: {
                    type: 'LICHSU',
                    title: 'LỊCH SỬ PHÊ DUYỆT, CẬP NHẬP ĐỊNH HƯỚNG ĐĂNG KÝ',
                },
            }
        );
    }

    ngOnDestroy() {
        // this.getYearSubscription.unsubscribe();
        // this.getGiaoSubcription.unsubscribe();
    }

    // getListDinhHuong() {
    //     this.getGiaoSubcription = this._serviceApi
    //         .execServiceLogin('E5050E10-799D-4F5F-B4F2-E13AFEA8543B', null)
    //         .subscribe((data) => {
    //             this.listGiao = data.data || [];
    //         });
    // }
    //phân trang
    length = 0;
    pageSize = 20;
    pageIndex = 0;
    pageSizeOptions = [10, 20, 50, 100];
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
                listFile: this.ListFleDemo,
            },
            width: '800px',
            panelClass: 'custom-PopupCbkh',
            position: {
                top: '100px',
            },
        });
    }

    detail(item) {
        this._router.navigate(
            ['/nghiepvu/sangkien/lstsangkiencuatoi/' + item.maSangKien],
            { queryParams: { type: 'CHITIET' } }
        );
    }

    editer(item) {
        this._router.navigate(
            ['/nghiepvu/sangkien/lstsangkiencuatoi/' + item.maSangKien],
            { queryParams: { type: 'CHINHSUA' } }
        );
    }

    updateActionHDXDCN(item) {
        this._router.navigate(
            ['/nghiepvu/sangkien/xetduyet/' + item.maSangKien],
            { queryParams: { type: 'updateActionHDXDCN' } }
        );
    }

    updateActionKQXDCN(item) {
        this._router.navigate(
            ['/nghiepvu/sangkien/xetduyet/' + item.maSangKien],
            { queryParams: { type: 'updateActionKQXDCN' } }
        );
    }

    updateActionKQ(item) {
        this._router.navigate(
            ['/nghiepvu/sangkien/xetduyet/' + item.maSangKien],
            { queryParams: { type: 'updateActionKQ' } }
        );
    }

    updateActionRaSoat(item) {
        this._router.navigate(
            ['/nghiepvu/sangkien/xetduyet/' + item.maSangKien],
            { queryParams: { type: 'updateActionRaSoat' } }
        );
    }

    xoa(item) {
        this._messageService.showConfirm(
            'Thông báo',
            'Bạn chắc chắn muốn xóa "' + item.tenGiaiPhap + '"',
            (toast: SnotifyToast) => {
                this._messageService.notify().remove(toast.id);
                this._serviceApi
                    .execServiceLogin('36A4A979-FDB3-4F60-8C5E-3B11EA084039', [
                        { name: 'MA_SANGKIEN', value: item.tenGiaiPhap },
                        { name: 'USERID', value: 'STR' },
                    ])
                    .subscribe((data) => {
                        switch (data.data) {
                            case 1:
                                this._messageService.showSuccessMessage(
                                    'Thông báo',
                                    'Xóa bản đăng ký thành công'
                                );
                                this.timKiem();
                                break;
                            case 0:
                                this._messageService.showErrorMessage(
                                    'Thông báo',
                                    'Không tìm thấy bản đăng ký cần xóa'
                                );
                                break;
                            case -1:
                                this._messageService.showErrorMessage(
                                    'Thông báo',
                                    'Xảy ra lỗi khi thực hiện xóa bản đăng ký'
                                );
                                break;
                        }
                    });
            }
        );
    }
}
