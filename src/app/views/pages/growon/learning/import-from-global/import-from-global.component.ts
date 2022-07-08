import { LoadingService } from './../../../loader/loading/loading.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { getDropData } from 'ngx-drag-drop/dnd-utils';
import Swal from 'sweetalert2';
import { LearningService } from '../services/learning.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { sortBy } from 'lodash';
import * as _ from 'lodash';



@Component({
  selector: 'kt-import-from-global',
  templateUrl: './import-from-global.component.html',
  styleUrls: ['./import-from-global.component.scss']
})
export class ImportFromGlobalComponent implements OnInit {

  @Input() type = '';
  class_id: any[] = []
  ELEMENT_DATA = []
  displayedColumns: string[] = ['select', 'name', 'description'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  repository: any[] = [];
  index = 0;
  title: any;
  filterQuestions: FormGroup
  classes: any;
  filteredQuestions: any;
  selectedClass: any;
  selectedQuestionsToImport: Array<any> = [];
  existingQuestions: any;
  selectedFilter: any;
  selectedQuestionType: any;
  selectedChapter: any;
  filterTypes = [
    { name: 'Filter by Class', value: 'byClass' },
    { name: 'Filter by Question Type', value: 'byQType' },
    { name: 'Filter by Chapter', value: 'byChapter' },
    // {name:'Filter by Syllabus',value:'bySyllabus'},
  ];
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
  chapters: any;
  constructor(
    public apiService: LearningService,
    public cdr: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private loaderService: LoadingService,
  ) { }


  async ngOnInit() {
    this.loaderService.show();
    await this.getData()
    await this.saveCurrentRepository();
    this.filterQuestions = this.formBuilder.group({
      'class': [null, Validators.required]
    });
    this.loaderService.hide();
  }
  getFormData() {
    return this.formBuilder.group({
      class: [null, Validators.required]
    });
  }
  saveCurrentRepository() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    if (user.user_info[0].school_id) {
      this.repository = [{
        id: user.user_info[0].school_id,
        repository_type: 'School',

      }]
    } else {
      this.repository = [{
        id: user.user_info[0].id,
        repository_type: 'Global'
      }]
    }
  }


  async getData() {
    this.loaderService.show();
    switch (this.type) {
      case 'class':
        await this.getGlobalClassData();
        this.title = 'Classes';
        this.loaderService.hide();
        break;
      case 'board':
        await this.getGlobalBoardData();
        this.title = 'Boards';
        this.loaderService.hide();
        break;
      case 'syllabus':
        await this.getGlobalSyllabusData();
        this.title = 'Syllabuses';
        this.loaderService.hide();
        break;
      case 'subject':
        await this.getGlobalSubjectData();
        this.title = 'Subjects';
        this.loaderService.hide();
        break;
      case 'questionCategory':
        await this.getGlobalQuestionCategoryData();
        this.title = 'Question Category';
        this.loaderService.hide();
      case 'examType':
        await this.getGlobalExamTypesData();
        this.title = 'Exam Types';
        this.loaderService.hide();
        break;
      case 'All Questions':
        await this.getAllQuestions();
        this.title = 'All Questions';
        this.loaderService.hide();
        break;
      default:
        this.loaderService.hide();
        break;
    }
  }


