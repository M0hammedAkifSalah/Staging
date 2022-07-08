// Angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// Translate
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// CRUD
import { InterceptService } from '../../../core/_base/crud/';
// Module components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
// Auth
import { AuthEffects, AuthGuard, authReducer, AuthService } from '../../../core/auth';
import { StudentComponent } from './register/student/student.component';
import { StepFormComponent } from './step-form/step-form.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { AddBoardComponent } from './add-board/add-board.component';
import { AddSyllabusComponent } from './add-syllabus/add-syllabus.component';
import { AddSubjectsComponent } from './add-subjects/add-subjects.component';
import { SubjectPipePipe } from './pipes/subject-pipe.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgToggleModule } from 'ng-toggle-button';
import { ForgotPasswordGuard, ResetPasswordGuard } from 'src/app/core/auth/_guards/auth.guard';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full'
			},
			{
				path: 'login',
				component: LoginComponent,
				data: { returnUrl: window.location.pathname }
			},
			{
				path: 'register',
				component: RegisterComponent
			},
			{
				path: 'forgot-password',
        canActivate: [ForgotPasswordGuard],
        // canLoad: [ForgotPasswordGuard],
				component: ForgotPasswordComponent,
			},
      {
				path: 'reset-password',
        canActivate: [ResetPasswordGuard],
        // canLoad: [ResetPasswordGuard],
				component: ForgotPasswordComponent,
			},
			{
				path: 'register/student',
				component: StudentComponent
			},
			{
				path: 'stepForm',
				component: StepFormComponent
			}
		]
	}
];


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		RouterModule.forChild(routes),
		MatInputModule,
		MatFormFieldModule,
		MatCheckboxModule,
		TranslateModule.forChild(),
		StoreModule.forFeature('auth', authReducer),
		EffectsModule.forFeature([AuthEffects]),
		MatStepperModule,
		MatTableModule,
		MatSelectModule,
		MatSlideToggleModule,
		NgToggleModule
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
	],
	exports: [AuthComponent, StepFormComponent],
	declarations: [
		AuthComponent,
		LoginComponent,
		RegisterComponent,
		ForgotPasswordComponent,
		AuthNoticeComponent,
		StudentComponent,
		StepFormComponent,
		AddBoardComponent,
		AddSyllabusComponent,
		AddSubjectsComponent,
		SubjectPipePipe,
	],
	entryComponents: [
		AddBoardComponent,
		AddSyllabusComponent,
		AddSubjectsComponent,
	]
})

export class AuthModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AuthModule,
			providers: [
				AuthService,
				AuthGuard,
        ResetPasswordGuard,
        ForgotPasswordGuard
			]
		};
	}
}
