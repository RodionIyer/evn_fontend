import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import {
    catchError,
    finalize,
    forkJoin,
    Observable,
    of,
    switchMap,
    throwError,
} from 'rxjs';
import { DangTinService } from './dangtin.service';

@Injectable({
    providedIn: 'root',
})
export class DangTinGroupsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _dangTinService: DangTinService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any[]> {
        return this._dangTinService.getGroups();
    }
}

@Injectable({
    providedIn: 'root',
})
export class DangTinResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _listTinTucService: DangTinService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any[]> | any {
        let source = [];
        source.push(this._listTinTucService.getGroups());
        source.push(this._listTinTucService.getObjects());
        return forkJoin(source);
    }
}

@Injectable({
    providedIn: 'root',
})
export class DangTinDetailsResolve implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(
        private _listTinTucService: DangTinService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any[]> | any {
        const sources = [];

        // If folder is set on the parameters...
        if (route.paramMap.get('id')) {
            sources.push(
                this._listTinTucService.getObjectById(route.paramMap.get('id'))
            );
        }

        return forkJoin(sources).pipe(
            // Error here means the requested Api is either
            // not available on the requested page or not
            // available at all
            catchError((error) => {
                // Log the error
                console.error(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');

                // Navigate to there
                this._router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(error);
            })
        );
    }
}
