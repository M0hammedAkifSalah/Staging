import { element } from 'protractor';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { LearningService } from '../services/learning.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import * as Papa from 'papaparse';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportFromGlobalComponent } from '../import-from-global/import-from-global.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LoadingService } from '../../../loader/loading/loading.service';
import { ImportModalComponent } from './import-modal/import-modal.component';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { CreateservicesService } from '../../create/services/createservices.service';


@Component({
  selector: 'kt-allquestions',
  templateUrl: './allquestions.component.html',
  styleUrls: ['./allquestions.component.scss']
})
export class AllquestionsComponent implements OnInit {
  isOwner: boolean;

  constructor(public apiService: LearningService, private cdr: ChangeDetectorRef, private modalService: NgbModal,private createApiServices: CreateservicesService,
    private router: Router, private loadingService: LoadingService, private loaderService: LoadingService) { }
  questions: any;
  displayedColumns: string[] = ['questionCount','questionPreview', 'class','board','subject', 'questionType', 'topic', 'action'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  resultLength: any;
  pageSize: any = 5;
  pageIndex: any = 1;
  pageEvent: PageEvent;
  schoolId: any;
  filterValue: any = '';
  questionCSV = [];
  csvClass = [];
  csvClassName = [];
  csvBoardId = [];
  csvBoardName = [];
  csvSyllabusId = [];
  csvSyllabusName = [];
  csvSubjectId = [];
  csvSubjectName = [];
  csvChapterId = [];
  csvChapterName = [];
  csvTopicId = [];
  csvTopicName = [];
  csvLearningOutcomeId = [];
  csvLearningOutcomeName = [];
  filterData = {
    searchValue: this.filterValue,
    filterKeysArray: ['question','question_count'],
  }

  globalId;
  Subjects = [];
  topics = [];
  classes = [];
  Chapters = [];
  boards = [];
  syllabuses = [];
  queTypes = [
    { name: "Objectives", _id: "objectives" },
    { name: "MCQs", _id: "mcq" },
    { name: "Fill In The Blanks", _id: "fillInTheBlanks" },
    { name: "2 Column Match The Following", _id: "twoColMtf" },
    { name: "3 Column Match The Following", _id: "threeColMtf" },
    {
      name: "Option Level Scoring - 3 Column Match The Following",
      _id: "3colOptionLevelScoring",
    },
    // { 'name': 'Sequencing Question', '_id': 'sequencingQuestion' },
    { name: "Option Level Scoring", _id: "optionLevelScoring" },
    // { 'name': 'Sentence Sequencing', '_id': 'sentenceSequencing' },
    { name: "True Or False", _id: "trueOrFalse" },
    { name: "Numerical value Range", _id: "NumericalRange" },
    // { 'name': 'Sorting', '_id': 'sorting' },
    { name: "Free Text", _id: "freeText" },
    { name: "Comprehension", _id: "comprehension" },
  ]

  attemptType: any[] = [
    { name: "Practice", value: "practice" },
    { name: "Test", value: "test" },
    { name: "Practice & Test", value: "practiceTest" },
  ];
  difficultyLevelArray: Array<object> = [
    { name: "Very Easy", value: "veryEasy", checked: "false" },
    { name: "Easy", value: "easy", checked: "false" },
    { name: "Intermediate", value: "intermediate", checked: "false" },
    { name: "Hard", value: "hard", checked: "false" },
    { name: "Very Hard", value: "veryHard", checked: "false" },
  ];

  filterOptins = {
    practiceAndTestQuestion: null,
    difficultyLevel: null,
    class: null,
    subject: null,
    topic: null,
    questionType: null,
    questionCount: null,
    chapter:null,
    board: null,
    syllabus: null
  }

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Question List :',
    useBom: true,
    noDownload: false,
    headers: ["classId", "className", "boardId", "boardName", "syllabusId", "syllabusName", "subjectId", "subjectName", "chapterId", "chapterName", "topicId", "topicName", "learning outcome id", "learning outcome name"]
  };


