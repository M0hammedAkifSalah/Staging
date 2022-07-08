import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { filter, forEach } from 'lodash';
import { saveAs } from "file-saver";
import { Packer } from 'docx';
// import { filter } from 'lodash';
import Swal from 'sweetalert2';
import { LoadingService } from '../../../loader/loading/loading.service';
import { CreateservicesService } from '../../create/services/createservices.service';
import { LearningService } from '../services/learning.service';
import { AddEditInstructionComponent } from './add-edit-instruction/add-edit-instruction.component';
import { DocumentCreator } from './documentCreator';
import { experiences, education, skills, achievements } from "./document-data";
import { SelectQuestionComponent } from './select-question/select-question.component';
import * as mso from '@email-types/data/mso';
import { PrintConfirmationComponent } from '../confirmation-dialogue-modal/print-confirmation/print-confirmation.component';
import { C } from '@angular/cdk/keycodes';
import { element } from 'protractor';


@Component({
  selector: 'kt-create-question-paper-module',
  templateUrl: './create-question-paper-module.component.html',
  styleUrls: ['./create-question-paper-module.component.scss']
})
export class CreateQuestionPaperModuleComponent implements OnInit {

  // 'mso-border-alt': {
  //   mso-border-alt:'basic-black-dashes;
  // }
  Datee:any;
  currDate:any;
  currMonth:any;
  currYear:any;
  schoolname = localStorage.getItem('schoolname')
  subjectname : any;
  questionPaper = {
    _id: null,
    detail_question_paper: {
      chapters: [],
      subject: [],
      topic: [],
      studentType: [],
      examType: [],
      learningOutcome: [],
      questionCategory: [],
      board: null,
      class: null,
      syllabus: null,
      totalQuestion: 0,
      language: null,
    },
    //optional
    attemptType: {
      practice: null,
      test: null,
      practiceTest: null,
    },
    difficultyLevel: {
      veryEasy: null,
      easy: null,
      intermediate: null,
      hard: null,
      veryHard: null,
    },
    createdAt: null,
    updatedAt: null,
    repository: [],
    question_title: null,
    class_id: null,
    coin: 20,
    award: 10,
    dueDate: null,
    duration: null,
    startDate: null,
    user_id: null,
    question_id: null,
    school_id: null,
    AssignDate: null,
    assignTo: [
      {
        status: [],
        _id: [],
        student_id: [],
      },
    ],
    section: [
      {
        "_id": null,
        question_list: [
          {
            questionType: [],
            question: [],
            options: [],
            answer: [],
            _id: null,
            duration: null,
            negativeMarks: null,
            negativeScore: null,
            optionsType: null,
            totalMarks: null,
            matchOptions: {
              column1: [],
              column2: [],
              column3: []
            }
          },
        ],
        section_name: null,
        information: null,
      }
    ],
    createdBy: null,
    __v: 0
  };

  questionAttemptCounts;

  schoolId: any;
  selectedBoardName: any;
  selectedSyllabusName: any;
  userName: any;
  questionPaperId: any;
  updateQuestionPaper: any;
  globalId: any;
  globalType: any;
  totalScore: number = 0;

  subjectLoader: boolean = false;
  globalClasses: any = [];
  schoolClasses: any = [];
  globalBoard: any = [];
  globalSyllabus: any = [];
  globalSubjects: any = [];
  globalChapters: any = [];
  globalTopics: any = [];
  globalLearningOutcome: any = [];
  allBoards: any = [];
  allSyllabus: any = [];
  allSubjects: any = [];
  allChapters: any = [];
  allTopics: any = [];
  allLearningOutcomes: any = [];
  allExamTypes: any = [];
  actualQuestionList: any = [];
  languages: any[] = ['English', 'Hindi', 'Urdu', 'Kannada'];
  studentTypes: any[] = [
    { 'name': 'Special Needs', 'value': 'specialNeeds' },
    { 'name': 'General', 'value': 'general' },
    { 'name': 'Gifted', 'value': 'gifted' }
  ];
  questionCount: any = [];

  questionList: any;
  selectedQuestionList: any = [];
  inputAutoQuestionCount: any = {}

  isOwner: boolean;
  selectQuestion: boolean = true;
  filterQuestion: boolean = false;
  previewQuestion: boolean = false;
  autoGenerateQuestionFlag: boolean = false;
  autoQuestionFlag: boolean = false;
  printQuestionPaperFlag: boolean = false

  subjectFlag: boolean = false;
  chapterFlag: boolean = false;
  topicFlag: boolean = false;
  learningOutcomeFlag: boolean = false;
  fetchQuestionFlag: boolean = false;
  requiredQuestionList: any = [];
  withoutAudioVideoSelectedQuestionList: any = [];
  isSchoolAdmin: boolean = false;



  constructor(private learningService: LearningService,
    private cdr: ChangeDetectorRef,
    private loaderService: LoadingService,
    private createApiServices: CreateservicesService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) { 
      this.Datee = new Date();

     this.currDate = this.Datee.getDate();
      this.currMonth = this.Datee.getMonth() + 1;
      this.currYear = this.Datee.getFullYear();
      console.log(this.currDate)
    }


  

  async ngOnInit() {

    await this.getAdmin();

    this.route.params.subscribe(param => {
      this.questionPaperId = param.id
      // this.pageType = state.type;
      // this.createDetails = state.data
    })
    console.log(this.questionPaperId)
    if (this.questionPaperId) {
      this.getQuestionPaperById();
    }
    if(!this.isOwner){
      this.getClasses();
      this.getSubjects();
    }

    this.getallinstitutesClasses();
    this.getExamType();
    this.getBoards();
    this.getSyllabus();

  }

  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    this.userName = user.user_info[0].name;
    console.log(user)
    let id: any;
    console.log(user.user_info[0].name)

