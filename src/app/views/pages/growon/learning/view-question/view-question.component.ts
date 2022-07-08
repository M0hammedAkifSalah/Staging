import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '../../../../../../../angular-editor/src/lib/config';
import { LearningService } from '../services/learning.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'kt-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.scss']
})
export class ViewQuestionComponent implements OnInit {

  constructor(public apiService : LearningService,private formBuilder: FormBuilder,private cdr:ChangeDetectorRef) { }
  question:any;
  questionsLoaded:boolean = false;
  fibText = '{?}';
  fibAnsLength:Array<any> = [];
  answersForFib:Array<any> = [];
  capitalAlpha:Array<any> = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  smallAlpha:Array<any> = ['a','b','c','d','e','f','g','h','i','j","k","l","m","n","o','p','q","r','s","t","u","v","w","x','y","z',','];
  twoColMtfOptions:Array<any> = [];
  twoColMtfAnsCount:Array<any> = [];
  answerForTwoColMtf:any;
  mtfError:boolean = false;
  sequencingArrayQuestion:Array<any> = [];
  sequencingArrayAnswer:Array<any> = [];
  trueOrFalse:Array<object> = [{'name':'True','value':'true'},{'name':'False','value':'false'}];
  sortingQuestions:Array<any> = [];
  sortingAnswers:Array<any> = [];
  sortingQuestionsGroupAns:Array<any> = [];
  numRangeMinMax:Array<any> = [];
  numRangeMinMaxAns:Array<any> = [];
  noOfSortingGroups:Array<any> = [];
  sortingGroup:any;
  praticTestQuestionArray:Array<object> = [
    {'name':'Pratice','value': 'pratice'},
    {'name':'Test','value': 'test'}
  ]; 
  praticTestQuestionValue:Array<any> = [];
  studentTypeArray:Array<object> = [
    {'name':'Special Needs','value': 'specialNeeds'},
    {'name':'General','value': 'general'},
    {'name':'Gifted','value': 'gifted'}
  ];
  studentTypeValue:Array<any> = [];
  difficultyLevelArray:Array<object> = [
    {'name':'Very Easy','value': 'veryEasy'},
    {'name':'Easy','value': 'easy'},
    {'name':'Intermediate','value': 'intermediate'},
    {'name':'Hard','value': 'hard'},
    {'name':'Very Hard','value': 'veryHard'}
  ];
  getMcqAnswer:Array<any> = [];
  difficultyLevelValue:Array<any> = [];
  questionTypes:Array<object> = [
  {'name':'Objectives','value': 'objectives'},
  {'name':'MCQs','value':'mcq'},
  {'name':'Fill In The Blanks','value':'fillInTheBlanks'},
  {'name':'2 Column Match The Following','value':'twoColMtf'},
  {'name':'3 Column Match The Following','value':'threeColMtf'},
  // {'name':'Sequencing Question','value':'sequencingQuestion'},
  // {'name':'Sentence Sequencing','value':'sentenceSequencing'},
  {'name':'True Or False','value':'trueOrFalse'},
  {'name':'Numerical value Range','value':'NumericalRange'},
  // {'name':'Sorting','value':'sorting'},
  {'name':'Free Text','value':'freeText'},
  ];
  objectives:Array<any> = [1];
  mtfColOneOptions:Array<any> = [1];
  mtfColTwoOptions:Array<any> = [1];
  mtfColThreeOptions:Array<any> = [1];
  objectiveQuestions:Array<any> = [];
  learningOutcome:any;
  questionCategory:any;
  examType:any;
  type:any;
  questionType:any;
  studentType:any;
  praticTest:any;
  questionDifficulty:any;
  class:any;
  board:any;
  syl:any;
  subject:any;
  chapter:any;
  topic:any;
  language:any;
  objType:Array<object> = [
    {'name':'Text','value':'text'},
    {'name':'Image','value':'image'},
    {'name':'Audio','value':'audio'},
    {'name':'Video','value':'video'}
  ];
  answer:any;
  oqImages:Array<any> = [];
  oqImagesArray:Array<any> = [];
  objTypeVal:any;
  textQuestions:any;
  duration:any;
  negativeScoring:any = 'no';
  totalMarks:any;
  negativeMarks:any;
  audioThubmnail:any = '../../../../../../assets/media/growon/questionpaper/audiothumbnail.jpg';
  videoThubmnail:any = '../../../../../../assets/media/growon/questionpaper/videothumbnail.png';
  // Editor
  htmlContent = '';
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
  chapters:Array<any>;
  topics:any;
  learningOutcomes:any;
  classes:Array<any>;
  boards:Array<any>;
  syllabus:Array<any>;
  subjects:Array<any>;
  questionCategories:any;
  questionTitle:any;
  examTypes:any;
  settings:any;
  settingsTwo:any;
  questionForm: FormGroup;
  sortingFrm: FormGroup;
  gpAnsForm: FormGroup;
  ngOnInit(): void {
    const id = window.location.href.split('/').pop();
    this.getQuestionWithId(id);
    this.getClasses();
    this.getBoards();
    this.getSyllabus();
    this.getSubjects();
    this.getAllChapters();
    this.getAllTopics();
    this.getAllLarningOutcomes();
    this.getQuestionCategories();
    this.getExamType();
    this.settings = {
      singleSelection: false,
      selected : 5,
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
      selected : 5,
      idField: 'value',
      textField: 'value',
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
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    }
  }
  getClasses(){
    this.apiService.getClasses().subscribe((response:any) => {
      this.classes = response.body.data;
    });
  }
  getBoards(){
    this.apiService.getBoards().subscribe((response:any) => {
      this.boards = response.body.data;
    })
  }
  getSyllabus(){
    this.apiService.getSyllabus().subscribe((response:any) => {
      this.syllabus = response.body.data;
    })
  }
  getSubjects(){
    this.apiService.getSubjects().subscribe((response:any) => {
      this.subjects = response.body.data;
    })
  }
  getAllChapters(){
    this.apiService.getChapters().subscribe((response:any) => {
      this.chapters = response.body.data;
    })
  }
  getAllTopics(){
    this.apiService.getTopics().subscribe((response:any) => {
      this.topics = response.body.data;
    })
  }
  getAllLarningOutcomes(){
    this.apiService.getAllLarningOutcomes().subscribe((response:any) => {
      this.learningOutcomes = response.body.data;
    })
  }
  getQuestionCategories(){
    this.apiService.getQuestionCategory().subscribe((response:any) => {
      this.questionCategories = response.body.data;
    })
  }
  getExamType(){
    this.apiService.getExamType().subscribe((response:any) => {
      this.examTypes = response.body.data.examTypeData;
    })
  }
  // getQuestion
  getQuestionWithId(id){
    this.apiService.getQuestionWithId(id).subscribe((response:any) => {
      this.question = response.body.data;
      console.log('question',response);
      this.questionType = response.body.data.questionType[0];
      if(this.questionType == 'fillInTheBlanks'){
        // this.fibAnsLength = this.question.answer.length;
        for (let i = 0; i < this.question.answer.length; i++) {
          this.fibAnsLength.push(i);
        }
      }
      // this.learningOutcome = response.body.data.learningOutcome;
      /* this.questionCategory = response.body.data.questionCategory;
      this.examType = response.body.data.examType;
      this.praticTest = response.body.data.practiceAndTestQuestion;
      this.studentType = response.body.data.studentType;
      this.questionDifficulty = response.body.data.difficultyLevel;
      this.class = response.body.data.class;
      this.board = response.body.data.board;
      this.syl = response.body.data.syllabus;
      this.subject = response.body.data.subject;
      this.chapter = response.body.data.chapter;
      this.topic = response.body.data.topic;
      this.questionTitle = response.body.data.questionTitle;
      this.htmlContent = response.body.data.question[0];
      this.totalMarks = response.body.data.totalMarks;
      this.negativeMarks = response.body.data.negativeMarks;
      this.negativeScoring = response.body.data.negativeScore;
      this.language = response.body.data.language;
      this.duration = response.body.data.duration; */
      this.questionsLoaded = true;
      this.cdr.detectChanges();
    });
  }
  // changeQuestionType
  changeQuestionType(){

  }
  // addQuestion
  updateQuestion(){

  }
  // fillInTheBlanksForm
  fillInTheBlanksForm(){

  }

  valuechanged($event){
console.log($event)
  }
  // validateFib
  validateFib(value){
    this.fibAnsLength = [];
    if(value.includes('{?}')){
      console.log('values',value);
      let len = (value.match(/{?}/g) || []).length;
      for(let i = 0; i < len; i++){
        this.fibAnsLength.push(i);
      }
      console.log('no of {?}',len);
      console.log('len of fibAns',this.fibAnsLength);
    }else{
      alert('Format does not match. Please read instructions');
      return;
    }
  }
}
