import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
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
import { DangThucHienService } from '../dangthuchien.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ServiceService } from 'app/shared/service/service.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupCbkhComponent } from './popup-cbkh/popup-cbkh.component';
import { User } from 'app/core/user/user.types';
import { DOfficeService } from 'app/shared/service/doffice.service';
import { DOfficeComponent } from 'app/shared/component/d-office/d-office.component';
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
    public selectedYear: number;
    public getYearSubscription: Subscription;
    public listYears = [];
    public actionType = null;
    public listThang = [];
    public method = null;
    public form: FormGroup;
    public idParam: string = null;
    public soLanGiaHan: number;
    submitted = {check: false};
    //add
    public dataFile = [];
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
        //add
        private _userService: UserService,
        private _dOfficeApi: DOfficeService,
    ) {
        this.idParam = this._activatedRoute.snapshot.paramMap.get('id');
        console.log('this.idParam',this.idParam);
        this._activatedRoute.queryParams.subscribe((params) => {
            if (params?.type) {
                this.actionType = params?.type;
            } else {
                this.actionType = null;
            }
            console.log(this.actionType);
            if (this.actionType == 'updateActionHSTH') {
                this.method = 'CAPNHATHSTHUCHIEN';
            } else if (this.actionType == 'updateActionGH') {
                this.method = 'GIAHAN';
            }
            this.initForm(this.method);
            this.detail(this.method);
        });
    }

    initForm(actionType) {
        this.form = this._formBuilder.group({
            maDeTai: [null],
            lyDo: [null],
            thang: [null, [Validators.required]],

            lanGiaHanThu: [null],
            soLanGiaHan: 0,
            thoiGianHop: [null],
            ketQuaPhieuDanhGia: [null],
            ketLuanKienNghiHD: [null],
            diaDiem: [null],
            method: actionType,
            maTrangThai: [null],
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
            noiDungGuiMail: [null],
            listFolderFile: this._formBuilder.array([]),
            listFile: this._formBuilder.array([]),
            // listFile1: this._formBuilder.array([]),
            // listFile2: this._formBuilder.array([]),
            // listFile3: this._formBuilder.array([]),
            // listFile4: this._formBuilder.array([]),
            // listFile5: this._formBuilder.array([]),
            // listFile6: this._formBuilder.array([]),
        });
    }

    detail(method) {
        this._serviceApi
            .execServiceLogin('F360054F-7458-443A-B90E-50DB237B5642', [
                { name: 'MA_DE_TAI', value: this.idParam },
                { name: 'METHOD_BUTTON', value: method },
            ])
            .subscribe((data) => {
                console.log(data.data);
                this.form.patchValue(data.data);
                let soLanGH = data.data.soLanGiaHan;
                if(soLanGH != undefined && soLanGH !=''){
                    this.soLanGiaHan =parseInt(soLanGH) + 1;
                    this.form.get("lanGiaHanThu").setValue(this.soLanGiaHan);
                }else{
                    this.soLanGiaHan =1
                    this.form.get("lanGiaHanThu").setValue(1);
                }
                
                let formDocParent = this.form.get(
                    'listFolderFile'
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
                if(method=='GIAHAN'){
                    this.form.get('soLanGiaHan').setValue(this.soLanGiaHan +1);
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
            sovanban: item?.sovanban || null,
            ngayVanBan: ngayVanBan || null,
            ngaySua: ngaySua || null,
            nguoiSua: item?.nguoiSua || null,
            nguoiCapnhap: item?.nguoiSua || null,
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
            ngayVanBan: ngayVanBan || null,
        });
    }
    getThang() {
        this.listThang = [];
        let thang =[]
        for (var i = 1; i <= 18; i++) {
            thang.push({ ID: i, NAME: i });
        }
        this.listThang = thang;
    }


    ngOnInit(): void {
        this.getCheckQuyenDoffice();
        this.geListYears();
        if (this.actionType == 'updateActionGH') {
            this.getThang();
        }
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
            fileName: itemVal?.name || null,
            base64: base64 || null,
            size: itemVal?.size || null,
            sovanban: '',
            mafile: '',
        });
    }
    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    onSubmit(status, method) {
        console.log(this.form.value);
         //this.submitted.checkFile = true;
         this.submitted.check = true;
         if (this.form.invalid) {
            this._messageService.showErrorMessage("Thông báo", "Chưa nhập đủ trường bắt buộc!")

              return;
          }
        this.form.get('method').setValue(method);
        var token = localStorage.getItem('accessToken');
        this._serviceApi
            .execServiceLogin('8565DAF2-842B-438E-B518-79A47096E2B5', [
                { name: 'DE_TAI', value: JSON.stringify(this.form.value) },
                { name: 'TOKEN_LINK', value: token },
            ])
            .subscribe((data) => {
                if (data.status == 1) {
                    this._messageService.showSuccessMessage(
                        'Thông báo',
                        'Thành công'
                    );
                    this._router.navigateByUrl('nghiepvu/detainhiemvu/dangthuchien');
                } else {
                    this._messageService.showErrorMessage(
                        'Thông báo',
                        data.message
                    );
                }
            });
    }
    // add
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
}