    this.isSchoolAdmin = !!(
      user.user_info[0].profile_type.role_name == "school_admin"
    );
    if (user.user_info[0].school_id) {
      this.schoolId = localStorage.getItem('schoolId');
    } else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.globalId = user.user_info[0].repository[0].id
        this.globalType = user.user_info[0].repository[0].repository_type;
      } else {
        this.globalId = user.user_info[0]._id
        this.globalType = 'Global'
      }
      // this.global_id=
      // this.globalId = user.user_info[0]._id;
      // this.globalType = user.user_info[0].profile_type.repository[0].repository_type
    }
    if (user.user_info[0].profile_type.role_name == 'school_admin' || user.user_info[0].profile_type.role_name == 'teacher'
      || user.user_info[0].profile_type.role_name == 'principal' || user.user_info[0].profile_type.role_name == 'management') {
      this.isOwner = true
      console.log(this.isOwner)
    }
    else if (localStorage.getItem('schoolId')) {
      this.isOwner = true;
    }
    else {
      this.isOwner = false
    }
  }
  getClasses() {
    this.loaderService.show();
    this.learningService.getGlobalClasses().subscribe((response: any) => {
      this.globalClasses = response.body.data;
      this.loaderService.hide();
    },
      error => {
        this.loaderService.hide()
      });
  }
  getBoards() {
    this.loaderService.show();
    this.learningService.getGlobalBoards().subscribe((response: any) => {
      this.globalBoard = response.body.data;
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
  }
  getSyllabus() {
    this.loaderService.show();
    this.learningService.getGlobalSyllabuses().subscribe((response: any) => {
      this.globalSyllabus = response.body.data;
      this.loaderService.hide();
    },
      error => {
        this.loaderService.hide();
      })
  }
  getSubjects() {
    this.loaderService.show();
    this.subjectLoader = true;
    this.learningService.getGlobalSubjects().subscribe((response: any) => {
      this.globalSubjects = response.body.data
      this.loaderService.hide();
      this.subjectLoader = false;
    }, error=>{
      this.subjectLoader = false;
    })
    this.loaderService.hide();
  }
  getallinstitutesClasses() {
    // let userInfo = localStorage.getItem('info');
    // let user = JSON.parse(userInfo);
    // let id: any;
    // if (user.user_info[0].school_id) {
    //   id = user.user_info[0].school_id;
    // }
    this.loaderService.show();
    this.learningService.getallinstitute(this.schoolId).subscribe((data: any) => {
      this.schoolClasses = data.body.data[0].classList;
      console.log(this.schoolClasses, "this.class")
      this.cdr.detectChanges();
      this.loaderService.hide();
    }
      , error => {
        this.loaderService.hide();
      })
  }

  getExamType() {
    this.loaderService.show();
    this.learningService.getExamType().subscribe((response: any) => {
      this.allExamTypes = response.body.data;
      this.loaderService.hide();
    }, error => {
      this.loaderService.hide();
    })
  }

  getQuestionPaperById() {
    this.loaderService.show();
    this.learningService.getQuestionPaperById(this.questionPaperId).subscribe(
      (response:any) => {
        
       
        
        if (response && response.body && response.body.data) {
          this.updateQuestionPaper = response.body.data[0];
          console.log('Data2',response)
          //this.questionPaper.detail_question_paper.class = this.updateQuestionPaper
          console.log('QuestionPaper BY id',this.updateQuestionPaper)
          
          this.selectedQuestionList = response.body.data[0].section[0].question_list;
          this.selectedQuestionList = this.selectedQuestionList.map(v => ({ ...v, isChecked: true }));
          this.questionPaper.detail_question_paper = response.body.data[0].detail_question_paper
          console.log(this.selectedQuestionList);
          this.questionPaper.class_id = response.body.data[0].class_id._id;

          this.questionPaper.detail_question_paper.class = this.questionPaper.class_id;
          this.getBoardIdAndSyllabusId();
          this.classChanged()
          this.questionPaper.detail_question_paper.subject = this.updateQuestionPaper.detail_question_paper.subject.map((obj)=>{
            console.log(obj._id)
            return obj._id
          }) ;

          console.log(this.questionPaper.detail_question_paper.subject)
     
          console.log(this.questionPaper.detail_question_paper)
          this.questionPaper.detail_question_paper.chapters = this.updateQuestionPaper.detail_question_paper.chapters.map((obj)=>{
            console.log(obj._id)
            return obj._id
          })  
         
          this.getChpterAndSetSubjectGlobal();
          this.getTopicAndSetChapterGlobal()
           console.log(this.questionPaper.detail_question_paper.subject);
          
          
          
         // this.questionPaper.detail_question_paper.board = this.questionPaper.detail_question_paper
          console.log('Board', this.questionPaper.detail_question_paper.board)
          //this.boardsChanged();
          this.questionPaper.question_title = response.body.data[0].question_title;
          this.questionPaper.duration = this.updateQuestionPaper.duration;
          this.questionPaper.question_id = this.updateQuestionPaper.question_id
          setTimeout(()=>{
            this.getTotalScore();
          },1200)
          if (this.updateQuestionPaper && this.updateQuestionPaper.autoGeneratedQuestion) {
            
            this.autoQuestionFlag = this.updateQuestionPaper.autoGeneratedQuestion;
            if (this.updateQuestionPaper && this.updateQuestionPaper.autoGeneratedQuestionCount) {
              this.inputAutoQuestionCount = this.updateQuestionPaper.autoGeneratedQuestionCount;
            }
            this.fetchQuestion('autoQuestionList')
          }
          else {
            
            this.fetchQuestion();
          }
         
          console.log(this.selectedQuestionList);
          if (this.selectedQuestionList && this.selectedQuestionList.length) {
            this.withoutAudioVideoSelectedQuestionList = this.selectedQuestionList.filter(v => v.optionsType == 'text' || v.optionsType == 'image')
          }
          
          console.log(this.questionPaper)
          
          this.previewQuestion = true;
          this.fetchQuestionFlag = false;
          this.selectQuestion = false;
          this.cdr.detectChanges();
          this.loaderService.hide();
          console.log(this.questionPaper.detail_question_paper.chapters)
        }
        
      },
      error => {
        this.loaderService.hide();
      }
    )
    console.log(this.questionPaper.detail_question_paper.chapters)
  }

  getBoardIdAndSyllabusId(value?) {
    this.loaderService.show();
    this.chapterFlag = false;
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    this.subjectFlag = false;
    
    
    this.questionPaper.detail_question_paper.learningOutcome = [];
     
    if (value) {
      this.questionPaper.detail_question_paper.topic = [];
      this.questionPaper.detail_question_paper.chapters = [];
      this.questionPaper.detail_question_paper.subject = []
      this.allSubjects = [];
      // this.selectedBoardId = '';
      // this.selectedSyllabusId = '';
      // this.selectedBoardName = '';
      // this.selectedSyllabusName = '';
    }
    console.log('ClassIID',this.questionPaper.detail_question_paper.class)
    this.createApiServices.getBoardByClassId(this.questionPaper.detail_question_paper.class).subscribe(
      (response: any) => {
        console.log("Board",response)
        if (response && response.body && response.body.data && response.body.data.length) {
         
          //Res.body.data is empty need to fix
          //to execute this block

         this.questionPaper.detail_question_paper.board = response.body.data[0];
         console.log('Board',this.questionPaper.detail_question_paper.board)
         // this.selectedBoardId = response.body.data[0]._id

          this.selectedBoardName = response.body.data[0].name
          console.log(this.selectedBoardName)
          this.createApiServices.getSyllabusByClassId(this.questionPaper.detail_question_paper.class, this.questionPaper.detail_question_paper.board).subscribe(
            (response: any) => {
              if (response && response.body && response.body.data && response.body.data.length) {
                this.questionPaper.detail_question_paper.syllabus = response.body.data[0]._id
                // this.selectedSyllabusId = response.body.data[0]._id
                this.selectedSyllabusName = response.body.data[0].name
                this.subjectLoader = true;
                this.createApiServices.getSubjectsByClassId(this.questionPaper.detail_question_paper.class, this.questionPaper.detail_question_paper.board._id, this.questionPaper.detail_question_paper.syllabus).subscribe(
                  (response: any) => {
                    console.log(response)
                    this.subjectLoader = false;
                    if (response && response.body && response.body.data && response.body.data.length) {
                      this.allSubjects = response.body.data;
                      this.loaderService.hide();
                    }
                    this.loaderService.hide();
                  },
                  error => {
                    this.subjectLoader = false;
                    this.loaderService.hide();
                  }
                )
              }
              this.loaderService.hide();
            },
            error => {
              this.loaderService.hide();
            }
          )
        }
        this.loaderService.hide();
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.subjectFlag = true;
    this.cdr.detectChanges();
    console.log('this.questionPaper.detail_question_paper',this.questionPaper.detail_question_paper)
    if(this.questionPaper.detail_question_paper.subject
      && this.questionPaper.detail_question_paper.subject.length
      && this.questionPaper.detail_question_paper.class
   /*    && this.questionPaper.detail_question_paper.board._id
      && this.questionPaper.detail_question_paper.board.length */
      && this.questionPaper.detail_question_paper.syllabus
/*       && this.questionPaper.detail_question_paper.syllabus.length */) {
      this.getAttemptCounts();
    }else{
      this.questionAttemptCounts = {};
    }

  }

  classChanged(){
    console.log('this.questionPaper.detail_question_paper',this.questionPaper.detail_question_paper)
    if(this.questionPaper.detail_question_paper.subject
      && this.questionPaper.detail_question_paper.subject.length
      && this.questionPaper.detail_question_paper.class
      && this.questionPaper.detail_question_paper.board._id
      && this.questionPaper.detail_question_paper.syllabus) {
      this.getAttemptCounts();
    }else{
      this.questionAttemptCounts = {};
    }
  }

  boardsChanged(){
    console.log('this.questionPaper.detail_question_paper',this.questionPaper.detail_question_paper)
    if(this.questionPaper.detail_question_paper.subject
      && this.questionPaper.detail_question_paper.subject.length
      && this.questionPaper.detail_question_paper.class
      && this.questionPaper.detail_question_paper.class.length
      && this.questionPaper.detail_question_paper.board._id
      && this.questionPaper.detail_question_paper.board.length
      && this.questionPaper.detail_question_paper.syllabus
      && this.questionPaper.detail_question_paper.syllabus.length) {
      this.getAttemptCounts();
    }else{
      this.questionAttemptCounts = {};
    }
  }

  syllabusChanged(){
    console.log('this.questionPaper.detail_question_paper',this.questionPaper.detail_question_paper)
    if(this.questionPaper.detail_question_paper.subject
      && this.questionPaper.detail_question_paper.subject.length
      && this.questionPaper.detail_question_paper.class
      && this.questionPaper.detail_question_paper.class.length
      && this.questionPaper.detail_question_paper.board._id
      && this.questionPaper.detail_question_paper.board.length
      && this.questionPaper.detail_question_paper.syllabus
      && this.questionPaper.detail_question_paper.syllabus.length) {
      this.getAttemptCounts();
    }else{
      this.questionAttemptCounts = {};
    }
  }

  getChapterAndSetSubject(value?) {
    this.loaderService.show();
    this.chapterFlag = false;
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    if(this.questionPaper.detail_question_paper.chapters){
      this.questionPaper.detail_question_paper.chapters = [] ;
    } 
    
    this.questionPaper.detail_question_paper.topic = [];
    this.questionPaper.detail_question_paper.learningOutcome = [];
    this.allChapters = [];
    this.learningService.getChaptersBySubject(this.questionPaper.detail_question_paper.class, this.questionPaper.detail_question_paper.board._id,
      this.questionPaper.detail_question_paper.syllabus, this.questionPaper.detail_question_paper.subject).subscribe(
        (response: any) => {
          if (response && response.body && response.body.data && response.body.data.length) {
            this.allChapters = response.body.data;
            
          }
          this.loaderService.hide();
        },
        error => {
          this.loaderService.hide();
        }
      )
    this.chapterFlag = true;
  }

  getTopicsAndSetChapter(value?) {
    this.loaderService.show();
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    this.questionPaper.detail_question_paper.topic = [];
    this.questionPaper.detail_question_paper.learningOutcome = [];
    this.allTopics = [];
    this.learningService.getTopicByChapters(this.questionPaper.detail_question_paper.class, this.questionPaper.detail_question_paper.board._id,
      this.questionPaper.detail_question_paper.syllabus, this.questionPaper.detail_question_paper.subject, this.questionPaper.detail_question_paper.chapters).subscribe(
        (response: any) => {
          if (response && response.body && response.body.data && response.body.data.length) {
            this.allTopics = response.body.data;
            this.loaderService.hide();
          }
          this.loaderService.hide();
        },
        error => {
          this.loaderService.hide();
        }
      )
    this.topicFlag = true;
  }

  getLearnOutcomeAndSetTopic(value?) {
    this.learningOutcomeFlag = false;
    this.loaderService.show();
    this.questionPaper.detail_question_paper.learningOutcome = [];
    this.allLearningOutcomes = [];
    this.learningService.getLearningOutcomeByTopic(this.questionPaper.detail_question_paper.class, this.questionPaper.detail_question_paper.board._id,
      this.questionPaper.detail_question_paper.syllabus, this.questionPaper.detail_question_paper.subject,
      this.questionPaper.detail_question_paper.chapters, this.questionPaper.detail_question_paper.topic).subscribe(
        (response: any) => {
          if (response && response.body && response.body.data && response.body.data.length) {
            this.allLearningOutcomes = response.body.data;
            this.loaderService.hide();
          }
          this.loaderService.hide();
        },
        error => {
          this.loaderService.hide();
        }
      )

    this.learningOutcomeFlag = true;

  }

  getAttemptCounts(){
    console.log('Inside Attempt Count',this.questionPaper.detail_question_paper)
    let reqPayload = {
      class:this.questionPaper.detail_question_paper.class,
      //board:this.questionPaper.detail_question_paper.board._id,
      syllabus:[],
      subject:[],
      globalLogin:!this.isOwner
    }
    this.questionPaper.detail_question_paper.syllabus.forEach(element => {
      reqPayload.syllabus.push(element._id)

    });
   
    this.questionPaper.detail_question_paper.subject.forEach(ele => {
      reqPayload.subject.push(ele._id)
    })
    console.log('reqPayload',reqPayload)
    this.learningService.getQuestionAttemptCount(reqPayload)
    .subscribe(result =>{
      this.questionAttemptCounts = {};
      if(result.body['data'])
      this.questionAttemptCounts = result.body['data'];
      console.log('this.questionAttemptCounts',this.questionAttemptCounts)
    }, error =>{
      this.questionAttemptCounts = {};
    })
  }

  getChpterAndSetSubjectGlobal(value?) {
    
    this.loaderService.show();
    // if (!value) {
    this.chapterFlag = false;
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    this.globalChapters = [];
    this.globalTopics = [];
    this.globalLearningOutcome = [];
    if(value){
      console.log('getChpterAndSetSubjectGlobal1')
    this.questionPaper.detail_question_paper.chapters= [];
     this.questionPaper.detail_question_paper.topic = [];
    }
    
   
    this.questionPaper.detail_question_paper.learningOutcome = [];
    // }
    let obj = {}
    if (this.isOwner) {
      console.log('getChpterAndSetSubjectGlobal2')
      let boardListArray = [];
      let syllabusListArray = [];
      boardListArray[0] = this.questionPaper.detail_question_paper.board._id;
      syllabusListArray[0] = this.questionPaper.detail_question_paper.syllabus;
      obj = {
        class_id: this.questionPaper.detail_question_paper.class,
        board_id: this.questionPaper.detail_question_paper.board._id,
        syllabus_id: this.questionPaper.detail_question_paper.syllabus,
        subject_id: this.questionPaper.detail_question_paper.subject,
        "repository.id": this.schoolId
      }
    } else {
      obj = {
        class_id: this.questionPaper.detail_question_paper.class,
        board_id: this.questionPaper.detail_question_paper.board._id,
        syllabus_id: this.questionPaper.detail_question_paper.syllabus,
        subject_id: this.questionPaper.detail_question_paper.subject,
        "repository.id": this.globalId
      }
    }

    this.learningService.getChaptersBySubjectGlobalFilter(obj).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.globalChapters = response.body.data;
          this.loaderService.hide();
          this.cdr.detectChanges();
        }
        this.loaderService.hide();
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.chapterFlag = true;
    console.log('this.questionPaper.detail_question_paper',this.questionPaper.detail_question_paper)
    if(this.questionPaper.detail_question_paper.subject
      && this.questionPaper.detail_question_paper.subject.length
      && this.questionPaper.detail_question_paper.class
      && this.questionPaper.detail_question_paper.class.length
      && this.questionPaper.detail_question_paper.board._id
      && this.questionPaper.detail_question_paper.board.length
      && this.questionPaper.detail_question_paper.syllabus
      && this.questionPaper.detail_question_paper.syllabus.length) {
      this.getAttemptCounts();
    }else{
      this.questionAttemptCounts = {};
    }

  }

  

  getTopicAndSetChapterGlobal(event?) {
    this.loaderService.show();
    // if (!event) {
    this.topicFlag = false;
    this.learningOutcomeFlag = false;
    //this.questionPaper.detail_question_paper.chapters[0].topic = [];
    this.questionPaper.detail_question_paper.learningOutcome = [];
    this.globalTopics = [];
    this.globalLearningOutcome = [];
    // }
    let obj = {}
    if (this.isOwner) {
      let boardListArray = [];
      let syllabusListArray = [];
      boardListArray[0] = this.questionPaper.detail_question_paper.board._id;
      syllabusListArray[0] = this.questionPaper.detail_question_paper.syllabus;
      obj = {
        class_id: this.questionPaper.detail_question_paper.class,
        board_id: boardListArray,
        syllabus_id: syllabusListArray,
        subject_id: this.questionPaper.detail_question_paper.subject,
        chapter_id: this.questionPaper.detail_question_paper.chapters,
        "repository.id": this.schoolId
      }
    } else {
      obj = {
        class_id: this.questionPaper.detail_question_paper.class,
        board_id: this.questionPaper.detail_question_paper.board._id,
        syllabus_id: this.questionPaper.detail_question_paper.syllabus,
        subject_id: this.questionPaper.detail_question_paper.subject,
        chapter_id: this.questionPaper.detail_question_paper.chapters,
        "repository.id": this.globalId
      }
    }
    this.learningService.getTopicsByChapterGlobalFilter(obj).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.globalTopics = response.body.data
          this.loaderService.hide();
        }
        this.loaderService.hide();
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.topicFlag = true;

  }

  getLearningAndSetTopicGlobal(event?) {
    this.loaderService.show();
    if (!event) {
      this.learningOutcomeFlag = false;
      this.questionPaper.detail_question_paper.learningOutcome = [];
      this.globalLearningOutcome = [];
    }
    let obj = {}
    if (this.isOwner) {
      let boardListArray = [];
      let syllabusListArray = [];
      boardListArray[0] = this.questionPaper.detail_question_paper.board._id;
      syllabusListArray[0] = this.questionPaper.detail_question_paper.syllabus;
      obj = {
        class_id: this.questionPaper.detail_question_paper.class,
        board_id: boardListArray,
        syllabus_id: syllabusListArray,
        subject_id: this.questionPaper.detail_question_paper.subject,
        chapter_id: this.questionPaper.detail_question_paper.chapters,
        topic_id: this.questionPaper.detail_question_paper.topic,
        "repository.id": this.globalId
      }
    } else {
      obj = {
        class_id: this.questionPaper.detail_question_paper.class,
        board_id: this.questionPaper.detail_question_paper.board._id,
        syllabus_id: this.questionPaper.detail_question_paper.syllabus,
        subject_id: this.questionPaper.detail_question_paper.subject,
        chapter_id: this.questionPaper.detail_question_paper.chapters,
        topic_id: this.questionPaper.detail_question_paper.topic,
        "repository.id": this.globalId
      }
    }
    this.learningService.getLearningOutcomeByGlobalFilter(obj).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.globalLearningOutcome = response.body.data;
          this.loaderService.hide();
        }
        this.loaderService.hide();
      },
      error => {
        this.loaderService.hide();
      }
    )
    this.learningOutcomeFlag = true;

  }

  compareFn(x, y): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  //fetch question based on filter
  fetchQuestion(autoGenerateQuestion?) {
    
    //flag for validation
    this.fetchQuestionFlag = true;

    //  else {
    //   this.autoGenerateQuestionFlag = true;
    // }
    console.log('Inside Fetch')
    this.loaderService.show();
    console.log('detail_question_paper',this.questionPaper);
    if (this.questionPaper.detail_question_paper.subject.length && this.questionPaper.detail_question_paper.board
      && this.questionPaper.detail_question_paper.syllabus && this.questionPaper.detail_question_paper.class
      && this.questionPaper.question_title && this.questionPaper.question_id) {
        console.log('Inside Fetch')
        console.log('detail_question_paper',this.questionPaper);
        console.log('School Id',this.schoolId)
      let filterObj = {}

      if (this.questionPaper && this.questionPaper.detail_question_paper.class) {
        filterObj['class'] = this.questionPaper.detail_question_paper.class;
      }
      if(this.schoolId){
        if (this.questionPaper && this.questionPaper.detail_question_paper.board._id) {
          filterObj['board'] = this.questionPaper.detail_question_paper.board._id;
        }
      }else{
        if (this.questionPaper && this.questionPaper.detail_question_paper.board) {
          filterObj['board'] = this.questionPaper.detail_question_paper.board;
        }
      }
     
      if (this.questionPaper && this.questionPaper.detail_question_paper.syllabus) {
        filterObj['syllabus'] = this.questionPaper.detail_question_paper.syllabus;
      }
      if (this.questionPaper && this.questionPaper.detail_question_paper.chapters) {
        filterObj['chapter'] = this.questionPaper.detail_question_paper.chapters;
      }
      if (this.questionPaper && this.questionPaper.detail_question_paper.topic && this.questionPaper.detail_question_paper.topic.length) {
        filterObj['topic'] = this.questionPaper.detail_question_paper.topic;
      }
      if (this.questionPaper && this.questionPaper.detail_question_paper.learningOutcome && this.questionPaper.detail_question_paper.learningOutcome.length) {
        filterObj['learningOutcome'] = this.questionPaper.detail_question_paper.learningOutcome;
      }
      if (this.questionPaper && this.questionPaper.detail_question_paper.subject && this.questionPaper.detail_question_paper.subject.length) {
        filterObj['subject'] = this.questionPaper.detail_question_paper.subject;
      }
      if (this.questionPaper && this.questionPaper.difficultyLevel) {
        let difficultyLevelArray = []
        for (let [key, value] of Object.entries(this.questionPaper.difficultyLevel)) {
          if (value > 0) {
            difficultyLevelArray.push(key);
          }
        }
        if (difficultyLevelArray.length) {
          filterObj['difficultyLevel'] = difficultyLevelArray;
        }
      }
      if (this.questionPaper && this.questionPaper.attemptType) {
        let attamptArray = []
        for (let [key, value] of Object.entries(this.questionPaper.attemptType)) {
          if (value > 0) {
            attamptArray.push(key);
          }
        }
        if (attamptArray.length) {
          filterObj['practiceAndTestQuestion'] = attamptArray;
        }
      }
      if (this.questionPaper && this.questionPaper.detail_question_paper.studentType && this.questionPaper.detail_question_paper.studentType.length) {
        filterObj['studentType'] = this.questionPaper.detail_question_paper.studentType;
      }
      if (this.schoolId) {
        filterObj['repository.id'] = this.schoolId;
      }
      if (this.questionPaper && this.questionPaper.detail_question_paper.language) {
        filterObj['language'] = this.questionPaper.detail_question_paper.language;
      }
      if (this.questionPaper && this.questionPaper.detail_question_paper.questionCategory && this.questionPaper.detail_question_paper.questionCategory.length) {
        filterObj['questionCategory'] = this.questionPaper.detail_question_paper.questionCategory;
      }
     console.log('Filter',filterObj)
      if (!this.globalId) {
        console.log('No Global')
        this.learningService.questionsBasedOnFilter(filterObj).subscribe(
          (response: any) => {
            if (response && response.body) {
              this.questionList = response.body.data;
              console.log(this.questionList)
              this.actualQuestionList = response.body.data;
              this.questionList = this.questionList.map(v => ({ ...v, isChecked: false }))
              this.questionList = this.questionList.map(v => ({ ...v, instruction: "" }))
              this.questionList = this.questionList.map(v => ({ ...v, sectionInstruction: "" }))
              this.questionList.forEach(element => {
                this.selectedQuestionList.filter(x => {
                  if (x._id === element._id) {
                    element.isChecked = x.isChecked;
                    element.instruction = x.instruction;
                    element.sectionInstruction = x.sectionInstruction;
                  }
                })
              });
              this.resizeImage(this.questionList);
              this.questionCount = [];
              if (response && response.body && response.body.count) {
                for (let [key, value] of Object.entries(response.body.count)) {
                  this.questionCount.push({ questionType: key, count: value, selectCount: 0 })
                }
                this.questionCount.forEach(element => {
                  switch(element.questionType){
                    case 'objectives':
                      element['questionTypeValue']="Objective";
                      break;

                      case 'mcq':
                      element['questionTypeValue']="MCQs";
                      break;

                      case 'fillInTheBlanks':
                      element['questionTypeValue']="Fill In The Blanks";
                      break;

                      case 'twoColMtf':
                      element['questionTypeValue']="2 Column Match The Following";
                      break;

                      case 'threeColMtf':
                      element['questionTypeValue']="3 Column Match The Following";
                      break;

                      case '3colOptionLevelScoring':
                      element['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
                      break;

                      case 'optionLevelScoring':
                      element['questionTypeValue']="Option Level Scoring";
                      break;

                      case 'trueOrFalse':
                      element['questionTypeValue']="True Or False";
                      break;

                      case 'NumericalRange':
                      element['questionTypeValue']="Numerical value Range";
                      break;

                      case 'freeText':
                      element['questionTypeValue']="Free Text";
                      break;

                      case 'comprehension':
                      element['questionTypeValue']="Comprehension";
                      break;
                  }
                });

              }
              if (this.questionPaperId) {
                let count = {}
                this.selectedQuestionList.forEach(element => {
                  this.questionCount.filter(x => {
                    if (element.questionType[0] == x.questionType) {
                      x.selectCount++;
                    }
                  })
                  this.questionCount.forEach(element => {
                    switch(element.questionType){
                      case 'objectives':
                        element['questionTypeValue']="Objective";
                        break;

                        case 'mcq':
                        element['questionTypeValue']="MCQs";
                        break;

                        case 'fillInTheBlanks':
                        element['questionTypeValue']="Fill In The Blanks";
                        break;

                        case 'twoColMtf':
                        element['questionTypeValue']="2 Column Match The Following";
                        break;

                        case 'threeColMtf':
                        element['questionTypeValue']="3 Column Match The Following";
                        break;

                        case '3colOptionLevelScoring':
                        element['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
                        break;

                        case 'optionLevelScoring':
                        element['questionTypeValue']="Option Level Scoring";
                        break;

                        case 'trueOrFalse':
                        element['questionTypeValue']="True Or False";
                        break;

                        case 'NumericalRange':
                        element['questionTypeValue']="Numerical value Range";
                        break;

                        case 'freeText':
                        element['questionTypeValue']="Free Text";
                        break;

                        case 'comprehension':
                        element['questionTypeValue']="Comprehension";
                        break;
                    }
                  });
                  // if (count[element.questionType[0]]) {
                  //   count[element.questionType[0]]++
                  // } else {
                  //   count[element.questionType[0]] = 1;
                  // }
                });
                this.getTotalScore();
                if (this.selectedQuestionList && this.selectedQuestionList.length) {
                  this.withoutAudioVideoSelectedQuestionList = this.selectedQuestionList.filter(v => v.questionType == 'text' || v.questionType == 'image')
                }
                // for (let [key, value] of Object.entries(count)) {
                //   this.questionCount.push({ questionType: key, count: value, selectCount: value })
                // }
              }

              console.log(this.questionCount);
              console.log(response.body)
              this.cdr.detectChanges();
              this.loaderService.hide();
            }
          }, error => {
            this.loaderService.hide();
          }
        )
      } else {
        this.learningService.questionsBasedOnGlobalFilter(filterObj).subscribe(
          (response: any) => {
            if (response && response.body) {
              this.questionList = response.body.data;
              console.log(this.questionList)
              this.actualQuestionList = response.body.data
              this.questionList = this.questionList.map(v => ({ ...v, isChecked: false }))
              this.questionList = this.questionList.map(v => ({ ...v, instruction: "" }))
              this.questionList = this.questionList.map(v => ({ ...v, sectionInstruction: "" }))
              console.log(this.questionList)
              this.questionList.forEach(element => {
                this.selectedQuestionList.filter(x => {
                  if (x._id === element._id) {
                    element.isChecked = x.isChecked;
                    element.instruction = x.instruction;
                    element.sectionInstruction = x.sectionInstruction;
                  }
                })
              });

              this.resizeImage(this.questionList);

              this.questionCount = [];
              if (response && response.body && response.body.count) {
                for (let [key, value] of Object.entries(response.body.count)) {
                  this.questionCount.push({ questionType: key, count: value, selectCount: 0 })
                }
                this.questionCount.forEach(element => {
                  switch(element.questionType){
                    case 'objectives':
                      element['questionTypeValue']="Objective";
                      break;

                      case 'mcq':
                      element['questionTypeValue']="MCQs";
                      break;

                      case 'fillInTheBlanks':
                      element['questionTypeValue']="Fill In The Blanks";
                      break;

                      case 'twoColMtf':
                      element['questionTypeValue']="2 Column Match The Following";
                      break;

                      case 'threeColMtf':
                      element['questionTypeValue']="3 Column Match The Following";
                      break;

                      case '3colOptionLevelScoring':
                      element['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
                      break;

                      case 'optionLevelScoring':
                      element['questionTypeValue']="Option Level Scoring";
                      break;

                      case 'trueOrFalse':
                      element['questionTypeValue']="True Or False";
                      break;

                      case 'NumericalRange':
                      element['questionTypeValue']="Numerical value Range";
                      break;

                      case 'freeText':
                      element['questionTypeValue']="Free Text";
                      break;

                      case 'comprehension':
                      element['questionTypeValue']="Comprehension";
                      break;
                  }
                });
              }
              if (this.questionPaperId) {
                let count = {}
                this.selectedQuestionList.forEach(element => {
                  this.questionCount.filter(x => {
                    if (element.questionType[0] == x.questionType) {
                      x.selectCount++;
                    }
                  })
                });
                //to get Total score
                this.getTotalScore();
                this.questionCount.forEach(element => {
                  switch(element.questionType){
                    case 'objectives':
                      element['questionTypeValue']="Objective";
                      break;

                      case 'mcq':
                      element['questionTypeValue']="MCQs";
                      break;

                      case 'fillInTheBlanks':
                      element['questionTypeValue']="Fill In The Blanks";
                      break;

                      case 'twoColMtf':
                      element['questionTypeValue']="2 Column Match The Following";
                      break;

                      case 'threeColMtf':
                      element['questionTypeValue']="3 Column Match The Following";
                      break;

                      case '3colOptionLevelScoring':
                      element['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
                      break;

                      case 'optionLevelScoring':
                      element['questionTypeValue']="Option Level Scoring";
                      break;

                      case 'trueOrFalse':
                      element['questionTypeValue']="True Or False";
                      break;

                      case 'NumericalRange':
                      element['questionTypeValue']="Numerical value Range";
                      break;

                      case 'freeText':
                      element['questionTypeValue']="Free Text";
                      break;

                      case 'comprehension':
                      element['questionTypeValue']="Comprehension";
                      break;
                  }
                });
                if (this.selectedQuestionList && this.selectedQuestionList.length) {
                  this.withoutAudioVideoSelectedQuestionList = this.selectedQuestionList.filter(v => v.questionType == 'text' || v.questionType == 'image')
                }
              }

              console.log(this.questionCount);
              console.log(response.body)
              this.cdr.detectChanges();
              this.loaderService.hide();
            }
          }, error => {
            this.loaderService.hide();
          }
        )
      }
      if (!this.questionPaperId) {
        if (!autoGenerateQuestion) {
          this.filterQuestion = true;
          this.autoGenerateQuestionFlag = false;
        } else {
          //this.autoGenerateQuestionFlag = true;
          this.filterQuestion = false;
        }
      }
    } else {
      console.log('Outside if')
      this.loaderService.hide();
      return;
    }
  }

  addQuestionTypeValue(value){
    this.questionCount.forEach(element => {
      switch(element.questionType){
        case 'objectives':
          element['questionTypeValue']="Objective";
          break;

          case 'mcq':
          element['questionTypeValue']="MCQs";
          break;

          case 'fillInTheBlanks':
          element['questionTypeValue']="Fill In The Blanks";
          break;

          case 'twoColMtf':
          element['questionTypeValue']="2 Column Match The Following";
          break;

          case 'threeColMtf':
          element['questionTypeValue']="3 Column Match The Following";
          break;

          case '3colOptionLevelScoring':
          element['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
          break;

          case 'optionLevelScoring':
          element['questionTypeValue']="Option Level Scoring";
          break;

          case 'trueOrFalse':
          element['questionTypeValue']="True Or False";
          break;

          case 'NumericalRange':
          element['questionTypeValue']="Numerical value Range";
          break;

          case 'freeText':
          element['questionTypeValue']="Free Text";
          break;

          case 'comprehension':
          element['questionTypeValue']="Comprehension";
          break;
      }
    });
    return value;
  }

  //to resize image for view
  resizeImage(questions: any[]) {
    questions.forEach(que => {
      if(que.questionType == "comprehension"){
        que.questions.forEach(q => {
          if ((q.questionType[0] != "threeColMtf" && q.questionType[0] != "twoColMtf" && q.questionType[0] != "3colOptionLevelScoring") && q.optionsType && q.optionsType == 'image' ) {
            q.options.forEach(opt => {
              const aa = opt.value
              const splitArray = aa.split('/')
              console.log(splitArray)
              const ab = [];
              ab.push("https://grow-on-prod.s3.ap-south-1.amazonaws.com/")
              ab.push(splitArray[splitArray.length - 1])
              opt.value = ab.join("");
            });
            q.answer.forEach(ans => {
              const aa = ans.value
              const splitArray = aa.split('/')
              console.log(splitArray)
              const ab = [];
              ab.push("https://grow-on-prod.s3.ap-south-1.amazonaws.com/")
              ab.push(splitArray[splitArray.length - 1])
              ans.value = ab.join("");
            });
          }
          if ((q.questionType[0] == "threeColMtf" || q.questionType[0] == "twoColMtf" || q.questionType[0] == "3colOptionLevelScoring") && q.optionsType && q.optionsType == 'image' ) {
            q.matchOptions.column1.forEach(opt => {
              const aa = opt.value
              const splitArray = aa.split('/')
              console.log(splitArray)
              const ab = [];
              ab.push("https://grow-on-prod.s3.ap-south-1.amazonaws.com/")
              //ab.push("/100x100/")
              ab.push(splitArray[splitArray.length - 1])
              opt.value = ab.join("");
            });

            q.matchOptions.column2.forEach(opt => {
              const aa = opt.value
              const splitArray = aa.split('/')
              console.log(splitArray)
              const ab = [];
              ab.push("https://grow-on-prod.s3.ap-south-1.amazonaws.com/")
              //ab.push("/100x100/")
              ab.push(splitArray[splitArray.length - 1])
              opt.value = ab.join("");
            });

            if(q.questionType[0] == "threeColMtf" || q.questionType[0] == "3colOptionLevelScoring"){
              q.matchOptions.column3.forEach(opt => {
                const aa = opt.value
                const splitArray = aa.split('/')
                console.log(splitArray)
                const ab = [];
                ab.push("https://grow-on-prod.s3.ap-south-1.amazonaws.com/")
               // ab.push("/100x100/")
                ab.push(splitArray[splitArray.length - 1])
                opt.value = ab.join("");
              });
            }
          }
        });

      }else{
        if ((que.questionType[0] != "threeColMtf" && que.questionType[0] != "twoColMtf" && que.questionType[0] != "3colOptionLevelScoring") && que.optionsType && que.optionsType == 'image' ) {
          que.options.forEach(opt => {
            const aa = opt.value
            const splitArray = aa.split('/')
            console.log(splitArray)
            const ab = [];
            ab.push("https://grow-on-prod.s3.ap-south-1.amazonaws.com/")
           // ab.push("/100x100/")
            ab.push(splitArray[splitArray.length - 1])
            opt.value = ab.join("");
          });
          que.answer.forEach(ans => {
            const aa = ans.value
            const splitArray = aa.split('/')
            console.log(splitArray)
            const ab = [];
            ab.push("https://grow-on-prod.s3.ap-south-1.amazonaws.com/")
           // ab.push("/100x100/")
            ab.push(splitArray[splitArray.length - 1])
            ans.value = ab.join("");
          });
        }

        if ((que.questionType[0] == "threeColMtf" || que.questionType[0] == "twoColMtf" || que.questionType[0] == "3colOptionLevelScoring") && que.optionsType && que.optionsType == 'image' ) {
          que.matchOptions.column1.forEach(opt => {
            const aa = opt.value
            const splitArray = aa.split('/')
            console.log(splitArray)
            const ab = [];
            ab.push("https://grow-on-prod.s3.ap-south-1.amazonaws.com/")
            //ab.push("/100x100/")
            ab.push(splitArray[splitArray.length - 1])
            opt.value = ab.join("");
          });

          que.matchOptions.column2.forEach(opt => {
            const aa = opt.value
            const splitArray = aa.split('/')
            console.log(splitArray)
            const ab = [];
            ab.push("https://grow-on-prod.s3.ap-south-1.amazonaws.com/")
            //ab.push("/100x100/")
            ab.push(splitArray[splitArray.length - 1])
            opt.value = ab.join("");
          });

          if(que.questionType[0] == "threeColMtf" || que.questionType[0] == "3colOptionLevelScoring"){
            que.matchOptions.column3.forEach(opt => {
              const aa = opt.value
              const splitArray = aa.split('/')
              console.log(splitArray)
              const ab = [];
              ab.push("https://grow-on-prod.s3.ap-south-1.amazonaws.com/")
              //ab.push("/100x100/")
              ab.push(splitArray[splitArray.length - 1])
              opt.value = ab.join("");
            });
          }
        }
        console.log(que.options)
      }

    });
  }

  selectQuestions(element) {
   
    if(!this.questionList){
      setTimeout(()=>{
        this.fetchQuestion()
      },100)
      
    }
    setTimeout(()=>{
      const modalRef = this.modalService.open(SelectQuestionComponent, { size: 'xl' })
      console.log(this.questionList)
      modalRef.componentInstance.questionList = [...this.questionList];
      modalRef.componentInstance.questionCount = this.questionCount;
      modalRef.componentInstance.totalQuestion = this.questionPaper.detail_question_paper.totalQuestion;
      console.log(this.questionPaper.detail_question_paper.totalQuestion)
      modalRef.componentInstance.questionType = element;
      modalRef.result.then((result) => {
        this.selectedQuestionList = result;
        
        this.questionCount.forEach(element => {
          element.selectCount = 0
        });
        this.questionPaper.detail_question_paper.totalQuestion = 0;
        let totalQuestionCount = 0
        this.selectedQuestionList.forEach(element => {
          this.questionCount.filter(x => {
            if (x.questionType === element.questionType[0]) {
              x.selectCount++;
              totalQuestionCount++;
            }
          })
        });
        this.getTotalScore();
        this.questionCount.forEach(element => {
          switch(element.questionType){
            case 'objectives':
              element['questionTypeValue']="Objective";
              break;
  
              case 'mcq':
              element['questionTypeValue']="MCQs";
              break;
  
              case 'fillInTheBlanks':
              element['questionTypeValue']="Fill In The Blanks";
              break;
  
              case 'twoColMtf':
              element['questionTypeValue']="2 Column Match The Following";
              break;
  
              case 'threeColMtf':
              element['questionTypeValue']="3 Column Match The Following";
              break;
  
              case '3colOptionLevelScoring':
              element['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
              break;
  
              case 'optionLevelScoring':
              element['questionTypeValue']="Option Level Scoring";
              break;
  
              case 'trueOrFalse':
              element['questionTypeValue']="True Or False";
              break;
  
              case 'NumericalRange':
              element['questionTypeValue']="Numerical value Range";
              break;
  
              case 'freeText':
              element['questionTypeValue']="Free Text";
              break;
  
              case 'comprehension':
                element['questionTypeValue']="Comprehension";
                element.questions?.forEach(ele => {
                  switch(ele.questionType){
                    case 'objectives':
                      ele['questionTypeValue']="Objective";
                      break;
  
                      case 'mcq':
                      ele['questionTypeValue']="MCQs";
                      break;
  
                      case 'fillInTheBlanks':
                      ele['questionTypeValue']="Fill In The Blanks";
                      break;
  
                      case 'twoColMtf':
                      ele['questionTypeValue']="2 Column Match The Following";
                      break;
  
                      case 'threeColMtf':
                      ele['questionTypeValue']="3 Column Match The Following";
                      break;
  
                      case '3colOptionLevelScoring':
                      ele['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
                      break;
  
                      case 'optionLevelScoring':
                      ele['questionTypeValue']="Option Level Scoring";
                      break;
  
                      case 'trueOrFalse':
                      ele['questionTypeValue']="True Or False";
                      break;
  
                      case 'NumericalRange':
                      ele['questionTypeValue']="Numerical value Range";
                      break;
  
                      case 'freeText':
                      ele['questionTypeValue']="Free Text";
                      break;
                  }
                });
                break;
          }
        });
        console.log("Total Score", this.totalScore)
        console.log(totalQuestionCount);
        this.questionPaper.detail_question_paper.totalQuestion = totalQuestionCount;
        if (this.selectedQuestionList && this.selectedQuestionList.length) {
          this.withoutAudioVideoSelectedQuestionList = this.selectedQuestionList.filter(v => v.questionType == 'text' || v.questionType == 'image')
        }
        this.cdr.detectChanges();
      })
    },500) 
    console.log('Change',element)
  
  }


  //to auto select question based on filter
  autogenerateQuestion() {
    // this.filterQuestion = true
    this.loaderService.show()
    //for validation flag
    this.fetchQuestionFlag = true;
    if (this.questionPaper.detail_question_paper.subject.length && this.questionPaper.detail_question_paper.board
      && this.questionPaper.detail_question_paper.syllabus && this.questionPaper.detail_question_paper.class
      && this.questionPaper.question_title && this.questionPaper.question_id) {
      this.autoGenerateQuestionFlag = true;
      this.requiredQuestionList = {};
      this.inputAutoQuestionCount = {};
      this.autoQuestionFlag = true;
      this.fetchQuestion('autoGenerateQuestion');
    } else {
      this.loaderService.hide();
      return;
    }
  }

  //get total number of question user want with type
  autoSelectQuestion(questionType, questionCount, requiredQuestionCount, i) {
    if (requiredQuestionCount > questionCount) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'It should be not grater than total question' })
      delete this.inputAutoQuestionCount[questionType]
      return;
    }
    else {
      this.requiredQuestionList[questionType] = requiredQuestionCount;
    }
    this.questionPaper.detail_question_paper.totalQuestion = 0
    for (let item of Object.keys(this.inputAutoQuestionCount)) {
      this.questionPaper.detail_question_paper.totalQuestion += this.inputAutoQuestionCount[item];
    }
    console.log(this.requiredQuestionList)
  }

  generateQuestionList(autoSelectQuestion?) {
    this.selectQuestion = false;
    this.filterQuestion = false;
    this.previewQuestion = true;
    if (autoSelectQuestion) {
      this.autoGenerateQuestionFlag = false;
      let autoSelectQuestionList: any = [];
      this.selectedQuestionList = [];
      //select randome question from question pool
      for (let item of Object.keys(this.requiredQuestionList)) {
        if (this.requiredQuestionList[item] == "" || this.requiredQuestionList[item] == null) {
          delete this.requiredQuestionList[item];
        } else {
          autoSelectQuestionList = this.getRandom(this.questionList.filter(x => x.questionType[0] === item), this.requiredQuestionList[item])
          if (autoSelectQuestionList) {
            autoSelectQuestionList.forEach((questions) => {
              this.selectedQuestionList.push(questions)
            });
          }
        }
      }
      this.getTotalScore();
    }
    if (this.selectedQuestionList && this.selectedQuestionList.length) {
      this.withoutAudioVideoSelectedQuestionList = this.selectedQuestionList.filter(v => v.questionType == 'text' || v.questionType == 'image')
    }
    this.selectedQuestionList.forEach(element => {
      switch(element.questionType[0]){
        case 'objectives':
          element['questionTypeValue']="Objective";
          break;

          case 'mcq':
          element['questionTypeValue']="MCQs";
          break;

          case 'fillInTheBlanks':
          element['questionTypeValue']="Fill In The Blanks";
          break;

          case 'twoColMtf':
          element['questionTypeValue']="2 Column Match The Following";
          break;

          case 'threeColMtf':
          element['questionTypeValue']="3 Column Match The Following";
          break;

          case '3colOptionLevelScoring':
          element['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
          break;

          case 'optionLevelScoring':
          element['questionTypeValue']="Option Level Scoring";
          break;

          case 'trueOrFalse':
          element['questionTypeValue']="True Or False";
          break;

          case 'NumericalRange':
          element['questionTypeValue']="Numerical value Range";
          break;

          case 'freeText':
          element['questionTypeValue']="Free Text";
          break;

          case 'comprehension':
            element['questionTypeValue']="Comprehension";
            element.questions.forEach(ele => {
              switch(ele.questionType[0]){
                case 'objectives':
                  ele['questionTypeValue']="Objective";
                  break;

                  case 'mcq':
                  ele['questionTypeValue']="MCQs";
                  break;

                  case 'fillInTheBlanks':
                  ele['questionTypeValue']="Fill In The Blanks";
                  break;

                  case 'twoColMtf':
                  ele['questionTypeValue']="2 Column Match The Following";
                  break;

                  case 'threeColMtf':
                  ele['questionTypeValue']="3 Column Match The Following";
                  break;

                  case '3colOptionLevelScoring':
                  ele['questionTypeValue']="Option Level Scoring - 3 Column Match The Following";
                  break;

                  case 'optionLevelScoring':
                  ele['questionTypeValue']="Option Level Scoring";
                  break;

                  case 'trueOrFalse':
                  ele['questionTypeValue']="True Or False";
                  break;

                  case 'NumericalRange':
                  ele['questionTypeValue']="Numerical value Range";
                  break;

                  case 'freeText':
                  ele['questionTypeValue']="Free Text";
                  break;
              }
            });
            break;
      }
    });
    console.log(this.selectedQuestionList)
  }

  getRandom(arr, n) {
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  backToSelectFilterQuestion(autoSelectQuestion?) {
    if (autoSelectQuestion) {
      this.autoGenerateQuestionFlag = true;
    } else {
      this.filterQuestion = true;
    }
     setTimeout(()=>{
      this.fetchQuestion();
    },4000) 
    this.selectQuestion = true;
    this.previewQuestion = false;
    this.getTotalScore();
    this.cdr.detectChanges();
  }
  addInstruction(i, queList) {
    console.log(queList)
    const modalRef = this.modalService.open(AddEditInstructionComponent, { size: 'lg' })
    modalRef.componentInstance.queList = queList;
    modalRef.result.then(result => {
      this.selectedQuestionList[i] = result; this.cdr.detectChanges();
    })
  }

  getTotalScore() {
    this.loaderService.show()
    this.totalScore = 0;
    this.selectedQuestionList.forEach(element => {
      this.totalScore += element.totalMarks;
      console.log('Total Marks or S',this.totalScore )
    });
    this.cdr.detectChanges();
    this.loaderService.hide();
  }

  submitAssessment() {
    

    console.log(this.selectedQuestionList.length)

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let coins = 0
    this.selectedQuestionList.forEach(element => {
      coins += element.totalMarks;
    });
    let questionListObj = []
    this.selectedQuestionList.forEach(element => {
      questionListObj.push({
        questionType: element.questionType,
        question: element.question,
        questions: (element.questions && element.questions.length)? element.questions : [],
        options: this.actualQuestionList.filter(x => x._id === element._id).map(x => x.options)[0],
        answer: this.actualQuestionList.filter(x => x._id === element._id).map(x => x.answer)[0],
        _id: element._id,
        duration: element.duration,
        negativeMarks: element.negativeMarks,
        negativeScore: element.negativeScore,
        optionsType: element.optionsType,
        totalMarks: element.totalMarks,
        instruction: element.instruction,
        sectionInstruction: element.sectionInstruction,
        questionCategory: element.questionCategoryName,
        learningOutcome: element.learningOutcomeName,
        difficultyLevel: element.difficultyLevel,
        matchOptions: {
          column1: element.matchOptions.column1,
          column2: element.matchOptions.column1,
          column3: element.matchOptions.column1,
        }
      })
    });
    if (this.questionPaperId) {
      console.log('Question Paper ID',this.questionPaperId)
      if (this.globalId) {
        
        console.log('ID',this.globalId)
        let questionPaperObj = {
          detail_question_paper: {
            chapters: this.questionPaper.detail_question_paper.chapters,
            subject: this.questionPaper.detail_question_paper.subject,
            topic: this.questionPaper.detail_question_paper.topic,
            studentType: this.questionPaper.detail_question_paper.studentType,
            examType: this.questionPaper.detail_question_paper.examType,
            learningOutcome: this.questionPaper.detail_question_paper.learningOutcome,
            questionCategory: this.questionPaper.detail_question_paper.questionCategory,
            board: this.questionPaper.detail_question_paper.board,
            class: this.questionPaper.detail_question_paper.class,
            syllabus: this.questionPaper.detail_question_paper.syllabus,
            totalQuestion: this.questionPaper.detail_question_paper.totalQuestion,
            language: this.questionPaper.detail_question_paper.language
          },
          createdAt: this.updateQuestionPaper.createdAt,
          updatedAt: new Date(),
          repository: [
            {
              id: this.globalId,
              repository_type: this.globalType
            }
          ],
          question_title: this.questionPaper.question_title,
          class_id: this.questionPaper.detail_question_paper.class,
          coin: coins,
          award: this.updateQuestionPaper.award,
          dueDate: this.updateQuestionPaper.dueDate,
          duration: this.questionPaper.duration,
          startDate: this.updateQuestionPaper.startDate,
          user_id: user.user_info[0]._id,
          question_id: this.questionPaper.question_id,
          AssignDate: this.updateQuestionPaper.AssignDate,
          section: [{
            question_list: questionListObj,
          }],
          createdBy: user.user_info[0].name,
          isGlobal: true,
          autoGeneratedQuestion: this.autoQuestionFlag ? true : false,
          autoGeneratedQuestionCount: this.requiredQuestionList
        }
        console.log('QuestionPaperObj',questionPaperObj)
        this.learningService.updateQuestionPaper(this.updateQuestionPaper._id, questionPaperObj).subscribe(
          (response) => {
            if (response) {
              Swal.fire('Updated', 'Question Paper Updated', 'success').then(function () {
              });
              // window.location.reload();
              // this.selectQuestion = true;
              // this.filterQuestion = false;
              // this.previewQuestion = false;
              // this.questionPaper = null;
              // this.ngOnInit();
              this.router.navigate(['view/questionpapers']);
              this.loaderService.hide();
            }
          }, error => {
            if (error.status == 400) {
              console.log('error => ', error)
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
              this.loaderService.hide();
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
              this.loaderService.hide();
            }
          }
        )

      } else {
        let questionPaperObj = {
          detail_question_paper: {
            chapters: this.questionPaper.detail_question_paper.chapters,
            subject: this.questionPaper.detail_question_paper.subject,
            topic: this.questionPaper.detail_question_paper.topic,
            studentType: this.questionPaper.detail_question_paper.studentType,
            examType: this.questionPaper.detail_question_paper.examType,
            learningOutcome: this.questionPaper.detail_question_paper.learningOutcome,
            questionCategory: this.questionPaper.detail_question_paper.questionCategory,
            board: this.questionPaper.detail_question_paper.board._id,
            class: this.questionPaper.detail_question_paper.class,
            syllabus: this.questionPaper.detail_question_paper.syllabus,
            totalQuestion: this.questionPaper.detail_question_paper.totalQuestion,
            language: this.questionPaper.detail_question_paper.language
          },
          createdAt: this.updateQuestionPaper.createdAt,
          updatedAt: new Date(),
          repository: [],
          question_title: this.questionPaper.question_title,
          class_id: this.questionPaper.detail_question_paper.class,
          coin: coins,
          award: this.updateQuestionPaper.award,
          dueDate: this.updateQuestionPaper.dueDate,
          duration: this.questionPaper.duration,
          startDate: this.updateQuestionPaper.startDate,
          user_id: user.user_info[0]._id,
          question_id: this.questionPaper.question_id,
          school_id: this.schoolId,
          AssignDate: this.updateQuestionPaper.AssignDate,
          section: [{
            question_list: questionListObj,
          }],
          createdBy: user.user_info[0].name,
          isGlobal: false,
          autoGeneratedQuestion: this.autoQuestionFlag ? true : false,
          autoGeneratedQuestionCount: this.requiredQuestionList
        }
        console.log('QuestionPaperObj',questionPaperObj)
        this.learningService.updateQuestionPaper(this.updateQuestionPaper._id, questionPaperObj).subscribe(
          (response) => {
            if (response) {
              Swal.fire('Updated', 'Question Paper Updated', 'success').then(function () {
              });
              // window.location.reload();
              // this.selectQuestion = true;
              // this.filterQuestion = false;
              // this.previewQuestion = false;
              // this.questionPaper = null;
              // this.ngOnInit();
              this.router.navigate(['view/questionpapers']);
              this.loaderService.hide();
            }
          }, error => {
            if (error.status == 400) {
              console.log('error => ', error)
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
              this.loaderService.hide();
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
              this.loaderService.hide();
            }
          }
        )
      }
    } else {
      if (this.globalId) {
        console.log('ID2',this.globalId)
        console.log('QP',this.questionPaper)
        let questionPaperObj = {
          detail_question_paper: {
            chapters: this.questionPaper.detail_question_paper.chapters,
            subject: this.questionPaper.detail_question_paper.subject,
            topic: this.questionPaper.detail_question_paper.topic,
            studentType: this.questionPaper.detail_question_paper.studentType,
            examType: this.questionPaper.detail_question_paper.examType,
            learningOutcome: this.questionPaper.detail_question_paper.learningOutcome,
            questionCategory: this.questionPaper.detail_question_paper.questionCategory,
            board: this.questionPaper.detail_question_paper.board[0],
            class: this.questionPaper.detail_question_paper.class,
            syllabus: this.questionPaper.detail_question_paper.syllabus,
            totalQuestion: this.questionPaper.detail_question_paper.totalQuestion,
            language: this.questionPaper.detail_question_paper.language
          },
          createdAt: new Date(),
          updatedAt: "",
          repository: [
            {
              id: this.globalId,
              repository_type: this.globalType
            }
          ],
          question_title: this.questionPaper.question_title,
          class_id: this.questionPaper.detail_question_paper.class,
          coin: coins,
          award: "",
          dueDate: "",
          duration: this.questionPaper.duration,
          startDate: "",
          user_id: user.user_info[0]._id,
          question_id: this.questionPaper.question_id,
          AssignDate: "",
          section: [{
            question_list: questionListObj,
          }],
          createdBy: user.user_info[0].name,
          isGlobal: true,
          autoGeneratedQuestion: this.autoQuestionFlag ? true : false,
          autoGeneratedQuestionCount: this.requiredQuestionList
        }
        console.log('Question Paper Obj3',questionPaperObj)
        this.learningService.createQuestionPaperGlobally(this.globalId, questionPaperObj).subscribe(
          (response) => {
            if (response) {
              Swal.fire('Created', 'Question Paper Created', 'success').then(function () {
              });
              // window.location.reload();
              // this.selectQuestion = true;
              // this.filterQuestion = false;
              // this.previewQuestion = false;
              // this.questionPaper = null;
              // this.ngOnInit();
              this.router.navigate(['view/questionpapers']);
              this.loaderService.hide();
            }
          }, error => {
            if (error.status == 400) {
              console.log('error => ', error)
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
              this.loaderService.hide();
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
              this.loaderService.hide();
            }
          }
        )

      } else {
        let questionPaperObj = {
          detail_question_paper: {
            chapters: this.questionPaper.detail_question_paper.chapters,
            subject: this.questionPaper.detail_question_paper.subject,
            topic: this.questionPaper.detail_question_paper.topic,
            studentType: this.questionPaper.detail_question_paper.studentType,
            examType: this.questionPaper.detail_question_paper.examType,
            learningOutcome: this.questionPaper.detail_question_paper.learningOutcome,
            questionCategory: this.questionPaper.detail_question_paper.questionCategory,
            board: this.questionPaper.detail_question_paper.board._id,
            class: this.questionPaper.detail_question_paper.class,
            syllabus: this.questionPaper.detail_question_paper.syllabus,
            totalQuestion: this.questionPaper.detail_question_paper.totalQuestion,
            language: this.questionPaper.detail_question_paper.language
          },
          createdAt: new Date(),
          updatedAt: "",
          repository: [],
          question_title: this.questionPaper.question_title,
          class_id: this.questionPaper.detail_question_paper.class,
          coin: coins,
          award: "",
          dueDate: "",
          duration: this.questionPaper.duration,
          startDate: "",
          user_id: user.user_info[0]._id,
          question_id: this.questionPaper.question_id,
          school_id: this.schoolId,
          AssignDate: "",
          section: [{
            question_list: questionListObj,
          }],
          createdBy: user.user_info[0].name,
          isGlobal: false,
          autoGeneratedQuestion: this.autoQuestionFlag ? true : false,
          autoGeneratedQuestionCount: this.requiredQuestionList
        }
        console.log('QuestionPaperObj',questionPaperObj)
        
        this.learningService.createQuestionPaper(questionPaperObj).subscribe(
          (response) => {
            if (response) {
              Swal.fire('Created', 'Question Paper Created', 'success').then(function () {
              });
              // window.location.reload();
              // this.selectQuestion = true;
              // this.filterQuestion = false;
              // this.previewQuestion = false;
              // this.questionPaper = null;
              // this.ngOnInit();
              this.router.navigate(['view/questionpapers'])
              this.loaderService.hide();
            }
          }, error => {
            if (error.status == 400) {
              console.log('error => ', error)
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
              this.loaderService.hide();
            } else {
              Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
              this.loaderService.hide();
            }
          }
        )
      }
    }

  }


  public download(): void {
    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create([
      experiences,
      education,
      skills,
      achievements
    ]);

    Packer.toBlob(doc).then(blob => {
      console.log(blob);
      saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });
  }


  Export2Doc(element, filename) {
    
    console.log(element)
    let preHtml
    let postHtml
    let html
    let audioVideoSelectedQuestion = []
    if (this.selectedQuestionList && this.selectedQuestionList.length) {
      audioVideoSelectedQuestion = this.selectedQuestionList.filter(v => v.optionsType !== 'video' || v.optionsType !== "audio")
    }
    if (audioVideoSelectedQuestion.length) {
      const modalRef = this.modalService.open(PrintConfirmationComponent, { size: 'sm' })
      modalRef.componentInstance.totalQuestion = audioVideoSelectedQuestion.length;
      modalRef.result.then(result => {
        if (result === 'yes') {
          console.log("yessss")
          let cssProperty: HTMLElement = document.getElementById(element)
          cssProperty.setAttribute("style", 'mso-border-alt:basic-black-dashes;')
          preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title><style>@import 'https://gist.github.com/p3t3r67x0/ac9d052595b406d5a5c1.js'; .b-cls{mso-border-alt:basic-black-dashes; mso-border-between-width:thick;} img{height:50px;width:50px}</style></head><body>";

          postHtml = "</body></html>";
          html = preHtml + document.getElementById(element).innerHTML + postHtml;
          var css = (
            '<style>' +
            'img{height:50px;width:50px}'+
            '@page contentToPrint{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
            'div.contentToPrint {page: contentToPrint;}' +
            '</style>'
          )
          var blob = new Blob(['\ufeff', css + html], {
            type: 'application/msword'
          });

          var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)

          filename = filename ? filename + '.doc' : 'document.doc';

          var downloadLink = document.createElement("a");

          document.body.appendChild(downloadLink);
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
          } else {
            // Create a link to the file
            downloadLink.href = url;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
          }

          document.body.removeChild(downloadLink);
        } else {
          // console.log("nooo")
          // let cssProperty: HTMLElement = document.getElementById('contentToPrintWithoutVideoAudio')
          // cssProperty.setAttribute("style", 'mso-border-alt:basic-black-dashes;')
          // preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title><style>@import 'https://gist.github.com/p3t3r67x0/ac9d052595b406d5a5c1.js'; .b-cls{mso-border-alt:basic-black-dashes; mso-border-between-width:thick;}</style></head><body>";

          // postHtml = "</body></html>";
          // html = preHtml + document.getElementById('contentToPrintWithoutVideoAudio').innerHTML + postHtml;
          // var css = (
          //   '<style>' +
          //   '@page contentToPrint{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
          //   'div.contentToPrint {page: contentToPrint;}' +
          //   '</style>'
          // )
          // var blob = new Blob(['\ufeff', css + html], {
          //   type: 'application/msword'
          // });

          // var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html)

          // filename = filename ? filename + '.doc' : 'document.doc';

          // var downloadLink = document.createElement("a");

          // document.body.appendChild(downloadLink);
          // if (navigator.msSaveOrOpenBlob) {
          //   navigator.msSaveOrOpenBlob(blob, filename);
          // } else {
          //   // Create a link to the file
          //   downloadLink.href = url;

          //   // Setting the file name
          //   downloadLink.download = filename;

          //   //triggering the function
          //   downloadLink.click();
          // }

          // document.body.removeChild(downloadLink);
        }
      })
    }

    


  }

  removeNewLine(value: any) {
    // this.removeTags(value);
    // value.replace(/<[^>]+>/g, '')
    if (value) {
      return this.removeTags(value).replace(/</g, "&lt;")
    }
  }

  removeTags(str) {
    if (!str)
      return false;
    else
      str = str.toString();
    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/ig, '');
  }



 

}
