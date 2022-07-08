import { BulkUploadQuestionsComponent } from './views/pages/growon/learning/allquestions/bulk-upload-questions/bulk-upload-questions.component';
// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
// Auth
import { AuthGuard } from './core/auth';
// Test
import { MyPageComponent } from '../app/views/pages/my-page/my-page.component';
import { EditAppComponent } from '../app/views/pages/edit-app/edit-app.component';
import { SchoolComponent } from '../app/views/pages/growon/create/school/school.component';
import { StudentComponent } from '../app/views/pages/growon/create/student/student.component';
import { TeacherComponent } from '../app/views/pages/growon/create/teacher/teacher.component';
import { PrincipleComponent } from '../app/views/pages/growon/create/principle/principle.component';
import { ManagementComponent } from '../app/views/pages/growon/create/management/management.component';
import { AllInstituteComponent } from '../app/views/pages/growon/create/all-institute/all-institute.component';
import { AllStudentComponent } from '../app/views/pages/growon/create/all-student/all-student.component';
import { AllManagementComponent } from '../app/views/pages/growon/create/all-management/all-management.component';
import { AllPrincipleComponent } from '../app/views/pages/growon/create/all-principle/all-principle.component';
import { AllTeacherComponent } from '../app/views/pages/growon/create/all-teacher/all-teacher.component';
import { EditAllInstituteComponent } from '../app/views/pages/growon/create/all-institute/edit-all-institute/edit-all-institute.component';
import { EditAllStudentComponent } from '../app/views/pages/growon/create/all-student/edit-all-student/edit-all-student.component';
import { EditAllTeacherComponent } from '../app/views/pages/growon/create/all-teacher/edit-all-teacher/edit-all-teacher.component';
import { EditAllManagementComponent } from '../app/views/pages/growon/create/all-management/edit-all-management/edit-all-management.component';

// Learning
import { ClassesComponent } from '../app/views/pages/growon/learning/classes/classes.component';
import { QuestionComponent } from '../app/views/pages/growon/learning/question/question.component';
import { BoardComponent } from '../app/views/pages/growon/learning/board/board.component';
import { ExamtypeComponent } from '../app/views/pages/growon/learning/examtype/examtype.component';
import { QuestioncatogoryComponent } from '../app/views/pages/growon/learning/questioncatogory/questioncatogory.component';
import { SubjectsComponent } from '../app/views/pages/growon/learning/subjects/subjects.component';
import { SyllabusComponent } from '../app/views/pages/growon/learning/syllabus/syllabus.component';
import { ChapterComponent } from '../app/views/pages/growon/learning/chapter/chapter.component';
import { LearningOutcomeComponent } from '../app/views/pages/growon/learning/learning-outcome/learning-outcome.component';
import { TopicComponent } from '../app/views/pages/growon/learning/topic/topic.component';
import { CreateQuestionPaperComponent } from '../app/views/pages/growon/learning/create-question-paper/create-question-paper.component';
import { QuestionpaperComponent } from '../app/views/pages/growon/learning/questionpaper/questionpaper.component';
import { ViewQuestionComponent } from '../app/views/pages/growon/learning/view-question/view-question.component';
import { AllquestionpapersComponent } from '../app/views/pages/growon/learning/allquestionpapers/allquestionpapers.component';
import { AllquestionsComponent } from '../app/views/pages/growon/learning/allquestions/allquestions.component';
import { AllStudentsComponent } from '../app/views/pages/growon/create/student/all-students/all-students.component';
import { PromotionComponent } from './views/pages/growon/create/all-student/promotion/promotion.component';

//roles & Management
import { AddRoleComponent } from "../app/views/pages/growon/roles-permission/add-role/add-role.component";
import { AssignRoleComponent } from "../app/views/pages/growon/roles-permission/assign-role/assign-role.component";
import { ViewquestionComponent } from './views/pages/growon/learning/viewquestion/viewquestion.component';
import { CreateQuestionComponent } from './views/pages/growon/learning/create-question/create-question.component';
import { CreateQuestionpaperComponent } from './views/pages/growon/learning/create-questionpaper/create-questionpaper.component';
import { QuestionPaperComponent } from './views/pages/growon/learning/question-paper/question-paper.component';

