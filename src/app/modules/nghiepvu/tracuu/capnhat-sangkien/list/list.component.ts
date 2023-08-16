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
import { NghiemThuService } from '../capnhat-sangkien.service';
import { CapnhatSangkienComponent } from '../capnhat-sangkien.component';
import { ServiceService } from 'app/shared/service/service.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PopupFileComponent } from 'app/shared/component/popup-file/popup-filecomponent';
import { PopupConfirmComponent } from 'app/shared/component/popup-confirm/popup-confirmcomponent';
import { AbstractControl,FormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { PopupCbkhComponent } from 'app/modules/nghiepvu/sangkien/lstsangkiencuatoi/detail/popup-cbkh/popup-cbkh.component';
import { DatetimeAdapter } from '@mat-datetimepicker/core';
import {
    MatDatepicker,
    MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { moneyDirective } from 'app/shared/fomat-money.directive';
import {
    MatNativeDateModule,
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
    selector: 'component-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
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
export class ListItemComponent implements OnInit, OnDestroy {
    public selectedYear: number;
    public actionClick: string = null;
    public getYearSubscription: Subscription;
    public getGiaoSubcription: Subscription;
    public listYears = [];
    public listGiao = [];
    public listFolderFile = [];
    public listCapDo =[];
    public listDonViChuDauTu =[];
    public listChucDanh = [];
    public form;
    public listLinhVucNghienCuu;
    public submitted = {check: false};
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
        public dialog: MatDialog,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.initForm('THEMMOI');
        this._activatedRoute.queryParams.subscribe((params) => {
            if (params?.type) {
                this.actionClick = params?.type;
            } else {
                this.actionClick = null;
            }
        });
    }
    initForm(actionType) {
        this.form = this._formBuilder.group({
            method: actionType,
            maSangKien: [null],
            maTrangThai: [null],
            nam: new Date().getFullYear(),
            capDoSangKien: [null, [Validators.required]],
            donViApDungInfo: {},
            donViApDung: [null, [Validators.required]],
            donViChuDauTuInfo: {},
            donViChuDauTu: [null, [Validators.required]],
            tenGiaiPhap: [null, [Validators.required]],
            tacGiaGiaiPhap: this._formBuilder.array([]),
            linhVucNghienCuu: [null, [Validators.required]],
            uuNhuocDiem: [null, [Validators.required]],
            noiDungGiaiPhap: [null, [Validators.required]],
            ngayApDung: [null],
            quaTrinhApDung: [null],
            hieuQuaThucTe: [null],
            tomTat: [null],
            thamGiaToChuc: [null],
            soTienLamLoi: [null],
            donDangKy: [null],
            thuTruongDonVi: [null],
            taiLieuDinhKem: [null],
            listFolderFile: this._formBuilder.array([]),
            capDoSangkien: [null, [Validators.required]],
            tacGia: this._formBuilder.array([]),
            linhVucSanKien: [null],
            danhSachNguoiThamGia: [null],
            listFolderHSDK: this._formBuilder.array([]),
            listFolderHSXD: this._formBuilder.array([]),
        });
    }

    ngOnInit(): void {
        this.getListFolder();
        this.geListYears();
        this.getListDonViChuDauTu();
        this.getListCapDoSK();
        this.getListChucDanh();
        this.getListLinhVucNghienCuu();
    }

    getListLinhVucNghienCuu() {
        this._serviceApi
            .execServiceLogin('FF1D2502-E182-4242-A754-BCCC29B70C61', null)
            .subscribe((data) => {
                console.log(data.data);
                this.listLinhVucNghienCuu = data.data || [];
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
    removeItem(items, i) {
        // remove address from the list
        const control = items.get('tacGiaGiaiPhap');
        control.removeAt(i);
    }

    getListChucDanh() {
        this._serviceApi
            .execServiceLogin('AF87AA00-EC9C-4B1E-9443-CE0D6E88F1C6', null)
            .subscribe((data) => {
                this.listChucDanh = data.data || [];
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

    getListCapDoSK() {
        this._serviceApi
            .execServiceLogin('825C8F49-51DE-417E-AACD-FBDB437346AB', null)
            .subscribe((data) => {
                console.log(data.data);
                this.listCapDo = data.data || [];
            });
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

    addNew(): void {
        this._router.navigate(['/nghiepvu/detainhiemvu/lstdetaicuatoi'], {
            queryParams: { type: 'THEMMOI' },
        });
    }

    ngOnDestroy() {
        this.getYearSubscription.unsubscribe();
        this.getGiaoSubcription.unsubscribe();
    }
    getListFolder() {
        this.getGiaoSubcription = this._serviceApi
            .execServiceLogin('8EBCEDE9-F218-4896-812B-DC9B7EE480CA', null)
            .subscribe((data) => {
                this.listFolderFile = data.data || [];
                debugger;
                if(this.listFolderFile != null && this.listFolderFile.length >0){
                    let valDk = this.form.get('listFolderHSDK') as FormArray;
                    let listDK = this.listFolderFile.filter(c => c.DANG_KY==true);
                    for (let i = 0; i < listDK.length; i++) {
                    
                        valDk.push(this.newFolder(listDK[i]));
                    }

                    let valHSXD = this.form.get('listFolderHSXD') as FormArray;
                    let listHSXD = this.listFolderFile.filter(c => c.DANG_KY !=true && c.RA_SOAT !=true && c.PHE_DUYET !=true);
                    for (let i = 0; i < listHSXD.length; i++) {
                    
                        valHSXD.push(this.newFolder(listHSXD[i]));
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
                console.log('data1', data);
                console.log(item);
                item.get('ten').setValue(data.data.username);
                item.get('maThanhVien').setValue(data.data.userId);
            } else if (type == 'DKAPDUNGSK') {
                console.log('data1', data);
                //   console.log(item);
                //  item.get('ten').setValue(data.data.username);
                item.get('donViApDung').setValue(data.data.name);
                item.get('donViApDungInfo').setValue(data.data);
            }
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    detail(item) {
        this._router.navigate(['/nghiepvu/sangkien/lstsangkiencuatoi'], {
            queryParams: { type: 'CHITIET' },
        });
    }

    updateAction(item) {
        this._router.navigate(['/nghiepvu/sangkien/lstsangkiencuatoi'], {
            queryParams: { type: 'THEMMOI' },
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
    downLoadFile(item) {}
    deleteItemFile(item, idex) {}

    onSubmit(status, method) {
        // this.submitted.check = true;
        // if (this.form.invalid) {
        //     return;
        // }
        this.form.get('maTrangThai').setValue(status);
        var token = localStorage.getItem('accessToken');
        this._serviceApi
            .execServiceLogin('ADB68831-D89B-423A-934C-DC917A479491', [
                {name: 'SANG_KIEN', value: JSON.stringify(this.form.value)},
                {name: 'TOKEN_LINK', value: token},
            ])
            .subscribe((data) => {
                if (data.status == 1) {
                    this._messageService.showSuccessMessage(
                        'Thông báo',
                        data.message
                    );
                   
                        this._router.navigateByUrl('nghiepvu/sangkien/capnhat');
                    
                } else {
                    this._messageService.showErrorMessage(
                        'Thông báo',
                        data.message
                    );
                }
            });
    }
}
