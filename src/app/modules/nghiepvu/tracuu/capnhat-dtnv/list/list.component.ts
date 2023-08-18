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
import { NghiemThuService } from '../capnhat-dtnv.service';
import { CapnhatDtnvComponent } from '../capnhat-dtnv.component';
import { ServiceService } from 'app/shared/service/service.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PopupFileComponent } from 'app/shared/component/popup-file/popup-filecomponent';
import { PopupConfirmComponent } from 'app/shared/component/popup-confirm/popup-confirmcomponent';
import {
    AbstractControl,
    FormArray,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import moment, { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'app/modules/nghiepvu/detainhiemvu/lstdetaicuatoi/detail/details.component';
import { PopupCbkhComponent } from 'app/modules/nghiepvu/detainhiemvu/lstdetaicuatoi/detail/popup-cbkh/popup-cbkh.component';

@Component({
    selector: 'component-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class ListItemComponent implements OnInit, OnDestroy {
    public selectedYear: number;
    public actionClick: string = null;
    public getYearSubscription: Subscription;
    public getGiaoSubcription: Subscription;
    public listYears = [];
    public listGiao = [];
    public submitted = { check: false };
    public form;
    public listFolderFile=[];
    public ListFleDemo = [
        { id: 1, name: 'ten_file', kichthuoc: '20mb' },
        { id: 2, name: 'ten_file1', kichthuoc: '20mb' },
        { id: 3, name: 'ten_file2', kichthuoc: '20mb' },
    ];

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _messageService: MessageService,
        private _userService: UserService,
        public _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _functionService: FunctionService,
        private el: ElementRef,
        private _serviceApi: ServiceService,
        public dialog: MatDialog
    ) {
        this.initForm();
        this._activatedRoute.queryParams.subscribe((params) => {
            if (params?.type) {
                this.actionClick = params?.type;
            } else {
                this.actionClick = null;
            }

        });
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
            thoiGianThucHienTu: [moment(), [Validators.required]],
            thoiGianThucHienDen: [moment(), [Validators.required]],

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
            tongKinhPhi: [null],
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
        });
    }

    getListFolderFile() {
        this._serviceApi
            .execServiceLogin('4CBA7F5A-1825-4EAB-88BC-C44E5CED9AF4', null)
            .subscribe((data) => {
                this.listFolderFile = data.data || [];
                if(this.listFolderFile != null && this.listFolderFile.length >0){
                    let valDk = this.form.get('listFolderHSDK') as FormArray;
                    let listDK = this.listFolderFile.filter(c => c.DANG_KY==true);
                    for (let i = 0; i < listDK.length; i++) {
                    
                        valDk.push(this.newFolder(listDK[i]));
                    }

                    let valHsxd = this.form.get('listFolderHSXD') as FormArray;
                    let listHsxd = this.listFolderFile.filter(c => c.THUC_HIEN_GIAO_HOP_DONG==true);
                    for (let i = 0; i < listHsxd.length; i++) {
                    
                        valHsxd.push(this.newFolder(listHsxd[i]));
                    }

                    let valTamUng = this.form.get('listFolderFileTamUng') as FormArray;
                    let listTamUng = this.listFolderFile.filter(c => c.THUC_HIEN_TAM_UNG==true);
                    for (let i = 0; i < listTamUng.length; i++) {
                    
                        valTamUng.push(this.newFolder(listTamUng[i]));
                    }

                    let valHSNT = this.form.get('listFolderHSNT') as FormArray;
                    let listHSNT = this.listFolderFile.filter(c => c.NGHIEM_THU_HSO==true);
                    for (let i = 0; i < listHSNT.length; i++) {
                    
                        valHSNT.push(this.newFolder(listHSNT[i]));
                    }

                    let valBanGiao = this.form.get('listFolderBanGiao') as FormArray;
                    let listBanGiao = this.listFolderFile.filter(c => c.NGHIEM_THU_BGIAO_KET_QUA==true);
                    for (let i = 0; i < listBanGiao.length; i++) {
                    
                        valBanGiao.push(this.newFolder(listBanGiao[i]));
                    }

                    let valQuyetToan = this.form.get('listFolderQuyetToan') as FormArray;
                    let listQuyetToan = this.listFolderFile.filter(c => c.QUYET_TOAN==true);
                    for (let i = 0; i < listQuyetToan.length; i++) {
                    
                        valQuyetToan.push(this.newFolder(listQuyetToan[i]));
                    }
                    
                    
                }
                
            });
    }
     newFolder(item?: any) {
       
        return this._formBuilder.group({
            maFolder: item?.maFolder,
            fileName: item?.fileName,
            ghiChu: item?.ghiChu,
            listFile: this._formBuilder.array([]),
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    listKhoanChi = [];
    getListKhoanChi() {
        this._serviceApi
            .execServiceLogin('89191345-88FF-4C2E-B3CF-6FE315D6A631', null)
            .subscribe((data) => {
                this.listKhoanChi = data.data || [];
            });
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
        this.getListFolderFile();
        this.geListYears();
        this.getListDinhHuong();
        this.getListKhoanChi();
        this.getListNguonKinhPhi();
        this.getListChucDanh();
        this.getListHocVi();
        this.getListHocHam();
        this.getListGioiTinh();
        this.getListDonViChuTri();
        this.getListLinhVucNghienCuu();
        this.getListCapQuanLy();
    }

    listCapQuanLy = [];
    getListCapQuanLy() {
        this._serviceApi
            .execServiceLogin('2977F0EA-A6C6-4A32-A36B-8617898B710D', null)
            .subscribe((data) => {
                this.listCapQuanLy = data.data || [];
            });
    }

    listLinhVucNghienCuu = [];
    getListLinhVucNghienCuu() {
        this._serviceApi
            .execServiceLogin('FF1D2502-E182-4242-A754-BCCC29B70C61', null)
            .subscribe((data) => {
                this.listLinhVucNghienCuu = data.data || [];
            });
    }
    listDonViChuTri = [];
    listDonViCongTac = [];
    getListDonViChuTri() {
        this._serviceApi
            .execServiceLogin('D3F0F915-DCA5-49D2-9A5B-A36EBF8CA5D1', null)
            .subscribe((data) => {
                this.listDonViChuTri = data.data || [];
                this.listDonViCongTac = data.data || [];
            });
    }
    listNguonKinhPhi = [];
    getListNguonKinhPhi() {
        this._serviceApi
            .execServiceLogin('942181CC-FD57-42FE-8010-59B6FF1D26DB', null)
            .subscribe((data) => {
                this.listNguonKinhPhi = data.data || [];
            });
    }
    geListYears() {
        this.getYearSubscription = this._serviceApi
            .execServiceLogin('E5050E10-799D-4F5F-B4F2-E13AFEA8543B', null)
            .subscribe((data) => {
                this.listYears = data.data || [];
            });
    }
    listChucDanh = [];
    getListChucDanh() {
        this._serviceApi
            .execServiceLogin('AF87AA00-EC9C-4B1E-9443-CE0D6E88F1C6', null)
            .subscribe((data) => {
                this.listChucDanh = data.data || [];
            });
    }

    addNew(): void {
        this._router.navigate(['/nghiepvu/detainhiemvu/lstdetaicuatoi'], {
            queryParams: { type: 'THEMMOI' },
        });
    }
    listHocHam = [];
    getListHocHam() {
        this._serviceApi
            .execServiceLogin('1B009679-0ABB-4DBE-BBCF-E70CBE239042', null)
            .subscribe((data) => {
                this.listHocHam = data.data || [];
            });
    }

    listGioiTinh = [];
    getListGioiTinh() {
        var obj = { ID: 2, NAME: 'Nam' };
        this.listGioiTinh.push(obj);
        obj = { ID: 1, NAME: 'Nữ' };
        this.listGioiTinh.push(obj);
    }

    listHocVi = [];
    getListHocVi() {
        this._serviceApi
            .execServiceLogin('654CB6D4-9DD7-48B7-B3FD-8FDAC07FE950', null)
            .subscribe((data) => {
                this.listHocVi = data.data || [];
            });
    }

    removeItem(items, i) {
        // remove address from the list
        const control = items.get('danhSachThanhVien');
        control.removeAt(i);
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

    ngOnDestroy() {
        this.getYearSubscription.unsubscribe();
        this.getGiaoSubcription.unsubscribe();
    }

    getListDinhHuong() {
        this.getGiaoSubcription = this._serviceApi
            .execServiceLogin('E5050E10-799D-4F5F-B4F2-E13AFEA8543B', null)
            .subscribe((data) => {
                this.listGiao = data.data || [];
            });
    }
    //phân trang
    length = 500;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 25];
    showFirstLastButtons = true;

    handlePageEvent(event: PageEvent) {
        this.length = event.length;
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
    }

    // mo popup file
    openAlertDialog1() {
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

    addMember() {
        return this._formBuilder.group({
            maThanhVien: '',
            ten: '',
            chucDanh: '',
            soDienThoai: '',
            email: '',
            donViCongTac: '',
        });
    }

    addThanhVien() {
        let ar = this.form.get('danhSachThanhVien') as FormArray;
        ar.push(this.addMember());
    }
    editer(item) {
        this._router.navigate(['/nghiepvu/detainhiemvu/nghiemthu'], {
            queryParams: { type: 'CHINHSUA' },
        });
    }

    detail(item) {
        this._router.navigate(['/nghiepvu/detainhiemvu/lstdetaicuatoi'], {
            queryParams: { type: 'CHITIET' },
        });
    }

    updateActionHDNT(item) {
        this._router.navigate(['/nghiepvu/detainhiemvu/nghiemthu'], {
            queryParams: { type: 'updateActionHDNT' },
        });
    }

    updateActionKQNT(item) {
        this._router.navigate(['/nghiepvu/detainhiemvu/nghiemthu'], {
            queryParams: { type: 'updateActionKQNT' },
        });
    }
    updateActionHSQT(item) {
        this._router.navigate(['/nghiepvu/detainhiemvu/nghiemthu'], {
            queryParams: { type: 'updateActionHSQT' },
        });
    }

    downloadTempExcel(userInp, fileName) {
        var mediaType =
            'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';

        const downloadLink = document.createElement('a');

        downloadLink.href = mediaType + userInp;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    deleteItemFile(items, i) {
        const control = items.get('listFile');
        control.removeAt(i);
    }

    downLoadFile(item) {
        if (item.base64 != undefined && item.base64 != '') {
            let link = item.base64.split(',');
            let url = '';
            if (link.length > 1) {
                url = link[1];
            } else {
                url = link[0];
            }
            this.downloadTempExcel(url, item.fileName);
        } else {
            var token = localStorage.getItem('accessToken');
            this._serviceApi
                .execServiceLogin('2269B72D-1A44-4DBB-8699-AF9EE6878F89', [
                    { name: 'DUONG_DAN', value: item.duongdan },
                    { name: 'TOKEN_LINK', value: 'Bearer ' + token },
                ])
                .subscribe((data) => {});
        }
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

    listupload = [];
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
    }

    onSubmit(status, method) {
        var token = localStorage.getItem('accessToken');
        this.submitted.check = true;
        if (this.form.invalid) {
            return;
        }

    //    let listDK = this.form.get('listFolderHSDK').value;
    //    let listHSXD = this.form.get('listFolderHSXD').value;
    //    debugger;
    //    let listFile = this.form.get('listFolder') as FormArray;
    //    if(listDK != null && listDK.length >0){
    //     for(let i=0;i<listDK.length;i++){
    //         listFile.push(this.newFolder(listDK[i]));
    //     }
    //    }
    //    if(listHSXD != null && listHSXD.length >0){
    //     for(let i=0;i<listHSXD.length;i++){
    //         listFile.push(this.newFolder(listHSXD[i]));
    //     }
    //    }
    //    console.log(this.form.value);
    
        
        this.form.get('maTrangThai').setValue(status);
        this._serviceApi
        .execServiceLogin('8652B7BD-DE29-4698-B387-1566ABE92669', [
            { name: 'DE_TAI', value: JSON.stringify(this.form.value) },
            { name: 'TOKEN_LINK', value: token },
        ])
        .subscribe((data) => {
            if (data.status == 1) {
                this._messageService.showSuccessMessage(
                    'Thông báo',
                    data.message
                );
                // if (this.screen) {
                //     this._router.navigateByUrl(this.screen);
                // } else {
                    this._router.navigateByUrl(
                        'nghiepvu/tracuu/capnhat-dtnv'
                    );
               // }
            } else {
                this._messageService.showErrorMessage(
                    'Thông báo',
                    data.message
                );
            }
        });
    }
}
