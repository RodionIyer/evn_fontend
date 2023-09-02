import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MessageService } from 'app/shared/message.services';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { ActivatedRoute, Router } from '@angular/router';
import { State } from 'app/shared/commons/conmon.types';
import { FunctionService } from 'app/core/function/function.service';
import { viewfilepdfService } from '../viewfilepdf.service';
import { viewfilepdfComponent } from '../viewfilepdf.component';
import { ServiceService } from 'app/shared/service/service.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PopupFileComponent } from 'app/shared/component/popup-file/popup-filecomponent';
import { PopupConfirmComponent } from 'app/shared/component/popup-confirm/popup-confirmcomponent';

@Component({
    selector: 'component-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListItemComponent  {
    filePdf;
    constructor(private _viewfile:ServiceService){

    }

    ngOnInit()	{
       this.getvalueFile() 
    }
    getvalueFile(){

        this._viewfile.viewfile.subscribe((data:any)=>{
            debugger;
            this.filePdf = data;
            console.log( this.filePdf);
            
        })
    }

}
