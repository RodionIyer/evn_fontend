import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { HighlightPlusModule } from 'ngx-highlightjs/plus';
import { TraCuuTimKiemRoutes } from './tracuu-timkiem.routing';
import { ListItemComponent } from './list/list.component';
import { TracuuTimKiemComponent } from './tracuu-timkiem.component';
import { DetailsComponent } from './detail/details.component';
import { ApiGiaoEmptyDetailsComponent } from './empty-details/empty-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { PopupCbkhComponent } from './detail/popup-cbkh/popup-cbkh.component';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(TraCuuTimKiemRoutes), MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        NgSelectModule,
        MatTableModule,
        FormsModule,
        FuseLoadingBarModule,
        MatDialogModule,
        MatTabsModule, MatToolbarModule, MatPaginatorModule, MatListModule,
        MatInputModule, ReactiveFormsModule, MatSelectModule, MatAutocompleteModule, MatSlideToggleModule,
        CommonModule, NgxMatSelectSearchModule, FuseAlertModule, FuseNavigationModule, HighlightPlusModule
    ],
    declarations: [
        ListItemComponent,
        TracuuTimKiemComponent,
        DetailsComponent,
        ApiGiaoEmptyDetailsComponent,
        PopupCbkhComponent
    ]
})
export class TraCuuTimKiemModule { }
