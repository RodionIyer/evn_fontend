import { QuanTriTinService } from './../../quantritin.service';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionService } from 'app/core/function/function.service';
import { UserService } from 'app/core/user/user.service';
import { BaseComponent } from 'app/shared/commons/base.component';
import { MessageService } from 'app/shared/message.services';
import { DateAdapter } from '@angular/material/core';
import { ServiceService } from 'app/shared/service/service.service';
import { takeUntil } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'details-view',
    templateUrl: './details-view.component.html',
    styleUrls: ['./details-view.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class QuanTriTinDetailsViewComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    obj: any;
    listDMTinTuc: any;
    safeHtmlContent: SafeHtml;

    constructor(
        private _quanTriTinService: QuanTriTinService,
        public _activatedRoute: ActivatedRoute,
        public _router: Router,
        public _functionService: FunctionService,
        public _userService: UserService,
        public _messageService: MessageService,
        private dateAdapter: DateAdapter<Date>,
        public _serviceService: ServiceService,
        private sanitizer: DomSanitizer
    ) {
        super(
            _activatedRoute,
            _router,
            _functionService,
            _userService,
            _messageService
        );
        this.dateAdapter.setLocale('en-GB');
    }

    ngOnInit(): void {
        super.ngOnInit();
        this._quanTriTinService.ObjectListDanhMucTinTuc$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((data: any[]) => {
            this.listDMTinTuc = data;
        });

        this._quanTriTinService.Object$.pipe(
            takeUntil(this._unsubscribeAll)
        ).subscribe((obj: any) => {
            this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(
                obj.NOI_DUNG_SOAN_THAO
            );
            this.obj = obj;
        });
    }

    downLoadFile(item) {
        this._quanTriTinService
            .downLoadFile(item)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {});
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
