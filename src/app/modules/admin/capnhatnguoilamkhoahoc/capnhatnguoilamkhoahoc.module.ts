import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapnhatnguoilamkhoahocComponent } from './capnhatnguoilamkhoahoc.component';
import { RouterModule } from '@angular/router';
import { CapnhatnguoilamkhoahocRoutes } from './capnhatnguoilamkhoahoc.routing';
import { ListNguoiThucHienDetailsInputComponent } from '../listnguoithuchien/detail/details-input/details-input.component';
import { MatButtonModule } from '@angular/material/button';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { HighlightPlusModule } from 'ngx-highlightjs/plus';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { BrowserModule } from '@angular/platform-browser';
import { ListNguoiThucHienModule } from '../listnguoithuchien/listnguoithuchien.module';
import { ListNguoiThucHienDetailsInputModule } from '../listnguoithuchien/detail/details-input/details-input.module';

@NgModule({
    declarations: [CapnhatnguoilamkhoahocComponent],
    imports: [
        RouterModule.forChild(CapnhatnguoilamkhoahocRoutes),
        ListNguoiThucHienDetailsInputModule,
        CommonModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule
    ],
})
export class CapnhatnguoilamkhoahocModule {}
