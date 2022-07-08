import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LearningService } from '../services/learning.service';
import { SelectQuestionTypeModalComponent } from './select-question-type-modal/select-question-type-modal.component';

@Component({
  selector: 'kt-create-questionpaper',
  templateUrl: './create-questionpaper.component.html',
  styleUrls: ['./create-questionpaper.component.scss']
})
export class CreateQuestionpaperComponent implements OnInit {

  questionPaperForm: FormGroup;
  boards: any[] = [];
  SchoolBoards: any[] = [];
  isOwner: boolean;
  classes: any[] = [];
  class: any[] = [];
  syllabuses: any[] = [];
  subjects: any[] = [];
  languages: any[] = ['English', 'Hindi', 'Urdu', 'Kannada'];
  examTypes: any[] = [];
  studentTypes: any[] = [
    { 'name': 'Special Needs', 'value': 'specialNeeds' },
    { 'name': 'General', 'value': 'general' },
    { 'name': 'Gifted', 'value': 'gifted' }
  ];
  allQuestions: any[] = [];
  questionsByChapters: any;
  filteredChapters = new MatTableDataSource<any>();
  filteredTopics = new MatTableDataSource<any>();
  isChapters: boolean = false;
  displayedChapterColumns: string[] = ['select', 'chapter', 'subject'];
  selection = new SelectionModel<any>(true, []);
  questionByTopics: any[] = [];
  filteredByTopics: any[] = [];
  isTopics: boolean = false;
  isLearningOutCome: boolean = false;
  displayedTopicColumns: string[] = ['chapter', 'topic'];
  questionByOutcome: any[] = [];
  filteredByOutcome: any[] = [];
  displayedOutcomeColumns: string[] = ['chapter', 'topic', 'learningOutcome']
  outcomeDataSource = new MatTableDataSource<any>();
  questionByQuestionCategory: any;
  filteredByQuestionCategory: any[] = [];
  isQuestionCategories: boolean = false;
  selectedQuestionsByCategories: any[] = [];
  questionByQuestionType: any;
  filteredByQuestionType = new MatTableDataSource<any>();
  selectedQuestions: any = {};
  isObjective: boolean = false;
  displayedQuestionCategoryColumns: string[] = ['questionType', 'totalQuestion', 'selectedQuestion', 'action']

  constructor(
    public route: Router,
    private formBuilder: FormBuilder,
    private apiService: LearningService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,

  ) {
  }

  ngOnInit(): void {
    this.questionPaperForm = this.createQuestionPaperForm();
    this.getBoards();
    this.getClasses();
    this.getSyllabus();
    this.getSubjects();
    this.getExamType();
    this.getallinstitutes();
    this.getAdmin();
    this.getSchoolBoards();
  }

  createQuestionPaperForm() {
    return this.formBuilder.group({
      QuestionTitle: ['', Validators.required],
      questionPaperId: ['',],
      questionPaperDetail: this.formBuilder.group({
        board: ['', Validators.required],
        class: ['', Validators.required],
        syllabus: ['', Validators.required],
        totalQuestion: ['', Validators.required],
        subject: ['', Validators.required],
        language: ['', Validators.required],
        examType: ['', Validators.required],
        studentType: ['', Validators.required],
        attemptType: this.formBuilder.group({
          practice: [0, Validators.required],
          test: [0, Validators.required],
          practiceTest: [0, Validators.required]
        }),
        difficultyLevel: this.formBuilder.group({
          veryEasy: [0, Validators.required],
          easy: [0, Validators.required],
          intermediate: [0, Validators.required],
          hard: [0, Validators.required],
          veryHard: [0, Validators.required]
        }),
      }),
      repository: this.formBuilder.array([{
        id: [''],
        repository_type: ['']
      }]),
      questionId: [''],
      createdBy: ['']
    })
  }

  get questionPaperFormControl() {
    return this.questionPaperForm.controls;
  }

  get questionDetailFormControl() {
    return (<FormGroup>this.questionPaperFormControl.questionPaperDetail).controls;
  }

  get attemptTypeFormControl() {
    return (<FormGroup>this.questionDetailFormControl.attemptType).controls;
  }

