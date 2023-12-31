import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription, takeUntil, timeout, Subject} from 'rxjs';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {MessageService} from 'app/shared/message.services';
import {SnotifyToast} from 'ng-alt-snotify';
import {State} from 'app/shared/commons/conmon.types';
import {BaseDetailInterface} from 'app/shared/commons/basedetail.interface';
import {UserService} from 'app/core/user/user.service';
import {BaseComponent} from 'app/shared/commons/base.component';
import {FunctionService} from 'app/core/function/function.service';
import {lstdetaicuatoiService} from '../lstdetaicuatoi.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ServiceService} from 'app/shared/service/service.service';
import {MatDialog} from '@angular/material/dialog';
import {PopupCbkhComponent} from './popup-cbkh/popup-cbkh.component';
import {ArrayValidators} from 'app/shared/array.validator';
import { User } from 'app/core/user/user.types';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MomentDateAdapter,
} from '@angular/material-moment-adapter';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import {MatDatepicker} from '@angular/material/datepicker';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'component-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },

        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
})
export class LstdetaicuatoiDetailsComponent implements OnInit {
    public selectedYear: number;
    public getYearSubscription: Subscription;
    public listYears = [];
    public listCapQuanLy = [];
    public listDonViChuTri = [];
    public listGioiTinh = [];
    public listHocHam = [];
    public listHocVi = [];
    public listDonViCongTac = [];
    public listNguonKinhPhi = [];
    public listKhoanChi = [];
    public listChucDanh = [];
    submitted = {check: false, checkFile:false};

