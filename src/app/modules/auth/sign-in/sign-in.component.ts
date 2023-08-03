import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { Observable, of, switchMap, throwError } from 'rxjs';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    version: String = ""

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.version = environment.appVersion;
        // Create the form
        this.signInForm = this._formBuilder.group({
            userid: ['', [Validators.required]],
            password: ['', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in local
        this._authService.signIn(this.signInForm.get('userid').value, this.signInForm.get('password').value)
            .subscribe(
                {
                    next: (data) => {
                        return this._authService.check()
                            .subscribe(
                                {
                                    next: (authenticated) => {

                                        // If the user is not authenticated...
                                        if (!authenticated) {
                                            this.signInForm.enable();

                                            // Reset the form
                                            // this.signInNgForm.resetForm();

                                            // Set the alert
                                            this.alert = {
                                                type: 'error',
                                                message: 'Sai tên đăng nhập hoặc mật khẩu'
                                            };
                                            this.showAlert = true;

                                            // Prevent the access
                                            return of(false);
                                        }
                                        const redirectURL = '/signed-in-redirect';
                                        // Navigate to the redirect url
                                        this._router.navigateByUrl(redirectURL);
                                        // Allow the access
                                        return of(true);
                                    }
                                }
                            );
                    },
                    error: (error: HttpErrorResponse) => {
                        this.signInForm.enable();

                        // Set the alert
                        this.alert = {
                            type: 'error',
                            message: 'Lỗi kết nối tới máy chủ'
                        };
                        this.showAlert = true;
                    },
                },
            );
    }
}
