import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription, takeUntil} from 'rxjs';
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
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ServiceService} from 'app/shared/service/service.service';
import {MatDialog} from '@angular/material/dialog';
import {PopupCbkhComponent} from './popup-cbkh/popup-cbkh.component';


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
    public listTrangThai = [];
    public actionType = null;
    public form;
    public method;
    public idParam;
    public submitted = {check: false};
    public listChucDanh = [];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _messageService: MessageService,
        public _router: Router,
        private _serviceApi: ServiceService,
        public dialog: MatDialog
    ) {
        this.initForm();
        // this.initFormUpdateActionKQXDCN();
        this.idParam = this._activatedRoute.snapshot.paramMap.get('id');
        this._activatedRoute.queryParams.subscribe((params) => {
            if (params?.type) {
                this.actionType = params?.type;
            } else {
                this.actionType = null;
            }
            if (this.actionType == 'updateActionRaSoat') {
                this.method = 'RASOAT';
            } else if (this.actionType == 'updateActionHDXDCN') {
                this.method = 'HOIDONGXD';
            } else if (this.actionType == 'updateActionKQXDCN') {
                this.method = 'KETQUAXD';
            } else if (this.actionType == 'updateActionKQ') {
                this.method = 'CHUNGNHANSK';
            } else if (this.actionType == 'CHINHSUA') {
                this.method = 'CAPNHAT';
            }
            console.log(this.actionType);
            this.detail(this.method);
        });
    }

    detail(method) {
        this._serviceApi
            .execServiceLogin('0CCBA90A-07BA-482E-85AA-A129FD4B7EE5', [
                {name: 'MA_SANGKIEN', value: this.idParam},
                {name: 'METHOD_BUTTON', value: method},
            ])
            .subscribe((data) => {
                console.log(data.data)
                this.form.patchValue(data.data);
                let formDocParent = this.form.get(
                    'listFolderFile'
                ) as FormArray;
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
                // danh sách thành viên
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

                if (method == 'HOIDONGXD') {
                    this.form.get('maTrangThai').setValue('DA_TLHDXDTC');
                }else
                if (method == 'KETQUAXD') {
                    this.form.get('maTrangThai').setValue('DA_CONG_NHAN');
                }else
                if (method == 'CHUNGNHANSK') {
                    this.form.get('maTrangThai').setValue('DA_TRA_THU_LAO');
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
            ghiChu:item?.ghiChu|| null,
        });
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
            nguoiSua:item?.nguoiSua || null,
            nguoiCapnhap:item?.nguoiSua || null,
            ngaySua:ngaySua || null,
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

    initForm() {
        this.form = this._formBuilder.group({
            method: [null],
            maSangKien: [null],
            tenGiaiPhap: [null, [Validators.required]],
            capDoSangKien: [null],
            tenCapDoSangKien: [null],
            nam: [null],
            tacGia: [null],
            tenTacGia: [null],
            donViCongTac: [null],
            tenDonViCongTac: [null],
            donViThucHien: [null],
            tenDonViThucHien: [null],
            vanBan: this._formBuilder.array([]),
            danhSachThanhVien: this._formBuilder.array([]),
            danhSachThanhVienHD: this._formBuilder.array([]),
            maTrangThai: [null],
            isEmail: [null],
            quyetDinhThanhLapHoiDing: [null],
            diemHop: [null],
            thoiGianHop: [null],
            ketQuaPhieuDanhGia: [null],
            thuLaoTacGia: [null],
            thuLaoChoNguoiLanDau: [null],
            thoaThuanChiPhi: [null],
            luanGiaiHoiDong: [null],
            kienNghiHoiDong: [null],
            phieuDanhGia: [null],
            bienBan: [null],
            guiMail: [false],
            listFolderFile: this._formBuilder.array([]),
            listFile: this._formBuilder.array([]),
            noiDungGuiMail: [null],
            ghiChu: [null],
            tacGiaGiaiPhap: [null],
            sovanban: [null],
            ngayVanBan: [null]
        });
    }

    getListChucDanh() {
        this._serviceApi
            .execServiceLogin('1450CB9E-4224-408C-900D-1CB4B7E643EF', null)
            .subscribe((data) => {
                this.listChucDanh = data.data || [];
            });
    }

    getListChucDanhHD() {
        this._serviceApi
            .execServiceLogin('0C10C696-1E6B-41FD-8E8F-135BBCA9883E', null)
            .subscribe((data) => {
                this.listChucDanh = data.data || [];
            });
    }

    ngOnInit(): void {
        this.geListYears();
        if (this.actionType == 'updateActionHDXDCN') {
            this.getListChucDanhHD();
        }else{
            this.getListChucDanh();
        }
       
        if (this.actionType == 'updateActionHDXDCN') {
            this.getListTrangThaiHSXD();
        } else if (this.actionType == 'updateActionKQXDCN') {
            this.getListTrangThaiKQXD();
        } else if (this.actionType == 'updateActionKQ') {
            this.getListTrangThaiCNXK();
        }
        // this._messageService.showSuccessMessage('Thông báo', 'Thành công');
    }

    getListTrangThaiHSXD() {
        this._serviceApi
            .execServiceLogin('F78D616F-CB41-46B3-A5A2-429E9F9C07AD', null)
            .subscribe((data) => {
                this.listTrangThai = data.data || [];
                this.listTrangThai = this.listTrangThai.filter(function (str) {
                    if (
                        str.ID == 'DA_TLHDXDTC'
                    ) {
                        return str;
                    }
                    return;
                });
                this.form.get('maTrangThai').setValue('DA_TLHDXDTC');
            });
    }

    getListTrangThaiKQXD() {
        this._serviceApi
            .execServiceLogin('F78D616F-CB41-46B3-A5A2-429E9F9C07AD', null)
            .subscribe((data) => {
                this.listTrangThai = data.data || [];
                this.listTrangThai = this.listTrangThai.filter(function (str) {
                    if (
                        str.ID == 'KHONG_CONG_NHAN' || str.ID == 'DA_CONG_NHAN' || str.ID == 'Y_CAU_HIEU_CHINH'
                    ) {
                        return str;
                    }
                    return;
                });
                this.form.get('maTrangThai').setValue('DA_CONG_NHAN');
            });
    }

    getListTrangThaiCNXK() {
        this._serviceApi
            .execServiceLogin('F78D616F-CB41-46B3-A5A2-429E9F9C07AD', null)
            .subscribe((data) => {
                this.listTrangThai = data.data || [];
                this.listTrangThai = this.listTrangThai.filter(function (str) {
                    if (
                        str.ID == 'DA_TRA_THU_LAO'
                    ) {
                        return str;
                    }
                    return;
                });
                this.form.get('maTrangThai').setValue('DA_TRA_THU_LAO');
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
        const matDialog = this.dialog.open(PopupCbkhComponent, {
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

        matDialog.afterClosed().subscribe((data) => {
            if (type == 'KEHOACH') {
                console.log('data2', data);
                this.form.get('canCuThucHien').setValue(data.data.name);
                this.form.get('keHoach').setValue(data.data);
            } else if (type == 'CHUNHIEM') {
                console.log('data1', data);
                this.form.get('chuNhiemDeTai').setValue(data.data.username);
                this.form.get('chuNhiemDeTaiInfo').setValue(data.data);
                this.form.get('gioiTinh').setValue(data.data.gioiTinh + '');
                this.form.get('hocHam').setValue(data.data.maHocHam);
                this.form.get('hocVi').setValue(data.data.maHocVi);
                this.form.get('donViCongTac').setValue(data.data.noiLamViec);
            } else if (type == 'DONGCHUNHIEM') {
                console.log('data1', data);
                this.form.get('dongChuNhiemDeTai').setValue(data.data.username);
                this.form.get('dongChuNhiemDeTaiInfo').setValue(data.data);
                this.form
                    .get('gioiTinhDongChuNhiem')
                    .setValue(data.data.gioiTinh + '');
                this.form
                    .get('hocHamDongChuNhiem')
                    .setValue(data.data.maHocHam);
                this.form.get('hocViDongChuNhiem').setValue(data.data.maHocVi);
                this.form
                    .get('donViCongTacDongChuNhiem')
                    .setValue(data.data.noiLamViec);
            } else if (type == 'THUKY') {
                console.log('data1', data);
                this.form.get('thuKyDeTai').setValue(data.data.username);
                this.form.get('thuKyDeTaiInfo').setValue(data.data);
                this.form
                    .get('gioiTinhThuKy')
                    .setValue(data.data.gioiTinh + '');
                this.form.get('hocHamThuKy').setValue(data.data.maHocHam);
                this.form.get('hocViThuKy').setValue(data.data.maHocVi);
                this.form
                    .get('donViCongTacThuKy')
                    .setValue(data.data.noiLamViec);
            } else if (type == 'THANHVIEN') {
                console.log('data1', data);
                item.get('ten').setValue(data.data.username);
                item.get('soDienThoai').setValue(data.data.sdt);
                item.get('email').setValue(data.data.email);
                item.get('donViCongTac').setValue(data.data.noiLamViec);
                item.get('maThanhVien').setValue(data.data.userId);
                item.get('maThanhVien').setValue(data.data.userId);
            } else if (type == 'HOIDONGSK') {
                let formThanhVien = this.form.get(
                    'danhSachThanhVien'
                ) as FormArray;
                for (
                    let i = 0;
                    i < data.data.danhSachThanhVien.length;
                    i++
                ) {
                    formThanhVien.push(
                        this.THEM_THANHVIEN(
                            data.data.danhSachThanhVien[i]
                        )
                    );
                }
            }else if (type == 'HOIDONG') {
                item.get('maThanhVien').setValue(data.data.userId);
                item.get('ten').setValue(data.data.username);
                item.get('soDienThoai').setValue(data.data.sdt);
                item.get('email').setValue(data.data.email);
                item.get('donViCongTac').setValue(data.data.noiLamViec);
                item.get('maThanhVien').setValue(data.data.userId);
            }
        });
    }

    removeItem(items, i) {
        // remove address from the list
        const control = items.get('danhSachThanhVien');
        control.removeAt(i);
    }

    addMember() {
        return this._formBuilder.group({
            maThanhVien: '',
            ten: '',
            chucDanh: '',
            soDienThoai: '',
            email: '',
            donViCongTac: '',
            ghiChu:''
        });
    }

    addThanhVien() {
        let ar = this.form.get('danhSachThanhVien') as FormArray;
        ar.push(this.addMember());
    }

    onSubmit(status, method) {
        this.submitted.check = true;
        if (this.form.invalid) {
            this._messageService.showErrorMessage("Thông báo", "Chưa nhập đủ trường bắt buộc!")
            return;
        }
        console.log(this.form.value);
        this.form.get('method').setValue(method);
        this.form.get('nam').setValue(new Date().getFullYear());
        if (method == "SUA") {
            // if(status=="LUU"){
            //     this.form.get('maTrangThai').setValue('SOAN');
            // }else if(status=="LUUGUI"){
            //     this.form.get('maTrangThai').setValue('CHO_RA_SOAT');
            // }
        } else if (method == "RASOAT") {
            if (status == "TRALAI") {
                this.form.get('maTrangThai').setValue('Y_CAU_HIEU_CHINH');
            } else if (status == "CHAPTHUAN") {
                this.form.get('maTrangThai').setValue('DA_PHE_DUYET');
            }
        } else if (method = 'CHUNGNHANSK') {
            let tenTrangThai = "";
            let lstTrangThai = this.listTrangThai.filter(c => c.ID == this.form.get('maTrangThai').value);
            if (lstTrangThai != null && lstTrangThai.length > 0) {
                tenTrangThai = lstTrangThai[0].NAME;
            }
            let noiDung = tenTrangThai + ' ' + this.form.get('tenGiaiPhap').value;
            this.form.get('noiDungGuiMail').setValue(noiDung);
        }
        var token = localStorage.getItem("accessToken");
        this._serviceApi
            .execServiceLogin('09E301E6-9C2E-424C-A3C3-FD46CE8CB18C', [{
                "name": "SANG_KIEN",
                "value": JSON.stringify(this.form.value)
            }, {"name": "TOKEN_LINK", "value": token}])
            .subscribe((data) => {
                if (data.status == 1) {
                    this._messageService.showSuccessMessage(
                        'Thông báo',
                        "Thành công"
                    );
                    // if (this.screen) {
                    //     this._router.navigateByUrl(this.screen);
                    // } else {
                    this._router.navigateByUrl(
                        'nghiepvu/sangkien/xetduyetttdv'
                    );
                    // }
                } else {
                    this._messageService.showErrorMessage(
                        'Thông báo',
                        data.message
                    );
                }

            })
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

    addFile(item, itemVal, base64) {
        return this._formBuilder.group({
            fileName: itemVal.name,
            base64: base64,
            size: itemVal.size,
            sovanban: "",
            mafile: "",
        })
    }

    deleteItemFile(items, i) {
        const control = items.get('listFile');
        control.removeAt(i);
    }

    downloadTempExcel(userInp, fileName) {
        var mediaType = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";

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

}
