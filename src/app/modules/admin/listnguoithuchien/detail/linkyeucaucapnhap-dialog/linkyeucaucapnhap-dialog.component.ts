import {Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MessageService} from 'app/shared/message.services';
import {Subject, takeUntil} from 'rxjs';
import {ListNguoiThucHienService} from '../../listnguoithuchien.service';

@Component({
    selector: 'linkyeucaucapnhap-dialog',
    templateUrl: './linkyeucaucapnhap-dialog.component.html',
    styleUrls: ['./linkyeucaucapnhap-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LinkYeuCauCapNhapComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    dialogForm: UntypedFormGroup;
    email: string;
    content: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialogRef: MatDialogRef<LinkYeuCauCapNhapComponent>,
        private _listUserService: ListNguoiThucHienService,
        private _messageService: MessageService,
        private _formBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {

        this.email = this.data.email;
        this.content = {
            type: "doc",
            content: [
                {
                    type: "heading",
                    attrs: {
                        level: 1,
                        align: null
                    },
                    content: [
                        {
                            type: "text",
                            text: "Kính gửi!"
                        }
                    ]
                },
                {
                    type: "paragraph",
                    attrs: {
                        align: null
                    },
                    content: [
                        {
                            type: "text",
                            text: "Để thực hiện đề tài Nghiên cứu KHCN do Anh/Chị đã đăng ký thực hiện, Xin mời Anh/Chị vào cập nhật thông tin Lý lịch khoa học theo đường link: "
                        },
                    ]
                },
                {
                    type: "paragraph",
                    attrs: {
                        align: null
                    },
                    content: [
                        {
                            type: "text",
                            marks: [
                                {
                                    type: "link",
                                    attrs: {
                                        href: this.data.link,
                                        title: "Đường dẫn cập nhật thông tin",
                                        target: "_blank"
                                    }
                                }
                            ],
                            text: this.data.link
                        }
                    ]
                },
                {
                    type: "heading",
                    attrs: {
                        level: 2,
                        align: null
                    },
                    content: [
                        {
                            type: "text",
                            text: "Trân trọng!"
                        }
                    ]
                }
            ]
        };
        this.content = "<h4>Kính gửi!</h4><h4><p>   Để thực hiện đề tài Nghiên cứu KHCN do Anh/Chị đã đăng ký thực hiện, Xin mời Anh/Chị vào cập nhật thông tin Lý lịch khoa học theo đường link: </p><p><a href=\"" + this.data.link + "\" title=\"Cập nhật hồ sơ\" target=\"_self\"><span style=\"color:#d93f0b;\">" + this.data.link + "</span></a></p></h4><h4>Trân trọng</h4>"
        this.dialogForm = this._formBuilder.group({
            email: [this.email, Validators.email],
            content: new FormControl({value: this.content, disabled: false}, Validators.required),
        });
        this.dialogForm.get('email').valueChanges.subscribe((value) => {
            this.email = value;
        });
        this.dialogForm.get('content').valueChanges.subscribe((value) => {

            this.content = value;
        });
    }

    close(): void {
        this.matDialogRef.close();
    }

    async copyToClipboard() {
        await navigator.clipboard.writeText(this.data.link);
    }

    sendmail() {
        if (!this.dialogForm.valid) {
            this.dialogForm.markAllAsTouched();
            this._messageService.showWarningMessage(
                'Thông báo',
                'Thông tin bạn nhập chưa đủ hoặc không hợp lệ'
            );
            return false;
        } else {
            let obj: any = {};
            obj.MA_EMAIL = this.generateRandomUUID();
            obj.NHOM_NGUOI_NHAN = this.email;
            obj.TIEU_DE = 'Yêu cầu cập nhật thông tin';
            obj.LOAI = 'NGHIEP_VU';
            // Có html và dấu
            obj.NOI_DUNG = this.content;
            //Có html và không dâu
            // obj.NOI_DUNG =
            //     '<html>' +
            //     '<head>' +
            //     "<meta charset='UTF-8'>" +
            //     '</head>' +
            //     '<body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">' +
            //     '<p style="font-style: italic;">Chao ' +
            //     this.data.TEN_NGUOI_THUC_HIEN +
            //     ',</p>' +
            //     '<p>Rat mong email nay tim ban trong tinh trang tot dep. Toi viet de yeu cau thuc hien mot so thay doi ve thong tin tai khoan cua minh.</p>' +
            //     '<p>De cap nhat thong tin tai khoan cua toi, vui long truy cap vao duong link duoi day:</p>' +
            //     '<a ' +
            //     'style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 4px;"' +
            //     " href='" +
            //     this.data.link +
            //     "'>Cap nhat thong tin tai khoan</a>" +
            //     '<p>Tran trong,</p>' +
            //     '<h3 style="font-size:small;">CONG TY VIEN THONG DIEN LUC VA CONG NGHE THONG TIN - EVNICT</h3>' +
            //     '<p style="font-size:small;">Tru so chinh: Tang 15, 16, 17, 18 Toa nha EVN, 11 Cua Bac - Quan Ba Dinh - TP.Ha noi</p>' +
            //     '</body>' +
            //     '</html>';
            //Không html không dấu
            // obj.NOI_DUNG =
            //     'Chao ' +
            //     this.data.TEN_NGUOI_THUC_HIEN +
            //     ',\n' +
            //     'Rat mong email nay tim ban trong tinh trang tot dep. Toi viet de yeu cau thuc hien mot so thay doi ve thong tin tai khoan cua minh.\n' +
            //     'De cap nhat thong tin tai khoan cua toi, vui long truy cap vao duong link duoi day:\n' +
            //     this.data.link +
            //     '\n' +
            //     'Tran trong,\n' +
            //     'CONG TY VIEN THONG DIEN LUC VA CONG NGHE THONG TIN - EVNICT,\n' +
            //     'Tru so chinh: Tang 15, 16, 17, 18 Toa nha EVN, 11 Cua Bac - Quan Ba Dinh - TP.Ha noi,\n';

            this._listUserService
                .guiMailToDB(obj)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result: any) => {
                    switch (result) {
                        case 0:
                            this._messageService.showErrorMessage(
                                'Thông báo',
                                'Gửi yêu cầu gửi mail không thành công'
                            );
                            break;
                        case 1:
                            this._messageService.showSuccessMessage(
                                'Thông báo',
                                'Gửi yêu cầu gửi mail thành công'
                            );
                            this._listUserService
                                .guiMailReal()
                                .pipe(takeUntil(this._unsubscribeAll))
                                .subscribe((result: any) => {
                                    switch (result) {
                                        case 1:
                                            this._messageService.showSuccessMessage(
                                                'Thông báo',
                                                'Gửi mail thành công'
                                            );
                                            break;
                                        case 0:
                                            this._messageService.showErrorMessage(
                                                'Thông báo',
                                                'Gửi mail không thành công'
                                            );
                                    }
                                });
                    }
                });
        }
    }

    generateRandomUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                const r = (Math.random() * 16) | 0;
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        );
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
