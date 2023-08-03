import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablePlansComponent } from './component/table-plans/table-plans.component';
import { PopupFileComponent } from './component/popup-file/popup-filecomponent';
import { PopupConfirmComponent } from './component/popup-confirm/popup-confirmcomponent';
import { LichsuComponent } from './component/lichsu/lichsu.component';
import { LichsuKeHoachComponent } from './component/lichsuKeHoach/lichsuKeHoach.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule, 
        NgSelectModule
    ],

    declarations: [
        TablePlansComponent,
        PopupFileComponent,
        PopupConfirmComponent,
        LichsuComponent,
        LichsuKeHoachComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TablePlansComponent,
        PopupFileComponent,
        PopupConfirmComponent,
        LichsuComponent,
        LichsuKeHoachComponent
    ]
})
export class SharedModule
{
}
