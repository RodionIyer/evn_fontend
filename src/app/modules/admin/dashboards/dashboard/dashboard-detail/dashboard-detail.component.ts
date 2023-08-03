import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ActionKey, Chart, Dashboard, Frame, LayoutType, MODE, URL } from '../dashboard-constants';
import { DashboardService } from '../dashboard.service';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { MessageService } from 'app/shared/message.services';
import { UserService } from 'app/core/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutDialogComponent } from './layout-dialog/layout-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SnotifyToast } from 'ng-alt-snotify';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-detail',
  templateUrl: './dashboard-detail.component.html',
  styleUrls: ['./dashboard-detail.component.scss']
})
export class DashboardDetailComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  mode: number = MODE.EDIT;

  charts: Chart[] = [];
  dataSource: Chart[] = [];
  userId: string = null;
  searching: boolean = false;
  searchingValue: string = '';
  selectedLayout: string = '';
  lstChartsF1: Chart[] = [];
  lstChartsF2: Chart[] = [];
  lstChartsF3: Chart[] = [];

  dashboard: Dashboard = {
    MA_DASHBOARD: '',
    LAYOUT: '',
    USER_ID: '',
    LST_CHARTS: '',
    POSITION: '',
    USER_CR_ID: '',
    USER_CR_DTIME: null,
    USER_MDF_ID: '',
    USER_MDF_DTIME: null,
  };

  constructor(
    private _dashboardService: DashboardService,
    private _messageService: MessageService,
    private _userService: UserService,
    private _dialog: MatDialog,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  async ngOnInit() {
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((response: any) => {
        this.userId = response.userId;
      });

    
  }

  
}
