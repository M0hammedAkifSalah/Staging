import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { LearningService } from '../services/learning.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'kt-create-question-paper',
  templateUrl: './create-question-paper.component.html',
  styleUrls: ['./create-question-paper.component.scss']
})
export class CreateQuestionPaperComponent implements OnInit {

  constructor(public apiService: LearningService, private cdr: ChangeDetectorRef, public router: Router) { }
  public fieldArray: Array<any> = [];
  public newAttribute: any = {};
  public isVisited = false;
  testString: string = this.apiService.testVariable;
  languages: Array<string> = ['English', 'Hindi', 'Urdu', 'Kannada'];
  userName: any = localStorage.getItem('userName');
  questionPName: any;
  questionPId: any;
  testArray: any = [1, 2, 3];
  questionCategory: any;
  examType: any;
  type: any;
  questionType: any;
  studentType: any;
  class: any;
  board: any;
  syl: any;
  subject: any;
  chapter: any;
  topic: any;
  language: any;
  chapters: Array<any>;
  topics: any;
  classes: Array<any>;
  boards: Array<any>;
  syllabus: Array<any>;
  subjects: Array<any>;
  questionCategories: any;
  examTypes: any;
  totalQuestions: any;
  settings: any;
  studentTypeArray: Array<object> = [
    { 'name': 'Special Needs', 'value': 'specialNeeds' },
    { 'name': 'General', 'value': 'general' },
    { 'name': 'Gifted', 'value': 'gifted' }
  ];
  practice: any;
  test: any;
  practiceAndTest: any;
  veryEasy: any;
  easy: any;
  intermediate: any;
  hard: any;
  veryHard: any;
  settingsTwo: any;
  settingsForTopics: any;
  settingsForQa: any;
  settingsForLOC: any;
  firstSectionFilteredData: any;
  queryString: any;
  query: any;
  filteredChapters: Array<any> = [];
  selectedChapters: Array<any> = [];
  filteredTopics: Array<any> = [];
  selectedTopics: Array<any> = [];
  countOfTopicsList: Array<any> = [1];
  filteredQuestionCat: Array<any> = [];
  selectedQuestionCat: Array<any> = [];
  filteredLearningOutcome: Array<any> = [];
  selectedLearningOutcome: Array<any> = [];
  filteredQuestionType: Array<any> = [];
  selectedQuestionType: Array<any> = [];
  filteredQuestions: Array<any> = [];
  selectedQuestions: Array<any> = [];
  loadingChapters: boolean;
  loadingTopics: boolean;
  loadingQuestionCategories: boolean;
  loadingLearningOutcome: boolean;
  loadingQuestionType: boolean;
  loadingQuestions: boolean;
  // --------------------------------------
  chapterTopicsName: any;
  chapterTopics: Array<any> = [];
  countOfQC: Array<any> = [1];
  countOfLOC: Array<any> = [1];
  qCategories: Array<any> = [];
  LearningOC: Array<any> = [];
  testingString: any;
  openModal: boolean = false;
  finalSelectedQuestions: object = {
    objectives: [],
    mcq: [],
    fillInTheBlanks: [],
    twoColMtf: [],
    threeColMtf: [],
    sequencingQuestion: [],
    sentenceSequencing: [],
    trueOrFalse: [],
    sorting: [],
    freeText: []
  };
  finalSelectedQuestionsIds: Array<any> = [];
  ngOnInit(): void {
    this.getClasses();
    this.getBoards();
    this.getSyllabus();
    this.getSubjects();
    this.getAllChapters();
    this.getAllTopics();
    this.getQuestionCategories();
    this.getExamType();
    this.settings = {
      singleSelection: false,
      selected: 5,
      idField: '_id',
      textField: 'name',
      enableCheckAll: false,
      selectAllText: 'select All',
      unSelectAllText: 'unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Search',
      noDataAvailablePlaceholderText: 'No data available',
      closeDropDownOnSelection: true,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    };
    this.settingsTwo = {
      singleSelection: false,
      selected: 5,
      idField: 'value',
      textField: 'name',
      enableCheckAll: false,
      selectAllText: 'select All',
      unSelectAllText: 'unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Search',
      noDataAvailablePlaceholderText: 'No data available',
      closeDropDownOnSelection: true,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    };
    this.settingsForTopics = {
      singleSelection: false,
      selected: 5,
      idField: '_id',
      textField: 'topic',
      enableCheckAll: false,
      selectAllText: 'select All',
      unSelectAllText: 'unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Search',
      noDataAvailablePlaceholderText: 'No data available',
      closeDropDownOnSelection: true,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    }
    this.settingsForQa = {
      singleSelection: false,
      selected: 5,
      idField: '_id',
      textField: 'questionCategory',
      enableCheckAll: false,
      selectAllText: 'select All',
      unSelectAllText: 'unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Search',
      noDataAvailablePlaceholderText: 'No data available',
      closeDropDownOnSelection: true,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    }
    this.settingsForLOC = {
      singleSelection: false,
      selected: 5,
      idField: '_id',
      textField: 'learningOutcome',
      enableCheckAll: false,
      selectAllText: 'select All',
      unSelectAllText: 'unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Search',
      noDataAvailablePlaceholderText: 'No data available',
      closeDropDownOnSelection: true,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    }
    /*if(localStorage.getItem('query')){
      this.getChapters();
    }*/
  }
  addFieldValue() {
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }
  getClasses() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
    });
  }
  getBoards() {
    this.apiService.getBoards().subscribe((response: any) => {
      this.boards = response.body.data;
    })
  }
  getSyllabus() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      this.syllabus = response.body.data;
    })
  }
  getSubjects() {
    this.apiService.getSubjects().subscribe((response: any) => {
      this.subjects = response.body.data
    })
  }
  getAllChapters() {
    this.apiService.getChapters().subscribe((response: any) => {
      this.chapters = response.body.data;
    })
  }
  getAllTopics() {
    this.apiService.getTopics().subscribe((response: any) => {
      this.topics = response.body.data;
    })
  }
  getQuestionCategories() {
    this.apiService.getQuestionCategory().subscribe((response: any) => {
      this.questionCategories = response.body.data;
    })
  }
  getExamType() {
    this.apiService.getExamType().subscribe((response: any) => {
      this.examTypes = response.body.data;
    })
  }
  getChapters() {
    this.apiService.filterQuestionData(localStorage.getItem('query')).subscribe((response: any) => {
      console.log('response from lc', response);
      this.filteredChapters = response.body.data;
    })
  }
  testApiFun() {
    this.apiService.getClasses().subscribe((response: any) => {
      this.testString = response.body.data;
    })
  }
  public checkVisited() {
    // reverse the value of property
    this.isVisited = !this.isVisited;
  }
  getChaptersForm(data, valid) {
    if (valid) {
      if (this.practice + this.test + this.practiceAndTest > this.totalQuestions) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Total attempt type can not be greater than total questions' });
        return;
      } else if (this.veryEasy + this.easy + this.intermediate + this.hard + this.veryHard > this.totalQuestions) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Total Difficulty level can not be greater than total questions' });
        return;
      } else {
        this.loadingChapters = true;
        let exType = [];
        this.examType.forEach(element => {
          exType.push(element.name);
        })
        data.examType = exType.toString();
        let studType = [];
        this.studentType.forEach(element => {
          studType.push(element.value);
        })
        data.studentType = studType.toString();
        this.firstSectionFilteredData = data;
        this.queryString = `class=${this.firstSectionFilteredData.class}&board=${this.firstSectionFilteredData.board}&syllabus=${this.firstSectionFilteredData.syl}&subject=${this.firstSectionFilteredData.subject}&language=${this.firstSectionFilteredData.language}&examType=${this.firstSectionFilteredData.examType}&studentType=${this.firstSectionFilteredData.studentType}`;
        this.apiService.filterQuestionData(this.queryString).subscribe((response: any) => {
          if (response.status == 200) {
            if (response.body.data.length > 0) {
              this.filteredChapters = response.body.data;
              this.loadingChapters = false;
              this.cdr.detectChanges();
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
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter all the options' });
      return;
    }
  }
  checkedChapter(chapter) {
    console.log(chapter);
    if (!this.selectedChapters.includes(chapter)) {
      this.selectedChapters.push(chapter);
    } else {
      var index = this.selectedChapters.indexOf(chapter);
      if (index > -1) {
        this.selectedChapters.splice(index, 1);
      }
    }
    /* this.queryString = `${this.queryString}&chapter=${this.selectedChapters.toString()}`;
    this.apiService.filterQuestionData(this.queryString).subscribe((response:any) => {
      console.log('response for topic',response);
      this.filteredTopics = response.body.data;
    }) */;
  }
  // checkCount
  checkCount(event, count) {
    console.log('event', event.target.value);
    console.log('count', count);
    if (event.target.value > count) { alert('Question count can not be greater than question list'); event.preventDefault(); }
  }
  // callTopics
  callTopics() {
    this.loadingTopics = true;
    this.queryString = this.queryString;
    let query = `${this.queryString}&chapter=${this.selectedChapters.toString()}`;
    this.apiService.filterQuestionData(query).subscribe((response: any) => {
      this.filteredTopics = response.body.data;
      // let element = document.getElementById('loadingMsg') as HTMLElement;
      // element.click();
      this.loadingTopics = false;
      this.cdr.detectChanges();
    })
  }
  // checked Chapters
  checkedTopics() {
    this.countOfTopicsList.push(1);
    /* if(!this.selectedTopics.includes(topic)){
      this.selectedTopics.push(topic);
    }else{
      var index = this.selectedTopics.indexOf(topic);
      if(index > -1){
        this.selectedTopics.splice(index,1);
      }
    } */
  }
  // callQuestionCat
  callQuestionCat() {
    // console.log('chapterTopicsName',chapterTopicsName);
    this.loadingQuestionCategories = true;
    // this.queryString = `${this.queryString}&topic=${this.selectedTopics.toString()}`;
    let query = `${this.queryString}&chapter=${this.selectedChapters.toString()}&topic=${this.selectedTopics.toString()}`;
    this.apiService.filterQuestionData(query).subscribe((response: any) => {
      this.filteredQuestionCat = response.body.data;
      this.loadingQuestionCategories = false;
    })
  }
  // checkedQuestionCat
  checkedQuestionCat(questionCat) {
    console.log('questionCat', questionCat);
    console.log('selectedQuestionCat', this.selectedQuestionCat);
    if (!this.selectedQuestionCat.includes(questionCat)) {
      this.selectedQuestionCat.push(questionCat);
    } else {
      var index = this.selectedQuestionCat.indexOf(questionCat);
      if (index > -1) {
        this.selectedQuestionCat.splice(index, 1);
      }
    }
  }
  // callLearningOutcome
  callLearningOutcome() {
    console.log('selectedQuestionCat', this.selectedQuestionCat);
    this.loadingLearningOutcome = true;
    this.queryString = `${this.queryString}&questionCategory${this.selectedQuestionCat.toString()}`;
    this.apiService.filterQuestionData(this.queryString).subscribe((response: any) => {
      this.filteredLearningOutcome = response.body.data;
      this.loadingLearningOutcome = false;
    })
  }
  // checkedLoc
  checkedLoc(loc) {
    if (!this.selectedLearningOutcome.includes(loc)) {
      this.selectedLearningOutcome.push(loc);
    } else {
      var index = this.selectedLearningOutcome.indexOf(loc);
      if (index > -1) {
        this.selectedLearningOutcome.splice(index, 1);
      }
    }
  }
  // callQuestionType
  callQuestionType() {
    this.loadingQuestionType = true;
    this.queryString = `${this.queryString}&learningOutcome${this.selectedLearningOutcome.toString()}`;
    this.apiService.filterQuestionData(this.queryString).subscribe((response: any) => {
      this.filteredQuestionType = response.body.data;
    })
    this.loadingQuestionType = false;
  }
  // checkedQType
  checkedQType(qType) {
    if (!this.selectedQuestionType.includes(qType)) {
      this.selectedQuestionType.push(qType);
    } else {
      var index = this.selectedQuestionType.indexOf(qType);
      if (index > -1) {
        this.selectedQuestionType.splice(index, 1);
      }
    }
  }
  // callQuestionList
  callQuestionList() {
    this.loadingQuestions = true;
    this.queryString = `${this.queryString}&questionType${this.selectedQuestionType.toString()}`;
    this.apiService.filterQuestionData(this.queryString).subscribe((response: any) => {
      this.filteredQuestions = response.body.data;
      this.loadingQuestions = false;
    })
  }
  // formateQuestion
  formateQuestionTitle(title) {
    if (title.includes('face=\"Arial\">')) {
      return title;
    } else {
      return title;
    }
  }
  // -----------------------------------------------------------------------------------------------------------------------------------------
  // getTopicList
  getTopicList(event, i) {
    if (this.chapterTopics[i]) {
      this.chapterTopics[i] = [];
    }
    console.log('chapter =>', event.target.value);
    let query = `${this.queryString}&chapter=${event.target.value}`;
    this.apiService.filterQuestionData(query).subscribe((response: any) => {
      this.chapterTopics.push();
      this.chapterTopics[i] = response.body.data;
      console.log('this.chapterTopics', this.chapterTopics);
    })
  }
  // topicForm
  topicForm(data, valid) {
    // this.countOfQC = [];
    // this.countOfLOC = [];
    if (valid) {
      this.loadingQuestionCategories = true;
      let topicsLength = Object.keys(data).length;
      let allTopics = [];
      this.selectedTopics = [];
      for (let i = 0; i < topicsLength; i++) {
        for (let j = 0; j < data['chapterTopicsName' + i].length; j++) {
          allTopics.push('&topic=' + data['chapterTopicsName' + i][j].topic);
          this.selectedTopics.push(data['chapterTopicsName' + i][j].topic);
        }
      }
      this.apiService.filterQuestionData(`${this.queryString}${allTopics.toString()}`).subscribe((response: any) => {
        this.cdr.detectChanges();
      });
      this.loadingQuestionCategories = false;
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please select topics' });
      return;
    }
  }
  // appendQC
  appendQC(type) {
    if (type == 'qc') {
      this.countOfQC.push(1);
    } else if (type == 'loc') {
      this.countOfLOC.push(1);
    }
  }
  // clickFetchQuestionBtn
  clickFetchQuestionBtn() {
    let element = document.getElementById('fetchQuestionsbtn') as HTMLElement;
    element.click();
  }
  // getQCList
  getQCList(event, i) {
    this.apiService.filterQuestionData(`${this.queryString}&topic=${event.target.value}`).subscribe((response: any) => {
      this.qCategories.push();
      this.qCategories[i] = response.body.data;
      console.log('qCategories', this.qCategories);
    })
  }
  // qCategorieForm
  qCategorieForm(data, valid) {
    if (valid) {
      this.loadingLearningOutcome = true;
      let allQC = [];
      this.selectedQuestionCat = [];
      for (let i = 0; i < Object.keys(data).length; i++) {
        for (let j = 0; j < data['qCategorieName' + i].length; j++) {
          allQC.push('&questionCategory=' + data['qCategorieName' + i][j].questionCategory);
          this.selectedQuestionCat.push(data['qCategorieName' + i][j].questionCategory);
        }
      }
      this.loadingLearningOutcome = false;
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please select questions category' });
      return;
    }
  }
  // getLOCList
  getLOCList(event, i) {
    this.apiService.filterQuestionData(`${this.queryString}&topic=${this.selectedTopics.toString()}&questionCategory${this.selectedQuestionCat.toString()}&learningOutcome=${event.target.value}`).subscribe((response: any) => {
      this.LearningOC.push();
      this.LearningOC[i] = response.body.data;
      console.log('this.LearningOC', this.LearningOC);
    })
  }
  // learningOutcomeForm
  learningOutcomeForm(data, valid) {
    if (valid) {
      console.log('data of loc', data);
      this.loadingQuestionType = true;
      this.selectedLearningOutcome = [];
      let selectedLOC = [];
      this.filteredQuestionType = [];
      for (let i = 0; i < Object.keys(data).length; i++) {
        for (let j = 0; j < data['LearningOC' + i].length; j++) {
          selectedLOC.push('&learningOutcome=' + data['LearningOC' + i][j].learningOutcome);
          this.selectedLearningOutcome.push(data['LearningOC' + i][j].learningOutcome);
        }
      }
      // selectedChapters
      let selectedChapters = '';
      for (let i = 0; i < this.filteredChapters.length; i++) {
        if (this.filteredChapters[i].chapter) { selectedChapters += `&chapter=${this.filteredChapters[i].chapter}`; }
      }
      // selectedTopics
      let selectedTopics = '';
      for (let i = 0; i < this.selectedTopics.length; i++) {
        if (this.selectedTopics[i]) { selectedTopics += `&topic=${this.selectedTopics[i]}`; }
      }
      // selectedQC
      let selectedQC = '';
      for (let i = 0; i < this.selectedQuestionCat.length; i++) {
        if (this.selectedQuestionCat[i]) { selectedQC += `&questionCategory=${this.selectedQuestionCat[i]}`; }
      }
      // learningOC
      let learningOC = '';
      for (let i = 0; i < this.selectedLearningOutcome.length; i++) {
        if (this.selectedLearningOutcome[i]) { learningOC += `&learningOutcome=${this.selectedLearningOutcome[i]}`; }
      }
      let finalQuery = `${selectedChapters}${selectedTopics}${selectedQC}${learningOC}`;
      console.log('finalQuery', finalQuery);
      let demoQuery = `http://13.232.155.192:3000/api/v1/objectiveQuestion?class=class name&board=test board&syllabus=SubjectName&subject=subject name&language=English&examType=test,Exam&studentType=specialNeeds,gifted&topic=test title&questionCategory=test&learningOutcome=test learning outcome&questionType=mcq&chapter=fdhjhfjdh`;
      console.log('demoQuery', demoQuery);
      this.apiService.getQTypeAndCount(`${this.queryString}${finalQuery}`).subscribe((response: any) => {
        console.log('final response', response);
        this.filteredQuestionType = response.body.question;
        this.cdr.detectChanges();
      });
      this.loadingQuestionType = false;
      /* console.log('selectedLearningOutcome',this.selectedLearningOutcome);
      let string = '';
      console.log('bfr loop',string);
      for(let i=0;i<selectedLOC.length; i++){
        console.log('selectedLOC[i]',selectedLOC[i]);
        if(selectedLOC[i]){ string += selectedLOC[i]; }
      }
      //if(string.includes("undefined")){ string.replace('undefined','') }
      console.log('string',string);
      //let query = `${this.queryString}&topic=${this.selectedTopics.toString()}&questionCategory${this.selectedQuestionCat.toString()}${string}`;
      let query = `${this.queryString}${string}`;
      //this.apiService.filterQuestionData(`${this.queryString}&topic=${this.selectedTopics.toString()}&questionCategory${this.selectedQuestionCat.toString()}${string}`).subscribe((response:any) => {
      this.apiService.filterQuestionData(query).subscribe((response:any) => {
        this.filteredQuestionType = response.body.data;
      })
      this.loadingQuestionType = false; */
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please select learning outcome' });
      return;
    }
  }
  modalAction(action: boolean, qType) {
    this.openModal = action;
    if (action) {
      this.loadingQuestions = true;
      this.filteredQuestions = [];
      console.log('qtyep=>', qType);
      // selectedChapters
      let selectedChapters = '';
      for (let i = 0; i < this.filteredChapters.length; i++) {
        if (this.filteredChapters[i].chapter) { selectedChapters += `&chapter=${this.filteredChapters[i].chapter}`; }
      }
      // selectedTopics
      let selectedTopics = '';
      for (let i = 0; i < this.selectedTopics.length; i++) {
        if (this.selectedTopics[i]) { selectedTopics += `&topic=${this.selectedTopics[i]}`; }
      }
      // selectedQC
      let selectedQC = '';
      for (let i = 0; i < this.selectedQuestionCat.length; i++) {
        if (this.selectedQuestionCat[i]) { selectedQC += `&questionCategory=${this.selectedQuestionCat[i]}`; }
      }
      // learningOC
      let learningOC = '';
      for (let i = 0; i < this.selectedLearningOutcome.length; i++) {
        if (this.selectedLearningOutcome[i]) { learningOC += `&learningOutcome=${this.selectedLearningOutcome[i]}`; }
      }
      let finalQuery = `${selectedChapters}${selectedTopics}${selectedQC}${learningOC}`;
      this.apiService.filterQuestionData(`${this.queryString}${finalQuery}&questionType=${qType}`).subscribe((response: any) => {
        console.log('final response for qType', response);
        this.filteredQuestions = response.body.data;
        this.cdr.detectChanges();
      });
      this.loadingQuestions = false;
    }
  }
  // addFQuestion
  addFQuestion(qType, id) {
    /* if(!this.finalSelectedQuestionsIds.includes(id)){
      this.finalSelectedQuestionsIds.push(id);
    }else{
      var index = this.finalSelectedQuestionsIds.indexOf(id);
      if(index > -1){
        this.finalSelectedQuestionsIds.splice(index,1);
      }
    } */
    if (!this.finalSelectedQuestions['' + qType + ''].includes(id)) {
      this.finalSelectedQuestions['' + qType + ''].push(id);
    } else {
      var index = this.finalSelectedQuestions['' + qType + ''].indexOf(id);
      if (index > -1) {
        this.finalSelectedQuestions['' + qType + ''].splice(index, 1);
      }
    }
    // console.log('this.finalSelectedQuestions after splice',this.finalSelectedQuestions[''+qType+'']);
    //console.log('this.finalSelectedQuestions after splice',this.finalSelectedQuestionsIds);
    /* switch (qType) {
      case 'objectives':
        this.finalSelectedQuestions['objectives'].push(id); 
        break;
      case 'mcq':
        this.finalSelectedQuestions['mcq'].push(id); 
        break;
      case 'fillInTheBlanks':
        this.finalSelectedQuestions['fillInTheBlanks'].push(id); 
        break;
      case 'twoColMtf':
        this.finalSelectedQuestions['twoColMtf'].push(id); 
        break;
      case 'threeColMtf':
        this.finalSelectedQuestions['threeColMtf'].push(id); 
        break;
      case 'sequencingQuestion':
        this.finalSelectedQuestions['sequencingQuestion'].push(id); 
        break;
      case 'sentenceSequencing':
        this.finalSelectedQuestions['sentenceSequencing'].push(id); 
        break;
      case 'trueOrFalse':
        this.finalSelectedQuestions['trueOrFalse'].push(id); 
        break;
      case 'sorting':
        this.finalSelectedQuestions['sorting'].push(id); 
        break;
      case 'freeText':
        this.finalSelectedQuestions['freeText'].push(id); 
        break;
      default:
        break;
    } */
  }
  // getQTypeCount
  getQTypeCount(qType) {
    let returnVal;
    switch (qType) {
      case 'objectives':
        returnVal = this.finalSelectedQuestions['objectives'].length;
        break;
      case 'mcq':
        returnVal = this.finalSelectedQuestions['mcq'].length;
        break;
      case 'fillInTheBlanks':
        returnVal = this.finalSelectedQuestions['fillInTheBlanks'].length;
        break;
      case 'twoColMtf':
        returnVal = this.finalSelectedQuestions['twoColMtf'].length;
        break;
      case 'threeColMtf':
        returnVal = this.finalSelectedQuestions['threeColMtf'].length;
        break;
      case 'sequencingQuestion':
        returnVal = this.finalSelectedQuestions['sequencingQuestion'].length; 
        break;
      case 'sentenceSequencing':
        returnVal = this.finalSelectedQuestions['sentenceSequencing'].length; 
        break;
      case 'trueOrFalse':
        returnVal = this.finalSelectedQuestions['trueOrFalse'].length;
        break;
      case 'sorting':
        returnVal = this.finalSelectedQuestions['sorting'].length;
        break;
      case 'freeText':
        returnVal = this.finalSelectedQuestions['freeText'].length; 
        break;
      case 'NumericalRange':
        returnVal = this.finalSelectedQuestions['NumericalRange'].length; 
        break;
      default:
        break;
    }
    // console.log('returnVal',returnVal);
    return returnVal;
  }
  // generateQestionPaper
  generateQestionPaper() {
    let route = this.router;
    const mapped = Object.keys(this.finalSelectedQuestions).map(key => ({ type: key, value: this.finalSelectedQuestions[key] }));
    const ids = [];
    mapped.forEach(element => {
      if (element.value.length > 0) {
        element.value.forEach(el => {
          ids.push(el);
        });
      }
    });
    if (ids.length > 0) {
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
      let data = {
        "QuestionTitle": this.questionPName,
        "questionId": ids,
        'repository': [{ 'id': id, 'branch_name': '', 'repository_type': repo }],
        'createdBy': localStorage.getItem('UserName')
      }
      this.apiService.generatedQuestionPaper(data, 'insert').subscribe((response: any) => {
        if (response.status == 201) {
          Swal.fire('Added', 'Question paper generated successfully', 'success').then(function () {
            // this.router.navigateByUrl(`qpaper/${response.body.data._id}`);
            // route.navigate([`show/qpaper/${response.body.data._id}`])
            route.navigate(['show/qpaper/', response.body.data._id], { state: { type: 'create' } })

          });
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
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please select questions' });
      return;
    }
  }
}