    public actionType: string = null;
    public form: FormGroup;
    public title_lichsu;
    public selectedLinhVucNghienCuu: [];
    public listLinhVucNghienCuu;
    public listFolderFile: [{ TEN_LOAI_FILE: '',maFolder:String,fileName:'' , listFile: [] }];
    public method;
    public listTrangThai = [];
    public listThang = [];
    public listNam = [];
    public idParam: string = null;
    public screen;
    public lanGiaHanThu;
    public screentype;
    public madeTaiSK;
    public typeLichSu;
    public listKetQuaNT=[];
    user: User;
    public listRole=[];
    public checkDOffice = false;
    public linkDoffice = "";
    public checkChuNhiem = true;
    public listMaFolder = ['HOSO_DANG_KY', 'DE_NGHI_TAM_UNG'];
    public listMaFolder2 = [
        'KHCN BCAO_THINH_THIEN',
        'BANG_XNHAN_KHOI_LUONG',
        'BANG_CTIET_KINH_PHI',
        'SPHAM_TUONG_UNG',
        'TTU_THANH_TOAN',
    ];
    public listMaFolderNhiemThu1 = [
        'BSAO_HOP_DONG_THUC_HIEN',
        'BCAO_THOP_KET_QUA',
        'BCAO_TOM_TAT_KET_QUA',
        'VBAN_XAC_NHAN',
        'BCAO_THINH_SDUNG',
        'BCAO_THOP_SANPHAM',
        'VBAN_BCAO_HTHIEN_KQUA',
        'THOP_BAOCAO_THIEN',
    ];
    public listMaFolderNhiemThu2 = [
        'BCAO_KQUA_THEO_BB_NTHU',
        'TBI_LTRU_KQUA_THIEN',
    ];
    public listMaFolderQuyetToan = [
        'CTU_HDON',
        'QDINH_CNHAN',
        'BBAN_GIAO_LUUTRU',
        'HDON_THUE_TNCN',
    ];
    lstDanhSachThanhVienHD : any[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public nguoiSua : any;
    public nguoiTao : any;
    public ngayTao : any;
    public orgid : any;

    constructor(
        private _formBuilder: FormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _messageService: MessageService,
        public _router: Router,
        private _serviceApi: ServiceService,
        private _userService: UserService,
        public dialog: MatDialog
    ) {
        this.initForm();
        this.idParam = this._activatedRoute.snapshot.paramMap.get('id');
        this._activatedRoute.queryParams.subscribe((params) => {
            if (params?.type) {
                this.actionType = params?.type;
            } else {
                this.actionType = null;
            }
            if (params?.screen) {
                this.screen = params?.screen;
            }
            if (params?.screentype) {
                this.screentype = params?.screentype;
            }
            if (params?.title) {
                this.title_lichsu = params?.title;
            }
            if (this.actionType == 'updateActionHSTH') {
                this.method = 'CAPNHATHSTHUCHIEN';
            } else if (this.actionType == 'TIENDO') {
                this.method = 'BAOCAOTIENDO'; // BÁO CÁO TIẾN ĐỘ THỰC HIỆN ĐỊNH KỲ
            } else if (this.actionType == 'CHINHSUA') {
                this.method = 'CAPNHAT'; // cap nhat, them moi
            } else if (this.actionType == 'updateActionHSQT') {
                this.method = 'HSQTOAN'; // CẬP NHẬP HỒ SƠ THANH QUYẾT TOÁN
                this.f
            } else if (this.actionType == 'updateActionHSNT') {
                this.method = 'HSNHIEMTHU'; //  CẬP NHẬP HỒ SƠ NGHIỆM THU
            } else {
                this.method = 'DETAIL';
            }
            if (
                this.idParam != undefined &&
                this.idParam != '' &&
                this.idParam != null
            ) {
                this.madeTaiSK = this.idParam;
                this.typeLichSu = 'DETAI';

                this.detail(this.method);
                console.log(this.form)
            }
        });
    }


    initForm() {
        this.form = this._formBuilder.group({
            lanGiaHanThu:[null],
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
            thoiGianThucHienTu: [moment(), [Validators.required]],
            thoiGianThucHienDen: [moment(), [Validators.required]],

            chuNhiemDeTaiInfo: null,
            chuNhiemDeTai: [null, [Validators.required]],
            gioiTinh: 0,
            hocHam: [null],
            hocVi: [null],
            donViCongTac: [null],

            dongChuNhiemDeTaiInfo: null,
            dongChuNhiemDeTai: [null, [Validators.required]],
            gioiTinhDongChuNhiem: 0,
            hocHamDongChuNhiem: [null],
            hocViDongChuNhiem: [null],
            donViCongTacDongChuNhiem: [null],

            thuKyDeTaiInfo: null,
            thuKyDeTai: [null],
            gioiTinhThuKy: 0,
            hocHamThuKy: [null],
            hocViThuKy: [null],
            donViCongTacThuKy: [null],

            danhSachThanhVien: this._formBuilder.array([]),
            danhSachThanhVienHD: this._formBuilder.array([]),
            danhSachThanhVienHDXT: this._formBuilder.array([]),
            danhSachThanhVienHDNT: this._formBuilder.array([]),
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
            listKQXD: this._formBuilder.array([]),
            listKQNT: this._formBuilder.array([]),
            thoiGianHopNT:[null],
            ketQuaPhieuDanhGiaNT:[null],
            lyDoNT:[null],
            diaDiemNT:[null],
            tongPhiQT:[null],
            maKetQuaNhiemThu:[null],
            tonTaiKhacPhucNghiemThu:[null],
            diemNghiemThu:[null],
            tenTrangThai:[null],
            maKeHoachChiTiet:[null],
            maKeHoach:[null],
            vaiTro:[null]
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

    setMonthAndYear(
        normalizedMonthAndYear: Moment,
        datepicker: MatDatepicker<Moment>,
        name
    ) {
        const ctrlValue = this.form.get(name).value!;
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        this.form.get(name).setValue(ctrlValue);
        datepicker.close();
    }

    ngOnInit(): void {
        this.getCheckQuyenDoffice();
        this.lstDanhSachThanhVienHD = [];
        if (this.actionType == 'updateActionHSTH') {
            this.getListTrangThaiHSThucHien();
        } else if (this.actionType == 'updateActionHSQT') {
            this.getListTrangThaiQuyetToan();
        } else if (this.actionType == 'updateActionHSNT' && this.screentype == 'nghiemthu') {
            this.getListTrangThaiHSNT();
        }
        this.getThang();
        this.getNam();
        if (this.actionType == 'THEMMOI') {
            this.getListFolderFile();
            this.checkAddMember();
        }
        this.getListCapQuanLy();
        this.getListDonViChuTri();
        this.getListHocHam();
        this.getListHocVi();
        this.getListNguonKinhPhi();
        this.getListKhoanChi();
        this.getListLinhVucNghienCuu();
        this.getListGioiTinh();
        this.getListChucDanh();
        if(this.method == 'DETAIL'){
            this.getListTrangThaiAll();
            this.getListKQNT();
      
        }
     
        
    }

    getListKQNT() {
        this._serviceApi
            .execServiceLogin('E8796F41-0A24-47F4-A063-303F8C21EB1C', null)
            .subscribe((data) => {
           
                this.listKetQuaNT = data.data || [];
            });
    }

    getCheckQuyenDoffice() {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
                this.orgid ==user.ORGID;
                if(this.user != undefined && this.user != null && user.roles.length >0){
                    this.listRole = user.roles.map(item => {
                        return item.ROLECODE;
                    });
                }
                this._serviceApi.execServiceLogin("3FADE0E4-B2C2-4D9D-A0C7-06817ADE4FA3", [{ "name": "ORGID", "value": user.ORGID }]).subscribe((data) => {
                    if (data.data.API_DOFFICE) {
                        this.checkDOffice = true;
                        this.linkDoffice = data.data.API_DOFFICE;
                    }
                })
            });

    }

    getThang() {
        this.listThang = [];
        for (var i = 1; i <= 12; i++) {
            this.listThang.push({ID: i, NAME: i});
        }
    }

    fomatMoney(data) {
        let a = +(data);
        return new Intl.NumberFormat('en-US').format(a)
    }

    getNam() {
        this.listNam = [];
        var obj = {NAME: 0, ID: 0};
        var year = new Date().getFullYear();
        var yearStart = year - 4;
        var yearEnd = yearStart + 10;
        for (let i = yearStart; i <= yearEnd; i++) {
            obj = {NAME: i, ID: i};
            this.listNam.push(obj);
        }
        //this.selectedN = (new Date()).getFullYear();
    }

    addListDocParent(item?: any) {
        let ngaySua = item?.ngaySua;
        if (ngaySua) {
            ngaySua = new Date(ngaySua);
        }else{
            ngaySua =null;
        }
        let ngayVanBan = item?.ngayVanBan;
        if (ngayVanBan) {
            ngayVanBan = new Date(ngayVanBan);
        }else{
            ngayVanBan =null;
        }
        return this._formBuilder.group({
            fileName: item?.fileName || null,
            maFolder: item?.maFolder || null,
            listFile: this._formBuilder.array([]),
            ghiChu: item?.ghiChu,
            nguoiSua: item?.nguoiSua,
            ngaySua: ngaySua,
            nguoiCapnhap:item?.nguoiSua,
            sovanban: item?.sovanban || null,
            ngayVanBan: ngayVanBan || null,
        });
    }

    addListDocChild(item?: any) {
        return this._formBuilder.group({
            fileName: item?.fileName || null,
            base64: item?.base64 || null,
            size: item?.size || 0,
            sovanban: item?.sovanban || null,
            mafile: item?.mafile || null,
            maFolder: item?.maFolder || null,
            tenFolder: item?.tenFolder || null,
        });
    }

    detail(method) {

        this.getListDangNhap();
        this._serviceApi
            .execServiceLogin('F360054F-7458-443A-B90E-50DB237B5642', [
                {name: 'MA_DE_TAI', value: this.idParam},
                {name: 'METHOD_BUTTON', value: method},
            ])
            .subscribe((data) => {
                console.log('formData,', data.data);
                this.ngayTao = new Date(data.data.ngayTao);
                this.nguoiSua = data.data.nguoiSua;
                this.nguoiTao = data.data.nguoiTao;
                this.form.patchValue(data.data);
                let lanGiaHan = this.form.get("lanGiaHanThu").value;
                if(lanGiaHan !=undefined && lanGiaHan !=''){
                    this.lanGiaHanThu = parseInt(lanGiaHan) + 1;
                }else{
                    this.lanGiaHanThu =1;
                }
                //lấy ten trạng thái
                let trangThai = this.form.get('maTrangThai').value;
                if(this.listTrangThai != null && this.listTrangThai.length >0){
                    let tenTrangThai = this.listTrangThai.filter(c => c.ID==trangThai);
                    if(tenTrangThai != null && tenTrangThai.length >0){
                        this.form.get('tenTrangThai').setValue(tenTrangThai[0].NAME);
                    }
                }
                //lấy đơn vị chủ trì
                if(this.listDonViChuTri !=null && this.listDonViChuTri.length >0){
                    let donViChuTri = this.form.get('donViChuTri').value;
                    if(donViChuTri != undefined){
                        let dvChuTri = this.listDonViChuTri.filter(c => c.ID==donViChuTri);
                        if(dvChuTri != null && dvChuTri.length >0){
                            this.form.get('tenDonViChuTri').setValue(dvChuTri[0].NAME);
                        }
                    }
                   
                }

                //linhvuckhoahoc
                if(this.listLinhVucNghienCuu != null && this.listLinhVucNghienCuu.length >0){
                    let linhVuc = this.form.get('linhVucNghienCuu').value;
                    if(linhVuc != null && linhVuc.length >0){
                        let listLV = this.listLinhVucNghienCuu.filter(c =>linhVuc.includes(c.ID));
                        if(listLV != null && listLV.length >0){
                            var names = listLV.map(function(item) {
                                return item['NAME'];
                              });
                              this.form.get('tenLinhVucNghienCuu').setValue( names.toString());
                        }
                    }
                   
                }
              

                if(this.form.get('chuNhiemDeTaiInfo').value != null){
                   // this.form.get('chuNhiemDeTaiInfo').value.vaiTro = "Chủ nhiệm đề tài"
                    this.lstDanhSachThanhVienHD.push(this.form.get('chuNhiemDeTaiInfo').value);
                }
                if(this.form.get('dongChuNhiemDeTaiInfo').value){
                   // this.form.get('dongChuNhiemDeTaiInfo').value.vaiTro = "Đồng chủ nhiệm đề tài"
                    this.lstDanhSachThanhVienHD.push(this.form.get('dongChuNhiemDeTaiInfo').value);
                }
                if(this.form.get('thuKyDeTaiInfo').value){
                    //this.form.get('thuKyDeTaiInfo').value.vaiTro = "Thư kí đề tài"
                    this.lstDanhSachThanhVienHD.push(this.form.get('thuKyDeTaiInfo').value);
                }
                let formDocParent = this.form.get(
                    'listFolderFile'
                ) as FormArray;

                let formDocParentThucHien = this.form.get(
                    'listFolderFileThucHien'
                ) as FormArray;

                let formDocParentTamUng = this.form.get(
                    'listFolderFileTamUng'
                ) as FormArray;
                // listFolderFile

                if (data.data.listFolderFile != null) {
                    for (let i = 0; i < data.data.listFolderFile.length; i++) {
                        formDocParent.push(
                            this.addListDocParent(data.data.listFolderFile[i])
                        );
                        if (
                            data.data.listFolderFile[i].listFile != null &&
                            data.data.listFolderFile[i].listFile.length > 0
                        ) {
                            let formChild = formDocParent
                                .at(i)
                                .get('listFile') as FormArray;
                            for (
                                let j = 0;
                                j < data.data.listFolderFile[i].listFile.length;
                                j++
                            ) {
                                formChild.push(
                                    this.addListDocChild(
                                        data.data.listFolderFile[i].listFile[j]
                                    )
                                );
                            }
                        }
                    }
                }
                //file tạm ứng
                if (data.data.listFolderFileTamUng != null) {
                    for (
                        let i = 0;
                        i < data.data.listFolderFileTamUng.length;
                        i++
                    ) {
                        formDocParentTamUng.push(
                            this.addListDocParent(
                                data.data.listFolderFileTamUng[i]
                            )
                        );
                        if (
                            data.data.listFolderFileTamUng[i].listFile !=
                            null &&
                            data.data.listFolderFileTamUng[i].listFile.length >
                            0
                        ) {
                            let formChild = formDocParentTamUng
                                .at(i)
                                .get('listFile') as FormArray;
                            for (
                                let j = 0;
                                j <
                                data.data.listFolderFileTamUng[i].listFile
                                    .length;
                                j++
                            ) {
                                formChild.push(
                                    this.addListDocChild(
                                        data.data.listFolderFileTamUng[i]
                                            .listFile[j]
                                    )
                                );
                            }
                        }
                    }
                }
                // file thực hiện
                if (data.data.listFolderFileThucHien != null) {
                    for (
                        let i = 0;
                        i < data.data.listFolderFileThucHien.length;
                        i++
                    ) {
                        formDocParentThucHien.push(
                            this.addListDocParent(
                                data.data.listFolderFileThucHien[i]
                            )
                        );
                        if (
                            data.data.listFolderFileThucHien[i].listFile !=
                            null &&
                            data.data.listFolderFileThucHien[i].listFile
                                .length > 0
                        ) {
                            let formChild = formDocParentThucHien
                                .at(i)
                                .get('listFile') as FormArray;
                            for (
                                let j = 0;
                                j <
                                data.data.listFolderFileThucHien[i].listFile
                                    .length;
                                j++
                            ) {
                                formChild.push(
                                    this.addListDocChild(
                                        data.data.listFolderFileThucHien[i]
                                            .listFile[j]
                                    )
                                );
                            }
                        }
                    }
                }
                // danh sách thành viên
                if (data.data.danhSachThanhVien != null) {
                    let formThanhVien = this.form.get(
                        'danhSachThanhVien'
                    ) as FormArray;
                    if(data.data.danhSachThanhVien.length >0){
                        for (
                            let i = 0;
                            i < data.data.danhSachThanhVien.length;
                            i++
                        ) {
                            formThanhVien.push(
                                this.THEM_THANHVIEN(data.data.danhSachThanhVien[i])
                            );
                        }
                    }   
                  
                }
        
                //danh sach thành viên hội động xét duyệt
                if (data.data.danhSachThanhVienHD != null && data.data.danhSachThanhVienHD.length >0 ) {
                    let danhsachXD = data.data.danhSachThanhVienHD;
                    let formThanhVien = this.form.get(
                        'danhSachThanhVienHDXT'
                    ) as FormArray;

                    for (
                        let i = 0;
                        i < danhsachXD.length;
                        i++
                    ) {
                        formThanhVien.push(
                            this.THEM_THANHVIEN(danhsachXD[i])
                        );
                    }
                }
                //danh sách thành viên NT
                if (data.data.danhSachThanhVienHDNT != null && data.data.danhSachThanhVienHDNT.length >0 ) {
                    let danhsachXD = data.data.danhSachThanhVienHDNT;
                    let formThanhVien = this.form.get(
                        'danhSachThanhVienHDNT'
                    ) as FormArray;

                    for (
                        let i = 0;
                        i < danhsachXD.length;
                        i++
                    ) {
                        formThanhVien.push(
                            this.THEM_THANHVIEN(danhsachXD[i])
                        );
                    }
                }

                if (data.data.listTienDoCongViec != null && data.data.listTienDoCongViec.length >0 ) {
                    let danhsachXD = data.data.listTienDoCongViec;
                    let formTienDo = this.form.get(
                        'listTienDoCongViec'
                    ) as FormArray;

                    for (
                        let i = 0;
                        i < danhsachXD.length;
                        i++
                    ) {
                        formTienDo.push(
                            this.TIEN_DO(danhsachXD[i])
                        );
                    }
                }

                let thoiGianTu = this.form.get('thoiGianThucHienTu').value;
                if (thoiGianTu) {
                    this.form
                        .get('thoiGianThucHienTu')
                        .setValue(new Date(thoiGianTu));
                }
                let thoiGianDen = this.form.get('thoiGianThucHienDen').value;
                if (thoiGianDen) {
                    this.form
                        .get('thoiGianThucHienDen')
                        .setValue(new Date(thoiGianDen));
                }
                let thoiGianHop = this.form.get('thoiGianHop')?.value;
                if (thoiGianHop) {
                    this.form
                        .get('thoiGianHop')
                        .setValue(new Date(thoiGianHop));
                }

                let thoiGianHopNT = this.form.get('thoiGianHopNT')?.value;
                if (thoiGianHopNT) {
                    this.form
                        .get('thoiGianHopNT')
                        .setValue(new Date(thoiGianHopNT));
                }
                    if(this.actionType == 'CHINHSUA'){
                        this.checkAddMember();
                    }
                        
                console.log('form,', this.form);
                if (method == 'DETAIL') { //|| method == 'CAPNHAT'
                    let formDocParentHSDK = this.form.get(
                        'listFolderHSDK'
                    ) as FormArray;

                    let formDocParentHSXD = this.form.get(
                        'listFolderHSXD'
                    ) as FormArray;

                    let formDocParentTamUng = this.form.get(
                        'listFolderFileTamUng'
                    ) as FormArray;

                    let formDocParentHSNT = this.form.get(
                        'listFolderHSNT'
                    ) as FormArray;

                    let formDocParentBanGiaoKQ = this.form.get(
                        'listFolderBanGiao'
                    ) as FormArray;

                    let formDocParentQuyetToan = this.form.get(
                        'listFolderQuyetToan'
                    ) as FormArray;

                    let formDocParentHDXD = this.form.get(
                        'listHDXD'
                    ) as FormArray;

                    let formDocParentHDNT = this.form.get(
                        'listHDNT'
                    ) as FormArray;
                    let formDocParentKQNT = this.form.get(
                        'listKQNT'
                    ) as FormArray;
                    let formDocParentKQXD = this.form.get(
                        'listKQXD'
                    ) as FormArray;

                    if (data.data.listFolderAll != null) {
                        //Hồ sơ đăng ký
                        let listHSDK = data.data.listFolderAll.filter(
                            (c) => c.dangKy == true
                        );
                        if (listHSDK != null && listHSDK.length > 0) {
                            for (let i = 0; i < listHSDK.length; i++) {
                                formDocParentHSDK.push(
                                    this.addListDocParent(listHSDK[i])
                                );

                                if (listHSDK[i].listFile != null && listHSDK[i].listFile.length > 0) {
                                    let formChild = formDocParentHSDK
                                        .at(i)
                                        .get('listFile') as FormArray;
                                    for (let j = 0; j < listHSDK[i].listFile.length; j++) {
                                        formChild.push(
                                            this.addListDocChild(listHSDK[i].listFile[j])
                                        );
                                    }
                                }
                            }
                        }
                        //Hồ sơ xét duyệt, giao, ký hợp đồng thực hiện
                        let listHSXD = data.data.listFolderAll.filter(
                            (c) => c.thucHienHopDong == true
                        );
                        if (listHSXD != null && listHSXD.length > 0) {
                            for (let i = 0; i < listHSXD.length; i++) {
                                let listFile = data.data.listFile.filter(
                                    (c) => listHSXD[i].maFolder == c.maLoaiFile
                                );
                                formDocParentHSXD.push(
                                    this.addListDocParent(listHSXD[i])
                                );

                                if (listFile != null && listFile.length > 0) {
                                    let formChild = formDocParentHSXD
                                        .at(i)
                                        .get('listFile') as FormArray;
                                    for (let j = 0; j < listFile.length; j++) {
                                        formChild.push(
                                            this.addListDocChild(listFile[j])
                                        );
                                    }
                                }
                            }
                        }

                        //Hồ sơ đề nghị tạm ứng kinh phí các đợt sau
                        let listHSTamUng = data.data.listFolderAll.filter(
                            (c) => c.thucHienTamUng == true
                        );
                        if (listHSTamUng != null && listHSTamUng.length > 0) {
                            for (let i = 0; i < listHSTamUng.length; i++) {
                                let listFile = data.data.listFile.filter(
                                    (c) =>
                                        listHSTamUng[i].maFolder == c.maLoaiFile
                                );
                                formDocParentTamUng.push(
                                    this.addListDocParent(listHSTamUng[i])
                                );

                                if (listFile != null && listFile.length > 0) {
                                    let formChild = formDocParentTamUng
                                        .at(i)
                                        .get('listFile') as FormArray;
                                    for (let j = 0; j < listFile.length; j++) {
                                        formChild.push(
                                            this.addListDocChild(listFile[j])
                                        );
                                    }
                                }
                            }
                        }

                        //Hồ sơ nghiệm thu
                        let listHSNT = data.data.listFolderAll.filter(
                            (c) => c.nghiemThuHso == true
                        );
                        if (listHSNT != null && listHSNT.length > 0) {
                            for (let i = 0; i < listHSNT.length; i++) {
                                let listFile = data.data.listFile.filter(
                                    (c) => listHSNT[i].maFolder == c.maLoaiFile
                                );
                                formDocParentHSNT.push(
                                    this.addListDocParent(listHSNT[i])
                                );

                                if (listFile != null && listFile.length > 0) {
                                    let formChild = formDocParentHSNT
                                        .at(i)
                                        .get('listFile') as FormArray;
                                    for (let j = 0; j < listFile.length; j++) {
                                        formChild.push(
                                            this.addListDocChild(listFile[j])
                                        );
                                    }
                                }
                            }
                        }

                        //Bàn giao, lưu trữ kết quả thực hiện
                        let listBanGiaoKetQua = data.data.listFolderAll.filter(
                            (c) => c.nghiemThuBgiaoKetQua == true
                        );
                        if (
                            listBanGiaoKetQua != null &&
                            listBanGiaoKetQua.length > 0
                        ) {
                            for (let i = 0; i < listBanGiaoKetQua.length; i++) {
                                let listFile = data.data.listFile.filter(
                                    (c) =>
                                        listBanGiaoKetQua[i].maFolder ==
                                        c.maLoaiFile
                                );
                                formDocParentBanGiaoKQ.push(
                                    this.addListDocParent(listBanGiaoKetQua[i])
                                );

                                if (listFile != null && listFile.length > 0) {
                                    let formChild = formDocParentBanGiaoKQ
                                        .at(i)
                                        .get('listFile') as FormArray;
                                    for (let j = 0; j < listFile.length; j++) {
                                        formChild.push(
                                            this.addListDocChild(listFile[j])
                                        );
                                    }
                                }
                            }
                        }

                        //Hồ sơ thanh quyết toán
                        let listQuyetToan = data.data.listFolderAll.filter(
                            (c) => c.quyetToan == true
                        );
                        if (listQuyetToan != null && listQuyetToan.length > 0) {
                            for (let i = 0; i < listQuyetToan.length; i++) {
                                let listFile = data.data.listFile.filter(
                                    (c) =>
                                        listQuyetToan[i].maFolder ==
                                        c.maLoaiFile
                                );
                                formDocParentQuyetToan.push(
                                    this.addListDocParent(listQuyetToan[i])
                                );

                                if (listFile != null && listFile.length > 0) {
                                    let formChild = formDocParentQuyetToan
                                        .at(i)
                                        .get('listFile') as FormArray;
                                    for (let j = 0; j < listFile.length; j++) {
                                        formChild.push(
                                            this.addListDocChild(listFile[j])
                                        );
                                    }
                                }
                            }
                        }
                        //Hồ sơ xét duyệt, giao, ký hợp đồng thực hiện
                        let listHDXD = data.data.listFolderAll.filter(
                            (c) => c.hoiDongXetDuyet == true
                        );
                        if (listHDXD != null && listHDXD.length > 0) {
                            for (let i = 0; i < listHDXD.length; i++) {
                                let listFile = data.data.listFile.filter(
                                    (c) => listHDXD[i].maFolder == c.maLoaiFile
                                );
                                formDocParentHDXD.push(
                                    this.addListDocParent(listHDXD[i])
                                );

                                if (listFile != null && listFile.length > 0) {
                                    let formChild = formDocParentHDXD
                                        .at(i)
                                        .get('listFile') as FormArray;
                                    for (let j = 0; j < listFile.length; j++) {
                                        formChild.push(
                                            this.addListDocChild(listFile[j])
                                        );
                                    }
                                }
                            }
                        }

                        //Hồ sơ nghiệm thu, giao, ký hợp đồng thực hiện
                        let listHDNT = data.data.listFolderAll.filter(
                            (c) => c.hoiDongNghiemThu == true
                        );
                        if (listHDNT != null && listHDNT.length > 0) {
                            for (let i = 0; i < listHDNT.length; i++) {
                                let listFile = data.data.listFile.filter(
                                    (c) => listHDNT[i].maFolder == c.maLoaiFile
                                );
                                formDocParentHDNT.push(
                                    this.addListDocParent(listHDNT[i])
                                );

                                if (listFile != null && listFile.length > 0) {
                                    let formChild = formDocParentHDNT
                                        .at(i)
                                        .get('listFile') as FormArray;
                                    for (let j = 0; j < listFile.length; j++) {
                                        formChild.push(
                                            this.addListDocChild(listFile[j])
                                        );
                                    }
                                }
                            }
                        }

                        //Kết quả nghiệm thu, giao, ký hợp đồng thực hiện
                        let listKQNT = data.data.listFolderAll.filter(
                            (c) => c.ketQuaNghiemThu == true
                        );
                        if (listKQNT != null && listKQNT.length > 0) {
                        
                            for (let i = 0; i < listKQNT.length; i++) {
                             
                                let listFile = data.data.listFile.filter(
                                    (c) => listKQNT[i].maFolder == c.maLoaiFile
                                );
                                formDocParentKQNT.push(
                                    this.addListDocParent(listKQNT[i])
                                );

                                if (listFile != null && listFile.length > 0) {
                                    let formChild = formDocParentKQNT
                                        .at(i)
                                        .get('listFile') as FormArray;
                                    for (let j = 0; j < listFile.length; j++) {
                                        formChild.push(
                                            this.addListDocChild(listFile[j])
                                        );
                                    }
                                }
                            }
                        }
                        //Kết quả xét duyệt, giao, ký hợp đồng thực hiện
                        let listKQXD = data.data.listFolderAll.filter(
                            (c) => c.ketQuaXetDuyet == true
                        );
                        if (listKQXD != null && listKQXD.length > 0) {
                            for (let i = 0; i < listKQXD.length; i++) {
                                let listFile = data.data.listFile.filter(
                                    (c) => listKQXD[i].maFolder == c.maLoaiFile
                                );
                                formDocParentKQXD.push(
                                    this.addListDocParent(listKQXD[i])
                                );

                                if (listFile != null && listFile.length > 0) {
                                    let formChild = formDocParentKQXD
                                        .at(i)
                                        .get('listFile') as FormArray;
                                    for (let j = 0; j < listFile.length; j++) {
                                        formChild.push(
                                            this.addListDocChild(listFile[j])
                                        );
                                    }
                                }
                            }
                        }
                    }
                  
                    // this.listFolderAll = data.data.listFolderAll;
                    // this.listFolderDK = data.data.listFolderAll.filter(c  => c.maFolder=='VBDANGKY');
                    //  this.listFolderDK.listFile = data.data.listFile;
                    //  this.listFileDK =
                }
                if (method == 'CAPNHATHSTHUCHIEN') {
                    this.form.get('maTrangThai').setValue('DANG_THUC_HIEN');
                } else if (method == 'HSQTOAN') {
                    this.form.get('maTrangThai').setValue('DA_NTHU');
                }else if (this.actionType == 'updateActionHSNT' && this.screentype == 'nghiemthu') {
                    this.form.get("maTrangThai").setValue("CHUA_GUI_HS_NTHU");
                }

            });
    }

    // listFolderAll=[];
    // listFolderDK =[]
    // listFileDK =[]

    getListDangNhap() {
        this.getYearSubscription = this._serviceApi
            .execServiceLogin('EEE8942F-F458-4B58-9B5C-4A0CEE3A75E8', [
                {name: 'USERID', value: 'STR'},
            ])
            .subscribe((data) => {
                console.log(data.data);
            });
    }

    geListYears() {
        this.getYearSubscription = this._serviceApi
            .execServiceLogin('E5050E10-799D-4F5F-B4F2-E13AFEA8543B', null)
            .subscribe((data) => {
                this.listYears = data.data || [];
            });
    }

    openAlertDialog(type, item?: any) {
        let data = this.dialog.open(PopupCbkhComponent, {
            data: {
                type: type,
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

        data.afterClosed().subscribe((data) => {
            if (type == 'KEHOACH') {
                this.form.get('canCuThucHien').setValue(data.data.name);
                this.form.get('keHoach').setValue(data.data);
                this.form.get('maKeHoach').setValue(data.data.maKeHoach);
                this.form.get('maKeHoachChiTiet').setValue(data.data.maKeHoachChiTiet);
            } else if (type == 'CHUNHIEM') {
                this.form.get('chuNhiemDeTai').setValue(data.data.username);
                this.form.get('chuNhiemDeTaiInfo').setValue(data.data);
                this.form.get('gioiTinh').setValue(data.data.gioiTinh);
                this.form.get('hocHam').setValue(data.data.maHocHam);
                this.form.get('hocVi').setValue(data.data.maHocVi);
                this.form.get('donViCongTac').setValue(data.data.noiLamViec);
            } else if (type == 'DONGCHUNHIEM') {
                this.form.get('dongChuNhiemDeTai').setValue(data.data.username);
                this.form.get('dongChuNhiemDeTaiInfo').setValue(data.data);
                this.form
                    .get('gioiTinhDongChuNhiem')
                    .setValue(data.data.gioiTinh);
                this.form
                    .get('hocHamDongChuNhiem')
                    .setValue(data.data.maHocHam);
                this.form.get('hocViDongChuNhiem').setValue(data.data.maHocVi);
                this.form
                    .get('donViCongTacDongChuNhiem')
                    .setValue(data.data.noiLamViec);
            } else if (type == 'THUKY') {
                this.form.get('thuKyDeTai').setValue(data.data.username);
                this.form.get('thuKyDeTaiInfo').setValue(data.data);
                this.form.get('gioiTinhThuKy').setValue(data.data.gioiTinh);
                this.form.get('hocHamThuKy').setValue(data.data.maHocHam);
                this.form.get('hocViThuKy').setValue(data.data.maHocVi);
                this.form
                    .get('donViCongTacThuKy')
                    .setValue(data.data.noiLamViec);
            } else if (type == 'THANHVIEN') {
                item.get('ten').setValue(data.data.username);
                item.get('soDienThoai').setValue(data.data.sdt);
                item.get('email').setValue(data.data.email);
                item.get('donViCongTac').setValue(data.data.noiLamViec);
                item.get('maThanhVien').setValue(data.data.userId);
            }
        });
    }

    THEM_THANHVIEN(item?: any): FormGroup {
        return this._formBuilder.group({
            maThanhVien: item?.maThanhVien || null,
            ten: item?.ten || null,
            chucDanh: item?.chucDanh || null,
            soDienThoai: item?.soDienThoai || null,
            email: item?.email || null,
            donViCongTac: item?.donViCongTac || null,
            tenChucDanh: item?.tenChucDanh || null,
            ghiChu: item?.ghiChu || null
        });
    }

    TIEN_DO(item?: any): FormGroup {
       
        return this._formBuilder.group({
            maTienDo: item?.maTienDo || null,
            maDeTai: item?.maDeTai || null,
            thang: item?.thang || null,
            nam: item?.nam || null,
            noiDungBaoCao: item?.noiDungBaoCao || null,
            deXuatKienNghi: item?.deXuatKienNghi || null,
            keHoachTiepTheo: item?.keHoachTiepTheo || null
        });
    }

    addMember() {
        return this._formBuilder.group({
            maThanhVien: '',
            ten: '',
            chucDanh: '',
            soDienThoai: '',
            email: '',
            donViCongTac: '',
            tenChucDanh:''
        });
    }

    addThanhVien() {
        let ar = this.form.get('danhSachThanhVien') as FormArray;
        ar.push(this.addMember());
    }

    onSubmit(status, method) {
        let maDonVi = this.form.get('donViChuTri').value;
        if(this.orgid != maDonVi && this.orgid !=124){

        }else{
            if (this.form.invalid) {
                for (const control of Object.keys(this.form.controls)) {
                    this.form.controls[control].markAsTouched();
                }
                return;
            }
                this.submitted.check = true;
                if (this.form.invalid) {
                    this._messageService.showWarningMessage("Thông báo", "Chưa nhập đủ trường bắt buộc!")
                    return;
                }
        }
       
        if (this.form.get('danhSachThanhVien').value.length > 0) {
            let listTV: any[] = this.form.get('danhSachThanhVien').value;
            if (listTV.filter(n => n.ten == null || n.ten == '').length > 0) {
                this._messageService.showWarningMessage("Thông báo", "Xóa thành viên trống trong danh sách thành viên tham gia!");
                return;
            }
        }
        if (this.form.value.thuKyDeTaiInfo === '') {
            this.form.value.thuKyDeTaiInfo = {};
        }
        console.log(this.form.value);
        this.form.get('method').setValue(method);
        var token = localStorage.getItem('accessToken');

        if (method == 'HSNHIEMTHU') {
            if (status == 'LUU') {
                //this.form.get('maTrangThai').setValue('CHUA_GUI_HS_NTHU');
            } else if (status == 'LUUGUI') {
                this.form.get('maTrangThai').setValue('CHUA_GUI_HS_NTHU');
            }
        } else if (method == 'BAOCAOTIENDO') {
            // if(status=="LUU"){
            this.form.get('maTrangThai').setValue('DANG_THUC_HIEN');
            // }else if(status=="LUUGUI"){
            //     this.form.get('maTrangThai').setValue("DA_NTHU");
            // }
        } else if (method == 'CAPNHATHSTHUCHIEN') {
            // if(status=="LUU"){
            // this.form.get('maTrangThai').setValue('DANG_THUC_HIEN');
            // }else if(status=="LUUGUI"){
            //     this.form.get('maTrangThai').setValue("DA_NTHU");
            // }
        } else if (method == 'CAPNHAT') {
            let maTrangThai = this.form.get('maTrangThai').value;
            if (status == 'LUU') {
                if (maTrangThai != null && maTrangThai != '') {
                } else {
                    this.form.get('maTrangThai').setValue('CHUA_GUI');
                }

                this.form
                    .get('noiDungGuiMail')
                    .setValue(
                        'Chưa gửi hồ sơ thuyết minh ' +
                        this.form.get('tenDeTai').value
                    );
            } else if (status == 'LUUGUI') {
                
                let listFolder = this.form.get('listFolderFile').value;
                let check = false;
                if (listFolder != null && listFolder.length > 0) {
                    listFolder = listFolder.filter(c => c.maFolder != 'KHAC');
                    for (let i = 0; i < listFolder.length; i++) {
                        if (listFolder[i].listFile.length == 0) {
                            check = true;
                            break;
                        }
                    }
                }
                if (check) {
                    this._messageService.showErrorMessage(
                        'Thông báo',
                        "Vui lòng nhập đầy đủ hồ sơ thuyết minh."
                    );
                    return;
                }
                if (maTrangThai != null && maTrangThai != '' && maTrangThai != 'CHUA_GUI' && maTrangThai != 'Y_CAU_HIEU_CHINH') {
                } else {
                    this.form.get('maTrangThai').setValue('DA_GUI');
                }



                this.form
                    .get('noiDungGuiMail')
                    .setValue(
                        'Đã gửi hồ sơ thuyết minh ' +
                        this.form.get('tenDeTai').value
                    );
            }
        }
        this._serviceApi
            .execServiceLogin('8565DAF2-842B-438E-B518-79A47096E2B5', [
                {name: 'DE_TAI', value: JSON.stringify(this.form.value)},
                {name: 'TOKEN_LINK', value: token},
            ])
            .subscribe((data) => {
                if (data.status == 1) {
                    this._messageService.showSuccessMessage(
                        'Thông báo',
                        "Thành công"
                    );
                    if (this.screentype == 'nghiemthu') {
                        this._router.navigateByUrl("nghiepvu/detainhiemvu/nghiemthu");
                    } else if (this.screen) {
                        this._router.navigateByUrl(this.screen);
                    } else if (this.form.get('maTrangThai').value == 'HOAN_THANH') {
                        this._router.navigateByUrl("nghiepvu/detainhiemvu/hoanthanh");
                    } else {
                        this._router.navigateByUrl(
                            'nghiepvu/detainhiemvu/lstdetaicuatoi'
                        );
                    }
                } else {
                    this._messageService.showErrorMessage(
                        'Thông báo',
                        data.message
                    );
                }
            });
    }

    newFolder(item?: any) {
        if (item.maFolder == 'KHAC') {
            return this._formBuilder.group({
                maFolder: item?.maFolder,
                fileName: item?.fileName,
                ghiChu: item?.ghiChu,
                listFile: this._formBuilder.array([]),
                nguoiSua:item?.nguoiSua,
                ngaySua:item?.ngaySua,
                nguoiCapnhap:item?.nguoiSua,
            });
        }
        return this._formBuilder.group({
            maFolder: item?.maFolder,
            fileName: item?.fileName,
            ghiChu: item?.ghiChu,
            listFile: this._formBuilder.array([], ArrayValidators.minLength(0)),
            nguoiSua:item?.nguoiSua,
            ngaySua:item?.ngaySua,
            nguoiCapnhap:item?.nguoiSua,
        });
    }

    newFolderEdit(item?: any) {
        var arr = [];
        if (item.listFile != undefined && item.listFile.length > 0) {
            for (let i = 0; i < item.listFile.length; i++) {
                arr.push(
                    this.addFileEdit(
                        item.listFile[i],
                        item.listFile[i],
                        item.listFile[i].base64
                    )
                );
            }
        }

        return this._formBuilder.group({
            maFolder: item?.maFolder,
            fileName: item?.fileName,
            ghiChu: item?.ghiChu,
            listFile: this._formBuilder.array(arr),
            nguoiSua:item?.nguoiSua,
            ngaySua:item?.ngaySua,
            nguoiCapnhap:item?.nguoiSua,
        });
    }

    addFile2() {
        return this._formBuilder.group({
            fileName: '',
            base64: '',
            size: 0,
            sovanban: '',
            mafile: '',
            maFolder: '',
            tenFolder: '',
        });
    }

    addFileEdit(item, itemVal, base64) {
        return this._formBuilder.group({
            fileName: itemVal.name,
            base64: base64,
            size: itemVal.size,
            sovanban: '',
            mafile: '',
        });
    }

    addFile(item, itemVal, base64) {
        return this._formBuilder.group({
            fileName: itemVal?.name || null,
            base64: base64 || null,
            size: itemVal?.size || null,
            sovanban: '',
            mafile: '',
        });
    }

    getListFolderFile() {
        this._serviceApi
            .execServiceLogin('61808455-D993-4C3A-8117-1978C43F20C9', null)
            .subscribe((data) => {
                this.listFolderFile = data.data || [];

                let listFolderDK = this.listFolderFile.filter(c => c.maFolder !="TAI_LIEU_RA_SOAT");

                let val = this.form.get('listFolderFile') as FormArray;
                for (let i = 0; i < this.listFolderFile.length; i++) {

                    val.push(this.newFolder(this.listFolderFile[i]));
                }
            });
    }

    getListCapQuanLy() {
        this._serviceApi
            .execServiceLogin('2977F0EA-A6C6-4A32-A36B-8617898B710D', null)
            .subscribe((data) => {
                this.listCapQuanLy = data.data || [];
            });
    }

    getListDonViChuTri() {
        this._serviceApi
            .execServiceLogin('D3F0F915-DCA5-49D2-9A5B-A36EBF8CA5D1', null)
            .subscribe((data) => {
                this.listDonViChuTri = data.data || [];
                this.listDonViCongTac = data.data || [];
            });
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.form.get('donViChuTri').setValue(user.ORGID);
            });
    }

    getListHocHam() {
        this._serviceApi
            .execServiceLogin('1B009679-0ABB-4DBE-BBCF-E70CBE239042', null)
            .subscribe((data) => {
                var obj = {ID: '', NAME: '--Chọn--'};
                let hocHam = [];
                hocHam.push(obj)
                for(let i=0;i<data.data.length;i++){
                    hocHam.push(data.data[i]);
                }
                this.listHocHam = hocHam || [];
            });
    }

    getListHocVi() {
        this._serviceApi
            .execServiceLogin('654CB6D4-9DD7-48B7-B3FD-8FDAC07FE950', null)
            .subscribe((data) => {
                var obj = {ID: '', NAME: '--Chọn--'};
                let hocVi = [];
                hocVi.push(obj)
                for(let i=0;i<data.data.length;i++){
                    hocVi.push(data.data[i]);
                }
                this.listHocVi = hocVi || [];
               // this.listHocVi = data.data || [];
            });
    }

    getListNguonKinhPhi() {
        this._serviceApi
            .execServiceLogin('942181CC-FD57-42FE-8010-59B6FF1D26DB', null)
            .subscribe((data) => {
                this.listNguonKinhPhi = data.data || [];
            });
    }

    getListKhoanChi() {
        this._serviceApi
            .execServiceLogin('89191345-88FF-4C2E-B3CF-6FE315D6A631', null)
            .subscribe((data) => {
                this.listKhoanChi = data.data || [];
            });
    }

    getListLinhVucNghienCuu() {
        this._serviceApi
            .execServiceLogin('FF1D2502-E182-4242-A754-BCCC29B70C61', null)
            .subscribe((data) => {
                this.listLinhVucNghienCuu = data.data || [];
            });
    }

    getListGioiTinh() {
        var obj = {ID: 0, NAME: '--Chọn--'};
        this.listGioiTinh.push(obj);
        obj = {ID: 2, NAME: 'Nam'};
        this.listGioiTinh.push(obj);
        obj = {ID: 1, NAME: 'Nữ'};
        this.listGioiTinh.push(obj);
    }

    getListChucDanh() {
        this._serviceApi
            .execServiceLogin('AF87AA00-EC9C-4B1E-9443-CE0D6E88F1C6', null)
            .subscribe((data) => {
                this.listChucDanh = data.data || [];
            });
    }

    removeItem(items, i) {
        // remove address from the list
        const control = items.get('danhSachThanhVien');
        control.removeAt(i);
    }

    listupload = [];

    handleUpload(event, item, index) {
        let arr = item.get('listFile') as FormArray;
        item.get("nguoiCapnhap").setValue(this.user.userName);
        item.get("nguoiSua").setValue(this.user.userId);
        item.get("ngaySua").setValue(new Date());
        for (var i = 0; i < event.target.files.length; i++) {
            const reader = new FileReader();
            let itemVal = event.target.files[i];
            reader.readAsDataURL(event.target.files[i]);
            reader.onload = () => {
                arr.push(this.addFile(item, itemVal, reader.result));
            };
        }
        event.target.value = null;
    }

    handleUploadTamUng(event, item, index) {
        let arr = item.get('listFolderFileTamUng') as FormArray;
        for (var i = 0; i < event.target.files.length; i++) {
            const reader = new FileReader();
            let itemVal = event.target.files[i];
            reader.readAsDataURL(event.target.files[i]);
            reader.onload = () => {
                arr.push(this.addFile(item, itemVal, reader.result));
            };
        }
        event.target.value = null;
    }

    handleUploadThucHien(event, item, index) {
        let arr = item.get('listFolderFileThucHien') as FormArray;
        for (var i = 0; i < event.target.files.length; i++) {
            const reader = new FileReader();
            let itemVal = event.target.files[i];
            reader.readAsDataURL(event.target.files[i]);
            reader.onload = () => {
                arr.push(this.addFile(item, itemVal, reader.result));
            };
        }
        event.target.value = null;
    }

    deleteItemFile(items, i) {
        const control = items.get('listFile');
        control.removeAt(i);
    }

    downloadTempExcel(userInp, fileName) {
        var
        
mediaType =
            'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';

        const downloadLink = document.createElement('a');

        downloadLink.href = mediaType + userInp;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    downLoadFile(item) {
        if (item.value.base64 != undefined && item.value.base64 != '') {
            let link = item.value.base64.split(',');
            let url = '';
            if (link.length > 1) {
                url = link[1];
            } else {
                url = link[0];
            }
            this.downloadAll(url, item.value.fileName);
        } else {
            var token = localStorage.getItem('accessToken');
            this._serviceApi
                .execServiceLogin('2269B72D-1A44-4DBB-8699-AF9EE6878F89', [
                    {name: 'DUONG_DAN', value: item.duongdan},
                    {name: 'TOKEN_LINK', value: 'Bearer ' + token},
                ])
                .subscribe((data) => {
                });
        }
    }

   async downloadAll(base64String, fileName){
    let typeFile =  await this.detectMimeType(base64String, fileName);
    let mediaType = `data:${typeFile};base64,`;
    const downloadLink = document.createElement('a');

        downloadLink.href = mediaType + base64String;
        downloadLink.download = fileName;
        downloadLink.click();
    }

   async detectMimeType(base64String, fileName) {
        var ext = fileName.substring(fileName.lastIndexOf(".") + 1);
        if (ext === undefined || ext === null || ext === "") ext = "bin";
        ext = ext.toLowerCase();
        const signatures = {
          JVBERi0: "application/pdf",
          R0lGODdh: "image/gif",
          R0lGODlh: "image/gif",
          iVBORw0KGgo: "image/png",
          TU0AK: "image/tiff",
          "/9j/": "image/jpg",
          UEs: "application/vnd.openxmlformats-officedocument.",
          PK: "application/zip",
        };
        for (var s in signatures) {
          if (base64String.indexOf(s) === 0) {
            var x = signatures[s];
            // if an office file format
            if (ext.length > 3 && ext.substring(0, 3) === "ppt") {
              x += "presentationml.presentation";
            } else if (ext.length > 3 && ext.substring(0, 3) === "xls") {
              x += "spreadsheetml.sheet";
            } else if (ext.length > 3 && ext.substring(0, 3) === "doc") {
              x += "wordprocessingml.document";
            }
            // return
            return x;
          }
        }
        // if we are here we can only go off the extensions
        const extensions = {
          xls: "application/vnd.ms-excel",
          ppt: "application/vnd.ms-powerpoint",
          doc: "application/msword",
          xml: "text/xml",
          mpeg: "audio/mpeg",
          mpg: "audio/mpeg",
          txt: "text/plain",
        };
        for (var e in extensions) {
          if (ext.indexOf(e) === 0) {
            var xx = extensions[e];
            return xx;
          }
        }
        // if we are here – not sure what type this is
        return "unknown";
      }

    getListTrangThaiHSThucHien() {
        this._serviceApi
            .execServiceLogin('2EE0D143-CA88-4CFF-AC24-448236ECD72C', null)
            .subscribe((data) => {
                this.listTrangThai = data.data || [];
                this.listTrangThai = this.listTrangThai.filter(function (str) {
                    if (
                        str.ID == 'DANG_THUC_HIEN' ||
                        str.ID == 'YCAU_CAP_NHAT_HS_NTHU'
                    ) {
                        return str;
                    }
                    return;
                });
            });
    }

    getListTrangThaiHSNT() {
        this._serviceApi
            .execServiceLogin('2EE0D143-CA88-4CFF-AC24-448236ECD72C', null)
            .subscribe((data) => {
                this.listTrangThai = data.data || [];
                this.listTrangThai = this.listTrangThai.filter(function (str) {
                    if (
                        str.ID == 'CHUA_GUI_HS_NTHU' ||
                        str.ID == 'YCAU_CAP_NHAT_HS_NTHU' ||
                        str.ID == 'DA_RA_SOAT_HS_NTHU'
                    ) {
                        return str;
                    }
                    return;
                });
            });
    }

    checkAddMember(){
        let ar = this.form.get('danhSachThanhVien') as FormArray;
        if(ar !=undefined && ar.length >0){

        }else{
            ar.push(this.addMember());
        }

        let ar2 = this.form.get('danhSachThanhVienHDXT') as FormArray;
        if(ar2 !=undefined && ar2.length >0){

        }else{
            ar2.push(this.addMember());
        }

        let ar3 = this.form.get('danhSachThanhVienHDNT') as FormArray;
        if(ar3 !=undefined && ar3.length >0){

        }else{
            ar3.push(this.addMember());
        }
    }

    getListTrangThaiQuyetToan() {
        this._serviceApi
            .execServiceLogin('2EE0D143-CA88-4CFF-AC24-448236ECD72C', null)
            .subscribe((data) => {
                this.listTrangThai = data.data || [];
                this.listTrangThai = this.listTrangThai.filter(function (str) {
                    if (str.ID == 'DA_NTHU' || str.ID == 'HOAN_THANH' || str.ID == 'CHUA_GUI_HS_NTHU' ||
                    str.ID == 'YCAU_CAP_NHAT_HS_NTHU' ||
                    str.ID == 'DA_RA_SOAT_HS_NTHU') {
                        return str;
                    }
                    return;
                });
                this.form.get('maTrangThai').setValue('DA_NTHU');
            });
    }

    getListTrangThaiAll() {
        this._serviceApi
            .execServiceLogin('2EE0D143-CA88-4CFF-AC24-448236ECD72C', null)
            .subscribe((data) => {
                this.listTrangThai = data.data || [];
            });
    }
}
