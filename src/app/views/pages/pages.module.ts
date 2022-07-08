// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
//----- TinyMce
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatTabsModule } from '@angular/material/tabs';
// Pages
import { CoreModule } from '../../core/core.module';
import { MailModule } from './apps/mail/mail.module';
import { ECommerceModule } from './apps/e-commerce/e-commerce.module';
import { UserManagementModule } from './user-management/user-management.module';
import { MyPageComponent } from './my-page/my-page.component';
import { EditAppComponent } from './edit-app/edit-app.component';
// DD Components
import { DndModule } from 'ngx-drag-drop';
import { RouterModule, Routes, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { StudentComponent } from './growon/create/student/student.component';
import { SchoolComponent } from './growon/create/school/school.component';
// Editor
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxPrintModule } from 'ngx-print';
// import { Angular2CsvModule } from 'angular2csv';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv'
// Multiselect
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { TeacherComponent } from './growon/create/teacher/teacher.component';
import { PrincipleComponent } from './growon/create/principle/principle.component';
import { ManagementComponent } from './growon/create/management/management.component';
import { ClassesComponent } from './growon/learning/classes/classes.component';
import { QuestionComponent } from './growon/learning/question/question.component';
import { BoardComponent } from './growon/learning/board/board.component';
import { SyllabusComponent } from './growon/learning/syllabus/syllabus.component';
import { SubjectsComponent } from './growon/learning/subjects/subjects.component';
import { QuestioncatogoryComponent } from './growon/learning/questioncatogory/questioncatogory.component';
import { ExamtypeComponent } from './growon/learning/examtype/examtype.component';
import { ChapterComponent } from './growon/learning/chapter/chapter.component';
import { TopicComponent } from './growon/learning/topic/topic.component';
import { LearningOutcomeComponent } from './growon/learning/learning-outcome/learning-outcome.component';
import { CreateQuestionPaperComponent } from './growon/learning/create-question-paper/create-question-paper.component';
import { TestComponentComponent } from './growon/learning/test-component/test-component.component';
import { ModalPopupComponent } from './growon/learning/modal-popup/modal-popup.component';
import { QuestionpaperComponent } from './growon/learning/questionpaper/questionpaper.component';
import { ImportFromGlobalComponent } from './growon/learning/import-from-global/import-from-global.component';
import { ImportChapterComponent } from './growon/learning/import-chapter/import-chapter.component';
import { ImportTopicComponent } from './growon/learning/import-topic/import-topic.component';
import { ImportLearningOutcomeComponent } from './growon/learning/import-learning-outcome/import-learning-outcome.component';




//roles&permission
import { AddRoleComponent } from "./growon/roles-permission/add-role/add-role.component";
import { AssignRoleComponent } from "./growon/roles-permission/assign-role/assign-role.component";
import { UpdateRoleModalComponent } from './growon/roles-permission/modals/update-role-modal/update-role-modal.component';
import { UpdateUserModalComponent } from "./growon/roles-permission/modals/update-user-modal/update-user-modal.component";
// testing
// import { MarkdownModule } from 'ngx-markdown';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ViewQuestionComponent } from './growon/learning/view-question/view-question.component';
import { AllquestionpapersComponent } from './growon/learning/allquestionpapers/allquestionpapers.component';
import { AllquestionsComponent } from './growon/learning/allquestions/allquestions.component';
import { ViewquestionComponent } from './growon/learning/viewquestion/viewquestion.component';
import { EditorComponent } from './growon/learning/editor/editor.component';

import { MathjaxComponent } from './growon/learning/mathjax/mathjax.component';

import { NgbActiveModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UpdateTeacherModalComponent } from './growon/roles-permission/modals/update-teacher-modal/update-teacher-modal.component';
import { UpdatePrincipleModalComponent } from './growon/roles-permission/modals/update-principle-modal/update-principle-modal.component';
import { SafeUrlPipe } from './growon/pipes/safe-url/safe-url.pipe';
import { SafeHtmlPipe } from './growon/pipes/safe-html/safe-html.pipe';
import { SafeStylePipe } from './growon/pipes/safe-style/safe-style.pipe';
import { SafeScriptPipe } from './growon/pipes/safe-script/safe-script.pipe';
import { SafeResourceUrlPipe } from './growon/pipes/safe-resource-url/safe-resource-url.pipe';


