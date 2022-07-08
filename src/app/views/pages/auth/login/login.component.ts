// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, Login } from '../../../../core/auth';
import { AuthService } from '../auth.service';
// Swal
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StepFormComponent } from '../step-form/step-form.component';
import { LoadingService } from '../../loader/loading/loading.service';

/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
	EMAIL: 'admin@demo.com',
	PASSWORD: 'demo'
};

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];
	schoolList: any = [];
	loginCheck: boolean = true;
	private unsubscribe: Subject<any>;

	name = "ng-toggle-button";
	config = {
		value: false,
		name: "",
		disabled: false,
		height: 40,
		width: 200,
		margin: 3,
		fontSize: 14,
		speed: 300,
		color: {
			checked: "#ffbd51",
			unchecked: "#dcdcdc"
		},
		switchColor: {
			checked: "#FFFFFF",
			unchecked: "#FFFFFF"
		},
		labels: {
			unchecked: "SUPER ADMIN",
			checked: "SCHOOL LOGIN"
		},
		checkedLabel: "",
		uncheckedLabel: "",
		fontColor: {
			checked: "#fafafa",
			unchecked: "#ffffff"
		}
	};

	private returnUrl: any = '/dashboard';

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private auth: AuthService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		private modalService: NgbModal,
		private loaderService: LoadingService
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.initLoginForm();
		// redirect back to the returnUrl before login
		/* this.route.queryParams.subscribe(params => {
			this.returnUrl = params.returnUrl || '/';
			this.returnUrl = params.returnUrl || '/';
		}); */
	}



	chnageLogIn() {
		this.loaderService.show();
		if (this.config.value) {
			this.loginForm.controls['schoolId'].setValidators([Validators.required]);
		} else {
			this.loginForm.controls['schoolId'].clearValidators();
		}
		this.loginForm.controls['schoolId'].updateValueAndValidity();
		this.cdr.detectChanges;
		this.loaderService.hide();
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		// demo message to show
		/* if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			const initialNotice = `Use account
			<strong>${DEMO_PARAMS.EMAIL}</strong> and password
			<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
			this.authNoticeService.setNotice(initialNotice, 'info');
		} */

		this.loginForm = this.fb.group({
			email: ['', Validators.required],
			password: ['', Validators.required],
			schoolId: ['', this.config.value ? Validators.required : ''],
		});
	}

	/**
	 * Form Submit
	 */
	submit() {


		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const authData = {
			username: controls.email.value,
			// email: DEMO_PARAMS.EMAIL,
			password: controls.password.value,
			school_code: controls.schoolId.value,
			global: this.config.value ? false : true
			// password: DEMO_PARAMS.PASSWORD
		};
		this.auth.login(authData).subscribe((response: any) => {
			console.log(response, "res")
			if (response.status == 200) {
				let counter = 0
				localStorage.setItem('userToken', response.body.token);
				localStorage.setItem('UserName', response.body.user_info[0].name);
				localStorage.setItem('designation', response.body.user_info[0].designation);
				localStorage.setItem('roleNumber', JSON.stringify(counter));
				localStorage.setItem('assignUser', JSON.stringify(counter));
				localStorage.setItem('info', JSON.stringify(response.body));
				if (this.config.value) {
					localStorage.setItem('schoolId', response.body.user_info[0].school_id);
					console.log('Code', response.body.user_info[0].school_code)
					localStorage.setItem('schoolCode', response.body.user_info[0].school_code);
					localStorage.setItem('schoolImage', response.body.user_info[0].school_details[0].schoolImage);
				}
				// const modalRef1 = this.modalService.open(StepFormComponent, { size: 'xl', backdrop: 'static' })
				this.router.navigate(['/create/school-dashboard']);
				// Main page
				//open stepForm
				// console.log(response.body.user_info[0].isSubmitForm)
				// if (response.body.user_info[0].isSubmitForm) {
				// 	const modalRef1 = this.modalService.open(StepFormComponent, { size: 'xl', backdrop: 'static' })
				// }
			} else {
				this.loading = false;
				Swal.fire({ icon: 'error', title: 'Error', text: response.body.message });
				return;
			}


		},
			(error) => {
				this.loading = false;
				console.log(error, "error")
				//console.log(error.error ? error.error.message, "error")
				if (error.error ? error.error.status == 400 : '') {
					console.log('error => ', error)
					Swal.fire({ icon: 'error', title: 'Error', text: error.error ? error.error.message : '' });
					return;
				} else {
					Swal.fire({ icon: 'error', title: 'Error', text: error.error ? error.error.message : '' });
					return;
				}

			})
		/* this.auth
			.login(authData.email, authData.password)
			.pipe(
				tap(user => {
					if (user) {
						console.log('user=>',user);
						this.store.dispatch(new Login({authToken: user.accessToken}));
						this.router.navigateByUrl(this.returnUrl); // Main page
					} else {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
					}
				}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.loading = false;
					this.cdr.markForCheck();
				})
			)
			.subscribe(); */
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	gotoForgotPass() {
		if (this.loginForm.controls.email.valid && (this.config.value && this.loginForm.controls.schoolId.valid || !this.config.value)) {
			localStorage.setItem("forgot-pass", "true")
			this.getOtp();
		} else {
			this.loginForm.controls.email.markAsTouched();
			if (this.loginForm.controls.schoolId) {
				this.loginForm.controls.schoolId.markAsTouched();
			}
		}
	}

	getOtp() {
		this.loading = true;
		this.auth.getOrValidateOTP({ mobile: Number(this.loginForm.controls.email.value), username: this.loginForm.controls.email.value, profile_type: "teacher", type: "send" }).subscribe(
			res => {
				if (res.body['message']['message']) {
					localStorage.setItem('user', this.loginForm.controls.email.value);
					if (this.config.value) {
						localStorage.setItem('schoolCode', JSON.stringify(this.loginForm.controls.schoolId.value));
					}
					Swal.fire({ icon: 'success', title: 'Success', text: res.body['message']['message'] });
					this.router.navigate(["/auth/forgot-password"]);
				} else if (res.body['err']) {
					Swal.fire({ icon: 'error', title: 'Error', text: res.body['err'] });
				}
				this.loading = false;
			}, error => {
				Swal.fire({ icon: 'error', title: 'Error', text: 'Error sending OTP' });
				this.loading = false;
			}
		)
	}
}
