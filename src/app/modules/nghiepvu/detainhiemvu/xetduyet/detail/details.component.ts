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
import {xetduyetService} from '../xetduyet.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ServiceService} from 'app/shared/service/service.service';
import {MatDialog} from '@angular/material/dialog';
import {PopupCbkhComponent} from './popup-cbkh/popup-cbkh.component';
import { User } from 'app/core/user/user.types';
import { DOfficeService } from 'app/shared/service/doffice.service'
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DOfficeComponent } from 'app/shared/component/d-office/d-office.component';

export const MY_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'component-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
        },

        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
    encapsulation: ViewEncapsulation.None,
})
export class DetailsComponent implements OnInit {
    public mask = {
        guide: true,
        showMask: true,
        // keepCharPositions : true,
        mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
    };
    public selectedYear: number;
    public getYearSubscription: Subscription;
    public listTrangThai = [];
    public actionType = null;
    public method = null;
    public form: FormGroup;
    public idParam: string = null;
    public listChucDanh = [];
    public fileThanhLapHD: {
        maLoaiFile: '';
        fileName: '';
        base64: '';
        size: 0;
        sovanban: '';
        ngayVanBan: '';
        mafile: '';
        duongDan: '';
        rowid: '';
        kieuFile: '';
        loaiFile: '';
    };
    public screentype;
    public checkDOffice = false;
    public linkDoffice = "";
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _messageService: MessageService,
        public _router: Router,
        private _serviceApi: ServiceService,
        public dialog: MatDialog,
        private _userService: UserService,
        private _dOfficeApi: DOfficeService,
    ) {
             debugger;
        this.idParam = this._activatedRoute.snapshot.paramMap.get('id');
        this._activatedRoute.queryParams.subscribe((params) => {
            if (params?.type) {
                this.actionType = params?.type;
            } else {
                this.actionType = null;
            }
            if (params?.screentype) {
                this.screentype = params?.screentype;
            }
            console.log(this.actionType);
            if (this.actionType == 'updateActionKQ') {
                this.method = 'THANHLAPHD';
            } else if (this.actionType == 'updateActionHD') {
               
                if (this.screentype == 'nghiemthu') {
                    this.method = 'HOIDONGNT';
                } else {
                    this.method = 'HOIDONG';
                }

            } else if (this.actionType == 'updateActionRaSoat') {
                this.method = 'RASOAT';
            }
       
            this.initForm(this.method);
            this.detail(this.method);
            if (this.actionType == 'updateActionHD') {
                this.method = 'HOIDONG';
                this.form.get('maTrangThai').setValue('DA_TLHDXD');
            } else if (this.actionType == 'updateActionKQ') {
                this.form.get('maTrangThai').setValue('DANG_THUC_HIEN');
            }
        });
    }

    ngOnInit(): void {
        this.getListChucDanh();
        if (this.actionType == 'updateActionHD') {
            if (this.screentype == 'nghiemthu') {
                this.geListTrangThaiHDNT();
            } else {
                this.geListTrangThaiHD();
            }

        } else {
            this.geListTrangThaiThanhLapHD();
        }
        this.getCheckQuyenDoffice();
    }

    checkAddMember(){
        debugger;
        let ar = this.form.get('danhSachThanhVien') as FormArray;
        if(ar !=undefined && ar.length >0){

        }else{
            ar.push(this.addMember());
        }

        // let ar2 = this.form.get('danhSachThanhVienHDXT') as FormArray;
        // if(ar2 !=undefined && ar2.length >0){

        // }else{
        //     ar2.push(this.addMember());
        // }

        let ar3 = this.form.get('danhSachThanhVienHD') as FormArray;
        if(ar3 !=undefined && ar3.length >0){

        }else{
            ar3.push(this.addMember());
        }
    }
    // initFormHD(){
    //     this._serviceApi.execServiceLogin('F360054F-7458-443A-B90E-50DB237B5642', [{"name":"MA_DE_TAI","value":this.idParam}]).subscribe((data) => {
    //         this.form = this._formBuilder.group({
    //             maDeTai:this.idParam,
    //             method:"HOIDONG",
    //             tenDeTai: "",
    //             tenCapQuanLy:"",
    //             chuNhiemDeTai:"",
    //             donViCongTac:"",
    //             maTrangThai:[null],
    //             isEmail:true,
    //             listFolderFile:this._formBuilder.array(
    //                 [
    //                 ]
    //             )
    //         });
    //     })

    // }
    detail(method) {
        this._serviceApi
            .execServiceLogin('F360054F-7458-443A-B90E-50DB237B5642', [
                {name: 'MA_DE_TAI', value: this.idParam},
                {name: 'METHOD_BUTTON', value: method},
            ])
            .subscribe((data) => {
                this.form.patchValue(data.data);
                let formDocParent = this.form.get(
                    'listFolderFile'
                ) as FormArray;

                let formDocParentThucHien = this.form.get(
                    'listFolderFileThucHien'
                ) as FormArray;

                let formDocParentTamUng = this.form.get(
                    'listFolderFileTamUng'
                ) as FormArray;

                let formDocParentHD = this.form.get(
                    'listFolderFileHD'
                ) as FormArray;
                
                if (data.data != null && data.data.listFolderFile != null) {
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

                if (data.data.listFolderFileHD != null) {
                    for (
                        let i = 0;
                        i < data.data.listFolderFileHD.length;
                        i++
                    ) {
                        formDocParentHD.push(
                            this.addListDocParent(data.data.listFolderFileHD[i])
                        );
                        if (
                            data.data.listFolderFileHD[i].listFile != null &&
                            data.data.listFolderFileHD[i].listFile.length > 0
                        ) {
                            let formChild = formDocParentHD
                                .at(i)
                                .get('listFile') as FormArray;
                            for (
                                let j = 0;
                                j <
                                data.data.listFolderFileHD[i].listFile.length;
                                j++
                            ) {
                                formChild.push(
                                    this.addListDocChild(
                                        data.data.listFolderFileHD[i].listFile[
                                            j
                                            ]
                                    )
                                );
                            }
                        }
                    }
                }

                if (data.data.danhSachThanhVien != null) {
                    let formThanhVien = this.form.get(
                        'danhSachThanhVien'
                    ) as FormArray;

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

                if (data.data.danhSachThanhVienHD != null) {
                    let formThanhVien = this.form.get(
                        'danhSachThanhVienHD'
                    ) as FormArray;

                    for (
                        let i = 0;
                        i < data.data.danhSachThanhVienHD.length;
                        i++
                    ) {
                        formThanhVien.push(
                            this.THEM_THANHVIEN(
                                data.data.danhSachThanhVienHD[i]
                            )
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
                let thoiGianHop = this.form.get('thoiGianHop').value;
                if (thoiGianHop) {
                    this.form
                        .get('thoiGianHop')
                        .setValue(new Date(thoiGianHop));
                }
                debugger;
                if (method == 'HOIDONG') {
                    this.form.get('maTrangThai').setValue('DA_TLHDXD');
                    this.checkAddMember();
                } else if (method == 'HOIDONGNT') {
                    this.form.get('maTrangThai').setValue('DA_TLHDNT');
                    this.checkAddMember();
                } else if (method == 'THANHLAPHD') {
                    this.form.get('maTrangThai').setValue('DANG_THUC_HIEN');
                }
                
            });
    }

    addListDocParent(item?: any) {
        debugger;
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
            nguoiSua:item?.nguoiSua || null,
            nguoiCapnhap:item?.nguoiSua || null,
            ngaySua:ngaySua || null,
            sovanban: item?.sovanban || null,
            ngayVanBan: ngayVanBan || null,
        });
    }

    getCheckQuyenDoffice() {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
                this._serviceApi.execServiceLogin("3FADE0E4-B2C2-4D9D-A0C7-06817ADE4FA3", [{ "name": "ORGID", "value": user.ORGID }]).subscribe((data) => {
                    if (data.data.API_DOFFICE) {
                        this.checkDOffice = true;
                        this.linkDoffice = data.data.API_DOFFICE;
                    }
                })
            });

    }

    addListDocChild(item?: any) {
        let ngayVanBan = item?.ngayVanBan;
        if (ngayVanBan) {
            ngayVanBan = new Date(ngayVanBan);
        }else{
            ngayVanBan =null;
        }
        return this._formBuilder.group({
            fileName: item?.fileName || null,
            base64: item?.base64 || null,
            size: item?.size || 0,
            sovanban: item?.sovanban || null,
            mafile: item?.mafile || null,
            maFolder: item?.maFolder || null,
            tenFolder: item?.tenFolder || null,
            duongDan: item?.duongDan || null,
            rowid: item?.rowid || null,
            ngayVanBan:ngayVanBan || null,
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
            ma: item?.ma || null,
            ghiChu: item?.ghiChu || null,
            loaiHD: item?.loaiHD || 0,
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
            tenChucDanh: '',
            ma: '',
            ghiChu: '',
            loaiHD: 0,
        });
    }

    addThanhVien() {
        let ar = this.form.get('danhSachThanhVien') as FormArray;
        ar.push(this.addMember());
    }

    removeItem(items, i) {
        // remove address from the list
        const control = items.get('danhSachThanhVien');
        control.removeAt(i);
    }

    addThanhVienHD() {
        let ar = this.form.get('danhSachThanhVienHD') as FormArray;
        ar.push(this.addMember());
    }

    removeItemHD(items, i) {
        // remove address from the list
        const control = items.get('danhSachThanhVienHD');
        control.removeAt(i);
    }

    initForm(actionType) {
        this.form = this._formBuilder.group({
            maDeTai: [null],
            thoiGianHop: [null],
            ketQuaPhieuDanhGia: [null],
            ketLuanHoiDongXetDuyet: [null],
            diaDiem: [null],
            method: actionType,
            maTrangThai: [''],
            yKien: '',
            isEmail: true,
            tenDeTai: [null, [Validators.required]],
            canCuThucHien: [null],
            keHoach: [null],
            tenCapQuanLy: [null],
            capQuanLy: [null, [Validators.required]],
            vanBanChiDaoSo: [null],
            linhVucNghienCuu: [],
            //LINHVUCNGHIENCUU: this._formBuilder.array([]),
            donViChuTri: [null, [Validators.required]],
            thoiGianThucHienTu: [null, [Validators.required]],
            thoiGianThucHienDen: [null, [Validators.required]],

            chuNhiemDeTaiInfo: '',
            chuNhiemDeTai: [null, [Validators.required]],
            gioiTinh: [null],
            hocHam: [null],
            hocVi: [null],
            donViCongTac: [null],

            dongChuNhiemDeTaiInfo: '',
            dongChuNhiemDeTai: [null, [Validators.required]],
            gioiTinhDongChuNhiem: [null],
            hocHamDongChuNhiem: [null],
            hocViDongChuNhiem: [null],
            donViCongTacDongChuNhiem: [null],

            thuKyDeTaiInfo: '',
            thuKyDeTai: [null],
            gioiTinhThuKy: [null],
            hocHamThuKy: [null],
            hocViThuKy: [null],
            donViCongTacThuKy: [null],

            danhSachThanhVien: this._formBuilder.array([]),
            danhSachThanhVienHD: this._formBuilder.array([]),

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
            listFile: this._formBuilder.array([]),
            listFolderFileHD: this._formBuilder.array([]),
            // listFile1: this._formBuilder.array([]),
            // listFile2: this._formBuilder.array([]),
            // listFile3: this._formBuilder.array([]),
            // listFile4: this._formBuilder.array([]),
            // listFile5: this._formBuilder.array([]),
            // listFile6: this._formBuilder.array([]),
        });
    }

    // initFormRaSoat() {
    //     this.form = this._formBuilder.group({
    //         maDeTai:this.idParam,
    //         method:"RASOAT",
    //         yKien: "",
    //         maTrangThai:[null],
    //         isEmail:true,
    //         listFile:this._formBuilder.array(
    //             [
    //             ]
    //         )
    //     });
    // }
    addFile(item, itemVal, base64) {
        return this._formBuilder.group({
            fileName: itemVal.name,
            base64: base64,
            size: itemVal.size,
            sovanban: '',
            mafile: '',
        });
    }

    handleUploadRaSoat(event, item, index) {
        let arr = this.form.get('listFile') as FormArray;
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

    handleUpload(event, item, index) {
        let arr = item.get('listFile') as FormArray;
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

    geListTrangThaiHD() {
        this._serviceApi
            .execServiceLogin('2EE0D143-CA88-4CFF-AC24-448236ECD72C', null)
            .subscribe((data) => {
                this.listTrangThai = data.data || [];
                this.listTrangThai = this.listTrangThai.filter(
                    (c) => c.ID == 'DA_TLHDXD'
                );
                this.form.get('maTrangThai').setValue('DA_TLHDXD');
            });
    }

    geListTrangThaiHDNT() {
        this._serviceApi
            .execServiceLogin('2EE0D143-CA88-4CFF-AC24-448236ECD72C', null)
            .subscribe((data) => {
                this.listTrangThai = data.data || [];
                this.listTrangThai = this.listTrangThai.filter(
                    (c) => c.ID == 'DA_TLHDNT'
                );
                this.form.get('maTrangThai').setValue('DA_TLHDNT');
            });
    }

    geListTrangThaiThanhLapHD() {
        //let thisNow = this;
        this._serviceApi
            .execServiceLogin('2EE0D143-CA88-4CFF-AC24-448236ECD72C', null)
            .subscribe((data) => {
                this.listTrangThai = data.data || [];
                this.listTrangThai = this.listTrangThai.filter(function (str) {
                    if (
                        str.ID == 'DANG_THUC_HIEN' ||
                        str.ID == 'DUNG_THUC_HIEN' ||
                        str.ID == 'Y_CAU_HIEU_CHINH'
                    ) {
                        return str;
                    }
                    return;
                });
                this.form.get('maTrangThai').setValue('DANG_THUC_HIEN');
            });
    }

    dataFile = [];
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
                console.log('data2', data);
                this.form.get('canCuThucHien').setValue(data.data.name);
                this.form.get('keHoach').setValue(data.data);
            } else if (type == 'CHUNHIEM') {
                console.log('data1', data);
                this.form.get('chuNhiemDeTai').setValue(data.data.username);
                this.form.get('chuNhiemDeTaiInfo').setValue(data.data);
            } else if (type == 'DONGCHUNHIEM') {
                console.log('data1', data);
                this.form.get('dongChuNhiemDeTai').setValue(data.data.username);
                this.form.get('dongChuNhiemDeTaiInfo').setValue(data.data);
            } else if (type == 'THUKY') {
                console.log('data1', data);
                this.form.get('thuKyDeTai').setValue(data.data.username);
                this.form.get('thuKyDeTaiInfo').setValue(data.data);
            } else if (type == 'THANHVIEN') {
                item.get('ten').setValue(data.data.username);
                item.get('soDienThoai').setValue(data.data.sdt);
                item.get('email').setValue(data.data.email);
                item.get('donViCongTac').setValue(data.data.noiLamViec);
                item.get('maThanhVien').setValue(data.data.userId);
            } else if (type == 'HOIDONG') {
                item.get('ten').setValue(data.data.username);
                item.get('soDienThoai').setValue(data.data.sdt);
                item.get('email').setValue(data.data.email);
                item.get('donViCongTac').setValue(data.data.noiLamViec);
                item.get('maThanhVien').setValue(data.data.userId);
            } else if (type == 'DETAIHOIDONG') {
                let formThanhVien = this.form.get(
                    'danhSachThanhVienHD'
                ) as FormArray;
                for (
                    let i = 0;
                    i < data.data.danhSachThanhVienHD.length;
                    i++
                ) {
                    formThanhVien.push(
                        this.THEM_THANHVIEN(
                            data.data.danhSachThanhVienHD[i]
                        )
                    );
                }
            } else if (type == 'DETAIHOIDONGNT') {
                let formThanhVien = this.form.get(
                    'danhSachThanhVienHD'
                ) as FormArray;
                for (
                    let i = 0;
                    i < data.data.danhSachThanhVienHD.length;
                    i++
                ) {
                    formThanhVien.push(
                        this.THEM_THANHVIEN(
                            data.data.danhSachThanhVienHD[i]
                        )
                    );
                }
            }else if (type == 'DOffice') {
                this.dataFile = this._dOfficeApi.execTimKiemTheoFile(this.linkDoffice, data.ID_VB);
                if (this.dataFile != null && this.dataFile.length > 0) {
                     item.get("soKyHieu").setValue("123");
                     item.get("ngayVanBan").setValue(new Date());
                    for (var i = 0; i < this.dataFile.length; i++) {
                        let dataBase64 = this._dOfficeApi.execFileBase64(this.linkDoffice, this.dataFile[i].ID_FILE, this.user.ORGID, this.dataFile[i].ID_VB);
                        let arrFile = item.get("listFile") as FormArray;
                      
                        arrFile.push({
                            fileName: this.dataFile[i].TEN_FILE,
                            base64: dataBase64,
                            size: 0,
                            sovanban: data.KY_HIEU,
                            mafile: ""
                        })
                    }
                }
            }
        });
    }

    async openAlertDialogDoffice(type, item?: any) {
        let data = this.dialog.open(DOfficeComponent, {
            data: {
                type: type,
                linkApi: this.linkDoffice,
                maDv: this.user.ORGID,
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
           let kyHieu =data.data.KY_HIEU;
           let ngayVB =data.data.NGAY_VB;
           item.get("sovanban").setValue(kyHieu);
           item.get("ngayVanBan").setValue(ngayVB);
            if (type == 'DOffice') {
                  this._dOfficeApi.execTimKiemTheoFile(this.linkDoffice, data.data.ID_VB).then(data=>{
                this.dataFile = data.body.Data;
                console.log("thong tin file");
                console.log(data);
                if (this.dataFile != null && this.dataFile.length > 0) {
                   for (var i = 0; i < this.dataFile.length; i++) {
                    this.getFileFromDoffice(item, this.dataFile[i].ID_FILE, this.user.ORGID, this.dataFile[i].ID_VB,
                         this.dataFile[i].TEN_FILE, this.dataFile[i].KY_HIEU);
                //         let dataFile =  this.dataFile[i];
                //         setTimeout(() => {
                            
                     
                   
                // }, 1000);
                //     }
                }
            }
            }); 
            }
        });
    }
    async getFileFromDoffice(item,idFile,orgId,idVB,tenFile,kyHieu){
        this._dOfficeApi.execFileBase64(this.linkDoffice, idFile, orgId, idVB).then(data=>{
            console.log("file base64");
            var base64str = data.body;
            var decoded = atob(base64str);
             let arrFile = item.get("listFile") as FormArray;
             arrFile.push(this.addListDocChildView(tenFile,base64str,decoded,kyHieu))
            });
            
    }

    addListDocChildView(tenFile,base64str,decoded,kyHieu) {
        return this._formBuilder.group({
            fileName: tenFile,
            base64: base64str,
            size: decoded.length,
            sovanban: kyHieu,
            mafile: ""
        });
    }

    getListChucDanh() {
        this._serviceApi
            .execServiceLogin('AF87AA00-EC9C-4B1E-9443-CE0D6E88F1C6', null)
            .subscribe((data) => {
                this.listChucDanh = data.data || [];
            });
    }

    deleteItemFile(items, i) {
        // remove address from the list
        const control = items.get('listFile');
        control.removeAt(i);
    }

    downloadTempExcel(userInp, fileName) {
        var mediaType =
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

    convertBase64ToBlobData(base64Data: string) {
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length;) {
          const slice = byteCharacters.slice(offset, offset);
    
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
    
          const byteArray = new Uint8Array(byteNumbers);
    
          byteArrays.push(byteArray);
        }
    
        const blob = new Blob(byteArrays);
        return blob;
      }

    downloadPdf2(base64String, fileName) {
        const source = `data:application/pdf;base64,${base64String}`;
        const link = document.createElement("a");
        link.href = source;
        link.download = `${fileName}.pdf`
        link.click();
      }

    downloadTempExcel2(userInp, fileName) {
        var mediaType =
        'data:application/pdf;base64,';

        const downloadLink = document.createElement('a');

        downloadLink.href = mediaType + userInp;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    // submit(maTrangThai,method){
    //     this.form.get('method').setValue(method);
    //     this.form.get("maTrangThai").setValue(maTrangThai);
    //     console.log(this.form.value);
    //     // var token = localStorage.getItem("accessToken");
    //     // this._serviceApi
    //     // .execServiceLogin('8565DAF2-842B-438E-B518-79A47096E2B5', [{"name":"DE_TAI","value":JSON.stringify(this.form.value)},{"name":"TOKEN_LINK","value":token}])
    //     // .subscribe((data) => {
    //     //     console.log(data.data);

    //     // })
    // }

    onSubmit(status, method) {
        console.log(this.form.value);
        this.form.get('method').setValue(method);
        var token = localStorage.getItem('accessToken');
        if (method == 'HSNHIEMTHU') {
            if (status == 'LUU') {
                this.form.get('maTrangThai').setValue('CHUA_GUI_HS_NTHU');
            } else if (status == 'LUUGUI') {
                this.form.get('maTrangThai').setValue('DA_NTHU');
            }
        }
        if (method == 'RASOAT') {
            if (status == 'TRALAI') {
                this.form.get('maTrangThai').setValue('Y_CAU_HIEU_CHINH');
            } else if (status == 'CHAPTHUAN') {
                this.form.get('maTrangThai').setValue('DA_PHE_DUYET');
            }
        }
        let list: any[] = this.form.value.danhSachThanhVienHD;
        if (list.filter(n => n.ten == null).length > 0) {
            this._messageService.showWarningMessage("Thông báo", "Xóa thành viên trống trong danh sách thành viên hội đồng!");
        } else {
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
                            this._router.navigateByUrl(
                                '/nghiepvu/detainhiemvu/nghiemthu/'
                            );
                        } else {
                            this._router.navigateByUrl(
                                '/nghiepvu/detainhiemvu/xetduyet/'
                            );
                        }

                    } else {
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Lỗi trong quá trình thực hiện'
                        );
                    }
                });
            this.form.get('yKien').setValue("");
        }
    }
}
