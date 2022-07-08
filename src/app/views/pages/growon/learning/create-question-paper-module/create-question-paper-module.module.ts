import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateQuestionPaperModuleRoutingModule } from './create-question-paper-module-routing.module';
import { CreateQuestionPaperModuleComponent } from './create-question-paper-module.component';
import { ThemeModule } from 'src/app/views/theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from 'src/app/core/core.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPrintModule } from 'ngx-print';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MathModule } from '../../mathjax/mathjax.module';
import { MatTableModule } from '@angular/material/table';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DndModule } from 'ngx-drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SelectQuestionComponent } from './select-question/select-question.component';
import { AddEditInstructionComponent } from './add-edit-instruction/add-edit-instruction.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HtmlSanitizePipe } from './html-sanitize.pipe';


@NgModule({
  declarations: [CreateQuestionPaperModuleComponent, SelectQuestionComponent, AddEditInstructionComponent, HtmlSanitizePipe],
  entryComponents:[SelectQuestionComponent,AddEditInstructionComponent],
  exports:[SelectQuestionComponent,AddEditInstructionComponent],
  imports: [
    CommonModule,
    CreateQuestionPaperModuleRoutingModule,
    ThemeModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
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
    NgxPrintModule,
    MatTabsModule,
    MatToolbarModule,
    NgSelectModule,
  ]
})
export class CreateQuestionPaperModuleModule { }
