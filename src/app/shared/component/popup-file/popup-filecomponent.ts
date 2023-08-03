import { Component, Inject, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, takeUntil } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MessageService } from 'app/shared/message.services';
import { ServiceService } from 'app/shared/service/service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupConfirmComponent } from '../popup-confirm/popup-confirmcomponent';




@Component({
    selector: 'component-popup-file',
    templateUrl: './popup-file.component.html',
    styleUrls: ['./popup-file.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class PopupFileComponent implements OnInit {


    message: string = "Are you sure?"
    confirmButtonText = "Yes"
    cancelButtonText = "Cancel"
    listFilePopup = []

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any,
        private _formBuilder: UntypedFormBuilder,
        public _activatedRoute: ActivatedRoute,
        public _messageService: MessageService,
        public _router: Router,
        private _serviceApi: ServiceService,
        public dialog: MatDialog,
        private dialogRef: MatDialogRef<PopupFileComponent>
    ) {
        if (data) {
            this.listFilePopup = data.listFile
        }
    }


    ngOnInit(): void {
        // this._messageService.showSuccessMessage("Thông báo", "Thành công")
    }


    onConfirmClick(): void {
        this.dialogRef.close(true);
    }

    deleteItemFile(items){
        this.listFilePopup = this.listFilePopup.filter(item=>item.id != items.id)
    }
    Save(){
        console.log(this.listFilePopup);
        
    }

    downLoadFile(item){
        var token = localStorage.getItem("accessToken");
        this._serviceApi.execServiceLogin("2269B72D-1A44-4DBB-8699-AF9EE6878F89", [{"name":"DUONG_DAN","value":item.duongdan},{"name":"TOKEN_LINK","value":"Bearer "+token}]).subscribe((data) => {
            console.log("downloadFile:"+JSON.stringify(data));
        })
    }
// mo popup file
openAlertConfirm (item) {
    let dataPopup = this.dialog.open(PopupConfirmComponent, {
         width: '400px',
         data: {
             item:item
         },
         panelClass: 'custom-PopupCbkh',
         position: {
             top: '200px',
         }
     });
     dataPopup.afterClosed().subscribe((data) => {
         if(data){
             this.deleteItemFile(data.data)
         }
         
       });
 }

}
