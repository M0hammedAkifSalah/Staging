import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'kt-view-questionpaper',
  templateUrl: './view-questionpaper.component.html',
  styleUrls: ['./view-questionpaper.component.scss']
})
export class ViewQuestionpaperComponent implements OnInit {

  questionPaperForm: FormGroup;
  questionForm: FormGroup;

  constructor(public formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.craeteQuestionForm()
    this.createQuestionPaperForm();
  }

  createQuestionPaperForm(){
    return this.formBuilder.group({
      QuestionTitle:['',Validators.required],
      questionpaper_id:['',Validators.required],
      questionId:this.formBuilder.array([]),
      repository:['']
    })
  }

  craeteQuestionForm(){
    return this.formBuilder.group({
      board: ['', Validators.required],
      class: ['', Validators.required],
      syllabus: ['', Validators.required],
    })
  }

}
