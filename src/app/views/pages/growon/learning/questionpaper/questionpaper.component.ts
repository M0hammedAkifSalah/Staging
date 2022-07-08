import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearningService } from '../services/learning.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { Location } from '@angular/common';
@Component({
  selector: 'kt-questionpaper',
  templateUrl: './questionpaper.component.html',
  styleUrls: ['./questionpaper.component.scss']
})
export class QuestionpaperComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private apiService: LearningService, private cdr: ChangeDetectorRef, private route: ActivatedRoute, private location: Location) { }
  questions: any;
  questionOptions: any;
  trueOrFalse: Array<object> = [{ 'name': 'True', 'value': 'true' }, { 'name': 'False', 'value': 'false' }];
  alpha: Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  capitalAlpha: Array<any> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  smallAlpha: Array<any> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j","k","l","m","n","o', 'p', 'q","r', 's","t","u","v","w","x', 'y","z', ','];
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
  negativeScoring: any = 'no';
  negativeMarks: any;
  totalMarks: any;
  showModel: boolean = false;
  currentViewQuestionID: any;
  currentChangeQuestionID: any;
  currentQuestionType: any;
  questionIndex: any;
  questionsLoaded: any = false;
  username: any = localStorage.getItem('UserName');
  paperTitle: any;
  questionPaperId: any;
  pageType: any;
  s3BucketUrl: any;
  ngOnInit(): void {
    console.log();
    this.s3BucketUrl = environment.s3BucketUrl
    let state: any = this.location.getState();
    this.route.params.subscribe(param => {
      this.questionPaperId = param.id
      this.pageType = state.type
      if (this.pageType == 'create') {
        this.getAllQuestions(this.questionPaperId);
      } else {
        this.getQuestionPaperWithId(this.questionPaperId)
      }
    })
    // this.route.queryParams.subscribe(params => {
    //   console.log( params)
    //   this.questionPaperId = params['id'];
    //   this.getAllQuestions(this.questionPaperId);
    // });
    // let id = window.location.href.split('/').pop(); //Uncomment and comment above to receive actual data
    // let id = '5faf8a9400b42630135c2aff';
    // uncomment this function for actual data
    // this.getQnsForTest(); // dummy test function
  }
  getAllQuestions(id) {
    this.apiService.getSubmittedQuestions(id).subscribe((response: any) => {
      console.log('response', response);
      this.questions = response.body.data.questionId;
      console.log(this.questions)
      this.cdr.detectChanges();
    })
  }
  getQuestionPaperWithId(id) {
    this.apiService.getQuestionPaperWithId(id).subscribe((response: any) => {
      console.log('response', response);
      this.questions = response.body.data.chapter.question_list;
      console.log(this.questions)
      this.paperTitle = response.body.data.chapter.question_title;
      this.cdr.detectChanges();
    })
  }
  // changeQuestion
  changeQuestion(qType, index, qId) {
    this.questionIndex = index;
    this.currentChangeQuestionID = qId;
    this.currentQuestionType = qType;
    this.showModel = true;
    this.apiService.changeQuestion(qType).subscribe((response: any) => {
      this.questionOptions = response.body.data;
      this.cdr.detectChanges();
    })
  }
  // closeModal
  closeModal() {
    this.showModel = false;
  }
  // selectQuestion
  selectQuestion(question) {
    console.log('questions before change', this.questions);
    this.questions.splice(this.questionIndex, 1);
    this.questions.splice(this.questionIndex, 0, question);
    console.log('questions after change', this.questions);
    this.showModel = false;
  }
  // changeQtype
  changeQtype(qType) {
    this.currentChangeQuestionID = null;
    this.apiService.changeQuestion(qType).subscribe((response: any) => {
      if (response.body.data.length > 0) {
        this.questions = response.body.data;
        this.cdr.detectChanges();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No questions found for selected question type' });
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
  // changeQuestionDetails
  changeQuestionDetails(marks, index, type) {
    if (type == 'totalMarks') {
      this.questions[index].totalMarks = marks;
    } else if (type == 'duration') {
      this.questions[index].duration = marks;
    }
  }
  // getQnsForTest
  getQnsForTest() {
    this.apiService.getAllQuestions().subscribe((response: any) => {
      if (response.body.data.length > 0) {
        this.questions = response.body.data;
        this.cdr.detectChanges();
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No questions found for selected question type' });
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
    })
  }
  // formatTwoMtf
  formatTwoMtf(array, index) {
    let arr = array[0];
    let inc = index + 1;
    console.log('arr', arr);
    // return arr["matchForCol1Option"+inc];
    console.log('after converting to array', Object.keys(arr).map(key => ({ type: key, value: arr[key] })));
    return Object.keys(arr).map(key => ({ type: key, value: arr[key] }));

    console.log('array', array);
    console.log('index', index);
  }
  // showFib
  showFib(question) {
    // return question;
    // return question.replaceAll("{?}", "<span class='underscore'></span>");
    let find = '{?}';
    // let rep = '<span class="underscore" style="width: 60px; display: -webkit-inline-box; border-bottom: 1px solid;"></span>';
    let rep = '  ________  ';
    if (question) {
      return this.replaceAll(question, find, rep);
    } else {
      return '';
    }
  }
  replaceAll(string, search, replace) {
    if (string) {
      return string.split(search).join(replace);
    } else {
      return '';
    }
  }
  // testnig
  activeCustomers = [
    'John',
    'Watson'
  ];

  inactiveCustomers = [
    'Adam',
    'Jack',
    'Katherin'
  ];
  // dropQuestion
  dropQuestion(event: CdkDragDrop<string[]>) {
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
  }
  // drop
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      console.log('dropped Event one', `> dropped '${event.item.data}' into '${event.container.id}'`);
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

    this.pre = `
activeCustomers:
${JSON.stringify(this.activeCustomers, null, ' ')}

inactiveCustomers:
${JSON.stringify(this.inactiveCustomers, null, ' ')}`;
  }

  /* markdown = `
# Material Design: Angular 7, drag-and-drop list
requires:
- \`CdkDragDrop\`, \`moveItemInArray\` and \`transferArrayItem\` imports
- \`cdkDropList\` directive and \`cdkDropListDropped\` event
- CSS \`flex\` layout

`; */

  pre = `
activeCustomers:
${JSON.stringify(this.activeCustomers, null, ' ')}

inactiveCustomers:
${JSON.stringify(this.inactiveCustomers, null, ' ')}`;
  // viewQuestion
  viewQuestion(id) {
    this.currentViewQuestionID = null;
    this.currentViewQuestionID = id;
    console.log('id', id);
  }
  // saveChanges
  saveChanges() {
    // console.log('dropped Event one', `> dropped '${JSON.stringify(this.questions, null, ' ')}`);
    if (this.paperTitle) {
      let userInfo = localStorage.getItem('info');
      let user = JSON.parse(userInfo);
      let id: any;
      let repo: any;
      if (user.user_info[0].school_id) {
        id = user.user_info[0].school_id;
        repo = 'School';
      } else {
        id = user.user_info[0].id;
        repo = 'Global';
      }
      let questionList = [];
      this.questions.forEach(question => {
        questionList.push(question)
      });
      let questionPaper = {
        "question_title": this.paperTitle,
        "question_list": questionList,
        "repository": [{
          "school": id,
          "repository_Type": repo
        }],
        "createdBy": localStorage.getItem('UserName'),
        "updatedBy": localStorage.getItem('UserName')
      };
      if (this.pageType == 'create') {

        this.apiService.saveQuestionPaper(questionPaper).subscribe((response: any) => {
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
        this.apiService.updateQuestionPaper(this.questionPaperId, questionPaper).subscribe((response: any) => {
          if (response.status == 201) {
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
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter question paper title' });
      return;
    }
  }
  // getImage
  getSourceUrl(questions, answer) {
    console.log('question', questions);
    console.log('answer', answer);
    let path = questions[answer - 1].value;
    return `${environment.s3BucketUrl}${path}`;
  }
}
