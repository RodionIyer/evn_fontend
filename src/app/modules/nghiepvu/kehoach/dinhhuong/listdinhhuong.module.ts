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
import { CommonModule, DecimalPipe } from '@angular/common';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { HighlightPlusModule } from 'ngx-highlightjs/plus';
import { ApiDinhHuongRoutes } from './listdinhhuong.routing';
import { ApiDinhHuongListComponent } from './list/list.component';
import { ApiDinhHuongComponent } from './listdinhhuong.component';
import { ApiDinhHuongDetailsComponent } from './detail/details.component';
import { ApiDinhHuongEmptyDetailsComponent } from './empty-details/empty-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { PopupCbkhComponent } from './detail/popup-cbkh/popup-cbkh.component';
import { moneyDirective } from 'app/shared/fomat-money.directive';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(ApiDinhHuongRoutes), MatButtonModule,
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
        MatDialogModule,
        MatTabsModule, MatToolbarModule, MatPaginatorModule, MatListModule,
        MatInputModule, ReactiveFormsModule, MatSelectModule, MatAutocompleteModule, MatSlideToggleModule,
        CommonModule, NgxMatSelectSearchModule, FuseAlertModule, FuseNavigationModule, HighlightPlusModule
    ],
    declarations: [
        ApiDinhHuongListComponent,
        ApiDinhHuongComponent,
        ApiDinhHuongDetailsComponent,
        ApiDinhHuongEmptyDetailsComponent,
        PopupCbkhComponent,
    ],
    providers: [DecimalPipe],
})
export class ApiDinhHuongModule { }
