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
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MessageService } from 'app/shared/message.services';
import { SnotifyToast } from 'ng-alt-snotify';
import { State } from 'app/shared/commons/conmon.types';
import { BaseDetailInterface } from 'app/shared/commons/basedetail.interface';
import { UserService } from 'app/core/user/user.service';
import { BaseComponent } from 'app/shared/commons/base.component';
import { FunctionService } from 'app/core/function/function.service';
import { lstdetaicuatoiService } from '../lstsangkiencuatoi.service';
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
    public actionType: string = null;
    public form: FormGroup;
    public idParam: string = null;
    public method = null;
    public submitted = { check: false };
    public listChucDanh = [];
    public listLinhVucNghienCuu;
    public listDonViChuDauTu = [];
    public listCapDo = [];
    public listFolderFile = [];
    public screen;

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
            if (this.actionType == 'updateActionHSTH') {
                this.method = 'CAPNHATHSTHUCHIEN';
            }
            this.initForm(this.method);
            this.detail(this.method);
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
        }
    }

    geListYears() {
        var obj = { NAME: 0, ID: 0 };
        var year = new Date().getFullYear();
        var yearStart = year - 4;
        var yearEnd = yearStart + 10;
        for (let i = yearStart; i <= yearEnd; i++) {
            obj = { NAME: i, ID: i };
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
                console.log(data.data);
                this.listCapDo = data.data || [];
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
        console.log(item);
    }

    detail(method) {
        this._serviceApi
            .execServiceLogin('F360054F-7458-443A-B90E-50DB237B5642', [
                { name: 'MA_DE_TAI', value: this.idParam },
                { name: 'METHOD_BUTTON', value: method },
            ])
            .subscribe((data) => {
                this.form.patchValue(data.data);
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
            namSinh: '',
            chucDanh: '',
            soDienThoai: '',
            email: '',
            donViCongTac: '',
            trinhDoChuyenMon: '',
            noiDung: '',
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
                item.get('donViApDungInfo').setValue(data.data);
                item.get('donViApDung').setValue(data.data.name);
            }
        });
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
        const control = items.get('tacGiaGiaiPhap');
        control.removeAt(i);
    }

    onSubmit(status, method) {
        // this.submitted.check = true;
        // if (this.form.invalid) {
        //     return;
        // }
        console.log(this.form.value);
        this.form.get('method').setValue(method);
        //this.form.get('nam').setValue(new Date().getFullYear());
        if (method == 'SUA') {
            if (status == 'LUU') {
                this.form.get('maTrangThai').setValue('SOAN');
            } else if (status == 'LUUGUI') {
                this.form.get('maTrangThai').setValue('CHO_RA_SOAT');
            }
        }
        var token = localStorage.getItem('accessToken');
        this._serviceApi
            .execServiceLogin('09E301E6-9C2E-424C-A3C3-FD46CE8CB18C', [
                { name: 'SANG_KIEN', value: JSON.stringify(this.form.value) },
                { name: 'TOKEN_LINK', value: token },
            ])
            .subscribe((data) => {
                if (data.status == 1) {
                    this._messageService.showSuccessMessage(
                        'Thông báo',
                        data.message
                    );
                    if(this.screen){
                        this._router.navigateByUrl(this.screen);
                    }else{
                        this._router.navigateByUrl('nghiepvu/sangkien/lstsangkiencuatoi');
                    }
                   
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
                .execServiceLogin('FC95C3F7-942F-4C7E-88D7-46E12BFE9185', [
                    { name: 'MA_KE_HOACH', value: this.idParam },
                ])
                .subscribe((data) => {
                    this.downloadTempExcel(
                        data.data,
                        'DANH_SACH_DANG_KY_DINH_HUONG.docx'
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
                .subscribe((data) => {
                    console.log('downloadFile:' + JSON.stringify(data));
                });
        }
    }
}
