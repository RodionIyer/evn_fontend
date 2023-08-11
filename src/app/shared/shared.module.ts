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

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule, 
        NgSelectModule,
        TextMaskModule
    ],

    declarations: [
        TablePlansComponent,
        PopupFileComponent,
        PopupConfirmComponent,
        LichsuComponent,
        LichsuKeHoachComponent,
        moneyDirective
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
        moneyDirective
       
    ]
})
export class SharedModule
{
}
