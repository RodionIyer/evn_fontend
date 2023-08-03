import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { CHART_TYPE, MAX_INT_32BIT } from 'app/core/constants/chart-info';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { MessageService } from 'app/shared/message.services';
import { SnotifyToast } from 'ng-alt-snotify';
import { filter, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { BieuDo_NDL, ChartAPI, ChartDetail, Dashboard, Frame, LayoutType, MODE, Nhom_DuLieu, Nhom_DuLieu_Data, URL } from './dashboard-constants';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  user: User;
  // mode: number = MODE.VIEW;

  lstFrame1Charts: ChartDetail[] = [];
  lstFrame2Charts: ChartDetail[] = [];
  lstFrame3Charts: ChartDetail[] = [];

  lstCharts: ChartAPI[] = [];
  lstChartAPIsFrame1: ChartAPI[] = [];
  lstChartAPIsFrame2: ChartAPI[] = [];
  lstChartAPIsFrame3: ChartAPI[] = [];

  lstNhomDuLieu: Nhom_DuLieu[] = [];
  lstNhomDuLieuData: Nhom_DuLieu_Data[] = [];
  lstBieuDoNhomDuLieu: BieuDo_NDL[] = [];

  hadDashboard: boolean = false;

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
    private _userService: UserService,
    private _dashboardService: DashboardService,
    private _messageService: MessageService,
    public _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  
  async ngOnInit() {
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.user = user;
      });

    this.renderDashboard();
    // this._dashboardService.mode$
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((response: number) => {
    //     this.mode = response;
    //     if (this.mode == MODE.VIEW) {
    //       this.renderDashboard();
    //     } else {
    //       this.clearData();
    //     }
    //   })

    this._router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .pipe(takeUntil(this._unsubscribeAll))
      // .pipe(filter(event => event instanceof NavigationStart || event instanceof NavigationEnd))
      .subscribe((response: any) => {
        console.log(response);
    })
  }

  async renderDashboard() {
    
  }

  
}
