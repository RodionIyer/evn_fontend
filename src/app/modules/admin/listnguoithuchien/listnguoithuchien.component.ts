import { URL } from './../dashboards/dashboard/dashboard-constants';
import {
    AfterViewInit,
    OnDestroy,
    OnInit,
    Component,
    ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {
    Subject,
    forkJoin,
    take,
    takeUntil,
    tap,
    map,
    first,
    Subscription,
} from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ListNguoiThucHienService } from './listnguoithuchien.service';
import { NavigationEnd, Route, Router, UrlMatchResult } from '@angular/router';

@Component({
    selector: 'app-api',
    templateUrl: './listnguoithuchien.component.html',
    styleUrls: ['./listnguoithuchien.component.css'],
})
export class ListNguoiThucHienComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private subscription: Subscription;

    constructor(
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _listUserService: ListNguoiThucHienService,
        private _router: Router
    ) {}

    ngOnInit() {
        if (this._router.url.split('/')[5] == 'all') {
            this.navigateToDefault();
        }
        this.subscription = this._router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                if (
                    !this._router.url.startsWith(
                        '/nghiepvu/danhmuc/nguoilamkhoahoc'
                    )
                )
                    this.subscription.unsubscribe();
                if (this._router.url.split('/')[5] == 'all')
                    this.navigateToDefault();
            }
        });
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened if the given breakpoint is active
                if (matchingAliases.includes('md')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
            });
        const sources = [];

        sources.push(this._listUserService.getGroups());
        sources.push(this._listUserService.getListHocHam());
        sources.push(this._listUserService.getListHocVi());
        sources.push(this._listUserService.getListLvucNCuu());
        sources.push(this._listUserService.getListTrinhDo());
        // sources.push(this._listUserService.getListNhanSu());
        forkJoin(sources)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {});
    }

    navigateToDefault() {
        this._listUserService
            .getGroups()
            .pipe(first())
            .subscribe((res) => {
                let _url = '/';
                for (let x of this._router.url.split('/')) {
                    _url =
                        this._router.url.split('/').indexOf(x) != 5
                            ? x
                                ? _url + x + '/'
                                : ''
                            : _url + res.data[0].ORGID + '/';
                }
                this._router.navigateByUrl(_url.slice(0, -1));
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
