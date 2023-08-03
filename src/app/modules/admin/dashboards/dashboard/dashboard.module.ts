import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { routes } from './dashboard.routing';
import { EmptyDashboardComponent } from './empty-dashboard/empty-dashboard.component';
import { DashboardDetailComponent } from './dashboard-detail/dashboard-detail.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LayoutDialogComponent } from './dashboard-detail/layout-dialog/layout-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from '@angular/cdk/dialog';
import { NgApexchartsModule } from 'ng-apexcharts';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [
    DashboardComponent,
    EmptyDashboardComponent,
    DashboardDetailComponent,
    LayoutDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule, MatButtonModule, MatTreeModule, MatCardModule,
    DragDropModule, MatFormFieldModule, MatInputModule,
    FormsModule, MatDialogModule, DialogModule, NgApexchartsModule,
  ]
})
export class DashboardModule { }