import { MatTableModule } from '@angular/material/table';
import { ViewQuestionpaperComponent } from './growon/learning/view-questionpaper/view-questionpaper.component';
import { CreateQuestionComponent } from './growon/learning/create-question/create-question.component';
import { MathModule } from './growon/mathjax/mathjax.module';
// import { MathDirective } from './growon/mathjax/mathjax.directive';
import { MathJaxDirective } from "./growon/learning/directives/mathjax/math-jax.directive";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreateQuestionpaperComponent } from './growon/learning/create-questionpaper/create-questionpaper.component';
import { SelectQuestionTypeModalComponent } from './growon/learning/create-questionpaper/select-question-type-modal/select-question-type-modal.component';
import { QuestionPaperComponent } from './growon/learning/question-paper/question-paper.component';
import { EditSectionModalComponent } from './growon/learning/question-paper/edit-section-modal/edit-section-modal.component';
import { ChangeQuestionModalComponent } from './growon/learning/question-paper/change-question-modal/change-question-modal.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EditStudentComponent } from './growon/create/student/edit-student/edit-student.component';
import { AllStudentsComponent } from './growon/create/student/all-students/all-students.component';
import { AllInstituteComponent } from './growon/create/all-institute/all-institute.component';
import { AllStudentComponent } from './growon/create/all-student/all-student.component';
import { AllManagementComponent } from './growon/create/all-management/all-management.component';
import { AllPrincipleComponent } from './growon/create/all-principle/all-principle.component';
import { AllTeacherComponent } from './growon/create/all-teacher/all-teacher.component';
import { EditAllInstituteComponent } from './growon/create/all-institute/edit-all-institute/edit-all-institute.component';
import { EditAllStudentComponent } from './growon/create/all-student/edit-all-student/edit-all-student.component';
import { EditAllTeacherComponent } from './growon/create/all-teacher/edit-all-teacher/edit-all-teacher.component';
import { EditAllManagementComponent } from './growon/create/all-management/edit-all-management/edit-all-management.component';
import { SchoolDashboardComponent } from './growon/school-dashboard/school-dashboard.component';
import { BulkUploadStudentComponent } from './growon/create/all-student/bulk-upload-student/bulk-upload-student.component';
import { BackendUserComponent } from './growon/create/backend-user/backend-user.component';
import { ViewBackendUserComponent } from './growon/create/view-backend-user/view-backend-user.component';
import { EditSchoolAdminComponent } from './growon/create/all-institute/edit-school-admin/edit-school-admin.component';
import { GlobalAdminEditComponent } from './growon/create/all-institute/global-admin-edit/global-admin-edit.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ProfileUpdateComponent } from './growon/create/profile-update/profile-update.component';
import { MappingComponent } from './growon/create/mapping/mapping.component';
import { SectionComponent } from './growon/learning/section/section.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfirmationModalComponent } from './growon/create/confirmation-modal/confirmation-modal.component';
import { SecondaryClassSelectedPipe } from './growon/pipes/secondary-class-selected.pipe';
import { AnswerExplainComponent } from './growon/learning/answer-explain/answer-explain.component';
import { ImportModalComponent } from './growon/learning/allquestions/import-modal/import-modal.component';
import { SelectQuestionComponent } from './growon/learning/create-question-paper-module/select-question/select-question.component';
import { AddEditInstructionComponent } from './growon/learning/create-question-paper-module/add-edit-instruction/add-edit-instruction.component';
import { ImportConfirmationComponent } from './growon/learning/allquestions/import-confirmation/import-confirmation.component';
import { ImportChapterMediaComponent } from './growon/learning/chapter/import-chapter-media/import-chapter-media.component';
import { ImportTopicMediaComponent } from './growon/learning/topic/import-topic-media/import-topic-media.component';
import { ImportQuestionPaperComponent } from './growon/learning/allquestionpapers/import-question-paper/import-question-paper.component';
import { ImportQuestionpaperConfirmationComponent } from './growon/learning/allquestionpapers/import-questionpaper-confirmation/import-questionpaper-confirmation.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrintConfirmationComponent } from './growon/learning/confirmation-dialogue-modal/print-confirmation/print-confirmation.component';
import { QuestionpaperDeleteConfirmationComponent } from './growon/learning/confirmation-dialogue-modal/questionpaper-delete-confirmation/questionpaper-delete-confirmation.component';
import { SectionDeleteConfirmationComponent } from './growon/learning/section/section-delete-confirmation/section-delete-confirmation.component';
import { BulkUploadQuestionsComponent } from './growon/learning/allquestions/bulk-upload-questions/bulk-upload-questions.component';
import { PromotionComponent } from './growon/create/all-student/promotion/promotion.component';
import { AllUniversitiesComponent } from './growon/create/all-institute/all-universities/all-universities.component';
import { AdmissionsComponent } from './growon/create/admissions/admissions.component';
import { PaymentsComponent } from './growon/create/payments/payments.component';
import { ActivateBillingComponent } from './growon/create/payments/activate-billing/activate-billing.component';
import { DialogComponent } from './growon/create/payments/dialog/dialog.component';
import { InvoiceDialogComponent } from './growon/create/payments/invoice-dialog/invoice-dialog.component';
import { BillsDialogComponent } from './growon/create/payments/bills-dialog/bills-dialog.component';
import { OnboardDialogComponent } from './growon/create/payments/onboard-dialog/onboard-dialog.component';







