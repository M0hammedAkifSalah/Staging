import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LearningService } from '../services/learning.service';
import { ChangeQuestionModalComponent } from './change-question-modal/change-question-modal.component';
import { EditSectionModalComponent } from './edit-section-modal/edit-section-modal.component';
import { NgxPrintModule } from 'ngx-print';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';


@Component({
  selector: 'kt-question-paper',
  templateUrl: './question-paper.component.html',
  styleUrls: ['./question-paper.component.scss']
})
export class QuestionPaperComponent implements OnInit {
  questionPaperId: any;
  pageType: any;
  questionPaperForm: FormGroup;
  createDetails: any;
  showModel: boolean = false;
  showContent: boolean = false;
  viewQuestions: any[] = [];
  questions: any[] = [];
  allQuestions: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private apiService: LearningService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    let state: any = this.location.getState();
    this.route.params.subscribe(param => {
      this.questionPaperId = param.id
      this.pageType = state.type;
      this.createDetails = state.data
      if (this.pageType == 'create') {
        this.getAllQuestions(this.createDetails);
      } else {
        this.getQuestionPaperWithId(this.questionPaperId)
      }
    })
  }

  getAllQuestions(createDetails) {
    this.questionPaperForm = this.formBuilder.group({
      question_title: [createDetails.QuestionTitle, Validators.required],
      createdBy: [createDetails.createdBy],
      detail_question_paper: [createDetails.questionPaperDetail],
      repository: [createDetails.repository],
      section: this.formBuilder.array([])
    })
    this.sectionControl.push(this.formBuilder.group({
      section_name: ['Section 1', Validators.required],
      information: ['Section 1'],
      question_list: this.formBuilder.array([])
    }))

    let question_list = this.sectionControl.at(0).get('question_list') as FormArray;
    for (let i = 0; i < createDetails.questionId.length; i++) {
      question_list.push(this.formBuilder.group({
        questionTitle: [createDetails.questionId[i].questionTitle],
        answer: [createDetails.questionId[i].answer],
        duration: [createDetails.questionId[i].duration, Validators.required],
        negativeMarks: [createDetails.questionId[i].negativeMarks],
        negativeScore: [createDetails.questionId[i].negativeScore],
        options: [createDetails.questionId[i].options],
        optionsType: [createDetails.questionId[i].optionsType],
        question: [createDetails.questionId[i].question],
        questionType: [createDetails.questionId[i].questionType],
        totalMarks: [createDetails.questionId[i].totalMarks],
        matchOptions: [createDetails.questionId[i].matchOptions],
        _id: [createDetails.questionId[i]._id]
      }))
      this.viewQuestions.push(false)
      if (i == createDetails.questionId.length - 1) {
        this.showModel = true;
        this.questions.push(this.sectionControl.at(0).get('question_list').value);
        this.allQuestions = createDetails.questionId;
        console.log("this.allQuestions", this.allQuestions)
      }
    }
    console.log(this.questionPaperForm)
  }

  getQuestionPaperWithId(id) {
    this.apiService.getQuestionPaperWithId(id).subscribe((response: any) => {
      console.log('response', response);
      let createDetails = response.body.data
      this.questionPaperForm = this.formBuilder.group({
        question_title: [createDetails.question_title, Validators.required],
        createdBy: [createDetails.createdBy],
        detail_question_paper: [createDetails.detail_question_paper],
        repository: [createDetails.repository],
        section: this.formBuilder.array([])
      })
      this.sectionControl.push(this.formBuilder.group({
        section_name: [createDetails.section[0].section_name, Validators.required],
        information: [createDetails.section[0].information],
        question_list: this.formBuilder.array([])
      }))

      let question_list = this.sectionControl.at(0).get('question_list') as FormArray;
      for (let i = 0; i < createDetails.section[0].question_list.length; i++) {
        question_list.push(this.formBuilder.group({
          questionTitle: [createDetails.section[0].question_list[i].questionTitle],
          answer: [createDetails.section[0].question_list[i].answer],
          duration: [createDetails.section[0].question_list[i].duration, Validators.required],
          negativeMarks: [createDetails.section[0].question_list[i].negativeMarks],
          negativeScore: [createDetails.section[0].question_list[i].negativeScore],
          options: [createDetails.section[0].question_list[i].options],
          optionsType: [createDetails.section[0].question_list[i].optionsType],
          question: [createDetails.section[0].question_list[i].question],
          questionType: [createDetails.section[0].question_list[i].questionType],
          totalMarks: [createDetails.section[0].question_list[i].totalMarks],
          matchOptions: [createDetails.section[0].question_list[i].matchOptions],
          _id: [createDetails.section[0].question_list[i]._id]
        }))
        this.viewQuestions.push(false)
        if (i == createDetails.section[0].question_list.length - 1) {
          this.showModel = true;
          this.questions.push(this.sectionControl.at(0).get('question_list').value);
          this.allQuestions = createDetails.section[0].question_list;
          console.log("this.allQuestions", this.allQuestions)

        }
      }
    })
  }

  get sectionControl() {
    return this.questionPaperForm.get('section') as FormArray;
  }

  // showFib
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
  toggleButton(i) {
    console.log("in toggle", this.viewQuestions[i], !this.viewQuestions[i])
    this.viewQuestions[i] = !this.viewQuestions[i];
    console.log("in toggle", this.viewQuestions[i])

  }

  // dropQuestion
  dropQuestion(event: CdkDragDrop<string[]>, index) {
    console.log(event)
    if (event.previousContainer === event.container) {
      // console.log('dropped Event one', `> dropped '${JSON.stringify(this.questions, null, ' ')}`);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log('dropped Event two', `> dropped '${event.item.data}' into '${event.container.id}'`);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

    }
    this.sectionControl.at(index).get('question_list').patchValue(this.questions[index]);
    console.log(this.questionPaperForm.value)
  }

  editSection(index) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    };
    const modalRef = this.modalService.open(EditSectionModalComponent, ngbModalOptions);
    // modalRef.componentInstance.allQuestion = this.questionByQuestionType[type];
    // modalRef.componentInstance.selectQuestion = this.selectedQuestions[type];
    // modalRef.result.then((result) => {
    //   console.log(result);
    //   this.selectedQuestions[type] = result;
    // })
  }

  changeQuestion(i, j, questionType) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
      windowClass: 'fullscreen'
    };
    const modalRef = this.modalService.open(ChangeQuestionModalComponent, ngbModalOptions);
    modalRef.componentInstance.allQuestion = this.allQuestions;
    modalRef.componentInstance.questionPaperDetail = this.questionPaperForm.get('detail_question_paper').value;
    modalRef.componentInstance.questionType = questionType;
    modalRef.result.then((result) => {
      if (result) {
        let question_list = this.sectionControl.at(i).get('question_list') as FormArray;
        question_list.at(j).patchValue({
          questionTitle: [result.questionTitle],
          answer: [result.answer],
          duration: [result.duration, Validators.required],
          negativeMarks: [result.negativeMarks],
          negativeScore: [result.negativeScore],
          options: [result.options],
          optionsType: [result.optionsType],
          question: [result.question],
          questionType: [result.questionType],
          totalMarks: [result.totalMarks],
          matchOptions: [result.matchOptions],
          _id: [result._id]
        })
        this.questions[i].splice(j, 1);
        this.questions[i].splice(j, 0, question_list.at(j).value);
      }
    })
  }

  saveQuestionPaper() {

    if (this.pageType == 'create') {
      this.apiService.saveQuestionPaper(this.questionPaperForm.value).subscribe((response: any) => {
        if (response.status == 201) {
          Swal.fire('Added', 'Question Paper Saved', 'success').then(function () {

          });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
          return;
        }
      }, (error) => {
        if (error.status == 400) {
          Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
          return;
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your fie please try again' });
          return;
        }
      });
    }
    else {
      this.apiService.updateQuestionPaper(this.questionPaperId, this.questionPaperForm.value).subscribe((response: any) => {
        if (response.status == 201 || response.status == 200) {
          Swal.fire('Added', 'Question Paper Updated', 'success').then(function () {

          });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
          return;
        }
      }, (error) => {
        if (error.status == 400) {
          Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
          return;
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem uploding your fie please try again' });
          return;
        }
      });
    }
  }
  getNextLetter(num): String {
    var code: number = "abcdefghijklmnopqrstuvwxyz".charCodeAt(num);
    return String.fromCharCode(code);
  }

  // Export2Doc(element, filename) {


  //   var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title> < link rel = 'stylesheet' href =' ['./question-paper.component.scss']'/></head><body>";

  //   var postHtml = "</body></html>";
  //   var html = preHtml + document.getElementById(element).innerHTML + postHtml;






  //   var blob = new Blob(['\ufeff', html,], {
  //     type: 'application/msword'
  //   });


  //   var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)

  //   filename = filename ? filename + '.doc' : 'document.doc';



  //   var downloadLink = document.createElement("a");

  //   document.body.appendChild(downloadLink);
  //   if (navigator.msSaveOrOpenBlob) {
  //     navigator.msSaveOrOpenBlob(blob, filename);
  //   } else {
  //     // Create a link to the file
  //     downloadLink.href = url;

  //     // Setting the file name
  //     downloadLink.download = filename;

  //     //triggering the function
  //     downloadLink.click();
  //   }

  //   document.body.removeChild(downloadLink);



  // }



}