  getGlobalClassData() {
    this.loaderService.show();
    this.apiService.getGlobalClasses().subscribe((response: any) => {
      this.ELEMENT_DATA = Object.assign(_.sortBy(response.body.data, 'name'));
      this.classes = _.sortBy(response.body.data, 'name');
      this.dataSource.data = this.ELEMENT_DATA;
      this.cdr.detectChanges();
      console.log(this.ELEMENT_DATA)
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
  }

  getGlobalBoardData() {
    this.loaderService.show();
    this.apiService.getGlobalBoards().subscribe((response: any) => {
      this.ELEMENT_DATA = Object.assign(response.body.data);
      this.dataSource.data = this.ELEMENT_DATA;
      this.cdr.detectChanges();
      console.log(this.ELEMENT_DATA)
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
  }

  getGlobalSyllabusData() {
    this.loaderService.show();
    this.apiService.getGlobalSyllabuses().subscribe((response: any) => {
      this.ELEMENT_DATA = Object.assign(response.body.data);
      this.dataSource.data = this.ELEMENT_DATA;
      this.cdr.detectChanges();
      console.log(this.ELEMENT_DATA)
      this.loaderService.hide();
    },
      error => {
        this.loaderService.hide();
      })
  }

  getGlobalSubjectData() {
    this.loaderService.show();
    this.apiService.getGlobalSubjects().subscribe((response: any) => {
      this.ELEMENT_DATA = Object.assign(response.body.data);
      this.dataSource.data = this.ELEMENT_DATA;
      this.cdr.detectChanges();
      console.log(this.ELEMENT_DATA)
      this.loaderService.hide()
    },
      error => {
        this.loaderService.hide();
      })
  }

  getGlobalQuestionCategoryData() {
    this.loaderService.show();
    this.apiService.getGlobalQuestionCategories().subscribe((response: any) => {
      this.ELEMENT_DATA = Object.assign(response.body.data);
      this.dataSource.data = this.ELEMENT_DATA;
      this.cdr.detectChanges();
      console.log(this.ELEMENT_DATA)
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
  }

  getGlobalExamTypesData() {
    this.loaderService.show();
    this.apiService.getGlobalExamTypes().subscribe((response: any) => {
      this.ELEMENT_DATA = Object.assign(response.body.data);
      this.dataSource.data = this.ELEMENT_DATA;
      this.cdr.detectChanges();
      console.log(this.ELEMENT_DATA)
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
  }

  getAllQuestions() {
    this.apiService.getAllQuestions().subscribe(
      (response: any) => {
        if (response && response.body && response.body.data) {
          this.existingQuestions = response.body.data;
          console.log(this.existingQuestions)
        }
      }
    );
    this.getClasses();
    this.getChapters();
  }
  // get list of classes
  getClasses() {
    // this.apiService.getClasses().subscribe((res: any) => {
    //   this.classes = res.body.data;
    // });
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let repo: any;
    if (user.user_info[0].school_id) {
      this.apiService.getallinstitute(user.user_info[0].school_id).subscribe(
        (response: any) => {
          if (response && response.body && response.body.data && response.body.data.length) {
            this.classes = response.body.data[0].classList;
            console.log(this.classes, "this.class")
            this.cdr.detectChanges();
          }
        }
      )
    }
    else {
      this.getGlobalClassData();
    }
  }
  // getChapters
  getChapters() {
    this.apiService.getChapters().subscribe((response: any) => {
      this.chapters = response.body.data;
    });
  }
  getQuestionsWithFilters() {
    let filter = `class=${this.selectedClass}&questionType=${this.selectedQuestionType}&chapter=${this.selectedChapter}`;
    /* if(this.selectedFilter == 'byClass'){
      filter = `class=${this.selectedClass}`;
    }else if(this.selectedFilter == 'byQType'){
      filter = `questionType=${this.selectedQuestionType}`;
    }else if(this.selectedFilter == 'byChapter'){
      filter = `chapter=${this.selectedChapter}`;
    }else{
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please select filter' });
      return
    } */
    this.filteredQuestions = null;
    this.apiService.getQuestionsWithFilters(filter).subscribe((res: any) => {
      if (res.body.data.length > 0) {
        this.filteredQuestions = res.body.data;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Sorry! No Questions found for selected filter' });
      }
    })
  }

  checkedQuestion(question) {
    this.selectedQuestionsToImport.push(question);
    console.log('this.selectedQuestionsToImport', this.selectedQuestionsToImport);
  }

  getFilteredQuestions() {
    this.getQuestionsWithFilters();
  }

  importQuestions() {
    for (let i = 0; i < this.selectedQuestionsToImport.length; i++) {
      this.apiService.addQuestion(this.selectedQuestionsToImport[i]).subscribe((response: any) => {
        // Swal.fire('Success', 'Questions Imported', 'success').then(() => this.activeModal.close());
        Swal.fire('Success', 'Questions Imported', 'success');
      });
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  submit() {

    console.log(this.selection.selected)
    this.selection.selected.forEach(selected => {
      selected.repository = this.repository;
      switch (this.type) {
        case 'class':
          this.updateClass(selected);
          break;
        case 'board':
          this.updateBoard(selected);
          break;
        case 'syllabus':
          this.updateSyllabus(selected);
          break;
        case 'subject':
          this.updateSubject(selected);
          break;
        case 'questionCategory':
          this.updateQuestionCategory(selected);
          break;
        case 'examType':
          this.updateExamTypes(selected);
          break;
        default:
          break;
      }
    })
    this.activeModal.close()
  }

  updateClass(cls) {
    console.log(cls)
    console.log(this.selection.selected)
    console.log(this.selection.selected.length)
    for (let i = 0; i < this.selection.selected.length; i++) {
      this.class_id[i] = (this.selection.selected[i]._id)
      console.log(this.selection.selected[i]._id)
    }
    const classList = {
      'classList': this.class_id

    }
    console.log(this.class_id)
    console.log(classList)
    this.apiService.importClass(classList).subscribe((response: any) => {
      this.index++;
      Swal.fire('Success', 'Class imported', 'success').then(() => { window.location.reload() });
      // if (this.index == this.selection.selected.length) {
      //   console.log(this)
      //   this.activeModal.close(this.selection.selected);
      // }
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    });
  }


  updateBoard(board) {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let repo: any;
    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      repo = 'School';
    }
    const boardList = {

      "repository": [
        {
          "id": id,
          "repository_type": "School",
          "mapDetails": []
        }
      ]
    }
    console.log(this.selection.selected)
    console.log(board)
    this.apiService.importBoards(boardList, board._id).subscribe((response: any) => {
      if (response.body.error) {
        Swal.fire({ icon: 'error', title: 'Error', text: response.body.error });
      } else {
        this.index++;
        Swal.fire('Success', 'Board imported', 'success').then(() => { });
        if (this.index == this.selection.selected.length) {
          this.activeModal.close(this.selection.selected);
        }
      }
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    });
  }

  updateSyllabus(syllabus) {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let repo: any;
    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      repo = 'School';
    }
    const syllabusList = {

      "repository": [
        {
          "id": id,
          "repository_type": "School",
          "mapDetails": []
        }
      ]
    }
    this.apiService.importSyllabus(syllabusList, syllabus._id).subscribe((response: any) => {
      this.index++;
      Swal.fire('Success', 'Syllabus imported', 'success').then(() => { });
      if (this.index == this.selection.selected.length) {
        this.activeModal.close(this.selection.selected);
      }
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    });
  }

  updateSubject(subject) {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id: any;
    let repo: any;
    if (user.user_info[0].school_id) {
      id = user.user_info[0].school_id;
      repo = 'School';
    }
    const subjectList = {

      "repository": [
        {
          "id": id,
          "repository_type": "School",
          "mapDetails": []
        }
      ]
    }
    this.apiService.importSubjects(subjectList, subject._id).subscribe((response: any) => {
      this.index++;
      Swal.fire('Success', 'Subject Added', 'success').then(() => { });
      if (this.index == this.selection.selected.length) {
        this.activeModal.close(this.selection.selected);
      }
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    });
  }

  updateQuestionCategory(questionCategory) {
    this.apiService.addQuestionCategory(questionCategory, this.repository[0].id, questionCategory.name).subscribe((response: any) => {
      if (response.body.error) {
        Swal.fire({ icon: 'error', title: 'Error', text: response.body.error });
      } else {
        this.index++;
        Swal.fire('Success', 'Question Category  Added', 'success').then(() => this.activeModal.close());
        if (this.index == this.selection.selected.length) {
          this.activeModal.close(this.selection.selected);
        }
      }
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    });
  }

  updateExamTypes(examType) {
    this.apiService.addExamType(examType, this.repository[0].id, examType.name).subscribe((response: any) => {
      this.index++;
      Swal.fire('Success', 'Exam Type Added', 'success').then(() => this.activeModal.close());
      if (this.index == this.selection.selected.length) {
        this.activeModal.close(this.selection.selected);
      }
    }, (error) => {
      if (error.status == 400) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message });
        return;
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again' });
        return;
      }
    });
  }
}
