import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { FuseAlertModule } from '@fuse/components/alert';
import { ListNguoiThucHienDetailsComponent } from './detail/details.component';
import { ListNguoiThucHienGroupComponent } from './group/group.component';
import { ListNguoiThucHienEmptyDetailsComponent } from './empty-details/empty-details.component';
import { ListNguoiThucHienListComponent } from './list/list.component';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { HighlightPlusModule } from 'ngx-highlightjs/plus';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ListNguoiThucHienComponent } from './listnguoithuchien.component';
import { ListNguoiThucHienRoutes } from './listnguoithuchien.routing';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ListNhanSuComponent } from './detail/listnhansu-dialog/listnhansu-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    imports: [
        RouterModule.forChild(ListNguoiThucHienRoutes),
        MatButtonModule,
        CodemirrorModule,
        MatTreeModule,
        DragDropModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatListModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatSlideToggleModule,
        CommonModule,
        NgxMatSelectSearchModule,
        FuseAlertModule,
        FuseNavigationModule,
        HighlightPlusModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule
    ],
    declarations: [
        ListNguoiThucHienListComponent,
        ListNguoiThucHienGroupComponent,
        ListNguoiThucHienComponent,
        ListNguoiThucHienDetailsComponent,
        ListNguoiThucHienEmptyDetailsComponent,
        ListNhanSuComponent,
    ],
})
export class ListNguoiThucHienModule {}
