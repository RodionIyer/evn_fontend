import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, takeUntil } from 'rxjs';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    FormGroup,
    AbstractControl,
    Validators,
} from '@angular/forms';
import { MessageService } from 'app/shared/message.services';
import { SnotifyToast } from 'ng-alt-snotify';
import { State } from 'app/shared/commons/conmon.types';
import { BaseDetailInterface } from 'app/shared/commons/basedetail.interface';
import { UserService } from 'app/core/user/user.service';
import { BaseComponent } from 'app/shared/commons/base.component';
import { FunctionService } from 'app/core/function/function.service';
import { NghiemThuService } from '../nghiemthu.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ServiceService } from 'app/shared/service/service.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupCbkhComponent } from './popup-cbkh/popup-cbkh.component';

@Component({
    selector: 'component-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class DetailsComponent implements OnInit {
    public selectedYear: number;
    public getYearSubscription: Subscription;
    public listYears = [];
    public actionType = null;
    public method;
    public form: FormGroup;
    constructor(
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _messageService: MessageService,
        public _router: Router,
        private _serviceApi: ServiceService,
        public dialog: MatDialog
    ) {
        this._activatedRoute.queryParams.subscribe((params) => {
            if (params?.type) {
                this.actionType = params?.type;
            } else {
                this.actionType = null;
            }
            console.log(this.actionType);
            if (this.actionType == 'updateActionHSTN') {
                this.method = 'HDNGHIEMTHU';
            } else if (this.actionType == 'CHINHSUA') {
                this.method = 'HSNHIEMTHU';
            }
        });
    }

    ngOnInit(): void {
        this.geListYears();
    }

    initForm() {
        this.form = this._formBuilder.group({
            maDeTai: [null],
            method: [null],
            tenDeTai: [null, [Validators.required]],
            maTrangThai: [null],
            tenCapQuanLy: [null],
            isEmail: false,
            canCuThucHien: [null],
            keHoach: [null],
            capQuanLy: [null, [Validators.required]],
            vanBanChiDaoSo: [null],
            tenLinhVucNghienCuu: [null],
            linhVucNghienCuu: [],
            noiDungGuiMail: [null],
            noiDung: [null],
            keHoachTiepTheo: [null],
            dexuatKienNghi: [null],
            thang: [null],
            soLanGiaHan: [null],
            nam: new Date().getFullYear(),
            //LINHVUCNGHIENCUU: this._formBuilder.array([]),
            tenDonViChuTri: [null],
            donViChuTri: [null, [Validators.required]],
            thoiGianThucHienTu: [null, [Validators.required]],
            thoiGianThucHienDen: [null, [Validators.required]],

            chuNhiemDeTaiInfo: '',
            chuNhiemDeTai: [null, [Validators.required]],
            gioiTinh: 0,
            hocHam: [null],
            hocVi: [null],
            donViCongTac: [null],

            dongChuNhiemDeTaiInfo: '',
            dongChuNhiemDeTai: [null, [Validators.required]],
            gioiTinhDongChuNhiem: 0,
            hocHamDongChuNhiem: [null],
            hocViDongChuNhiem: [null],
            donViCongTacDongChuNhiem: [null],

            thuKyDeTaiInfo: '',
            thuKyDeTai: [null],
            gioiTinhThuKy: 0,
            hocHamThuKy: [null],
            hocViThuKy: [null],
            donViCongTacThuKy: [null],

            danhSachThanhVien: this._formBuilder.array([]),
            danhSachThanhVienHD: this._formBuilder.array([]),
            danhSachThanhVienHDXT: this._formBuilder.array([]),
            tenNguonKinhPhi: [null],
            nguonKinhPhi: [null, [Validators.required]],
            tongKinhPhi: [null, [Validators.required]],
            phuongThucKhoanChi: [null],
            kinhPhiKhoan: [null],
            kinhPhiKhongKhoan: [null],

            tinhCapThietCuaDeTaiNhiemVu: [null],
            mucTieu: [null],
            nhiemVuVaPhamViNghienCuu: [null],
            ketQuaDuKien: [null],
            kienNghiDeXuat: [null],

            listFolderFile: this._formBuilder.array([]),

            listFolderFileThucHien: this._formBuilder.array([]),
            listFolderFileTamUng: this._formBuilder.array([]),
            listTienDoCongViec: this._formBuilder.array([]),
            listHDXD: this._formBuilder.array([]),
            listHDNT: this._formBuilder.array([]),
            listFolderHSDK: this._formBuilder.array([]),
            listFolderHSXD: this._formBuilder.array([]),
            listFolderBanGiao: this._formBuilder.array([]),
            listFolderQuyetToan: this._formBuilder.array([]),
            listFolderHSNT: this._formBuilder.array([]),

            // listFile1: this._formBuilder.array([]),
            // listFile2: this._formBuilder.array([]),
            // listFile3: this._formBuilder.array([]),
            // listFile4: this._formBuilder.array([]),
            // listFile5: this._formBuilder.array([]),
            // listFile6: this._formBuilder.array([]),
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    geListYears() {
        this.getYearSubscription = this._serviceApi
            .execServiceLogin('E5050E10-799D-4F5F-B4F2-E13AFEA8543B', null)
            .subscribe((data) => {
                this.listYears = data.data || [];
            });
    }

    openAlertDialog() {
        this.dialog.open(PopupCbkhComponent, {
            data: {
                message: 'HelloWorld',
                buttonText: {
                    cancel: 'Done',
                },
            },
            width: '800px',
            panelClass: 'custom-PopupCbkh',
            position: {
                top: '100px',
            },
        });
    }

    onSubmit() {
        console.log(this.form.value);
    }
}
