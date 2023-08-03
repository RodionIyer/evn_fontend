import { Component, Inject, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'app/shared/message.services';
import { ServiceService } from 'app/shared/service/service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';




@Component({
    selector: 'component-popup-confirm',
    templateUrl: './popup-confirm.component.html',
    styleUrls: ['./popup-confirm.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class PopupConfirmComponent implements OnInit {


    item;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _messageService: MessageService,
        public _router: Router,
        private _serviceApi: ServiceService,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<PopupConfirmComponent>
    ) {
        if (data) {
           this.item = data.item
        }
    }


    ngOnInit(): void {
        // this._messageService.showSuccessMessage("Thông báo", "Thành công")
    }


    onConfirmClick(): void {
        this.dialogRef.close(true);
    }
    Save(item){
        this.dialogRef.close({
            data: item,
         });
    }
    



}
