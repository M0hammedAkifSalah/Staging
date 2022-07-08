import { Component, Input, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingService } from '../../../loader/loading/loading.service';

@Component({
  selector: 'kt-answer-explain',
  templateUrl: './answer-explain.component.html',
  styleUrls: ['./answer-explain.component.scss']
})
export class AnswerExplainComponent implements OnInit {
  @Input() updateAnswer;
  @Input() updateFlag;
  @Input() readyOnly: boolean = false;
  answerExplain: any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  constructor(private activeModal: NgbActiveModal, private loaderService: LoadingService) { }

  ngOnInit(): void {
    this.loaderService.show();
    // if (this.updateFlag) {
      this.answerExplain = this.updateAnswer
    // }
    this.loaderService.hide();
  }
  submitAnswerExplain() {
    this.activeModal.close(this.answerExplain)
  }
}
