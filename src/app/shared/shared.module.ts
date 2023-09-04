import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablePlansComponent } from './component/table-plans/table-plans.component';
import { PopupFileComponent } from './component/popup-file/popup-filecomponent';
import { PopupConfirmComponent } from './component/popup-confirm/popup-confirmcomponent';
import { LichsuComponent } from './component/lichsu/lichsu.component';
import { LichsuKeHoachComponent } from './component/lichsuKeHoach/lichsuKeHoach.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { moneyDirective } from './fomat-money.directive';
import { TextMaskModule } from 'angular2-text-mask';
import { ServiceService } from './service/service.service';
import { ViewFileComponent } from './component/view-file/view-file.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule, 
        NgSelectModule,
        TextMaskModule,
        PdfViewerModule
      ],

    declarations: [
        TablePlansComponent,
        PopupFileComponent,
        PopupConfirmComponent,
        LichsuComponent,
        LichsuKeHoachComponent,
        moneyDirective,
        ViewFileComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TablePlansComponent,
        PopupFileComponent,
        PopupConfirmComponent,
        LichsuComponent,
        LichsuKeHoachComponent,
        moneyDirective,
        ViewFileComponent
    ]
    ,
    providers:[ServiceService],
})
export class SharedModule
{
}