//dashboard
import { SchoolDashboardComponent } from './views/pages/growon/school-dashboard/school-dashboard.component';
import { BulkUploadStudentComponent } from './views/pages/growon/create/all-student/bulk-upload-student/bulk-upload-student.component';
import { BackendUserComponent } from './views/pages/growon/create/backend-user/backend-user.component';
import { ViewBackendUserComponent } from './views/pages/growon/create/view-backend-user/view-backend-user.component';
import { EditSchoolAdminComponent } from './views/pages/growon/create/all-institute/edit-school-admin/edit-school-admin.component';
import { GlobalAdminEditComponent } from './views/pages/growon/create/all-institute/global-admin-edit/global-admin-edit.component';
import { ProfileUpdateComponent } from './views/pages/growon/create/profile-update/profile-update.component';
import { SectionComponent } from './views/pages/growon/learning/section/section.component';
import { MappingComponent } from './views/pages/growon/create/mapping/mapping.component';
import { CreateQuestionPaperModuleComponent } from './views/pages/growon/learning/create-question-paper-module/create-question-paper-module.component';
import { ImportModalComponent } from './views/pages/growon/learning/allquestions/import-modal/import-modal.component';
import { ImportQuestionPaperComponent } from './views/pages/growon/learning/allquestionpapers/import-question-paper/import-question-paper.component';
import { AllUniversitiesComponent } from './views/pages/growon/create/all-institute/all-universities/all-universities.component';
import { AdmissionsComponent } from './views/pages/growon/create/admissions/admissions.component';
import { PaymentsComponent } from './views/pages/growon/create/payments/payments.component';
import { ActivateBillingComponent } from './views/pages/growon/create/payments/activate-billing/activate-billing.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  { path: 'error', loadChildren: () => import('./views/pages/error/error.module').then(m => m.ErrorModule) },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'test',
        loadChildren: () => import('./views/pages/test/test.module').then(m => m.TestModule),
      },
      {
        path: 'mail',
        loadChildren: () => import('./views/pages/apps/mail/mail.module').then(m => m.MailModule),
      },
      {
        path: 'ecommerce',
        loadChildren: () => import('./views/pages/apps/e-commerce/e-commerce.module').then(m => m.ECommerceModule),
      },
      {
        path: 'ngbootstrap',
        loadChildren: () => import('./views/pages/ngbootstrap/ngbootstrap.module').then(m => m.NgbootstrapModule),
      },
      {
        path: 'material',
        loadChildren: () => import('./views/pages/material/material.module').then(m => m.MaterialModule),
      },
      {
        path: 'user-management',
        loadChildren: () => import('./views/pages/user-management/user-management.module').then(m => m.UserManagementModule),
      },
      {
        path: 'wizard',
        loadChildren: () => import('./views/pages/wizard/wizard.module').then(m => m.WizardModule),
      },
      {
        path: 'builder',
        loadChildren: () => import('./views/theme/content/builder/builder.module').then(m => m.BuilderModule),
      },
      { path: 'mypage', component: MyPageComponent, pathMatch: 'full' },
      { path: 'editapp', component: EditAppComponent, pathMatch: 'full' },
      { path: 'mapping', component: MappingComponent, pathMatch: 'full' },
      { path: 'create/school', component: SchoolComponent, pathMatch: 'full' },
      { path: 'create/student', component: StudentComponent, pathMatch: 'full' },
      { path: 'create/promotion', component: PromotionComponent, pathMatch: 'full' },
      { path: 'create/admissions', component: AdmissionsComponent, pathMatch: 'full' },
      { path: 'create/payment', component: PaymentsComponent, pathMatch: 'full' },
      { path: 'create/activate-billing', component: ActivateBillingComponent, pathMatch: 'full' },
      { path: 'students', component: AllStudentsComponent, pathMatch: 'full' },
      { path: 'create/teacher', component: TeacherComponent, pathMatch: 'full' },
      { path: 'create/principle', component: PrincipleComponent, pathMatch: 'full' },
      { path: 'create/management', component: ManagementComponent, pathMatch: 'full' },
      { path: 'create/backend-user', component: BackendUserComponent, pathMatch: 'full' },
      { path: 'view/backend-user', component: ViewBackendUserComponent, pathMatch: 'full' },
      { path: 'view/edit-school-admin', component: EditSchoolAdminComponent, pathMatch: 'full' },
      { path: 'view/edit-global-admin', component: GlobalAdminEditComponent, pathMatch: 'full' },
      { path: 'view/profile-update', component: ProfileUpdateComponent, pathMatch: 'full' },
      { path: 'create/all-institute', component: AllInstituteComponent, pathMatch: 'full' },
      { path: 'create/all-student', component: AllStudentComponent, pathMatch: 'full' },
      { path: 'create/all-management', component: AllManagementComponent, pathMatch: 'full' },
      { path: 'create/all-principle', component: AllPrincipleComponent, pathMatch: 'full' },
      { path: 'create/all-teacher', component: AllTeacherComponent, pathMatch: 'full' },
      { path: 'create/all-universities', component: AllUniversitiesComponent, pathMatch: 'full' },
      { path: 'create/all-institute/edit-all-institute', component: EditAllInstituteComponent, pathMatch: 'full' },
      { path: 'create/all-student/edit-all-student', component: EditAllStudentComponent, pathMatch: 'full' },
      { path: 'create/all-student/bulk-upload-student', component: BulkUploadStudentComponent, pathMatch: 'full' },
      { path: 'create/all-teacher/edit-all-teacher', component: EditAllTeacherComponent, pathMatch: 'full' },
      { path: 'create/all-management/edit-all-management', component: EditAllManagementComponent, pathMatch: 'full' },
      { path: 'create/school-dashboard', component: SchoolDashboardComponent, pathMatch: 'full' },
      // Learning
      { path: 'create/class', component: ClassesComponent, pathMatch: 'full' },
      { path: 'create/section', component: SectionComponent, pathMatch: 'full' },
      // { path: 'create/question', component: QuestionComponent, pathMatch: 'full' },
      { path: 'create/question', component: CreateQuestionComponent, pathMatch: 'full' },
      { path: 'view/question/:id', component: CreateQuestionComponent, pathMatch: 'full' },
      { path: 'create/board', component: BoardComponent, pathMatch: 'full' },
      { path: 'create/syllabus', component: SyllabusComponent, pathMatch: 'full' },
      { path: 'create/question-category', component: QuestioncatogoryComponent, pathMatch: 'full' },
      { path: 'create/exam-type', component: ExamtypeComponent, pathMatch: 'full' },
      { path: 'create/subject', component: SubjectsComponent, pathMatch: 'full' },
      { path: 'create/chapter', component: ChapterComponent, pathMatch: 'full' },
      { path: 'create/topic', component: TopicComponent, pathMatch: 'full' },
      { path: 'create/learning-outcome', component: LearningOutcomeComponent, pathMatch: 'full' },
      // { path: 'create/question-paper', component: CreateQuestionpaperComponent, pathMatch: 'full' },
      { path: 'create/question-paper', component: CreateQuestionPaperModuleComponent, pathMatch: 'full' },
      { path: 'create/question-paper/:id', component: CreateQuestionPaperModuleComponent, pathMatch: 'full' },
      // { path: 'show/qpaper/:id', component: QuestionPaperComponent, pathMatch: 'full' },
      { path: 'view/questionpaper/:id', component: ViewQuestionComponent, pathMatch: 'full' },
      { path: 'view/questionpapers', component: AllquestionpapersComponent, pathMatch: 'full' },
      { path: 'view/questions', component: AllquestionsComponent, pathMatch: 'full' },
      { path: 'view/questions/import', component: ImportModalComponent, pathMatch: 'full' },
      { path: 'view/questions/bulk-upload', component: BulkUploadQuestionsComponent, pathMatch: 'full' },
      { path: 'view/questions/import-paper', component: ImportQuestionPaperComponent, pathMatch: 'full' },
      // { path: 'view/question/:id', component: ViewquestionComponent, pathMatch: 'full' },
      { path: 'role/add', component: AddRoleComponent, pathMatch: 'full' },
      { path: 'role/assign', component: AssignRoleComponent, pathMatch: 'full' },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
      //dashboard

    ],
  },
  { path: 'create-question-paper-module', loadChildren: () => import('./views/pages/growon/learning/create-question-paper-module/create-question-paper-module.module').then(m => m.CreateQuestionPaperModuleModule) },
  { path: '**', redirectTo: 'error/403', pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
