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
import { FormArray, UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'component-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListItemComponent implements OnInit, OnDestroy {
    public selectedYear: number;
    public actionClick: string = null;
    public getYearSubscription: Subscription;
    public getGiaoSubcription: Subscription;
    public listYears = [];
    public listGiao = [];
    public form;
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
            capDoSangkien: [null, [Validators.required]],
            nam: [null],
            donViChuDauTu: [null, [Validators.required]],
            donViApDung: [null, [Validators.required]],
            tenGiaiPhap: [null, [Validators.required]],
            tacGia: this._formBuilder.array([]),
            linhVucSanKien: [null],
            uuNhuocDiem: [null, [Validators.required]],
            noiDungGiaiPhap: [null, [Validators.required]],
            ngayApDung: [null],
            quaTrinhApDung: [null],
            hieuQuaThucTe: [null],
            tomTat: [null],
            danhSachNguoiThamGia: [null],
            soTienLamLoi: [null],
            hoSoTaiLieuDangKy: this._formBuilder.array([]),
            hoSoTaiLieuXetDuyetCongNhan: this._formBuilder.array([]),
        });
    }

    ngOnInit(): void {
        this.geListYears();
        this.getListDinhHuong();
    }

    geListYears() {
        this.getYearSubscription = this._serviceApi
            .execServiceLogin('E5050E10-799D-4F5F-B4F2-E13AFEA8543B', null)
            .subscribe((data) => {
                this.listYears = data.data || [];
            });
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
    openAlertDialog() {
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
                   
                        this._router.navigateByUrl('nghiepvu/tracuu/capnhat-sangkien');
                    
                } else {
                    this._messageService.showErrorMessage(
                        'Thông báo',
                        data.message
                    );
                }
            });
    }
}
