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
import { lstdetaicuatoiService } from '../lstdetaicuatoi.service';
import { LstdetaicuatoiComponent } from '../lstdetaicuatoi.component';
import { ServiceService } from 'app/shared/service/service.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PopupFileComponent } from 'app/shared/component/popup-file/popup-filecomponent';
import { SnotifyToast } from 'ng-alt-snotify';

@Component({
    selector: 'component-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class LstdetaicuatoiListComponent implements OnInit, OnDestroy {
    public selectedYear: number;
    public actionClick: string = null;
    public getYearSubscription: Subscription;
    public getGiaoSubcription: Subscription;
    public listYears = [];
    public txtSeach: String = '';
    public listGiao = [];
    public ListFleDemo = [
        { id: 1, name: 'ten_file', kichthuoc: '20mb' },
        { id: 2, name: 'ten_file1', kichthuoc: '20mb' },
        { id: 3, name: 'ten_file2', kichthuoc: '20mb' },
    ];
    public name: '';

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
        console.log('wwwwwwwwww');
        this.geListYears();
        this.timKiem();
    }

    geListYears() {
        this.getYearSubscription = this._serviceApi
            .execServiceLogin('E5050E10-799D-4F5F-B4F2-E13AFEA8543B', null)
            .subscribe((data) => {
                this.listYears = data.data || [];
            });
    }

    addNew(): void {
        this._router.navigate(['/nghiepvu/detainhiemvu/lstdetaicuatoi'], {
            queryParams: { type: 'THEMMOI' },
        });
    }

    ngOnDestroy() {
        this.getYearSubscription.unsubscribe();
        this.getGiaoSubcription.unsubscribe();
    }

    timKiem() {
        this.getGiaoSubcription = this._serviceApi
            .execServiceLogin('00249219-4EE7-466D-BD84-269064AC9D9B', [
                { name: 'TEN_DETAI', value: this.txtSeach },
                { name: 'PAGE_NUM', value: this.pageIndex },
                { name: 'PAGE_ROW_NUM', value: this.pageSize },
            ])
            .subscribe((data) => {
                this.listGiao = data.data || [];
                if (this.listGiao != null && this.listGiao.length > 0) {
                    this.length = this.listGiao[0].totalPage;
                }
            });
    }

    onChange() {
        return this.name;
    }
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

    lichsu(item) {
        this._router.navigate(
            ['/nghiepvu/detainhiemvu/lstdetaicuatoi/' + item.maDeTai],
            { queryParams: { type: 'LICHSU' } }
        );
    }

    updateActionHSTH(item) {
        this._router.navigate(
            ['/nghiepvu/detainhiemvu/lstdetaicuatoi/' + item.maDeTai],
            { queryParams: { type: 'updateActionHSTH' } }
        );
    }
    updateActionHSNT(item) {
        this._router.navigate(
            ['/nghiepvu/detainhiemvu/lstdetaicuatoi/' + item.maDeTai],
            { queryParams: { type: 'updateActionHSNT' } }
        );
    }

    updateActionHSQT(item) {
        this._router.navigate(
            ['/nghiepvu/detainhiemvu/lstdetaicuatoi/' + item.maDeTai],
            { queryParams: { type: 'updateActionHSQT' } }
        );
    }
    updateActionTIENDO(item) {
        this._router.navigate(
            ['/nghiepvu/detainhiemvu/lstdetaicuatoi/' + item.maDeTai],
            { queryParams: { type: 'TIENDO' } }
        );
    }

    editer(item) {
        this._router.navigate(
            ['/nghiepvu/detainhiemvu/lstdetaicuatoi/' + item.maDeTai],
            {
                queryParams: {
                    type: 'CHINHSUA',
                    screen: '/nghiepvu/detainhiemvu/lstdetaicuatoi/',
                },
            }
        );
    }
    detail(item) {
        this._router.navigate(
            ['/nghiepvu/detainhiemvu/lstdetaicuatoi/' + item.maDeTai],
            { queryParams: { type: 'CHITIET' } }
        );
    }

    xoa(item) {
        this._messageService.showConfirm(
            'Thông báo',
            'Bạn chắc chắn muốn xóa "' + item.tenDeTai + '"',
            (toast: SnotifyToast) => {
                this._messageService.notify().remove(toast.id);
                this._serviceApi
                    .execServiceLogin('9A2E2C8E-72F8-41E1-BEF7-A14E4FF5DF62', [
                        { name: 'MA_DE_TAI', value: item.maDeTai },
                        { name: 'USERID', value: 'STR' },
                    ])
                    .subscribe((data) => {
                        console.log(data);
                        switch (data.status) {
                            case 1:
                                this._messageService.showSuccessMessage(
                                    'Thông báo',
                                    'Xóa bản đăng ký thành công'
                                );
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
