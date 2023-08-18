import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ServiceService} from 'app/shared/service/service.service';
import {take, map, takeUntil, Subject, forkJoin} from 'rxjs';
import {CapnhatnguoilamkhoahocService} from './capnhatnguoilamkhoahoc.service';
import {ListNguoiThucHienService} from '../listnguoithuchien/listnguoithuchien.service';
import {
    ListNguoiThucHienDetailsInputComponent
} from '../listnguoithuchien/detail/details-input/details-input.component';
import {MessageService} from 'app/shared/message.services';
import {State} from "../../../shared/commons/conmon.types";

@Component({
    selector: 'app-capnhatnguoilamkhoahoc',
    templateUrl: './capnhatnguoilamkhoahoc.component.html',
    styleUrls: ['./capnhatnguoilamkhoahoc.component.scss'],
})
export class CapnhatnguoilamkhoahocComponent implements OnInit {
    id;
    obj: any;
    listHocHam: any[];
    listHocVi: any[];
    listLvucNcuu: any[];
    listTrinhDo: any[];
    public _unsubscribeAll: Subject<any> = new Subject<any>();
    isOk1: boolean = false;
    isOk2: boolean = false;
    confirmToEditValue: boolean = false;
    @ViewChild('checkBox') checkBox;
    @ViewChild(ListNguoiThucHienDetailsInputComponent)
    input: ListNguoiThucHienDetailsInputComponent;

    constructor(
        public _serviceService: ServiceService,
        private _router: Router,
        private _capnhatnguoilamkhoahocService: CapnhatnguoilamkhoahocService,
        private _listNguoiThucHienService: ListNguoiThucHienService,
        public _messageService: MessageService
    ) {
    }

    async ngOnInit() {
        let token_link =
            this._router.url.split('/')[this._router.url.split('/').length - 1];

        this._listNguoiThucHienService
            .getListHocHam()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any) => {
                this.listHocHam = data.data;
            });

        this._listNguoiThucHienService
            .getListHocVi()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any) => {
                this.listHocVi = data.data;
            });

        this._listNguoiThucHienService
            .getListLvucNCuu()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any) => {
                this.listLvucNcuu = data.data;
            });

        this._listNguoiThucHienService
            .getListTrinhDo()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any) => {
                this.listTrinhDo = data.data;
            });

        this._capnhatnguoilamkhoahocService
            .getObjfromServer(token_link)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this._listNguoiThucHienService
                    .getObjectfromServer(res.data)
                    .pipe(take(1))
                    .subscribe((_res) => {
                        this.obj = _res.data;
                        let sources = [];
                        sources.push(
                            this._listNguoiThucHienService.getLinhVucNghienCuuById(
                                res.data
                            )
                        );
                        sources.push(
                            this._listNguoiThucHienService.getListQuaTrinhDaoTaoFromServer(
                                res.data
                            )
                        );
                        sources.push(
                            this._listNguoiThucHienService.getListDeTaiFromServer(
                                res.data
                            )
                        );
                        sources.push(
                            this._listNguoiThucHienService.getListCongTrinhApDungFromServer(
                                res.data
                            )
                        );
                        sources.push(
                            this._listNguoiThucHienService.getListCongTrinhFromServer(
                                res.data
                            )
                        );
                        sources.push(
                            this._listNguoiThucHienService.getListVanBangFromServer(
                                res.data
                            )
                        );
                        sources.push(
                            this._listNguoiThucHienService.getListGiaiThuongFromServer(
                                res.data
                            )
                        );
                        sources.push(
                            this._listNguoiThucHienService.getListQuaTrinhCongTacFromServer(
                                res.data
                            )
                        );
                        forkJoin(sources).subscribe((res: any) => {
                            let apiLinhVucNghienCuu: any[] = [];
                            if (res[0] && res[0].status == 1 && res[0].data.length > 0) {
                                res[0].data.forEach((itemInput: any) => {
                                    apiLinhVucNghienCuu.push({
                                        MA_LVUC_NCUU: itemInput.MA_LVUC_NCUU,
                                        TEN_LVUC_NCUU: itemInput.TEN_LVUC_NCUU
                                    });
                                })
                            }
                            this.obj.LVUC_NCUU_LST = apiLinhVucNghienCuu;
                            this.obj.listQuaTrinhDaoTao = res[1].data;
                            this.obj.listDeTai = res[2].data;
                            this.obj.listCongTrinhApDung = res[3].data;
                            this.obj.listCongTrinh = res[4].data;
                            this.obj.listVanBang = res[5].data;
                            this.obj.listGiaiThuong = res[6].data;
                            this.obj.listQuaTrinhCongTac = res[7].data;
                            this.obj.SYS_ACTION = State.edit;
                            this.isOk1 = true;
                            this._listNguoiThucHienService._object.next(this.obj);
                        });
                        this.isOk2 = true;
                    });
            });
    }

    confirmToEdit() {
        this.confirmToEditValue = !this.confirmToEditValue;
    }

    onSaveObject() {
        let value = this.input.onSaveObject();
        if (value) {
            let listData: any = {};
            for (let x in this.obj) {
                if (Array.isArray(this.obj[x])) {
                    listData[x] = this.obj[x];
                }
            }
            this._capnhatnguoilamkhoahocService
                .editObjectToServer(this.obj, listData, value)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    switch (result) {
                        case 0:
                            this._messageService.showErrorMessage(
                                'Thông báo',
                                'Xảy ra lỗi khi thực hiện'
                            );
                            break;
                        case 100:
                            this._messageService.showWarningMessage(
                                'Thông báo',
                                'Đã ghi dữ liệu thành công, tuy nhiên một số cột không thể xóa do đã được sử dụng'
                            );
                            break;
                        case -1:
                            this._messageService.showErrorMessage(
                                'Thông báo',
                                'Không tìm thấy người dùng hoặc không được phép thực hiện'
                            );
                            break;
                        case -2:
                            this._messageService.showErrorMessage(
                                'Thông báo',
                                'Dữ liệu nhập không đúng'
                            );
                            break;
                        case 1:
                            this._messageService.showSuccessMessage(
                                'Thông báo',
                                'Ghi dữ liệu thành công'
                            );
                            this.confirmToEditValue = false;
                            this.checkBox.checked = false;

                            break;
                        default:
                            this._messageService.showErrorMessage(
                                'Thông báo',
                                'Xảy ra lỗi khi thực hiện'
                            );
                            break;
                    }
                });
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
