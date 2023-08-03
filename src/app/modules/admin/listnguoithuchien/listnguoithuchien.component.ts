import {
    AfterViewInit,
    OnDestroy,
    OnInit,
    Component,
    ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ListNguoiThucHienService } from './listnguoithuchien.service';

@Component({
    selector: 'app-api',
    templateUrl: './listnguoithuchien.component.html',
    styleUrls: ['./listnguoithuchien.component.css'],
})
export class ListNguoiThucHienComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _listUserService: ListNguoiThucHienService
    ) {}

    ngAfterViewInit() {}
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
        sources.push(this._listUserService.getListHocHam());
        sources.push(this._listUserService.getListHocVi());
        sources.push(this._listUserService.getListLvucNCuu());
        sources.push(this._listUserService.getListTrinhDo());
        // sources.push(this._listUserService.getListNhanSu());
        forkJoin(sources)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
