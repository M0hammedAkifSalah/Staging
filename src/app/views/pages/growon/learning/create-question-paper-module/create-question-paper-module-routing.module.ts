import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateQuestionPaperModuleComponent } from './create-question-paper-module.component';

const routes: Routes = [{ path: '', component: CreateQuestionPaperModuleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateQuestionPaperModuleRoutingModule { }
