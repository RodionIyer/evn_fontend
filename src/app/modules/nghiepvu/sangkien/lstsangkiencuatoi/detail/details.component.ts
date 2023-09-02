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
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {MessageService} from 'app/shared/message.services';
import {SnotifyToast, ToastComponent} from 'ng-alt-snotify';
import {State} from 'app/shared/commons/conmon.types';
import {BaseDetailInterface} from 'app/shared/commons/basedetail.interface';
import {UserService} from 'app/core/user/user.service';
import {BaseComponent} from 'app/shared/commons/base.component';
import {FunctionService} from 'app/core/function/function.service';
import {lstdetaicuatoiService} from '../lstsangkiencuatoi.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {ServiceService} from 'app/shared/service/service.service';
import {MatDialog} from '@angular/material/dialog';
import {PopupCbkhComponent} from './popup-cbkh/popup-cbkh.component';
import { DatetimeAdapter } from '@mat-datetimepicker/core';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MomentDateAdapter,
} from '@angular/material-moment-adapter';


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
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DatetimeAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class DetailsComponent implements OnInit {
    public selectedYear: number;
    public getYearSubscription: Subscription;
    public listYears = [];
    public actionType: string = null;
    public form: FormGroup;
    public idParam: string = null;
    public method = null;
    public submitted = {check: false};
    public listChucDanh = [];
    public listLinhVucNghienCuu;
    public listDonViChuDauTu = [];
    public listCapDo = [];
    public listFolderFile = [];
    public screen;
    public data: any;
    public listFileVB: any[] = [];
    public listFileOther: any[] = [];
    public listAuthor: any[] = [];
    public madeTaiSK;
    public typeLichSu;
    public title_lichsu;
    public lstDanhSachThanhVienHD: any[] = [];
    private oldInitiativeRank = '';
    vndMoney: string;
    orgId = "";
    hoidongs: any[];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _messageService: MessageService,
        public _router: Router,
        private _serviceApi: ServiceService,
        public dialog: MatDialog
    ) {
        this.idParam = this._activatedRoute.snapshot.paramMap.get('id');
        this._activatedRoute.queryParams.subscribe((params) => {
            if (params?.type) {
                this.actionType = params?.type;
            } else {
                this.actionType = null;
            }
            if (params?.title) {
                this.title_lichsu = params?.title;
            }
            if (this.actionType == 'updateActionHSTH') {
                this.method = 'CAPNHATHSTHUCHIEN';
            } else if (this.actionType == 'CHINHSUA') {
                this.method = 'CAPNHAT';
            } else {
                this.method = 'DETAIL';
            }
            this.initForm(this.method);
            this.madeTaiSK = this.idParam;
            this.typeLichSu = 'SANGKIEN';
            if(this.idParam){
                this.detail(this.method);
            }

        });
    }

    ngOnInit(): void {
        this.geListYears();
        this.getListLinhVucNghienCuu();
        this.getListCapDoSK();
        this.getListDonViChuDauTu();
        this.getListChucDanh();
        if (this.actionType == 'THEMMOI') {
            this.getListFolderFile();
            this.addTacGia();
            this.addFirstTimeAdopter();
        }
    }

    geListYears() {
        var obj = {NAME: 0, ID: 0};
        var year = new Date().getFullYear();
        var yearStart = year - 4;
        var yearEnd = yearStart + 10;
        for (let i = yearStart; i <= yearEnd; i++) {
            obj = {NAME: i, ID: i};
            this.listYears.push(obj);
        }
        this.form.get('nam').setValue(new Date().getFullYear());
    }

    getListFolderFile() {
        this._serviceApi
            .execServiceLogin('EEB9967E-0EEB-43AC-A2F7-1CB64C51377B', null)
            .subscribe((data) => {
                console.log(data.data);
                this.listFolderFile = data.data || [];
                let val = this.form.get('listFolderFile') as FormArray;
                for (let i = 0; i < this.listFolderFile.length; i++) {
                    val.push(this.newFolder(this.listFolderFile[i]));
                }
            });
    }

    newFolder(item?: any) {
        return this._formBuilder.group({
            maFolder: item?.maFolder,
            fileName: item?.fileName,
            ghiChu: item?.ghiChu,
            listFile: this._formBuilder.array([
                //this.addFile2()
            ]),
        });
    }

    getListLinhVucNghienCuu() {
        this._serviceApi
            .execServiceLogin('FF1D2502-E182-4242-A754-BCCC29B70C61', null)
            .subscribe((data) => {
                console.log(data.data);
                this.listLinhVucNghienCuu = data.data || [];
            });
    }

    getListCapDoSK() {
        this._serviceApi
            .execServiceLogin('825C8F49-51DE-417E-AACD-FBDB437346AB', null)
            .subscribe((data) => {
                let allRank = data?.data;
                if (this.actionType === 'NANGCAPSK') {
                    const newArray = [];
                    for (let i = 0; i < allRank.length; i++) {
                        if (allRank[i].ID !== this.oldInitiativeRank) {
                            newArray.push(allRank[i]);
                            continue;
                        }
                        break;
                    }
                    allRank = newArray;
                }
                this.listCapDo = allRank || [];
            });
    }

    getListDonViChuDauTu() {
        this._serviceApi
            .execServiceLogin('176BC0B0-7431-47F0-A802-BEDF83E85261', null)
            .subscribe((data) => {
                console.log(data.data);
                this.listDonViChuDauTu = data.data || [];
            });
    }

    initForm(actionType) {
        this.form = this._formBuilder.group({
            method: actionType,
            maSangKien: [null],
            maTrangThai: [null],
            nam: [null, [Validators.required]],
            capDoSangKien: [null, [Validators.required]],
            donViApDungInfo: {},
            donViApDung: [null, [Validators.required]],
            donViChuDauTuInfo: {},
            donViChuDauTu: [null, [Validators.required]],
            tenGiaiPhap: [null, [Validators.required]],
            tacGiaGiaiPhap: this._formBuilder.array([]),
            firstTimeAdopters: this._formBuilder.array([]),
            linhVucNghienCuu: [null, [Validators.required]],
            uuNhuocDiem: [null, [Validators.required]],
            noiDungGiaiPhap: [null, [Validators.required]],
            ngayApDung: [null],
            quaTrinhApDung: [null],
            hieuQuaThucTe: [null],
            tomTat: [null],
            thamGiaToChuc: [null],
            soTienLamLoi: 0,
            donDangKy: [null],
            thuTruongDonVi: [null],
            taiLieuDinhKem: [null],
            listFolderFile: this._formBuilder.array([]),
            listFolderFileThuLao: this._formBuilder.array([]),
            listFolderFileHDXD: this._formBuilder.array([]),
            danhSachThanhVienHD: this._formBuilder.array([]),
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    addFile(item, itemVal, base64) {
        return this._formBuilder.group({
            fileName: itemVal.name,
            base64: base64,
            size: itemVal.size,
            sovanban: '',
            mafile: '',
        });
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
        event.target.files.value = null;
    }

    detail(method) {
        this._serviceApi
            .execServiceLogin('0CCBA90A-07BA-482E-85AA-A129FD4B7EE5', [
                {name: 'MA_SANGKIEN', value: this.idParam},
                {name: 'METHOD_BUTTON', value: method},
            ])
            .subscribe((data) => {
                this.form.patchValue(data.data);
                this.oldInitiativeRank = data.data?.capDoSangKien;
                this.data = data.data;
                this.hoidongs = data.data.danhSachThanhVienHD;
               // this.lstDanhSachThanhVienHD =data.data?.danhSachThanhVienHD;
                let formDocParent = this.form.get(
                    'listFolderFile'
                ) as FormArray;
                if (data.data?.listFolderFile != null) {
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


                let formDocParentHDXD = this.form.get(
                    'listFolderFileHDXD'
                ) as FormArray;
                if (data.data?.listFolderFileHDXD != null) {
                    let listFolderHDXD = data.data.listFolderFileHDXD;

                    for (let i = 0; i < listFolderHDXD.length; i++) {
                        formDocParentHDXD.push(
                            this.addListDocParent(listFolderHDXD[i])
                        );
                        if (
                            listFolderHDXD[i].listFile != null &&
                            listFolderHDXD[i].listFile.length > 0
                        ) {
                            let formChild = formDocParentHDXD
                                .at(i)
                                .get('listFile') as FormArray;
                            for (
                                let j = 0;
                                j < listFolderHDXD[i].listFile.length;
                                j++
                            ) {
                                formChild.push(
                                    this.addListDocChild(
                                        listFolderHDXD[i].listFile[j]
                                    )
                                );
                            }
                        }
                    }
                }


                let formDocParentThuLao = this.form.get(
                    'listFolderFileThuLao'
                ) as FormArray;
                if (data.data?.listFolderFileThuLao != null) {
                    let listFolderThuLao = data.data.listFolderFileThuLao;

                    for (let i = 0; i < listFolderThuLao.length; i++) {
                        formDocParentThuLao.push(
                            this.addListDocParent(listFolderThuLao[i])
                        );
                        if (
                            listFolderThuLao[i].listFile != null &&
                            listFolderThuLao[i].listFile.length > 0
                        ) {
                            let formChild = formDocParentThuLao
                                .at(i)
                                .get('listFile') as FormArray;
                            for (
                                let j = 0;
                                j < listFolderThuLao[i].listFile.length;
                                j++
                            ) {
                                formChild.push(
                                    this.addListDocChild(
                                        listFolderThuLao[i].listFile[j]
                                    )
                                );
                            }
                        }
                    }
                }

                let linhVucNghienCuu = this.form.get('linhVucNghienCuu').value;
                if (linhVucNghienCuu) {
                    this.form
                        .get('linhVucNghienCuu')
                        .setValue(linhVucNghienCuu);
                }

                 // danh sách hoi dong
                 if (data.data != null && data.data.danhSachThanhVienHD != null) {
                    let listHD =data.data.danhSachThanhVienHD;
                    let formThanhVienHD = this.form.get(
                        'danhSachThanhVienHD'
                    ) as FormArray;

                    for (
                        let i = 0;
                        i < listHD.length;
                        i++
                    ) {
                        formThanhVienHD.push(
                            this.THEM_THANHVIEN(listHD[i])
                        );
                    }
                }

                // danh sách thành viên
                if (data.data != null && data.data.tacGiaGiaiPhap != null) {
                    let formThanhVien = this.form.get(
                        'tacGiaGiaiPhap'
                    ) as FormArray;

                    for (
                        let i = 0;
                        i < data.data.tacGiaGiaiPhap.length;
                        i++
                    ) {
                        formThanhVien.push(
                            this.THEM_THANHVIEN(data.data.tacGiaGiaiPhap[i])
                        );
                    }
                }

                if (data.data != null && data.data.firstTimeAdopters != null) {
                    const firstTimeAdopters = this.form.get(
                        'firstTimeAdopters'
                    ) as FormArray;

                    for (
                        let i = 0;
                        i < data.data.firstTimeAdopters.length;
                        i++
                    ) {
                        firstTimeAdopters.push(
                            this.THEM_THANHVIEN(data.data.firstTimeAdopters[i])
                        );
                    }
                }
                //this.selectedYear = parseInt(data.data.nam);
                this.data?.listFolderFile?.forEach((e) => {
                    if (e.maFolder === 'VBDANGKY') {
                        this.listFileVB = e.listFile;
                    } else if (e.maFolder === 'KHAC') {
                        this.listFileOther = e.listFile || [];
                    }
                })
                this.listAuthor = this.data.danhSachThanhVien;
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

    addTacGia() {
        let ar = this.form.get('tacGiaGiaiPhap') as FormArray;
        ar.push(this.addMember());
    }

    addMember() {
        return this._formBuilder.group({
            maThanhVien: '',
            ten: '',
            namSinh: null,
            chucDanh: '',
            soDienThoai: '',
            email: '',
            diaChiNoiLamViec: '',
            thanhTuu: '',
            noiDungThamGia: '',
        });
    }

    THEM_THANHVIEN(item?: any): FormGroup {
        return this._formBuilder.group({
            maThanhVien: item?.maThanhVien || null,
            ten: item?.ten || null,
            namSinh: item?.namSinh || null,
            chucDanh: item?.chucDanh || null,
            tenChucDanh: item?.tenChucDanh || null,
            soDienThoai: item?.soDienThoai || null,
            email: item?.email || null,
            donViCongTac: item?.donViCongTac || null,
            diaChiNoiLamViec: item?.diaChiNoiLamViec || null,
            thanhTuu: item?.thanhTuu || null,
            noiDungThamGia: item?.noiDungThamGia || null,
        });
    }

    openAlertDialog(type, item?: any) {
        let data = this.dialog.open(PopupCbkhComponent, {
            data: {
                type: type,
                orgId: this.orgId,
                message: 'HelloWorld',
                buttonText: {
                    cancel: 'Done',
                },
            },
            width: '800px',
            maxHeight: '80vh',
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
                console.log('data1', data);
                item.get('ten').setValue(data.data.username);
                item.get('maThanhVien').setValue(data.data.userId);
                item.get('diaChiNoiLamViec').setValue(data.data.orgName);
            } else if (type == 'DKAPDUNGSK') {
                console.log('data1', data);
                //   console.log(item);
                //  item.get('ten').setValue(data.data.username);
                item.get('donViApDung').setValue(data.data.name);
                item.get('donViApDungInfo').setValue(data.data);
                this.orgId = data.data.id;
            }
        });
    }

    getListChucDanh() {
        this._serviceApi
            .execServiceLogin('1450CB9E-4224-408C-900D-1CB4B7E643EF', null)
            .subscribe((data) => {
                this.listChucDanh = data.data || [];
            });
    }

    removeItem(items, i) {
        // remove address from the list
        const control = items.get('tacGiaGiaiPhap');
        control.removeAt(i);
    }

    onSubmit(status, method) {
        this.submitted.check = true;
        for (let i = 0; i < this.form.value.tacGiaGiaiPhap.length; i++) {
            if (!(!!this.form.value.tacGiaGiaiPhap[i]) || this.form.value.tacGiaGiaiPhap[i].ten === "") {
                this.removeItem(this.form, i);
            }
        }
        const appliedDateControl = this.form.get('ngayApDung');
        if (appliedDateControl && appliedDateControl.status && appliedDateControl.status === 'INVALID') {
            this._messageService.showErrorMessage('Lỗi', 'Ngày áp dụng chính thức không hợp lệ');
            return;
        }
        if (this.form.invalid) {
            this._messageService.showErrorMessage("Thông báo", "Chưa nhập đủ trường bắt buộc!")
            return;
        }
        console.log(this.form.value);
        this.form.get('method').setValue(method);
        const hasInvalidAuthorInput = this.form.get('tacGiaGiaiPhap')?.value?.find(e => !e.chucDanh);
        if (hasInvalidAuthorInput) {
            this._messageService.showErrorMessage('Lỗi', 'Vui lòng lựa chọn vai trò tác giả');
            return;
        }
        //this.form.get('nam').setValue(new Date().getFullYear());
       // if (method == 'SUA') {
        if (this.actionType === 'NANGCAPSK') {
            this.form.get('maTrangThai').setValue(null);
        }
            let maTrangThai = this.form.get('maTrangThai').value;
            this.form.get('maSangKien').setValue(this.idParam);
            if (status == 'LUU') {
                if (maTrangThai != null && maTrangThai != '') {
                } else {
                    this.form.get('maTrangThai').setValue('SOAN');
                }
            } else if (status == 'LUUGUI') {

                const listFolder: any[] = this.form.get('listFolderFile').value;
                const hasApplicationForm = listFolder.find(e => e.maFolder === 'VBDANGKY' && e.listFile && e.listFile.length > 0);
                if (!hasApplicationForm) {
                    this._messageService.showErrorMessage(
                        'Thông báo',
                        'Vui lòng nhập đơn đăng ký.'
                    );
                    return;
                }
                if (maTrangThai != null && maTrangThai != '' && maTrangThai != 'SOAN' && maTrangThai != 'CHUA_GUI' && maTrangThai != 'Y_CAU_HIEU_CHINH' && maTrangThai !='KHONG_CONG_NHAN') {
                } else {
                this.form.get('maTrangThai').setValue('CHO_RA_SOAT');
                }
            }
            if (this.actionType == 'THONGTINSK') {
                this.form.get('maSangKien').setValue('');
                if (status == 'LUU') {

                        this.form.get('maTrangThai').setValue('SOAN');

                } else if (status == 'LUUGUI') {
                    const listFolder: any[] = this.form.get('listFolderFile').value;
                    const hasApplicationForm = listFolder.find(e => e.maFolder === 'VBDANGKY' && e.listFile && e.listFile.length > 0);
                    if (!hasApplicationForm) {
                        this._messageService.showErrorMessage(
                            'Thông báo',
                            'Vui lòng nhập đơn đăng ký.'
                        );
                        return;
                    }
                    this.form.get('maTrangThai').setValue('CHO_RA_SOAT');
                }
            }

      //  }
        var token = localStorage.getItem('accessToken');
            const userParameter = [{name: 'SANG_KIEN', value: JSON.stringify(this.form.value)},
                {name: 'TOKEN_LINK', value: token}];
            if (this.actionType === 'NANGCAPSK') {
                userParameter.push({name: 'IS_UPGRADING_INITIATIVE', value: 'true'});
            }
        this._serviceApi
            .execServiceLogin('09E301E6-9C2E-424C-A3C3-FD46CE8CB18C', userParameter)
            .subscribe((data) => {
                if (data.status == 1) {
                    this._messageService.showSuccessMessage(
                        'Thông báo',
                       data.message
                    );
                    window.history.back();
                } else {
                    this._messageService.showErrorMessage(
                        'Thông báo',
                        data.message
                    );
                }
            });
    }

    exportMau() {
        if (this.idParam != undefined && this.idParam != null) {
            this._serviceApi
                .execServiceLogin('53BE3925-262C-4FB9-A2D4-6C898521D9EF', [
                    {name: 'MA_SANGKIEN', value: this.idParam},
                ])
                .subscribe((data) => {
                    this.downloadTempExcel(
                        data.data,
                        'MAU_SANG_KIEN.docx'
                    );
                });
        } else {
            this._messageService.showWarningMessage(
                'Thông báo',
                'Chức năng này không được sử dụng.'
            );
        }
    }

    deleteItemFile(items, i) {
        // const control = items.get('listFile');
        items.get('listFile').removeAt(i);
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

      public objectComparisonLVUC_NCUU = function (option, value): boolean {
        return option.MA_LVUC_NCUU === value.MA_LVUC_NCUU;
    }
    
    checkYear(event) {
        let now = new Date();
        let year = now.getFullYear();
        if (event.target.value >= year) {
            this._messageService.showErrorMessage("Lỗi!", "Năm sinh của tác giả không được lớn hơn hiện tại");
            event.target.value = null;
        }
        else {
            return;
        }
    }
    formatVND(input): string {
        let money: number = +input;
        let vnd = money.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        return vnd;
    }

    addFirstTimeAdopter(): void {
        const ar = this.form.get('firstTimeAdopters') as FormArray;
        ar.push(this.addMember());
    }

    removeFirstTimeAdopter(items, i: number): void {
        const control = items.get('firstTimeAdopters');
        control.removeAt(i);
    }
}