  async ngOnInit() {
   /*  var val = eval('<p>&nbsp; &nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><munderover><mo>&#8721;</mo><mn>4</mn><mn>4</mn></munderover></math><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msqrt><mn>53</mn></msqrt></math><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msqrt><mn>5</mn><mo>&#160;</mo><mo>&#160;</mo><msup><mn>54</mn><mn>4</mn></msup></msqrt></math></p>');
            console.log('val',val); */
    this.loadingService.show();
    await this.getAdmin();

    // this.getAllTopics();
    // this.getClasses();
    // this.getChapters();

    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    if (!this.isOwner) {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.schoolId = user.user_info[0].repository[0].id
      } else {
        this.schoolId = user.user_info[0]._id
      }
      // this.schoolId = user.user_info[0]._id;
      this.getAllQuestionAtGlobal();
      this.getCSVData();
    } else {

      this.schoolId = user.user_info[0].school_id;
      this.getAllQuestion();
    }
    this.filterData['repository.id'] = this.schoolId;

    this.loadingService.hide();
  }

  getSyllabus() {
    this.apiService.getSyllabus().subscribe((response: any) => {
      this.syllabuses = response.body.data;
    });
  }

  getBoards(){
    this.apiService.getBoards().subscribe((response: any) => {
      this.boards = response.body.data;
    });
  }

  getChapters() {

    this.apiService.getChapters().subscribe((response: any) => {
      this.Chapters = response.body.data;
    });
  }

  getClasses() {
    if(this.isOwner){
      this.loaderService.show();
    this.apiService.getallinstitute(this.schoolId).subscribe((data: any) => {
      this.classes = data.body.data[0].classList.map(m => ({_id: m.classId, name: m.className}));
      this.cdr.detectChanges();
      this.loaderService.hide();
    }
      , error => {
        this.loaderService.hide();
      })
    }else{
    this.apiService.getClasses().subscribe((response: any) => {
      this.classes = response.body.data;
    });
  }
  }

  getSubjects() {
    this.apiService.getSubjects().subscribe((response: any) => {
      this.Subjects = response.body.data;
    })
  }

  getAllTopics() {
    this.loaderService.show();
    this.apiService.getTopics().subscribe((response: any) => {
      if (response && response.body) {
        // this.resultLength = response.body.result;
        this.apiService.getTopicByPagination(this.schoolId, this.pageIndex, this.pageSize, this.filterData).subscribe((response: any) => {
          // then you can assign data to your dataSource like so
          if (response && response.body && response.body.data && response.body.data.length) {
            
            this.topics = response.body.data;
            console.log('Topics',this.topics)
          }
          this.loaderService.hide();
        })
      }
      this.cdr.detectChanges();
    })
  }

  getChpterAndSetSubjectGlobal() {
    this.loaderService.show();
    let obj = {}
    if (this.isOwner) {
      obj = {
        class_id: this.filterOptins.class,
        board_id: this.filterOptins.board,
        syllabus_id: this.filterOptins.syllabus,
        subject_id: this.filterOptins.subject,
        "repository.id": this.schoolId
      }
    } else {
      let boardListArray = [];
      let syllabusListArray = [];
      // boardListArray[0] = this.filterOptins.board;
      // syllabusListArray[0] = this.filterOptins.syllabus;
      obj = {
        class_id: this.filterOptins.class,
        board_id: this.filterOptins.board,
        syllabus_id: this.filterOptins.syllabus,
        subject_id: this.filterOptins.subject,
        "repository.id": this.globalId
      }
    }

    this.apiService.getChaptersBySubjectGlobalFilter(obj).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.Chapters = response.body.data;
          this.loaderService.hide();
          this.cdr.detectChanges();
        }
        this.loaderService.hide();
      },
      error => {
        this.loaderService.hide();
      }
    )
  }

  getTopicAndSetChapterGlobal() {
    this.loaderService.show();

    let obj;
    if (this.isOwner) {
      obj = {
        class_id: this.filterOptins.class,
        board_id: this.filterOptins.board,
        syllabus_id: this.filterOptins.syllabus,
        subject_id: this.filterOptins.subject,
        "repository.id": this.schoolId,
        chapter_id: this.filterOptins.chapter,
      }
    } else {
      let boardListArray = [];
      let syllabusListArray = [];
      // boardListArray[0] = this.filterOptins.board;
      // syllabusListArray[0] = this.filterOptins.syllabus;
      obj = {
        class_id: this.filterOptins.class,
        board_id: this.filterOptins.board,
        syllabus_id: this.filterOptins.syllabus,
        subject_id: this.filterOptins.subject,
        "repository.id": this.globalId,
        chapter_id: this.filterOptins.chapter,
      }
    }
    this.apiService.getTopicsByChapterGlobalFilter(obj).subscribe(
      (response: any) => {
        if (
          response &&
          response.body &&
          response.body.data &&
          response.body.data.length
        ) {
          this.topics = response.body.data;
          console.log('Topics',this.topics)
          this.cdr.detectChanges();
        }
      },
      (error) => {
        this.loaderService.hide();
      }
    );

  }

  classChanged(){
    if(this.isOwner){
      this.boards = [];
      this.syllabuses = [];
      this.Subjects = [];
      this.filterOptins.board = null;
      this.filterOptins.syllabus = null;
      this.filterOptins.subject = null;
      this.loaderService.show();
    this.createApiServices.getBoardByClassId(this.filterOptins.class).subscribe(
      (response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.filterOptins.board = response.body.data[0]._id
          this.boards = response.body.data;

          this.loaderService.show();
          this.createApiServices.getSyllabusByClassId(this.filterOptins.class, this.filterOptins.board).subscribe(
            (response: any) => {
              if (response && response.body && response.body.data && response.body.data.length) {
                this.filterOptins.syllabus = response.body.data[0]._id
                this.syllabuses = response.body.data;

                this.loaderService.show();
                this.createApiServices.getSubjectsByClassId(this.filterOptins.class, this.filterOptins.board, this.filterOptins.syllabus).subscribe(
                  (response: any) => {
                    if (response && response.body && response.body.data && response.body.data.length) {
                      this.Subjects = response.body.data;
                      this.loaderService.hide();
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
        }
        this.loaderService.hide();
      },
      error => {
        this.loaderService.hide();
      }
    )
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCSVData() {
    this.loaderService.show();
    this.apiService.getQuestionCsvData().subscribe(
      (response: any) => {
        if (response && response.data && response.data.data && response.data.data.length) {
          let questionDataList = [];
          questionDataList = response.data.data;
          for (let i = 0; i < questionDataList.length; i++) {
            this.csvClass[i] = questionDataList[i].classId;
            this.csvClassName[i] = questionDataList[i].className;
            this.csvBoardId[i] = questionDataList[i].boardId;
            this.csvBoardName[i] = questionDataList[i].boardName;
            this.csvSyllabusId[i] = questionDataList[i].syllabusId;
            this.csvSyllabusName[i] = questionDataList[i].syllabusName;
            this.csvSubjectId[i] = questionDataList[i].subjectId;
            this.csvSubjectName[i] = questionDataList[i].subjectName;
            this.csvChapterId[i] = questionDataList[i].chapterId;
            this.csvChapterName[i] = questionDataList[i].chapterName;
            this.csvTopicId[i] = questionDataList[i].topicId;
            this.csvTopicName[i] = questionDataList[i].topicName;
            this.csvLearningOutcomeId[i] = questionDataList[i].learningOutcomeId;
            this.csvLearningOutcomeName[i] = questionDataList[i].learningOutcome;
            this.questionCSV[i] = [this.csvClass[i], this.csvClassName[i], this.csvBoardId[i], this.csvBoardName[i], this.csvSyllabusId[i],
            this.csvSyllabusName[i], this.csvSubjectId[i], this.csvSubjectName[i], this.csvChapterId[i], this.csvChapterName[i], this.csvTopicId[i],
            this.csvTopicName[i], this.csvLearningOutcomeId[i], this.csvLearningOutcomeName[i]]
          }
          this.loaderService.hide();
        } else {
          this.loaderService.hide();
        }
      }, error => {
        this.loaderService.hide();
      }
    )
  }

  getAdmin() {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);

    if (user.user_info[0].school_id) {
      this.schoolId = localStorage.getItem('schoolId');
    } else {
      if (user.user_info[0].repository && user.user_info[0].repository.length) {
        this.globalId = user.user_info[0].repository[0].id
      } else {
        this.globalId = user.user_info[0]._id
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

    this.getClasses();
    if(!this.isOwner){
      this.getSubjects();
      this.getBoards();
      this.getSyllabus();
    }
  }

  onPageFired(event) {
    this.loaderService.show();
    if (!this.isOwner) {
      this.resultLength = 0
      this.dataSource = [] as any
      this.apiService.getAllGlobalQuestionByPagination(this.schoolId, (event.pageIndex + 1), event.pageSize, this.filterData).subscribe((response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.dataSource = this.formateQuestionType(response.body.data);
          console.log(this.dataSource)
          this.resultLength = response.body.recordCount
          this.loaderService.hide();
        }

      },
        error => {
          this.loaderService.hide()
        })
    } else {
      this.resultLength = 0
      this.dataSource = [] as any;
      this.apiService.getAllQuestionByPagination(this.schoolId, (event.pageIndex + 1), event.pageSize, this.filterData).subscribe((response: any) => {
        if (response && response.body && response.body.data && response.body.data.length) {
          this.dataSource = this.formateQuestionType(response.body.data);
          console.log(this.dataSource)
          this.resultLength = response.body.recordCount
          this.loaderService.hide();
        }
      }, error => {
        this.loaderService.hide()
      }
      )
    }

  }
  getAllQuestion() {
    // this.apiService.getAllQuestionCount(this.filterData).subscribe((response: any) => {
    //   console.log(response);
    //   if (response && response.body) {
        this.resultLength = 0;
        this.dataSource = [] as any;
        this.apiService.getAllQuestionByPagination(this.schoolId, this.pageIndex, this.pageSize, this.filterData).subscribe((response: any) => {
          if (response && response.body && response.body.data && response.body.data.length) {
            this.dataSource = this.formateQuestionType(response.body.data);
            console.log(this.dataSource)
            this.resultLength = response.body.recordCount
            this.loaderService.hide();
          }
          this.loaderService.hide();
        }, error => {
          this.loaderService.hide()
        })
        // this.questions = response.body.data;
        // this.dataSource.data = this.questions;
        this.cdr.detectChanges();
      // }
    // })
  }

  formateQuestionType(data) {
    data.forEach(element => {
      switch (element.questionType[0]) {
        case 'objectives':
          element.questionType[0] = "Objectives";
          break;
        case 'fillInTheBlanks':
          element.questionType[0] = "Fill in the blanks";
          break;
        case 'mcq':
          element.questionType[0] = "MCQ";
          break;
        case 'twoColMtf':
          element.questionType[0] = "2 Column Match The Following";
          break;
        case 'threeColMtf':
          element.questionType[0] = "3 Column Match The Following";
          break;
        case '3colOptionLevelScoring':
          element.questionType[0] = "Option Level Scoring - 3 Column Match The Following";
          break;
        case 'sequencingQuestion':
          element.questionType[0] = "Sequencing Question";
          break;
        case 'optionLevelScoring':
          element.questionType[0] = "Option Level Scoring";
          break;
        case 'trueOrFalse':
          element.questionType[0] = "True Or False";
          break;
      }
    });
    return data;
  }

  getAllQuestionAtGlobal() {
    // this.apiService.getAllQuestionGlobalUserCount(this.filterData).subscribe((response: any) => {
    //   console.log(response);
    //   if (response && response.body) {
    //     this.resultLength = response.body.result;
        this.resultLength = 0;
        this.dataSource = [] as any;
        this.apiService.getAllGlobalQuestionByPagination(this.schoolId, this.pageIndex, this.pageSize, this.filterData).subscribe((response: any) => {
          if (response && response.body && response.body.data && response.body.data.length) {
            this.dataSource = this.formateQuestionType(response.body.data);
            console.log( 'Questions',this.dataSource)
            this.resultLength = response.body.recordCount
            this.loaderService.hide();
          }
          this.loaderService.hide();
        },
          error => {
            this.loaderService.hide();
          })
        // this.questions = response.body.data;
        // this.dataSource.data = this.questions;
        this.cdr.detectChanges();
    //   }
    // }, error => {
    //   this.loaderService.hide();
    // })
  }
  // openQuestion
  openQuestion(id) {
    /* Swal.fire(
      'View Question',
      'Comming Soon...',
      'question'
    ) */
    this.router.navigate(['view/question/', id])
    // window.open(`/view/questionpaper/${id}`)
  }

  deleteQuestion(row) {
    this.loaderService.show();
    let data = {
      questionId: row._id,
      repositoryId: this.schoolId,
      isGlobal: this.isOwner ? false : true
    }
    this.apiService.deleteQuestions(data).subscribe((res) => {
      if (this.isOwner) {
        this.getAllQuestion();
        this.loaderService.hide()
      } else {
        this.getAllQuestionAtGlobal();
        this.loaderService.hide();
      }
    }, err => {
      this.loaderService.hide();
      Swal.fire({ icon: 'error', title: 'Error', text: err.error.message });
    })
  }

  applyFilter(event: Event) {
    const filterValuee = (event.target as HTMLInputElement).value;
    this.filterData['searchValue'] = filterValuee
    this.filterData['repository.id'] = this.schoolId;
    if (!this.isOwner) {
      // this.apiService.getAllQuestionGlobalUserCount({...this.filterData}).subscribe((response: any) => {
      //   console.log(response);
      //   if (response && response.body) {
      //     this.resultLength = response.body.result;
          this.dataSource = [] as any;
          this.resultLength = 0
          this.apiService.getAllGlobalQuestionByPagination(this.schoolId, this.pageIndex, this.pageSize, {...this.filterData}).subscribe((response: any) => {
            if (response && response.body && response.body.data && response.body.data.length) {
              this.dataSource = this.formateQuestionType(response.body.data);
              console.log( 'Questions',this.dataSource)
              this.resultLength = response.body.recordCount
              this.loaderService.hide();
            }
            this.loaderService.hide();
          },
            error => {
              this.loaderService.hide();
            })
          // this.questions = response.body.data;
          // this.dataSource.data = this.questions;
          this.cdr.detectChanges();
      //   }
      // }, error => {
      //   this.loaderService.hide();
      // })
    } else {
      // this.apiService.getAllQuestionCount({...this.filterData}).subscribe((response: any) => {
      //   console.log(response);
      //   if (response && response.body) {
      //     this.resultLength = response.body.result;
          this.dataSource = [] as any;
          this.resultLength = 0
          this.apiService.getAllQuestionByPagination(this.schoolId, this.pageIndex, this.pageSize, {...this.filterData}).subscribe((response: any) => {
            if (response && response.body && response.body.data && response.body.data.length) {
              this.dataSource = this.formateQuestionType(response.body.data);
              console.log(this.dataSource)
              this.resultLength = response.body.recordCount
              this.loaderService.hide();
            }
            this.loaderService.hide();
          }, error => {
            this.loaderService.hide()
          })
          // this.questions = response.body.data;
          // this.dataSource.data = this.questions;
          this.cdr.detectChanges();
      //   }
      // })
    }
    this.dataSource.filter = filterValuee.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterChanged(event){

    for(let [key, value] of Object.entries(this.filterOptins)){
      if(!value || !value.length){
        delete this.filterData[key];
      }else{
        this.filterData[key] = value;
      }
    }

    if (!this.isOwner) {
      // this.apiService.getAllQuestionGlobalUserCount({...this.filterData}).subscribe((response: any) => {
      //   console.log(response);
      //   if (response && response.body) {
      //     this.resultLength = response.body.result;
          this.dataSource = [] as any;
          this.resultLength = 0
          this.apiService.getAllGlobalQuestionByPagination(this.schoolId, this.pageIndex, this.pageSize, {...this.filterData}).subscribe((response: any) => {
            if (response && response.body && response.body.data && response.body.data.length) {
              this.dataSource = this.formateQuestionType(response.body.data);
              console.log(this.dataSource)
              this.resultLength = response.body.recordCount
              this.loaderService.hide();
            }
            this.loaderService.hide();
          },
            error => {
              this.loaderService.hide();
            })
          this.cdr.detectChanges();
      //   }
      // }, error => {
      //   this.loaderService.hide();
      // })
    } else {
      // this.apiService.getAllQuestionCount({...this.filterData}).subscribe((response: any) => {
      //   console.log(response);
      //   if (response && response.body) {
      //     this.resultLength = response.body.result;
          this.dataSource = [] as any;
          this.resultLength = 0
          this.apiService.getAllQuestionByPagination(this.schoolId, this.pageIndex, this.pageSize, {...this.filterData}).subscribe((response: any) => {
            if (response && response.body && response.body.data && response.body.data.length) {
              this.dataSource = this.formateQuestionType(response.body.data);
              console.log(this.dataSource)
              this.resultLength = response.body.recordCount
              this.loaderService.hide();
            }
            this.loaderService.hide();
          }, error => {
            this.loaderService.hide()
          })
          this.cdr.detectChanges();
      //   }
      // })
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  import() {
    // this.apiService.allQuestions = this.questions;
    // const modalRef = this.modalService.open(ImportFromGlobalComponent, { size: 'xl' });
    // modalRef.componentInstance.type = "All Questions";

    // const modalRef = this.modalService.open(ImportModalComponent,{size:'xl'});
    this.router.navigate(['view/questions/import']);
  }
  bulkUpload() {
    this.router.navigate(['view/questions/bulk-upload']);
  }

  getColumnData(columnData, col, answer?, learning?, optional?) {
    let typeValue = [
      { number: 0, small: 'a', capital: 'A' },
      { number: 1, small: 'b', capital: 'B' },
      { number: 2, small: 'c', capital: 'C' },
      { number: 3, small: 'd', capital: 'D' },
      { number: 4, small: 'e', capital: 'E' },
      { number: 5, small: 'f', capital: 'F' },
      { number: 6, small: 'g', capital: 'G' },
      { number: 7, small: 'h', capital: 'H' },
      { number: 8, small: 'i', capital: 'I' },
      { number: 9, small: 'j', capital: 'J' },
      { number: 10, small: 'k', capital: 'K' },
      { number: 11, small: 'l', capital: 'L' },
      { number: 12, small: 'm', capital: 'M' },
      { number: 13, small: 'n', capital: 'N' },
      { number: 14, small: 'o', capital: 'O' },
      { number: 15, small: 'p', capital: 'P' },
      { number: 16, small: 'q', capital: 'Q' },
      { number: 17, small: 'r', capital: 'R' },
      { number: 18, small: 's', capital: 'S' },
      { number: 19, small: 't', capital: 'T' },
      { number: 20, small: 'u', capital: 'U' },
      { number: 21, small: 'v', capital: 'V' },
      { number: 22, small: 'w', capital: 'W' },
      { number: 23, small: 'x', capital: 'X' },
      { number: 24, small: 'y', capital: 'Y' },
      { number: 25, small: 'z', capital: 'Z' },
    ]
    let value = [];
    let splitColumn = (columnData).split(",")
    splitColumn.forEach((element, i) => {

      switch (col) {
        case 'col1':
          value.push({
            "type": typeValue[i].number,
            "value": element,
            "file_text": ""
          })
          break;
        case 'col2':
          value.push({
            "type": typeValue[i].capital,
            "value": element,
            "file_text": ""
          })
          break;
        case 'col3':
          value.push({
            "type": typeValue[i].small,
            "value": element,
            "file_text": ""
          })
          break;
        case 'learning':
          value.push(element);
          break;

        case 'optional':
          value.push({
            "value": element,
            "file_text": "",
            'isDisable': true,
            'score': 0
          })
          break;
        case 'answer':
          value.push({
            "value": element,
            "file_text": ""
          })
          break;
      }
    });
    return value;
  }
  bulkUploadQuestion(files: File[]) {
    let userInfo = localStorage.getItem('info');
    let user = JSON.parse(userInfo);
    let id = ""
    let repository_type = ''
    let createdBy = user.user_info[0].name ? user.user_info[0].name : ''
    if (user.user_info[0].repository && user.user_info[0].repository.length) {
      id = user.user_info[0].repository[0].id,
        repository_type = 'Global'
    } else {
      id = user.user_info[0]._id,
        repository_type = 'Global'
    }
    let counter = 0;
    let resultLengthData;
    if (files[0]) {
      Papa.parse(files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result, file) => {


          resultLengthData = result.data.length;
          for (let i = 0; i < result.data.length; i++) {
            let column1 = [];
            let column2 = [];
            let column3 = [];
            let answers = [];
            let options = [];
            let boards = [];
            let syllabus = [];
            let subject = [];
            let chapters = [];
            let topics = [];
            let learningOutcome = [];
            let optionLevelScoring: any = []
            let optionHeader = ['option1', 'option2', 'option3', 'option4', 'option5',
              'option6', 'option7', 'option8', 'option9', 'option10']
            let questionType = result.data[i].QuestionType

            if (result.data[i].optionalLevelScoring) {
              optionLevelScoring = this.getColumnData(result.data[i].optionalLevelScoring, 'learning')
            }

            if (result.data[i].column1) {
              column1 = this.getColumnData(result.data[i].column1, 'col1')
            }
            if (result.data[i].column2) {
              column2 = this.getColumnData(result.data[i].column2, 'col2')
            }
            if (result.data[i].column3) {
              column3 = this.getColumnData(result.data[i].column3, 'col3')
              answers.forEach(element => {
                delete element.file_text
              });
            }

            if (result.data[i].Board) {
              boards = this.getColumnData(result.data[i].Board, 'learning')
            }
            if (result.data[i].Syllabus) {
              syllabus = this.getColumnData(result.data[i].Syllabus, 'learning')
            } subject = this.getColumnData(result.data[i].Subject, 'learning')

            if (result.data[i].Chapter) {
              chapters = this.getColumnData(result.data[i].Chapter, 'learning')
            }
            if (result.data[i].Topics) {
              topics = this.getColumnData(result.data[i].Topics, 'learning')
            }
            if (result.data[i].LearningOutcome) {
              learningOutcome = this.getColumnData(result.data[i].LearningOutcome, 'learning')
            }
            const optioneArray = [];
            optionHeader.forEach(element => {
              if (result.data[i][element]) {
                optioneArray.push(result.data[i][element]);
                let optionObj = {
                  'value': result.data[i][element],
                  "file_text": ''
                };
                if (questionType == 'optionLevelScoring' || questionType == '3colOptionLevelScoring') {
                  const score = optionLevelScoring && optionLevelScoring.length ? optionLevelScoring[i] ? optionLevelScoring[i] : 0 : 0;
                  optionObj['score'] = score;
                  optionObj['isDisable'] = score ? 'false' : true;
                }
                options.push(optionObj)
              }
            })
            if (result.data[i].Answer) {
              let answerKey = result.data[i].Answer;
              answerKey = answerKey.split(",");
              for (const ans of answerKey) {
                const answer = optioneArray[ans - 1]
                if (questionType == 'optionLevelScoring' || questionType == '3colOptionLevelScoring') {
                  answers.push({
                    "value": answer,
                    "file_text": "",
                    'isDisable': true,
                    'score': 0
                  })
                }
                else {
                  answers.push({
                    "value": answer,
                    "file_text": ""
                  })
                };
                // answers = answers.concat(this.getColumnData(answer, answerType))
              }
            }
            const questionData = {
              "board": boards,
              "class": result.data[i].Class,
              "syllabus": syllabus,
              "subject": result.data[i].Subject,
              "chapter": chapters,
              "topic": topics,
              "learningOutcome": learningOutcome,
              "questionCategory": result.data[i].questionCategory,
              "examType": result.data[i].ExamType,
              "questionType": result.data[i].QuestionType,
              "practiceAndTestQuestion": result.data[i].PracticeTestQuestion,
              "studentType": result.data[i].StudentType,
              "difficultyLevel": result.data[i].DifficultyLevel,
              "language": result.data[i].Language,
              "negativeScore": (String(result.data[i].NegativeScore)).toUpperCase(),
              "negativeMarks": result.data[i].Negativemark,
              "totalMarks": result.data[i].TotalMarks,
              "duration": result.data[i].Duration,
              "questionTitle": result.data[i].QuestionID,
              "reason": result.data[i].Solution,
              "question":  result.data[i].Question,
              "matchOptions": {
                "column1": column1,
                "column2": column2,
                "column3": column3
              },
              "optionsType": result.data[i].OptionType,
              "options": options,
              "answer": result.data[i].QuestionType == 'trueOrFalse' ? [(String(result.data[i].Answer)).toLowerCase()] : answers,
              "repository": [
                {
                  "id": id,
                  "repository_type": repository_type
                }
              ],
              "createdBy": createdBy
            }
            
            this.loaderService.show();
            this.apiService.addQuestionGlobally(questionData).subscribe((response: any) => {
              if (response.status == 201) {
                counter++
                Swal.fire('Added', 'Question Added', 'success').then(function () {
                });
                if (counter == resultLengthData) {
                  this.getAllQuestionAtGlobal();
                }
                this.loaderService.hide();
              } else {
                Swal.fire({ icon: 'error', title: 'Error', text: response.body.data });
                this.loaderService.hide();
                return;
              }
            }, (error) => {
              if (error.status == 400) {
                console.log('error => ', error)
                Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
                this.loaderService.hide();
              } else {
                Swal.fire({ icon: 'error', title: 'Error', text: error.error.data })
                this.loaderService.hide();
              }
            })
          }
        }
      });
    }

  }

  downloadCSV() {
    if (this.questionCSV && this.questionCSV.length) {
      new AngularCsv(this.questionCSV, "QuestionList", this.csvOptions);
    } else {
      this.loaderService.show();
      this.apiService.getQuestionCsvData().subscribe(
        (response: any) => {
          if (response && response.data && response.data.data && response.data.data.length) {
            let questionDataList = [];
            questionDataList = response.data.data;
            for (let i = 0; i < questionDataList.length; i++) {
              this.csvClass[i] = questionDataList[i].classId;
              this.csvClassName[i] = questionDataList[i].className;
              this.csvBoardId[i] = questionDataList[i].boardId;
              this.csvBoardName[i] = questionDataList[i].boardName;
              this.csvSyllabusId[i] = questionDataList[i].syllabusId;
              this.csvSyllabusName[i] = questionDataList[i].syllabusName;
              this.csvSubjectId[i] = questionDataList[i].subjectId;
              this.csvSubjectName[i] = questionDataList[i].subjectName;
              this.csvChapterId[i] = questionDataList[i].chapterId;
              this.csvChapterName[i] = questionDataList[i].chapterName;
              this.csvTopicId[i] = questionDataList[i].topicId;
              this.csvTopicName[i] = questionDataList[i].topicName;
              this.csvLearningOutcomeId[i] = questionDataList[i].learningOutcomeId;
              this.csvLearningOutcomeName[i] = questionDataList[i].learningOutcome;
              this.questionCSV[i] = [this.csvClass[i], this.csvClassName[i], this.csvBoardId[i], this.csvBoardName[i], this.csvSyllabusId[i],
              this.csvSyllabusName[i], this.csvSubjectId[i], this.csvSubjectName[i], this.csvChapterId[i], this.csvChapterName[i], this.csvTopicId[i],
              this.csvTopicName[i], this.csvLearningOutcomeId[i], this.csvLearningOutcomeName[i]]
            }
            if (this.questionCSV && this.questionCSV.length) {
              new AngularCsv(this.questionCSV, "QuestionList", this.csvOptions);
            }
            this.loaderService.hide();
          } else {
            this.loaderService.hide();
          }
        }, error => {
          this.loaderService.hide();
        }
      )
    }
  }

}
