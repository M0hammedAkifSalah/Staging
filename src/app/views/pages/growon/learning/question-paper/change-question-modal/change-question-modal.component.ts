import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LearningService } from '../../services/learning.service';

@Component({
  selector: 'kt-change-question-modal',
  templateUrl: './change-question-modal.component.html',
  styleUrls: ['./change-question-modal.component.scss']
})
export class ChangeQuestionModalComponent implements OnInit {

  @Input() allQuestion: any[] = [];
  @Input() questionPaperDetail;
  @Input() questionType;
  questionByQuestionType: any;
  questionTypeForm: FormGroup;
  questionTypes: Array<object> = [
    { 'name': 'Objectives', 'value': 'objectives' },
    { 'name': 'MCQs', 'value': 'mcq' },
    { 'name': 'Fill In The Blanks', 'value': 'fillInTheBlanks' },
    { 'name': '2 Column Match The Following', 'value': 'twoColMtf' },
    { 'name': '3 Column Match The Following', 'value': 'threeColMtf' },
    { 'name': 'Sequencing Question', 'value': 'sequencingQuestion' },
    { 'name': 'Sentence Sequencing', 'value': 'sentenceSequencing' },
    { 'name': 'True Or False', 'value': 'trueOrFalse' },
    { 'name': 'Numerical value Range', 'value': 'NumericalRange' },
    { 'name': 'Sorting', 'value': 'sorting' },
    { 'name': 'Free Text', 'value': 'freeText' },
  ];
  isQuestions: boolean = false;
  constructor(
    public apiService: LearningService,
    public formBuilder: FormBuilder,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.questionTypeForm = this.formBuilder.group({
      questiontype: [this.questionType]
    })
    // this.questiontype.setValue(this.questionType)
    console.log(this.allQuestion, this.questionPaperDetail)
    this.getQuestions();
  }

  getQuestions() {
    let exmType = '';
    this.questionPaperDetail.examType.forEach(element => {
      exmType = exmType + '&examType=' + element;
    })
    let studType = '';
    this.questionPaperDetail.studentType.forEach(element => {
      studType = studType + '&studentType=' + element;
    })
    let queryString = `class=${this.questionPaperDetail.class}&board=${this.questionPaperDetail.board}&syllabus=${this.questionPaperDetail.syllabus}&subject=${this.questionPaperDetail.subject}&language=${this.questionPaperDetail.language}${exmType}${studType}`;
    this.apiService.filterQuestionData(queryString).subscribe((response: any) => {
      console.log(response)
      if (response.status == 200) {
        if (response.body.data.length > 0) {
          let questions = [];
          for (let index = 0; index < this.questionPaperDetail.learningOutcome.length; index++) {
            for (let j = 0; j < this.questionPaperDetail.learningOutcome[index].outcome.length; j++) {
              questions = questions.concat(response.body.data.filter(question => {
                return question.chapter == this.questionPaperDetail.learningOutcome[index].chapter &&
                  question.topic == this.questionPaperDetail.learningOutcome[index].topic &&
                  question.learningOutcome == this.questionPaperDetail.learningOutcome[index].outcome[j] &&
                  this.questionPaperDetail.questionCategory.indexOf(question.questionCategory) > -1
              }))
              if (index == this.questionPaperDetail.learningOutcome.length - 1 && j == this.questionPaperDetail.learningOutcome[index].outcome.length - 1) {
                this.questionByQuestionType = this.groupBy(questions, 'questionType')
                console.log(this.questionByQuestionType)
                this.isQuestions = true;
              }
            }
          }
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Sorry! There are no questions for select filters' });
          return;
        }
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    }, (error) => {
      if (error.status == 400) {
        console.log('error => ', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    });
  }

  groupBy(xs, key) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  showFib(question) {
    // return question;
    // return question.replaceAll("{?}", "<span class='underscore'></span>");
    let find = '{?}';
    // let rep = '<span class="underscore" style="width: 60px; display: -webkit-inline-box; border-bottom: 1px solid;"></span>';
    let rep = '  ________  ';
    if (question) {

      return question.split(find).join(rep);
    } else {
      return '';
    }
  }

  changeQuestion(question) {
    this.activeModal.close(question);
  }

  disableQuestion(question) {
    if (this.allQuestion.some((item) => item._id == question._id)) {
      return true
    } else {
      return false
    }

  }

  closeModal() {
    this.activeModal.close(null);
  }
}
