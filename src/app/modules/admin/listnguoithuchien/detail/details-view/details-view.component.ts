import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FunctionService} from 'app/core/function/function.service';
import {UserService} from 'app/core/user/user.service';
import {BaseComponent} from 'app/shared/commons/base.component';
import {MessageService} from 'app/shared/message.services';
import {DateAdapter} from '@angular/material/core';
import {ServiceService} from 'app/shared/service/service.service';
import {takeUntil} from "rxjs";
import {ListNguoiThucHienService} from "../../listnguoithuchien.service";

@Component({
    selector: 'details-view',
    templateUrl: './details-view.component.html',
    styleUrls: ['./details-view.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class ListNguoiThucHienDetailsViewComponent
    extends BaseComponent
    implements OnInit, OnDestroy {
    obj: any;
    listHocHam: any[];
    listHocVi: any[];
    listLvucNcuu: any[];
    listTrinhDo: any[];

    quaTrinhDaoTaoColumns: string[] = [
        'HOC_VI',
        'NOI_DAO_TAO',
        'CHUYEN_MON',
        'NAM_TOT_NGHIEP',
    ];

    quaTrinhCongTacColumns: string[] = [
        'THOI_GIAN',
        'VI_TRI_CONG_TAC',
        'TO_CHUC_CONG_TAC',
        'DIA_CHI_TO_CHUC',
    ];

    congTrinhChuYeuColumns: string[] = [
        'TEN_CONG_TRINH',
        'TGIA_DTGIA',
        'NOI_CONG_BO',
        'NAM_CONG_BO',
    ];

    congTrinhApDungColumns: string[] = [
        'TEN_CONG_TRINH',
        'NOI_DUNG_AP_DUNG',
        'THOI_GIAN',
    ];

    vanBangChuYeuColumns: string[] = ['NOI_DUNG_VAN_BANG', 'NAM_CAP_VAN_BANG'];

    deTaiColumns: string[] = [
        'TEN_DE_TAI',
        'THOI_GIAN',
        'THUOC_CHUONG_TRINH',
        'TINH_TRANG_DE_TAI',
    ];

    giaiThuongColumns: string[] = ['NOI_DUNG_GIAI_THUONG', 'NAM_GIAI_THUONG'];

    constructor(
        private _listUserService: ListNguoiThucHienService,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        public _functionService: FunctionService,
        public _userService: UserService,
        public _messageService: MessageService,
        private dateAdapter: DateAdapter<Date>,
        public _serviceService: ServiceService
    ) {
        super(
            _activatedRoute,
            _router,
            _functionService,
            _userService,
            _messageService
        );
        this.dateAdapter.setLocale('en-GB');
    }

    ngOnInit(): void {
        super.ngOnInit();
        this._listUserService.ObjectListHocHam$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((data: any[]) => {
            this.listHocHam = data;
        });

        this._listUserService.ObjectListHocVi$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((data: any[]) => {
            this.listHocVi = data;
        });

        this._listUserService.ObjectListLvucNCuu$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((data: any[]) => {
            this.listLvucNcuu = data;
        });

        this._listUserService.ObjectListTrinhDo$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((data: any[]) => {
            this.listTrinhDo = data;
        });

        this._listUserService.Object$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((obj: any) => {
            this.obj = obj;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    getTenHocVi(MA_HOC_VI): any {
        this.listHocVi?.forEach((_value) => {
            if (_value.MA_HOC_VI == MA_HOC_VI) {
                return _value.TEN_HOC_VI;
            }
        });
    }

    formatDate(ts): any {
        if (!ts) return '';
        let dd = new Date(ts).getDate();
        let mm = new Date(ts).getMonth();
        let yyyy = new Date(ts).getFullYear();
        return dd + '/' + (mm + 1) + '/' + yyyy;
    }
}
