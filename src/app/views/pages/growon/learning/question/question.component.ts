import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularEditorConfig } from '../../../../../../../angular-editor/src/lib/config';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { LearningService } from '../services/learning.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'kt-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  constructor(public apiService : LearningService,private formBuilder: FormBuilder,private cdr:ChangeDetectorRef,
    private sanitized: DomSanitizer) { }
  public Editor = ClassicEditor;
  public mathconfig = {
    toolbar: {
			items: [
        'MathType',
        'ChemType'
      ]
    }
  }
  public editorconfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'fontColor',
        'fontBackgroundColor',
        'fontSize',
        'fontFamily',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        'highlight',
        'removeFormat',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'indent',
        'outdent',
        'alignment',
        '|',
        'MathType',
        'ChemType',
        'specialCharacters',
        'imageUpload',
        'imageInsert',
        'blockQuote',
        'code',
        'codeBlock',
        'htmlEmbed',
        'insertTable',
        'mediaEmbed',
        'CKFinder',
        'pageBreak',
        'previousPage',
        'nextPage',
        'pageNavigation',
        'undo',
        'redo'
      ]
    },
    language: 'en',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side',
        'linkImage'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties'
      ]
    },
    ckfinder: {
      uploadUrl:'http://ec2-35-154-221-135.ap-south-1.compute.amazonaws.com:3000/api/v1/file/upload'
    },
    licenseKey: '',
  };
    title = 'Mathjax playground in Angular 6';
  mathContent = `When $ a \\ne 0 $, there are two solutions to $ ax^2 + bx + c = 0 $ and they are $$ x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$`
  fibText = '{?}';
  fibAnsLength:Array<any> = [];
  answersForFib:Array<any> = [];
  capitalAlpha:Array<any> = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  smallAlpha:Array<any> = ['a','b','c','d','e','f','g','h','i','j","k","l","m","n","o','p','q","r','s","t","u","v","w","x','y","z',','];
  languages:Array<string> = ['English','Hindi','Urdu','Kannada'];
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
  examType:any='';
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
  htmlContent:string=``;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter question here...',
    translate: 'yes',
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
  allChapters:Array<any>;
  chapters:Array<any>;
  allTopics:Array<any>;
  topics:Array<any>;
  learningOutcomes:Array<any>;
  allLearningOutcomes:Array<any>;
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
    // document.getElementById("append").innerHTML = `<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mn>1</mn><mn>2</mn></mfrac></math></p>`;
  }
  getClasses(){
    this.apiService.getClasses().subscribe((response:any) => {
      this.classes = response.body.data;
      this.cdr.detectChanges();
    });
  }
  getBoards(){
    this.apiService.getBoards().subscribe((response:any) => {
      this.boards = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getSyllabus(){
    this.apiService.getSyllabus().subscribe((response:any) => {
      this.syllabus = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getSubjects(){
    this.apiService.getSubjects().subscribe((response:any) => {
      this.subjects = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getAllChapters(){
    this.apiService.getChapters().subscribe((response:any) => {
      console.log("chapters",response)
      this.allChapters = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getAllTopics(){
    this.apiService.getTopics().subscribe((response:any) => {
      this.allTopics = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getAllLarningOutcomes(){
    this.apiService.getAllLarningOutcomes().subscribe((response:any) => {
      this.allLearningOutcomes = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getQuestionCategories(){
    this.apiService.getQuestionCategory().subscribe((response:any) => {
      this.questionCategories = response.body.data;
      this.cdr.detectChanges();
    })
  }
  getExamType(){
    this.apiService.getExamType().subscribe((response:any) => {
      console.log( response.body.data)
      this.examTypes = response.body.data;
      this.cdr.detectChanges();
    })
  }

  subjectChanged(){
   
  this.chapters = this.allChapters.filter(chapter=>{
     return chapter.subject_id.name==this.subject && chapter.class_id.name==this.class && chapter.board_id.name==this.board && chapter.syllabus_id.name==this.syl
    }) 
    console.log(this.chapters)
    this.chapter='';
    this.topic='';
    this.learningOutcome='';
  }

  chapterChanged(){
    this.topics=this.allTopics.filter(topic=>{
      return topic.chapter_id.name==this.chapter
     }) 
     this.topic='';
    this.learningOutcome='';
  }

  topicChanged(){
    console.log(this.allLearningOutcomes)
    this.learningOutcomes=this.allLearningOutcomes.filter(learningOutcome=>{
      return learningOutcome.topic_id.name==this.topic
     }) 
     this.learningOutcome='';
  }

  selectPraticTestQuestion(value){
    if(!this.praticTestQuestionValue.includes(value)){
      this.praticTestQuestionValue.push(value);
    }else{
      var index = this.praticTestQuestionValue.indexOf(value);
      if(index > -1){
        this.praticTestQuestionValue.splice(index,1);
      }
    }
  }
  selectStudentType(value){
    if(!this.studentTypeValue.includes(value)){
      this.studentTypeValue.push(value);
    }else{
      var index = this.studentTypeValue.indexOf(value);
      if(index > -1){
        this.studentTypeValue.splice(index,1);
      }
    }
  }
  getMcqAnswerFun(value){
    /* console.log('all questions in this array');
    console.log('oqImages => ',this.oqImages);
    if(this.objTypeVal == 'text'){ */
      if(!this.getMcqAnswer.includes(value)){
        this.getMcqAnswer.push(value);
      }else{
        var index = this.getMcqAnswer.indexOf(value);
        if(index > -1){
          this.getMcqAnswer.splice(index,1);
        }
      }
    /* }else{
      if(!this.getMcqAnswer.includes(this.textQuestions[value])){
        this.getMcqAnswer.push(this.textQuestions[value]);
      }else{
        var index = this.getMcqAnswer.indexOf(this.textQuestions[value]);
        if(index > -1){
          this.getMcqAnswer.splice(index,1);
        }
      }
    }
    console.log('getMcqAnswer at last=>',this.getMcqAnswer); */
  }
  addObj(){
    if(this.objectives.length > 0){
      this.objectives.push(this.objectives[this.objectives.length -1] + 1);
    }else{
      this.objectives.push(1);
    }
  }
  addMtfOpt(col){
    if(col == 'colOne'){
      if(this.mtfColOneOptions.length > 0){
        this.mtfColOneOptions.push(this.mtfColOneOptions[this.mtfColOneOptions.length -1] + 1);
      }else{
        this.mtfColOneOptions.push(1);
      }
    }else if(col == 'colTwo'){
      if(this.mtfColTwoOptions.length > 0){
        this.mtfColTwoOptions.push(this.mtfColTwoOptions[this.mtfColTwoOptions.length -1] + 1);
      }else{
        this.mtfColTwoOptions.push(1);
      }
    }else if(col == 'colThree'){
      if(this.mtfColThreeOptions.length > 0){
        this.mtfColThreeOptions.push(this.mtfColThreeOptions[this.mtfColThreeOptions.length -1] + 1);
      }else{
        this.mtfColThreeOptions.push(1);
      }
    }
  }
  removeObj(val){
    const index = this.objectives.indexOf(val);
    if(index > -1){
      this.objectives.splice(index,1);
    }
  }
  removeAction(action,type){
    if(type == 'objective'){
      if(action == 'last'){
        this.objectives.pop();
      }else{
        this.objectives = [];
      }
    }else if(type == 'mtfColOne'){
      if(action == 'last'){
        this.mtfColOneOptions.pop();
      }else{
        this.mtfColOneOptions = [];
      }
    }else if(type == 'mtfColTwo'){
      if(action == 'last'){
        this.mtfColTwoOptions.pop();
      }else{
        this.mtfColTwoOptions = [];
      }
    }else if(type == 'mtfColThree'){
      if(action == 'last'){
        this.mtfColThreeOptions.pop();
      }else{
        this.mtfColThreeOptions = [];
      }
    }
  }
  
  selectObjType(value){
    console.log('in selectObj',value);
    this.objectives = [];
  }
  changeQuestionType(value:any){
    this.objectives = [];
    this.fibAnsLength = [];
    this.mtfColOneOptions = [];
    this.mtfColTwoOptions = [];
    this.mtfColThreeOptions = [];
    this.twoColMtfAnsCount = [];
    this.sequencingArrayQuestion = [];
  }
  // onFileChanged
  onFileChanged(event:any,index:any){
    console.log('index',index);
    console.log('event',event);
    console.log('event target',event.target);
    console.log('event target',event.target.attributes.getNamedItem('ng-reflect-name').value);
    if(event){
      let obj = {'name':event.target.attributes.getNamedItem('ng-reflect-name').value,'value':event.target.files[0]}
      console.log('obj',obj);
      // this.oqImagesArray[index] = event.target.files[0];
      this.oqImagesArray[index] = obj;
      event.preventDefault();
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        let fileExe = event.target.files[0].type;
        let fileType = fileExe.split('/');
        // console.log('fileType',fileType);
        if(fileType[0] === "image"){
          this.oqImages[index] = reader.result;
          this.cdr.detectChanges();
        }else if(fileType[0] === "audio"){
          this.oqImages[index] = this.audioThubmnail;
          this.cdr.detectChanges();
        }else if(fileType[0] === "video"){
          this.oqImages[index] = this.videoThubmnail;
          this.cdr.detectChanges();
        }else{
          alert('please select valid file type');
          return;
        }
      }
    }
  }
  // Add question
  collectObj(data,valid){
    if(valid){
      let imgs = [];
      this.objectiveQuestions = [];
      for (let i = 1; i <= this.objectives.length; i++) {
        this.objectiveQuestions.push(data['question'+i]);
      }
      if(this.objTypeVal !== 'text'){
        for (let i = 0; i < this.oqImagesArray.length; i++) {
          const formData = new FormData();
          formData.append('file', this.oqImagesArray[i].value);
          this.apiService.uploadFile(formData).subscribe((response:any) => {
            imgs.push({'type':'question'+i+1,'value':response.body.message});
          });
        }
      }else{
        // questionData.options = this.textQuestions;
        // this.textQuestions = Object.keys(data).map(key => ({type: key, value: data[key]}));
        imgs = Object.keys(data).map(key => ({type: key, value: data[key]}));
      }
      this.textQuestions = imgs
      console.log('this.textQuestions',this.textQuestions);
      // console.log('imgs',imgs);
    }else{
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter all the options'});
      return;
    }
  }
  // Validate Fib
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
  // fillInTheBlanksForm
  fillInTheBlanksForm(data){
    console.log('data',data);
    /* if(data.includes("")){
      alert('Please submit answers for all the blanks');
      return;
    }else{ */
      this.answersForFib = [];
      for (let i = 0; i < this.fibAnsLength.length; i++) {
        this.answersForFib.push(data['fibAnswer'+i]);
      }
      console.log('this.answersForFib before map',this.answersForFib);
      if(this.answersForFib.includes('undefined')){
        alert('Please submit answers for all the blanks');
        return;
      }else{
        this.answersForFib = Object.keys(data).map(key => ({type: key, value: data[key]}));
        console.log('this.answersForFib after map',this.answersForFib);
      }
    // }
  }
  // twoColMtf
  twoColMtf(data,valid){
    if(valid){
      console.log('this is data',data);
      console.log('this is images array',this.oqImagesArray);
      this.twoColMtfOptions = [];
      let imgs = [];
      if(this.objTypeVal !== 'text'){
        for (let i = 0; i < this.oqImagesArray.length; i++) {
          const formData = new FormData();
          formData.append('file', this.oqImagesArray[i].value);
          this.apiService.uploadFile(formData).subscribe((response:any) => {
            imgs.push({'type':this.oqImagesArray[i].name,'value':response.body.message});
            // this.twoColMtfOptions.push({'type':'option'+i+1,'value':response.body.message});
          });
        }
        console.log('imgs',imgs);
        this.twoColMtfOptions = imgs;
      }else{
        this.twoColMtfOptions = Object.keys(data).map(key => ({type: key, value: data[key]}));
      }
      this.twoColMtfAnsCount = [];
      console.log('twoColMtfOptions before loop',this.twoColMtfOptions);
      console.log('twoColMtfOptions length before loop',this.twoColMtfOptions.length);
      console.log('type of => ',typeof(this.twoColMtfOptions));
      let countArr = Object.keys(data).map(key => ({type: key, value: data[key]}))
      // this.twoColMtfAnsCount = countArr.length;
      Object.keys(data).map(key => ({type: key, value: data[key]})).forEach((element,index)=>{
        console.log('ele',element);
        if(element.value){
          if(element.type.includes('mtfColOneOption')){
            this.twoColMtfAnsCount.push(index);
          }
        }else{
          Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter all the options'});
          return;
        }
      });
    }else{
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter all the options'});
      return;
    }
  }
  validateInput(value,event){
    /* console.log('value',value);
    var pat = /^[a-z _ ,]+$/;
    if(pat.test(value)){
      console.log('valid');
    }else{
      alert('invalid option');
      return;
    } */
  }
  // mtfAns
  mtfAns(data){
    this.mtfError = false;
    console.log('ans',data);
    let toArr = Object.keys(data).map(key => ({type: key, value: data[key]}));
    toArr.forEach((element) => {
      if(element.value){
        /* if(!(this.smallAlpha.includes(element.value))){
          Swal.fire({ icon: 'error', title: 'Error', text: 'The match you entered does not exist in Column2'});
          this.mtfError = true;
          return; 
        } */
      }else{
        Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter match for all the options'});
        this.mtfError = true;
        return; 
      }
    });
    if(!this.mtfError){
      this.answerForTwoColMtf = data;
      console.log('this.answerForTwoColMtf',this.answerForTwoColMtf);
    }
  }
  // sequencingForm
  sequencingForm(data,valid){
    if(valid){
      console.log('this is data',data);
      console.log('this is images array',this.oqImagesArray);
      this.sequencingArrayQuestion = [];
      let imgs = [];
      if(this.objTypeVal !== 'text'){
        for (let i = 0; i < this.oqImagesArray.length; i++) {
          const formData = new FormData();
          console.log('val bfr apnd',this.oqImagesArray[i].value);
          formData.append('file', this.oqImagesArray[i].value);
          this.apiService.uploadFile(formData).subscribe((response:any) => {
            imgs.push({'type':this.oqImagesArray[i].name,'value':response.body.message});
            // this.sequencingArrayQuestion.push({'type':this.oqImagesArray[i].name,'value':response.body.message});
          })
        }
        this.sequencingArrayQuestion = imgs;
        console.log('imgs',imgs);
        this.cdr.detectChanges();
      }else{
        this.sequencingArrayQuestion = Object.keys(data).map(key => ({type: key, value: data[key]}));
      }
    }else{
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all the fields'});
      return;
    }
  }
  // seqAnswerForm
  seqAnswerForm(data,valid){
    if(valid){
      this.sequencingArrayAnswer = [];
      this.sequencingArrayAnswer = Object.keys(data).map(key => ({type: key, value: data[key]}));
    }else{
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all the fields'});
      return;
    }
  }
  // sortingForm
  sortingForm(data,valid){
    if(valid){
      console.log('data',data);
      console.log('images array',this.oqImagesArray);
      this.sortingQuestions = [];
      this.sortingQuestionsGroupAns = [];
      this.noOfSortingGroups = [];
      let imgs = [];
      if(this.objTypeVal !== 'text'){
        for (let i = 0; i < this.oqImagesArray.length; i++) {
          if(this.oqImagesArray[i]){
            const formData = new FormData();
            formData.append('file', this.oqImagesArray[i].value);
            this.apiService.uploadFile(formData).subscribe((response:any) => {
              let obj = {'type':this.oqImagesArray[i].name,'value':response.body.message};
              imgs.push(obj);
            })
          }
        }
        this.sortingQuestions = imgs;
        console.log('this.sortingQuestions as obj',this.sortingQuestions);
        console.log('this.sortingQuestions as obj',this.sortingQuestions[0]);
      }else{
        this.sortingQuestions = Object.keys(data).map(key => ({type: key, value: data[key]}));
      }
      Object.keys(data).map(key => ({type: key, value: data[key]})).forEach((element) => {
        // this.sortingQuestions.forEach((element) => {
        if(element.value){
          if(element.type.includes('sortingOption')){
            this.sortingQuestionsGroupAns.push({'value':element.value});
          }else if(element.type.includes('sortingGroup')){
            this.noOfSortingGroups.push({'value':element.value})
          }
        }else{
          Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all the fields'});
          return; 
        }
      })
    }else{
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all the fields'});
      return; 
    }
  }
  // groupAnswersForm
  groupAnswersForm(data,valid){
    if(valid){
      this.sortingAnswers = Object.keys(data).map(key => ({type: key, value: data[key]}));
    }else{
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please select options for all the groups'});
      return;
    }

  }
  // numericalRangeFun
  numericalRangeFun(data,valid){
    console.log('data',data);
    console.log('valid',valid);
    if(valid){
      this.numRangeMinMax = [];
      this.numRangeMinMaxAns = [];
      // this.numRangeMinMax = Object.keys(data).map(key => ({type: key, value: data[key]}));
      this.numRangeMinMax = [{'minValue':data.minRange,'maxValue':data.maxRange}];
      console.log('this.numRangeMinMax in numFun',this.numRangeMinMax);
    }else{
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter min and max value'});
      return;
    }
  }
  // minMaxAnsFun
  minMaxAnsFun(data,valid){
    if(valid){
      console.log('data',data);
      console.log('numRangeMinMax',this.numRangeMinMax[0]);
      if(parseInt(data.numRangeAns) < parseInt(this.numRangeMinMax[0].minValue)){
        Swal.fire({ icon: 'error', title: 'Error', text: 'Your answer is less than the minimum value'});
        return;
      }else if(parseInt(data.numRangeAns) > parseInt(this.numRangeMinMax[0].maxValue)){
        Swal.fire({ icon: 'error', title: 'Error', text: 'Your answer is greater than the maximum value'});
        return;
      }else{
        this.numRangeMinMaxAns = [];
        this.numRangeMinMaxAns.push(data.numRangeAns);
      }
    }else{
      Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter range for min and max values'});
      return;
    }
  }

  valuechanged($event){
    // this.htmlContent = this.sanitized.bypassSecurityTrustHtml($event)
    let ev=$event;

    this.htmlContent = ev
    // document.getElementById("append").innerHTML = this.htmlContent;

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 10);
   
    
    
    console.log( this.htmlContent)
  }




  // addQuestion
  addQuestion(data,isValid: boolean){
    console.log('htmlContent',this.htmlContent);
    // return;
    // var parts = this.htmlContent.split("<font face=\"Arial\">");
    // var thePart = parts[1];
    // var partstwo = thePart.split("</font>");
    // this.htmlContent = partstwo[0];
    // console.log('ed val',partstwo[0]);
    console.log('data',data);
    console.log('valid',isValid);
    // if(isValid){
      let eType = [];
      console.log(this.examType)
      this.examType.forEach(element => {
        eType.push(element.name);
      });
      let userInfo = localStorage.getItem('info');
      let user = JSON.parse(userInfo);
      let id:any;
      let repo:any;
      if(user.user_info[0].school_id){
        id = user.user_info[0].school_id;
        repo = 'School';
      }else{
        id = user.user_info[0].id;
        repo = 'Global';
      }
      /* if(user.user_info[0].profile_type == 'school_admin'){
      }else if(user.user_info[0].profile_type == 'admin'){
      }else{
        id = null;
        repo = null;
      } */
      const questionData = {
        'repository' : [{'id':id,'branch_name':'','repository_type':repo}],
        "class": this.class,
        "board": this.board,
        "syllabus": this.syl,
        "subject": this.subject,
        "chapter": this.chapter,
        "topic": this.topic,
        "language": this.language,
        "learningOutcome": this.learningOutcome.toString(),
        "questionCategory": this.questionCategory,
        "examType": eType,
        "questionType": this.questionType,
        "practiceAndTestQuestion": this.praticTestQuestionValue.toString(),
        "studentType": this.studentTypeValue,
        "difficultyLevel": this.questionDifficulty,
        "questionTitle": this.questionTitle,
        "question":this.htmlContent,
        // "question":this.htmlContent,
        "optionsType": this.objTypeVal,
        // "options": [{"option1":""},{"option2":""},{"option3":""},{"option4":""}],
        "options": [],
        "answer": this.answer,
        "totalMarks": parseFloat(this.totalMarks),
        "negativeMarks": parseFloat(this.negativeMarks),
        "negativeScore": this.negativeScoring.toUpperCase(),
        "duration": parseFloat(this.duration),
        "createdBy": localStorage.getItem('UserName'),
        "updatedBy": localStorage.getItem('UserName')
      }
      questionData.negativeMarks = this.negativeMarks ? parseFloat(this.negativeMarks) : 0;
      if(this.questionType == 'mcq'){
        questionData.answer = this.getMcqAnswer;
      }
      if(this.questionType == 'fillInTheBlanks'){
        questionData.answer = this.answersForFib;
        questionData.optionsType = 'text';
      }
      if(this.questionType == 'trueOrFalse'){
      	questionData.optionsType = 'text';
      }
      /* if(this.objTypeVal !== 'text'){
        for (let i = 0; i < this.oqImagesArray.length; i++) {
          const formData = new FormData();
          formData.append('file', this.oqImagesArray[i]);
          this.apiService.uploadFile(formData).subscribe((response:any) => {
            questionData.options.push({'type':'question'+i+1,'value':response.body.message});
          });
        }
      }else{ */
        // }
        // return;
        if(this.objTypeVal == 'text' || this.objTypeVal == 'video' || this.objTypeVal == 'image' || this.objTypeVal == 'audio'){
          questionData.options = this.textQuestions;
      }
      if(this.questionType == 'twoColMtf' || this.questionType == 'threeColMtf'){
        questionData.options = this.twoColMtfOptions;
        questionData.answer = this.answerForTwoColMtf;
        questionData.optionsType = 'text';
      }
      if(this.questionType == 'sequencingQuestion' || this.questionType == 'sentenceSequencing'){
        questionData.options = this.sequencingArrayQuestion;
        questionData.answer = this.sequencingArrayAnswer;
        questionData.optionsType = 'text';
      }
      if(this.questionType == 'sorting'){
        questionData.options = this.sortingQuestions;
        questionData.answer = this.sortingAnswers;
        questionData.optionsType = 'text';
      }
      if(this.questionType == 'NumericalRange'){
        questionData.options = this.numRangeMinMax;
        questionData.answer = this.numRangeMinMaxAns;
        questionData.optionsType = 'text';
      }
      if(this.questionType == 'freeText'){
        questionData.optionsType = 'text';
      }
      console.log('this.getMcqAnswer bfr',this.getMcqAnswer);
      console.log('questionData.answer bfr',questionData.answer);
      // add question
      this.apiService.addQuestion(questionData).subscribe((response:any) => {
        if(response.status == 201){
          Swal.fire('Added','Question Added','success').then(function(){
            window.location.reload();
          });
        }else{
          Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again'});
          return;
        }
      }, (error) => {
        if(error.status == 400){
          console.log('error => ',error)
          Swal.fire({ icon: 'error', title: 'Error', text: error.error.message.message})
        }else{
          Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong please try again'})
        }
      })
      console.log('question array', questionData);
    // }else{
    //   Swal.fire({ icon: 'error', title: 'Error', text: 'Please fill all the required fields'});
    // }
  }

  valueradio(event){
console.log(event, this.negativeScoring)
  }
}