@NgModule({
  declarations: [MyPageComponent, EditAppComponent, StudentComponent, SchoolComponent, TeacherComponent, PrincipleComponent,
    ManagementComponent, ClassesComponent, SectionComponent, QuestionComponent, BoardComponent, SyllabusComponent, SubjectsComponent,
    QuestioncatogoryComponent, ExamtypeComponent, ChapterComponent, TopicComponent, LearningOutcomeComponent,
    CreateQuestionPaperComponent, TestComponentComponent, ModalPopupComponent, QuestionpaperComponent,
    ViewQuestionComponent, AllquestionpapersComponent, AllquestionsComponent, ViewquestionComponent, MathjaxComponent,
    AddRoleComponent, AssignRoleComponent, UpdateRoleModalComponent, UpdateUserModalComponent, UpdateTeacherModalComponent,
    UpdatePrincipleModalComponent, EditorComponent, SafeUrlPipe, SafeStylePipe, SafeScriptPipe, SafeResourceUrlPipe,
    ImportFromGlobalComponent, ImportChapterComponent, ImportTopicComponent, ImportLearningOutcomeComponent, ViewQuestionpaperComponent, CreateQuestionComponent,
    MathJaxDirective, CreateQuestionpaperComponent, SelectQuestionTypeModalComponent, EditStudentComponent,
    AllStudentsComponent, QuestionPaperComponent, EditSectionModalComponent, ChangeQuestionModalComponent, AllInstituteComponent, AllStudentComponent, AllManagementComponent, AllPrincipleComponent, AllTeacherComponent, EditAllInstituteComponent,
    EditAllStudentComponent, EditAllTeacherComponent, EditAllManagementComponent, SchoolDashboardComponent, BulkUploadStudentComponent, BackendUserComponent, ViewBackendUserComponent, EditSchoolAdminComponent, GlobalAdminEditComponent,
    ProfileUpdateComponent, MappingComponent, ConfirmationModalComponent, SecondaryClassSelectedPipe,
    AnswerExplainComponent, ImportModalComponent, ImportConfirmationComponent, ImportChapterMediaComponent,
    ImportTopicMediaComponent, ImportQuestionPaperComponent, ImportQuestionpaperConfirmationComponent,
    PrintConfirmationComponent, QuestionpaperDeleteConfirmationComponent, SectionDeleteConfirmationComponent, BulkUploadQuestionsComponent, PromotionComponent, AllUniversitiesComponent, SafeHtmlPipe, AdmissionsComponent, PaymentsComponent, ActivateBillingComponent, DialogComponent, InvoiceDialogComponent, BillsDialogComponent, OnboardDialogComponent
  ],

  exports: [ConfirmationModalComponent, ImportModalComponent, ImportConfirmationComponent,
    ImportChapterMediaComponent, ImportTopicMediaComponent, ImportQuestionpaperConfirmationComponent,
    ImportQuestionPaperComponent, PrintConfirmationComponent, QuestionpaperDeleteConfirmationComponent,
    SectionDeleteConfirmationComponent],
  providers: [NgbActiveModal, MatDatepickerModule],
  imports: [
    EditorModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    AngularEditorModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    // PartialsModule,
    MailModule,
    // ECommerceModule,
    // UserManagementModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatIconModule,
    DndModule, // DD Modules
    DragDropModule,
    NgbModalModule,
    CKEditorModule,
    MatTableModule,
    MathModule,
    MatProgressSpinnerModule,
    NgbModule,
    MatPaginatorModule,
    NgxPrintModule,
    MatTabsModule,
    MatToolbarModule,
    MatSlideToggleModule,
    NgSelectModule,
    MatChipsModule
    // MarkdownModule.forRoot()
    //  MathjaxModule.forChild()
  ],
  entryComponents: [UpdateRoleModalComponent, UpdateUserModalComponent,
    UpdateTeacherModalComponent, UpdatePrincipleModalComponent,
    ImportFromGlobalComponent, ImportChapterComponent, ImportTopicComponent,
    ImportLearningOutcomeComponent, SelectQuestionTypeModalComponent,
    EditSectionModalComponent, ChangeQuestionModalComponent, ConfirmationModalComponent, AnswerExplainComponent
    , SelectQuestionComponent, AddEditInstructionComponent, ImportModalComponent,
    ImportConfirmationComponent, ImportChapterMediaComponent, ImportTopicMediaComponent,
    ImportQuestionpaperConfirmationComponent, ImportQuestionPaperComponent, PrintConfirmationComponent,
    QuestionpaperDeleteConfirmationComponent, SectionDeleteConfirmationComponent, DialogComponent, InvoiceDialogComponent, BillsDialogComponent, OnboardDialogComponent]
})
export class PagesModule {
}
