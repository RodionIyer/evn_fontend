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
import { DangTinService } from './dangtin.service';
import { NavigationEnd, Route, Router, UrlMatchResult } from '@angular/router';

@Component({
    selector: 'app-dangtin',
    templateUrl: './dangtin.component.html',
    styleUrls: ['./dangtin.component.css'],
})
export class DangTinComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private subscription: Subscription;

    constructor(
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _dangTinService: DangTinService,
        private _router: Router
    ) {}

    ngOnInit() {
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

        sources.push(this._dangTinService.getListDanMucTinTuc());
        forkJoin(sources)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {});
    }

    navigateToDefault() {
        this._dangTinService
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