  get difficultLevelFormControl() {
    return (<FormGroup>this.questionDetailFormControl.difficultyLevel).controls;
  }

  getBoards() {
    this.apiService.getBoards().subscribe((response: any) => {
      this.boards = response.body.data;
    })
  }

  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
    });
  }
  getallinstitutes() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;

    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;

    }
    this.apiService.getallinstitute(id).subscribe((data: any) => {
      this.class = data.body.data[0].classList;


      console.log(this.class, "this.class")

      this.cdr.detectChanges();

    })

  }
  getSyllabus() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      this.syllabuses = response.body.data;
    })
  }
  getSubjects() {
    this.apiService.getSubjects().subscribe((response: any) => {
      this.subjects = response.body.data
    })
  }
  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    console.log(user)
    let id: any;



    if (user.user_info[0].profile_type.role_name == 'school_admin' || user.user_info[0].profile_type.role_name == 'teacher') {


      this.isOwner = true
      console.log(this.isOwner)
    } else if(localStorage.getItem('schoolId')){
      this.isOwner=true;
    }
    else {
      this.isOwner = false
    }
  }
  getExamType() {
    this.apiService.getExamType().subscribe((response: any) => {
      this.examTypes = response.body.data;
    })
  }

  getChaptersForm() {
    console.log(this.attemptTypeFormControl.practice.value + this.attemptTypeFormControl.test.value + this.attemptTypeFormControl.practiceTest.value)
    if (this.attemptTypeFormControl.practice.value + this.attemptTypeFormControl.test.value + this.attemptTypeFormControl.practiceTest.value > this.questionDetailFormControl.totalQuestion.value) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Total attempt type can not be greater than total questions' });
      return;
    } else if (this.difficultLevelFormControl.veryEasy.value + this.difficultLevelFormControl.easy.value + this.difficultLevelFormControl.intermediate.value + this.difficultLevelFormControl.hard.value + this.difficultLevelFormControl.veryHard.value > this.questionDetailFormControl.totalQuestion.value) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Total Difficulty level can not be greater than total questions' });
      return;
    } else {
      let exmType = '';
      // this.loadingChapters = true;
      // let exType = [];
      this.questionDetailFormControl.examType.value.forEach(element => {
        exmType = exmType + '&examType=' + element;
      })
      // data.examType = exType.toString();
      let studType = '';
      console.log(this.questionDetailFormControl.studentType.value)
      this.questionDetailFormControl.studentType.value.forEach(element => {
        studType = studType + '&studentType=' + element;
      })
      let subject = '';
      console.log(this.questionDetailFormControl.subject.value)
      this.questionDetailFormControl.subject.value.forEach(element => {
        subject = subject + '&subject=' + element;
      })
      // data.studentType = studType.toString();
      // this.firstSectionFilteredData = data;
      console.log(this.questionPaperFormControl,)
      let queryString = `class=${this.questionDetailFormControl.class.value}&board=${this.questionDetailFormControl.board.value}&syllabus=${this.questionDetailFormControl.syllabus.value}&language=${this.questionDetailFormControl.language.value}${subject}${exmType}${studType}`;
      this.apiService.filterQuestionData(queryString).subscribe((response: any) => {
        console.log(response)
        if (response.status == 200) {
          if (response.body.data.length > 0) {
            this.allQuestions = response.body.data;
            this.questionsByChapters = this.groupBy(this.allQuestions, 'chapter');
            this.filteredChapters.data = Object.keys(this.questionsByChapters);
            this.isChapters = true;
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
  }


  groupBy(xs, key) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.filteredChapters.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.filteredChapters.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  submitChpters() {
    let group = this.questionPaperFormControl.questionPaperDetail as FormGroup;
    group.addControl('chapters', this.formBuilder.array([]));
    let chapters = this.questionDetailFormControl.chapters as FormArray
    console.log(chapters)
    this.filteredTopics.data = this.selection.selected;
    for (let index = 0; index < this.selection.selected.length; index++) {
      this.questionByTopics.push(this.groupBy(this.questionsByChapters[this.filteredChapters.data[index]], 'topic'))
      this.filteredByTopics.push(Object.keys(this.questionByTopics[index]))
      chapters.push(this.formBuilder.group({
        chapter: [this.selection.selected[index], Validators.required],
        topics: ['', Validators.required],
        learningOutcome: this.formBuilder.array([])
      }))

    }
    this.isTopics = true;
    console.log(this.questionPaperFormControl)
    console.log(this.questionByTopics, this.filteredByTopics)
    // this.selection.selected.forEach(chapter=>{
    //   this.questionByTopics.push(this.groupBy(this.allQuestions, 'chapter'))
    //   this.questionsByChapters = this.groupBy(this.allQuestions, 'chapter');
    //   this.filteredChapters.data = Object.keys(this.questionsByChapters);
    // })
  }

  submitTopics() {
    let chapters = this.questionDetailFormControl.chapters as FormArray;
    let group = this.questionPaperFormControl.questionPaperDetail as FormGroup;
    group.addControl('learningOutcome', this.formBuilder.array([]));
    let learningOutcome = this.questionDetailFormControl.learningOutcome as FormArray;
    for (let index = 0; index < chapters.controls.length; index++) {
      // let learningOutcome = chapters.get('learningOutcome') as FormArray;
      this.questionByOutcome.push([]);
      // this.filteredByOutcome.push([]);
      for (let j = 0; j < chapters.controls[index].get('topics').value.length; j++) {
        this.questionByOutcome[index].push(this.groupBy(this.questionByTopics[index][this.filteredByTopics[index][j]], 'learningOutcome'))
        console.log(this.questionByOutcome[index][j])
        this.filteredByOutcome.push(Object.keys(this.questionByOutcome[index][j]))
        learningOutcome.push(this.formBuilder.group({
          chapter: [chapters.controls[index].get('chapter').value],
          topic: [chapters.controls[index].get('topics').value[j]],
          outcome: ['', Validators.required]
        }))
        if (index == chapters.controls.length - 1 && j == chapters.controls[index].get('topics').value.length - 1) {
          this.isLearningOutCome = true;
          this.outcomeDataSource.data = this.questionDetailFormControl.learningOutcome.value;
          this.cdr.detectChanges();
        }
      }
      console.log(this.questionByOutcome, this.filteredByOutcome)
      // this.questionByTopics.push(this.groupBy(this.questionsByChapters[this.filteredChapters.data[index]], 'topic'))
      // this.filteredByTopics.push(Object.keys(this.questionByTopics[index]))
      // chapters.push(this.formBuilder.group({
      //   chapter: [this.selection.selected, Validators.required],
      //   topics: ['', Validators.required]
      // }))
    }

    console.log(this.questionPaperFormControl, this.questionDetailFormControl.learningOutcome.value)
  }

  submitOutcome() {
    // console.log(this.questionByOutcome)
    let questions = [];
    let learningOutcome = this.questionDetailFormControl.learningOutcome as FormArray;
    for (let index = 0; index < learningOutcome.controls.length; index++) {
      for (let j = 0; j < learningOutcome.controls[index].get('outcome').value.length; j++) {
        // console.log(learningOutcome.controls[index].value.chapter, learningOutcome.controls[index].value.topic, learningOutcome.controls[index].get('outcome').value[j])
        questions = questions.concat(this.allQuestions.filter(question => {
          return question.chapter == learningOutcome.controls[index].value.chapter &&
            question.topic == learningOutcome.controls[index].value.topic &&
            question.learningOutcome == learningOutcome.controls[index].get('outcome').value[j]
        }))
        if (index == learningOutcome.controls.length - 1 && j == learningOutcome.controls[index].get('outcome').value.length - 1) {
          console.log(questions)
          let group = this.questionPaperFormControl.questionPaperDetail as FormGroup;
          group.addControl('questionCategory', this.formBuilder.control(['', Validators.required]));
          this.questionByQuestionCategory = this.groupBy(questions, 'questionCategory')
          this.filteredByQuestionCategory = Object.keys(this.questionByQuestionCategory)
          this.isQuestionCategories = true;
        }
      }
    }

    // this.allQuestions.filter
  }

  submitQuestionCategory() {
    console.log(this.questionDetailFormControl.questionCategory.value)
    this.selectedQuestionsByCategories = [];
    for (let index = 0; index < this.questionDetailFormControl.questionCategory.value.length; index++) {
      this.selectedQuestionsByCategories = this.selectedQuestionsByCategories.concat(this.questionByQuestionCategory[this.questionDetailFormControl.questionCategory.value[index]])
      if (index == this.questionDetailFormControl.questionCategory.value.length - 1) {
        this.questionByQuestionType = this.groupBy(this.selectedQuestionsByCategories, 'questionType')
        this.filteredByQuestionType.data = Object.keys(this.questionByQuestionType)
        for (let j = 0; j < this.filteredByQuestionType.data.length; j++) {
          this.selectedQuestions[this.filteredByQuestionType.data[j]] = []
          if (index == this.questionDetailFormControl.questionCategory.value.length - 1 && j == this.filteredByQuestionType.data.length - 1) {
            console.log(this.selectedQuestions)
            this.isObjective = true;
          }
        }
        console.log(this.questionByQuestionType, this.filteredByQuestionType)
      }
    }
  }

  getNumberQuestions(type) {
    return this.questionByQuestionType[type].length;
  }

  getNumberSelectedQuestions(type) {
    return this.selectedQuestions[type].length;
  }

  selectQuestions(type) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'xl'
    };
    const modalRef = this.modalService.open(SelectQuestionTypeModalComponent, ngbModalOptions);
    modalRef.componentInstance.allQuestion = this.questionByQuestionType[type];
    modalRef.componentInstance.selectQuestion = this.selectedQuestions[type];
    modalRef.result.then((result) => {
      console.log(result);
      this.selectedQuestions[type] = result;
    })
  }

  generateQestionPaper() {

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    if (user.user_info[0].school_id) {
      this.questionPaperForm.controls['repository'].patchValue([{
        id: user.user_info[0].school_id,
        repository_type: 'School'
      }])
    } else {
      if(user.user_info[0].repository && user.user_info[0].repository.length){
        this.questionPaperForm.controls['repository'].patchValue([{
          id: user.user_info[0].repository[0].id,
          repository_type: 'Global'
        }])
      }else{
        this.questionPaperForm.controls['repository'].patchValue([{
          id: user.user_info[0]._id,
          repository_type: 'Global'
        }])
      }
      // this.questionPaperForm.controls['repository'].patchValue([{
      //   id: user.user_info[0]._id,
      //   repository_type: 'Global'
      // }])

    }
    const mapped = [].concat.apply([], Object.values(this.selectedQuestions))

    // const ids = [];
    // console.log(mapped, this.selectedQuestions)

    // mapped.forEach(element => {
    //   ids.push(element._id)
    // });
    if (mapped.length > 0) {

      this.questionPaperForm.controls['questionId'].setValue(mapped);
      this.questionPaperForm.controls['createdBy'].setValue(localStorage.getItem('UserName'));
      this.route.navigate(['show/qpaper/', ''], { state: { type: 'create', data: this.questionPaperForm.value } })

      // this.apiService.generatedQuestionPaper(this.questionPaperForm.value, 'insert').subscribe((response: any) => {
      //   if (response.status == 201) {
      //     Swal.fire('Added', 'Question paper generated successfully', 'success').then(() => {
      //       this.route.navigate(['show/qpaper/', response.body.data._id], { state: { type: 'create' } })
      //     });
      //   } else {
      //     Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
      //     return;
      //   }
      // }, (error) => {
      //   if (error.status == 400) {
      //     console.log('error => ', error)
      //     Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
      //     return;
      //   } else {
      //     Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
      //     return;
      //   }
      // });
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please select questions' });
      return;
    }
  }
  getSchoolBoards() {
    this.apiService.getSchoolBoards().subscribe((response: any) => {



      this.SchoolBoards = response.body.data;

      // this.boards = response.body.data.board;
      this.cdr.detectChanges();
    })
  }


}
